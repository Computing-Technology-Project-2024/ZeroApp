import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CombinedChart = () => {
    const chartRef = useRef(null);

    

    useEffect(() => {
        const margin = { top: 20, right: 100, bottom: 60, left: 60 },
              width = 1200 - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

        // Fetch all datasets: Solar_Import.txt, Solar_Export.txt, and Day_Power_data.txt
        Promise.all([
            fetch(`${process.env.PUBLIC_URL}/Solar_Import.txt`),
            fetch(`${process.env.PUBLIC_URL}/Solar_Export.txt`),
            fetch(`${process.env.PUBLIC_URL}/Day_Power_data.txt`)
        ])
        .then(responses => {
            if (responses.some(response => !response.ok)) {
                throw new Error('Network response was not ok');
            }
            return Promise.all(responses.map(response => response.json()));
        })
        .then(([importData, exportData, rawData]) => {
            console.log("Import data:", importData);
            console.log("Export data:", exportData);
            console.log("Power usage data:", rawData);

            // Get the first available date in the power usage dataset
            const availableDates = Object.keys(rawData);
            if (availableDates.length === 0) {
                throw new Error('No power usage data available');
            }
            const selectedDate = availableDates[0];

            // Transform data: convert energy to kWh and power usage to kW
            const importDataTransformed = importData.intervals[0].map(item => ({
                time: new Date(item.end_at * 1000),
                kwh_imported: (item.wh_imported / 1000).toFixed(2) // Convert Wh to kWh
            }));

            const exportDataTransformed = exportData.intervals[0].map(item => ({
                time: new Date(item.end_at * 1000),
                kwh_exported: (item.wh_exported / 1000).toFixed(2) // Convert Wh to kWh
            }));

            const powerDataTransformed = Object.keys(rawData[selectedDate]).map(hour => ({
                time: new Date(new Date(selectedDate).setHours(hour)),
                sumKw: rawData[selectedDate][hour].sumWatt / 1000 // Convert to kW
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

            // X-axis scale (time)
            const x = d3.scaleTime()
                .domain([d3.min(importDataTransformed, d => d.time), d3.max(importDataTransformed, d => d.time)])
                .range([0, width]);

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H"))); // Format as hours (0-23)
                

            // Y-axis scale
            const maxY = d3.max([
                ...importDataTransformed.map(d => d.kwh_imported),
                ...exportDataTransformed.map(d => d.kwh_exported),
                ...powerDataTransformed.map(d => d.sumKw)
            ]);

            const y = d3.scaleLinear()
                .domain([0, maxY])
                .range([height, 0]);

            svg.append("g")
                .call(d3.axisLeft(y));

            // Add paths for each dataset

            // Line for energy imported
            svg.append("path")
                .datum(importDataTransformed)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(d => x(d.time))
                    .y(d => y(d.kwh_imported))
                    .curve(d3.curveMonotoneX)
                );

            // Line for energy exported
            svg.append("path")
                .datum(exportDataTransformed)
                .attr("fill", "none")
                .attr("stroke", "orange")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(d => x(d.time))
                    .y(d => y(d.kwh_exported))
                    .curve(d3.curveMonotoneX)
                );

            // Area for power usage
            svg.append("path")
                .datum(powerDataTransformed)
                .attr("fill", "lightblue")
                .attr("stroke", "blue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.area()
                    .x(d => x(d.time))
                    .y0(y(0))
                    .y(d => y(d.sumKw))
                    .curve(d3.curveMonotoneX)
                );

            // X-axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width / 2 + margin.left)
                .attr("y", height + margin.bottom - 10)
                .text("Time of day (Hours)");
                

            // Y-axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 20)
                .attr("x", -margin.top - height / 2 + 20)
                .text("Energy (kWh) / Power (kW)");

            // Add legend
            svg.append("circle").attr("cx", 900).attr("cy", 50).attr("r", 6).style("fill", "steelblue");
            svg.append("text").attr("x", 920).attr("y", 50).text("Solar Imported (kWh)").style("font-size", "15px").attr("alignment-baseline", "middle");

            svg.append("circle").attr("cx", 900).attr("cy", 80).attr("r", 6).style("fill", "orange");
            svg.append("text").attr("x", 920).attr("y", 80).text("Solar Exported (kWh)").style("font-size", "15px").attr("alignment-baseline", "middle");

            svg.append("circle").attr("cx", 900).attr("cy", 110).attr("r", 6).style("fill", "blue");
            svg.append("text").attr("x", 920).attr("y", 110).text("Power Usage (kW)").style("font-size", "15px").attr("alignment-baseline", "middle");

            // Mouse-over functionality for displaying data points
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
                const x0 = x.invert(d3.pointer(event)[0]);
                const bisect = d3.bisector(d => d.time).left;

                // Find closest points in all datasets
                const iPower = bisect(powerDataTransformed, x0, 1);
                const iImport = bisect(importDataTransformed, x0, 1);
                const iExport = bisect(exportDataTransformed, x0, 1);
                

                const selectedImport = importDataTransformed[iImport - 1];
                const selectedExport = exportDataTransformed[iExport - 1];
                const selectedPower = powerDataTransformed[iPower - 1];

                focus
                    .attr('cx', x(selectedImport.time))
                    .attr('cy', y(selectedImport.kwh_imported));

                focusText
                    .html(`Time: ${d3.timeFormat("%H:%M")(selectedImport.time)} <br>
                           Imported: ${selectedImport.kwh_imported} kWh <br>
                           Exported: ${selectedExport.kwh_exported} kWh <br>
                           Power Usage: ${selectedPower.sumKw} kW`)
                    .attr('x', x(selectedImport.time) + 15)
                    .attr('y', y(selectedImport.kwh_imported));
            }

            function mouseout() {
                focus.style('opacity', 0);
                focusText.style('opacity', 0);
            }
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
        });
    }, []);

    return <div ref={chartRef}></div>;
};

export default CombinedChart;
