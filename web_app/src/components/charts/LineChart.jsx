import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const margin = { top: 10, right: 100, bottom: 60, left: 60 },
              width = 900 - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

        // Fetch data from Day_Power_data.txt file
        fetch(`${process.env.PUBLIC_URL}/Day_Power_data.txt`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(rawData => {
                console.log("Raw data fetched:", rawData);  // Debugging log

                // Get the first available date in the dataset (assuming rawData is keyed by date strings)
                const availableDates = Object.keys(rawData);
                if (availableDates.length === 0) {
                    throw new Error('No data available');
                }
                
                const selectedDate = availableDates[0]; // Select the first available date
                console.log(`Displaying data for date: ${selectedDate}`);

                // Extract and convert the sumWatt to kW for each hour (0-23) for the selected date
                const data = Object.keys(rawData[selectedDate]).map(hour => ({
                    hour: +hour,
                    sumKw: rawData[selectedDate][hour].sumWatt / 1000 // Convert to kW
                }));

                console.log("Parsed data (in kW):", data);  // Debugging log

                // Remove any existing SVG before re-drawing
                d3.select(chartRef.current).select("svg").remove();

                // Create SVG element
                const svg = d3.select(chartRef.current)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // X-axis scale (hours of the day)
                const x = d3.scaleLinear()
                    .domain([0, 23])
                    .range([0, width]);
                    
                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x));

                // Y-axis scale (for kW)
                const maxY = d3.max(data, d => d.sumKw);
                const y = d3.scaleLinear()
                    .domain([0, maxY])
                    .range([height, 0]);
                svg.append("g")
                    .call(d3.axisLeft(y));

                // Create the area path for power usage in kW
                svg.append("path")
                    .datum(data)
                    .attr("fill", "blue")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.area()
                        .x(d => x(d.hour))
                        .y0(y(0))
                        .y(d => y(d.sumKw))
                        .curve(d3.curveMonotoneX)
                    );

                // X-axis label
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", width / 2 + margin.left)
                    .attr("y", height + margin.top + 40)
                    .text("Time of day (Hours)");

                // Y-axis label
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -margin.left + 20)
                    .attr("x", -margin.top - height / 2 + 20)
                    .text("Power Usage (kW)");

                // Legend for power usage
                svg.append("circle").attr("cx", 700).attr("cy", 130).attr("r", 6).style("fill", "blue");
                svg.append("text").attr("x", 720).attr("y", 130).text("Power Usage").style("font-size", "15px").attr("alignment-baseline", "middle");

                // --- Mouse-over functionality ---

                // Create bisector to find the nearest data point
                const bisect = d3.bisector(d => d.hour).left;

                // Create a circle that follows the curve of the line
                const focus = svg.append('g').append('circle')
                    .attr('r', 8.5)
                    .attr('stroke', 'black')
                    .attr('fill', 'none')
                    .style('opacity', 0);

                // Create text that follows the circle
                const focusText = svg.append('g').append('text')
                    .style('opacity', 0)
                    .attr('text-anchor', 'left')
                    .attr('alignment-baseline', 'middle');

                // Add transparent rectangle to capture mouse movements
                svg.append('rect')
                    .style('fill', 'none')
                    .style('pointer-events', 'all')
                    .attr('width', width)
                    .attr('height', height)
                    .on('mouseover', mouseover)
                    .on('mousemove', mousemove)
                    .on('mouseout', mouseout);

                // Mouseover event handlers
                function mouseover() {
                    focus.style('opacity', 1);
                    focusText.style('opacity', 1);
                }

                function mousemove(event) {
                    const x0 = x.invert(d3.pointer(event)[0]);
                    const i = bisect(data, x0, 1);  // Find the closest data point
                    const selectedData = data[i];
                    
                    if (selectedData) {
                        focus
                            .attr('cx', x(selectedData.hour))
                            .attr('cy', y(selectedData.sumKw));

                        focusText
                            .html(`Hour: ${selectedData.hour}:00 - Power: ${selectedData.sumKw.toFixed(2)} kW`)
                            .attr('x', x(selectedData.hour) + 15)
                            .attr('y', y(selectedData.sumKw));
                    }
                }

                function mouseout() {
                    focus.style('opacity', 0);
                    focusText.style('opacity', 0);
                }

            })
            .catch(err => {
                console.error("Error fetching or parsing data:", err);
            });
            
    }, []);

    return (
        <div>
            <h1>Line Chart of Power Usage Throughout a Day (kW)</h1>
            <div id="my_dataviz" ref={chartRef}></div>
        </div>
    );
};

export default LineChart;
