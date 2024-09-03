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

            // Extract and convert the data for import and export
            const importDataTransformed = importData.intervals[0].map(item => ({
                time: new Date(item.end_at * 1000).toLocaleTimeString(), // Convert timestamp to time string
                wh_imported: item.wh_imported
            }));

            const exportDataTransformed = exportData.intervals[0].map(item => ({
                time: new Date(item.end_at * 1000).toLocaleTimeString(), // Convert timestamp to time string
                wh_exported: item.wh_exported
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

            // X-axis scale (time of day)
            const x = d3.scaleBand()
                .domain(importDataTransformed.map(d => d.time))
                .range([0, width])
                .padding(0.1);

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            // Y-axis scale (for both wh_imported and wh_exported)
            const maxY = d3.max([
                ...importDataTransformed.map(d => d.wh_imported),
                ...exportDataTransformed.map(d => d.wh_exported)
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
                    .x(d => x(d.time) + x.bandwidth() / 2) // Center the line on the band
                    .y(d => y(d.wh_imported))
                );

            // Create the line path for energy exported
            svg.append("path")
                .datum(exportDataTransformed)
                .attr("fill", "none")
                .attr("stroke", "orange")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(d => x(d.time) + x.bandwidth() / 2) // Center the line on the band
                    .y(d => y(d.wh_exported))
                );

            // X-axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width / 2 + margin.left)
                .attr("y", height + margin.top + 40)
                .text("Time of Day");

            // Y-axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 20)
                .attr("x", -margin.top - height / 2 + 20)
                .text("Energy (Wh)");

            // Legend
            svg.append("circle").attr("cx", 700).attr("cy", 50).attr("r", 6).style("fill", "steelblue");
            svg.append("text").attr("x", 720).attr("y", 50).text("Energy Imported").style("font-size", "15px").attr("alignment-baseline", "middle");
            svg.append("circle").attr("cx", 700).attr("cy", 80).attr("r", 6).style("fill", "orange");
            svg.append("text").attr("x", 720).attr("y", 80).text("Energy Exported").style("font-size", "15px").attr("alignment-baseline", "middle");

            // Mouse-over functionality
            const bisect = d3.bisector(d => d.time).left;

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
                const x0 = d3.pointer(event)[0];
                const i = bisect(importDataTransformed, x0, 1);  // Find the closest data point
                const selectedImportData = importDataTransformed[i];
                const selectedExportData = exportDataTransformed[i];
                
                if (selectedImportData && selectedExportData) {
                    focus
                        .attr('cx', x(selectedImportData.time) + x.bandwidth() / 2)
                        .attr('cy', y(selectedImportData.wh_imported));

                    focusText
                        .html(`Time: ${selectedImportData.time} - Imported: ${selectedImportData.wh_imported} Wh, Exported: ${selectedExportData.wh_exported} Wh`)
                        .attr('x', x(selectedImportData.time) + x.bandwidth() / 2 + 15)
                        .attr('y', y(selectedImportData.wh_imported));
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
            <h1>Solar Energy Import and Export Throughout a Day</h1>
            <div id="my_dataviz" ref={chartRef}></div>
        </div>
    );
};

export default SolarChart;
