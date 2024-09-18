import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const StackedAreaChart = () => {
    const chartRef = useRef(null); // UseRef for the chart container
    const [data, setData] = useState(null); // UseState to store the fetched data
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);  // Start loading
                const response = await fetch(
                    'https://api.edgeapi-v1.com/swinburn/powerquality/interval/EE40400611940374?starttime=1714658400&endtime=1714744800', 
                    {
                        method: 'GET',
                        headers: { 'x-api-key': 'JjsFazxTPd7GVoPYGdEI34HrudDZHq695FqKKnmU' }
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Retrieved Data:', data);
                const aggregatedData = preprocessData(data); // Preprocess data for the chart
                setData(aggregatedData); // Store the data in the state
                setLoading(false);  // Stop loading once the data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Stop loading in case of error
            }
        };

        fetchData();
    }, []);

    // Preprocess the data to aggregate by hours and phases
    const preprocessData = (data) => {
        const aggregatedData = {};
        const allHours = new Set();
        const allPhases = new Set();

        data.forEach(d => {
            const date = new Date(d.sampledate * 1000); // Convert timestamp to JavaScript date
            const hour = date.getUTCHours(); // Get the hour
            allHours.add(hour);
            allPhases.add(d.channel_label);
        });

        // Initialize aggregatedData for each hour and each phase
        allHours.forEach(hour => {
            aggregatedData[hour] = {};
            allPhases.forEach(phase => {
                aggregatedData[hour][phase] = 0;
            });
        });

        // Aggregate watt values by hour and channel label
        data.forEach(d => {
            const date = new Date(d.sampledate * 1000);
            const hour = date.getUTCHours();
            aggregatedData[hour][d.channel_label] += parseFloat(d.watt);
        });

        // Convert to an array format suitable for D3 stacking and convert watts to kW
        return Object.keys(aggregatedData).map(hour => {
            const deviceData = { hour: parseInt(hour) };
            Object.keys(aggregatedData[hour]).forEach(channel_label => {
                deviceData[channel_label] = aggregatedData[hour][channel_label] / 1000; // Convert watts to kW
            });
            return deviceData;
        });
    };

    // D3 chart rendering
    useEffect(() => {
        if (data) {
            createStackedAreaChart(data);
        }

        function createStackedAreaChart(data) {
            // Clear any existing chart before drawing
            d3.select(chartRef.current).select("svg").remove();

            // Chart dimensions
            const margin = { top: 20, right: 100, bottom: 50, left: 70 }, // Added more space for axis labels
                  width = 1200 - margin.left - margin.right,
                  height = 600 - margin.top - margin.bottom;

            // Append SVG object
            const svg = d3.select(chartRef.current)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // List of keys (channel_labels)
            const keys = Object.keys(data[0]).filter(d => d !== "hour");

            // Define stack generator
            const stack = d3.stack()
                .keys(keys)
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone);

            // Stack the data
            const stackedData = stack(data);

            // Define scales
            const x = d3.scaleLinear()
                .domain(d3.extent(data, d => d.hour))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
                .range([height, 0]);

            const color = d3.scaleOrdinal(d3.schemeCategory10).domain(keys);

            // Define area generator
            const area = d3.area()
                .x(d => x(d.data.hour))
                .y0(d => y(d[0]))
                .y1(d => y(d[1]));

            // Draw the areas
            svg.selectAll("path")
                .data(stackedData)
                .enter()
                .append("path")
                .attr("fill", d => color(d.key))
                .attr("d", area)
                .on("click", function(event, d) {
                    const [xPos] = d3.pointer(event);
                    const hour = Math.round(x.invert(xPos));
                    const watt = d.find(entry => entry.data.hour === hour);
                    showTooltip(event, d.key, hour, watt ? watt[1] - watt[0] : 0);
                });

            // Add X axis
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).ticks(24).tickFormat(d3.format("02d")));

            // X-axis label (Hours)
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 10) // Adjust the position
                .text("Hour of the Day");

            // Add Y axis
            svg.append("g")
                .call(d3.axisLeft(y));

            // Y-axis label (kW/h)
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 20)
                .attr("x", -height / 2)
                .text("Power (kW/h)");

            // Add legend
            const legend = svg.selectAll(".legend")
                .data(keys)
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(${width - 150},${i * 20})`)
                .on("click", function(event, d) {
                    const isActive = d3.select(this).classed("active");
                    d3.selectAll(".legend").classed("active", false);
                    d3.select(this).classed("active", !isActive);

                    if (!isActive) {
                        svg.selectAll(".area").style("opacity", 0.2);
                        svg.select(`.area.${d.replace(/\s+/g, '-')}`).style("opacity", 1);
                    } else {
                        svg.selectAll(".area").style("opacity", 1);
                    }
                });

            legend.append("circle")
                .attr("cx", 9)      // Center x-position for the circle
                .attr("cy", 9)      // Center y-position for the circle
                .attr("r", 9)       // Radius of the circle
                .style("fill", color);

            legend.append("text")
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(d => d);
        }

        // Tooltip function
        function showTooltip(event, device, hour, watt) {
            d3.select("#tooltip").remove();
            d3.select("body").append("div")
                .attr("id", "tooltip")
                .style("position", "absolute")
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`)
                .style("background", "lightsteelblue")
                .style("padding", "5px")
                .style("border-radius", "5px")
                .style("pointer-events", "none")
                .text(`Device: ${device}, Hour: ${hour}, Power: ${watt} kW/h`);
        }

    }, [data]); // Re-run the effect when `data` changes

    return (
        <div>
            {loading ? (
                <div className="loading-spinner">Loading data, please wait...</div>
            ) : (
                <div>
                    <div ref={chartRef}></div> {/* Chart container */}
                    <div id="tooltip" style={{ display: 'none' }}></div> {/* Tooltip container */}
                </div>
            )}
        </div>
    );
};

export default StackedAreaChart;
