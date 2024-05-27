import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Set the dimensions and margins of the graph
        const margin = { top: 10, right: 100, bottom: 60, left: 60 },
            width = 900 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // Sample data in the required JSON format
        const rawData = {
            "2024-04-0": { "example_field_data": 2 },
            "2024-04-1": { "example_field_data": 3 },
            "2024-04-2": { "example_field_data": 4 },
            "2024-04-3": { "example_field_data": 4 },
            "2024-04-4": { "example_field_data": 4 },
            "2024-04-5": { "example_field_data": 4 },
            "2024-04-6": { "example_field_data": 7 },
            "2024-04-7": { "example_field_data": 8 },
            "2024-04-8": { "example_field_data": 10 },
            "2024-04-9": { "example_field_data": 14 },
            "2024-04-10": { "example_field_data": 16 },
            "2024-04-11": { "example_field_data": 18 },
            "2024-04-12": { "example_field_data": 10 },
            "2024-04-13": { "example_field_data": 9 },
            "2024-04-14": { "example_field_data": 9 },
            "2024-04-15": { "example_field_data": 7 },
            "2024-04-16": { "example_field_data": 4 },
            "2024-04-17": { "example_field_data": 10 },
            "2024-04-18": { "example_field_data": 14 },
            "2024-04-19": { "example_field_data": 16 },
            "2024-04-20": { "example_field_data": 20 },
            "2024-04-21": { "example_field_data": 16 },
            "2024-04-22": { "example_field_data": 8 },
            "2024-04-23": { "example_field_data": 4 }
        };

        // Convert the JSON data to an array of objects
        const data = Object.keys(rawData).map(key => ({
            date: +key.split("-")[2], // Extract the day as an integer
            value: rawData[key].example_field_data
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

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, 23])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 25])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value))
            );

        // Add X axis label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width / 2 + margin.left)
            .attr("y", height + margin.top + 40)
            .text("Time of day in 24 hour");

        // Add Y axis label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - height / 2 + 20)
            .text("Power Usage in Kwh");

        // Bisector function to find the nearest data point
        const bisect = d3.bisector(d => d.date).left;

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
                .attr("cx", x(selectedData.date))
                .attr("cy", y(selectedData.value));
            focusText
                .html("x:" + selectedData.date + "  -  y:" + selectedData.value)
                .attr("x", x(selectedData.date) + 15)
                .attr("y", y(selectedData.value));
        }

        function mouseout() {
            focus.style("opacity", 0);
            focusText.style("opacity", 0);
        }
    }, []);

    return (
        <div>
            <h1>This is a Line Chart that shows power usage through-out the day in Kwh</h1>
            <div id="my_dataviz" ref={chartRef}></div>
        </div>
    );
};

export default LineChart;
