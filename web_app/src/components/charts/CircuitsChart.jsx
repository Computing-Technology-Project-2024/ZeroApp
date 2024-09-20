import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const StackedAreaChart = () => {
    const chartRef = useRef(null); // UseRef for the chart container
    const [data, setData] = useState(null); // UseState to store the fetched data
    const [loading, setLoading] = useState(true); // Loading state
    const [visibleCircuits, setVisibleCircuits] = useState(null); // Track visibility of circuits

    // Fetch data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);  // Start loading

                const apiUrls = [
                    'https://api.edgeapi-v1.com/swinburn/powerquality/interval/EE40400611940374?starttime=1714658400&endtime=1714744800',
                    'https://api.edgeapi-v1.com/swinburn/powerquality/interval/EE40400611940301?starttime=1714658400&endtime=1714744800'
                ];

                const fetchPromises = apiUrls.map(url =>
                    fetch(url, {
                        method: 'GET',
                        headers: { 'x-api-key': 'JjsFazxTPd7GVoPYGdEI34HrudDZHq695FqKKnmU' }
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                );

                const results = await Promise.all(fetchPromises);
                const combinedData = results.flat(); // Merge data from multiple API responses

                console.log('Retrieved Data from all APIs:', combinedData);
                const aggregatedData = preprocessData(combinedData); // Preprocess data for the chart
                setData(aggregatedData); // Store the combined data in the state
                setVisibleCircuits(Object.keys(aggregatedData[0]).filter(d => d !== "hour")); // Initialize all circuits as visible
                setLoading(false);  // Stop loading once the data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Stop loading in case of error
            }
        };

        fetchData();
    }, []);

    const preprocessData = (data) => {
        const excludedCircuits = ['NIU'];
        const aggregatedData = {};
        const allHours = new Set();
        const allPhases = new Set();

        const filteredData = data.filter(d => !excludedCircuits.includes(d.channel_label));

        filteredData.forEach(d => {
            const date = new Date(d.sampledate * 1000); 
            const hour = date.getUTCHours(); 
            allHours.add(hour);
            allPhases.add(d.channel_label);
        });

        allHours.forEach(hour => {
            aggregatedData[hour] = {};
            allPhases.forEach(phase => {
                aggregatedData[hour][phase] = 0;
            });
        });

        filteredData.forEach(d => {
            const date = new Date(d.sampledate * 1000);
            const hour = date.getUTCHours();
            aggregatedData[hour][d.channel_label] += parseFloat(d.watt);
        });

        return Object.keys(aggregatedData).map(hour => {
            const deviceData = { hour: parseInt(hour) };
            Object.keys(aggregatedData[hour]).forEach(channel_label => {
                deviceData[channel_label] = aggregatedData[hour][channel_label] / 1000;
            });
            return deviceData;
        });
    };

    useEffect(() => {
        if (data && visibleCircuits) {
            createStackedAreaChart(data);
        }

        function createStackedAreaChart(data) {
            d3.select(chartRef.current).select("svg").remove();

            const margin = { top: 20, right: 100, bottom: 150, left: 70 }, 
                width = 1200 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

            const svg = d3.select(chartRef.current)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const keys = Object.keys(data[0]).filter(d => d !== "hour"); // Get all keys without filtering by visibility

            const stack = d3.stack()
                .keys(keys)
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone);

            const stackedData = stack(data);

            const x = d3.scaleLinear()
                .domain(d3.extent(data, d => d.hour))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
                .range([height, 0]);

            const color = d3.scaleOrdinal(d3.schemeCategory10).domain(keys);

            const area = d3.area()
                .x(d => x(d.data.hour))
                .y0(d => y(d[0]))
                .y1(d => y(d[1]));

            const areas = svg.selectAll("path")
                .data(stackedData)
                .enter()
                .append("path")
                .attr("class", d => `area ${d.key.replace(/\s+/g, '-')}`)
                .attr("fill", d => color(d.key))
                .style("display", d => visibleCircuits.includes(d.key) ? null : "none")  // Show/hide paths based on visibility
                .attr("d", area);

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).ticks(24).tickFormat(d3.format("02d")));

            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 100)
                .text("Time of day (Hours)");

            svg.append("g")
                .call(d3.axisLeft(y));

            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 20)
                .attr("x", -height / 2)
                .text("Power (kW/h)");

            const totalKWUsage = keys.reduce((acc, key) => {
                const total = d3.sum(data, d => d[key]);
                acc[key] = total;
                return acc;
            }, {});

            const legend = svg.selectAll(".legend")
                .data(Object.keys(totalKWUsage))
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => {
                    const row = Math.floor(i / 5);
                    const col = i % 5;
                    const xPos = col * 250;
                    const yPos = height + margin.bottom - 50 + (row * 30);
                    return `translate(${xPos}, ${yPos})`;
                })
                .on("click", function (event, d) {
                    const newVisibleCircuits = visibleCircuits.includes(d) 
                        ? visibleCircuits.filter(circuit => circuit !== d) 
                        : [...visibleCircuits, d];

                    setVisibleCircuits(newVisibleCircuits); // Update visible circuits
                });

            legend.append("rect")  // Checkbox
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", d => visibleCircuits.includes(d) ? color(d) : "white")  // Change fill based on visibility
                .style("stroke", color);

            legend.append("text")
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(d => d);

            legend.append("text")
                .attr("x", -80)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("font-weight", "bold")
                .text(d => `${totalKWUsage[d].toFixed(2)} kW`);
        }

    }, [data, visibleCircuits]);

    return (
        <div>
            {loading ? (
                <div className="loading-spinner">Loading data, please wait...</div>
            ) : (
                <div ref={chartRef}></div>
            )}
        </div>
    );
};

export default StackedAreaChart;
