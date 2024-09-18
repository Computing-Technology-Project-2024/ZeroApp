import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const SolarChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const margin = { top: 10, right: 100, bottom: 60, left: 60 },
              width = 900 - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

        // Fetch data from both Solar_Import.txt and Solar_Export.txt files
        Promise.all([
            fetch(`${process.env.PUBLIC_URL}/Solar_Import.txt`),
            fetch(`${process.env.PUBLIC_URL}/Solar_Export.txt`)
        ])
        .then(responses => {
            if (!responses[0].ok || !responses[1].ok) {
                throw new Error('Network response was not ok');
            }
            return Promise.all([responses[0].json(), responses[1].json()]);
        })
        .then(([importData, exportData]) => {
            console.log("Import data fetched:", importData);
            console.log("Export data fetched:", exportData);

            if (!importData.intervals || !exportData.intervals ||
                !Array.isArray(importData.intervals[0]) ||
                !Array.isArray(exportData.intervals[0])) {
                throw new Error('Invalid data structure');
            }

            // Transform data: keep the granularity, but convert energy to kWh
            const importDataTransformed = importData.intervals[0].map(item => ({
                time: new Date(item.end_at * 1000), // Keep exact timestamp for granularity
                hour: new Date(item.end_at * 1000).getHours(), // Extract the hour (0-23)
                kwh_imported: (item.wh_imported / 1000).toFixed(2) // Convert Wh to kWh and format to 2 decimal places
            }));

            const exportDataTransformed = exportData.intervals[0].map(item => ({
                time: new Date(item.end_at * 1000), // Keep exact timestamp for granularity
                hour: new Date(item.end_at * 1000).getHours(), // Extract the hour (0-23)
                kwh_exported: (item.wh_exported / 1000).toFixed(2) // Convert Wh to kWh and format to 2 decimal places
            }));

            // Remove any existing SVG before re-drawing
            d3.select(chartRef.current).select("svg").remove();

            // Create SVG element
            const svg = d3.select(chartRef.current)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // X-axis scale (based on time, keep granularity)
            const x = d3.scaleTime()
                .domain(d3.extent(importDataTransformed, d => d.time)) // Time domain
                .range([0, width]);

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).tickFormat(d => d3.timeFormat("%H")(d))); // Display hour as 0-23

            // Y-axis scale (for kWh_imported and kWh_exported)
            const maxY = d3.max([
                ...importDataTransformed.map(d => d.kwh_imported),
                ...exportDataTransformed.map(d => d.kwh_exported)
            ]);
            const y = d3.scaleLinear()
                .domain([0, maxY])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Create the line path for energy imported
            svg.append("path")
                .datum(importDataTransformed)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(d => x(d.time)) // Use the exact timestamp for x-axis
                    .y(d => y(d.kwh_imported))
                    .curve(d3.curveMonotoneX)
                );

            // Create the line path for energy exported
            svg.append("path")
                .datum(exportDataTransformed)
                .attr("fill", "none")
                .attr("stroke", "orange")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(d => x(d.time)) // Use the exact timestamp for x-axis
                    .y(d => y(d.kwh_exported))
                    .curve(d3.curveMonotoneX)
                );

            // X-axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width / 2 + margin.left)
                .attr("y", height + margin.top + 40)
                .text("Hour of the Day");

            // Y-axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 20)
                .attr("x", -margin.top - height / 2 + 20)
                .text("Energy (kWh)");

            // Legend
            svg.append("circle").attr("cx", 700).attr("cy", 50).attr("r", 6).style("fill", "steelblue");
            svg.append("text").attr("x", 720).attr("y", 50).text("Solar Imported (kWh)").style("font-size", "15px").attr("alignment-baseline", "middle");
            svg.append("circle").attr("cx", 700).attr("cy", 80).attr("r", 6).style("fill", "orange");
            svg.append("text").attr("x", 720).attr("y", 80).text("Solar Exported (kWh)").style("font-size", "15px").attr("alignment-baseline", "middle");

            // Mouse-over functionality

            const focus = svg.append('g').append('circle')
                .attr('r', 8.5)
                .attr('stroke', 'black')
                .attr('fill', 'none')
                .style('opacity', 0);

            const focusText = svg.append('g').append('text')
                .style('opacity', 0)
                .attr('text-anchor', 'left')
                .attr('alignment-baseline', 'middle');

            svg.append('rect')
                .style('fill', 'none')
                .style('pointer-events', 'all')
                .attr('width', width)
                .attr('height', height)
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseout', mouseout);

            function mouseover() {
                focus.style('opacity', 1);
                focusText.style('opacity', 1);
            }

            function mousemove(event) {
                // Get the current x position of the mouse in terms of pixels
                const x0 = d3.pointer(event)[0];

                // Find the corresponding timestamp based on the mouse's position on the x-axis
                const timeAtMouse = x.invert(x0);

                // Get the closest data point for that time
                const bisect = d3.bisector(d => d.time).left;
                const i = bisect(importDataTransformed, timeAtMouse, 1);
                const selectedImportData = importDataTransformed[i - 1];
                const selectedExportData = exportDataTransformed[i - 1];

                if (selectedImportData && selectedExportData) {
                    // Position the focus circle on the chart based on the selected data
                    focus
                        .attr('cx', x(selectedImportData.time))
                        .attr('cy', y(selectedImportData.kwh_imported));

                    // Update the text that appears next to the focus circle
                    focusText
                        .html(`Time: ${d3.timeFormat("%H:%M")(selectedImportData.time)} - Imported: ${selectedImportData.kwh_imported} kWh, Exported: ${selectedExportData.kwh_exported} kWh`)
                        .attr('x', x(selectedImportData.time) + 15)
                        .attr('y', y(selectedImportData.kwh_imported));
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
            <h1>Solar Energy Imported and Exported Throughout a Day (kWh)</h1>
            <div ref={chartRef}></div>
        </div>
    );
};

export default SolarChart;
