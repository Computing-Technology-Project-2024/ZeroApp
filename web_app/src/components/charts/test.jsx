import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Set the dimensions and margins of the graph
        const margin = { top: 10, right: 100, bottom: 60, left: 60 },
            width = 900 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // Fetch data from Day_Power_data.txt file
        fetch('Day_Power_data.txt')
            .then(response => response.json())
            .then(rawData => {
                // Extract the sumWatt for each hour (0-23)
                const data = Object.keys(rawData['2024-04-20']).map(hour => ({
                    hour: +hour,
                    sumWatt: rawData['2024-04-20'][hour].sumWatt
                }));

                // Remove any existing SVG to avoid duplicates
                d3.select(chartRef.current).select("svg").remove();

                // Append the svg object to the body of the page
                const svg = d3.select(chartRef.current)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Add X axis (0-23 hours)
                const x = d3.scaleLinear()
                    .domain([0, 23])  // X-axis range is hours 0 to 23
                    .range([0, width]);
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                // Add Y axis (sumWatt range)
                const maxY = d3.max(data, d => d.sumWatt);  // Find the maximum sumWatt
                const y = d3.scaleLinear()
                    .domain([0, maxY])
                    .range([height, 0]);
                svg.append("g")
                    .call(d3.axisLeft(y));

                // Add the line (plotting hour vs. sumWatt)
                svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(d => x(d.hour))
                        .y(d => y(d.sumWatt))
                    );

                // Add X axis label
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", width / 2 + margin.left)
                    .attr("y", height + margin.top + 40)
                    .text("Time of day (Hours)");

                // Add Y axis label
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -margin.left + 20)
                    .attr("x", -margin.top - height / 2 + 20)
                    .text("Power Usage (sumWatt)");

                // Bisector function to find the nearest data point
                const bisect = d3.bisector(d => d.hour).left;

                // Create the circle that travels along the curve of chart
                const focus = svg.append('g').append('circle')
                    .style("fill", "none")
                    .attr("stroke", "black")
                    .attr('r', 8.5)
                    .style("opacity", 0);

                // Create the text that travels along the curve of chart
                const focusText = svg.append('g').append('text')
                    .style("opacity", 0)
                    .attr("text-anchor", "left")
                    .attr("alignment-baseline", "middle");

                // Create a rect on top of the svg area: this rectangle recovers mouse position
                svg.append('rect')
                    .style("fill", "none")
                    .style("pointer-events", "all")
                    .attr('width', width)
                    .attr('height', height)
                    .on('mouseover', mouseover)
                    .on('mousemove', mousemove)
                    .on('mouseout', mouseout);

                function mouseover() {
                    focus.style("opacity", 1);
                    focusText.style("opacity", 1);
                }

                function mousemove(event) {
                    // Recover coordinate we need
                    const x0 = x.invert(d3.pointer(event, this)[0]);
                    const i = bisect(data, x0, 1);
                    const selectedData = data[i];
                    focus
                        .attr("cx", x(selectedData.hour))
                        .attr("cy", y(selectedData.sumWatt));
                    focusText
                        .html("Hour:" + selectedData.hour + "  -  sumWatt:" + selectedData.sumWatt)
                        .attr("x", x(selectedData.hour) + 15)
                        .attr("y", y(selectedData.sumWatt));
                }

                function mouseout() {
                    focus.style("opacity", 0);
                    focusText.style("opacity", 0);
                }
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h1>This is a Line Chart that shows power usage through-out the day (sumWatt)</h1>
            <div id="my_dataviz" ref={chartRef}></div>
        </div>
    );
};

export default LineChart;
