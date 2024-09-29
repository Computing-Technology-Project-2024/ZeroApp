import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CombinedChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const margin = { top: 20, right: 100, bottom: 100, left: 60 },
            width = 1200 - margin.left - margin.right,
            height = 650 - margin.top - margin.bottom;


        // Fetch Solar Import, Solar Export, Solar Production, House Consumption, and Power Usage data from the API
        Promise.all([
            fetch(`${process.env.PUBLIC_URL}/Solar_Import.txt`),
            fetch(`${process.env.PUBLIC_URL}/Solar_Export.txt`),
            fetch(`${process.env.PUBLIC_URL}/Solar_Production.txt`),
            fetch('https://api.edgeapi-v1.com/swinburn/getloaddata/interval/2385?starttime=1714658400&endtime=1714744800', {
                method: 'GET',
                headers: { 'x-api-key': 'JjsFazxTPd7GVoPYGdEI34HrudDZHq695FqKKnmU' },
            })

        ])
            .then(responses => {
                if (responses.some(response => !response.ok)) {
                    throw new Error('Network response was not ok');
                }
                return Promise.all(responses.map(response => response.json()));
            })
            .then(([importData, exportData, productionData, powerUsageData]) => {
                console.log("Import data:", importData);
                console.log("Export data:", exportData);
                console.log("Solar Production data:", productionData);
                console.log("Power usage data from API:", powerUsageData);

                // Preprocess the power usage and house consumption data
                const powerDataTransformed = preprocessHouseConsumptionData(powerUsageData);

                // Transform the solar import/export data to kWh
                const importDataTransformed = importData.intervals[0].map(item => ({
                    time: new Date(item.end_at * 1000),
                    kwh_imported: (item.wh_imported / 1000).toFixed(2)
                }));

                const exportDataTransformed = exportData.intervals[0].map(item => ({
                    time: new Date(item.end_at * 1000),
                    kwh_exported: (item.wh_exported / 1000).toFixed(2)
                }));

                // Transform the solar production data to kWh
                const productionDataTransformed = productionData.intervals.map(item => ({
                    time: new Date(item.end_at * 1000),
                    kwh_produced: (item.wh_del / 1000).toFixed(2)
                }));

                // Calculate total kWh for each dataset
                const totalImport = d3.sum(importDataTransformed, d => +d.kwh_imported).toFixed(2);
                const totalExport = d3.sum(exportDataTransformed, d => +d.kwh_exported).toFixed(2);
                const totalProduction = d3.sum(productionDataTransformed, d => +d.kwh_produced).toFixed(2);
                const totalPowerUsage = d3.sum(powerDataTransformed, d => +d.total_kwh).toFixed(2);

                d3.select(chartRef.current).select("svg").remove();

                const svg = d3.select(chartRef.current)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

                // X-axis scale (time)
                const x = d3.scaleTime()
                    .domain([
                        d3.min([d3.min(importDataTransformed, d => d.time), d3.min(powerDataTransformed)]),
                        d3.max([d3.max(importDataTransformed, d => d.time), d3.max(powerDataTransformed)])
                    ])
                    .range([0, width]);

                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H")))
                    .style("stroke-opacity", 0)
                svg.selectAll(".tick text")
                    .style("fill", "#777")
                    .style("font-size", "14px");

                // Y-axis scale (energy and power)
                const maxY = d3.max([
                    ...importDataTransformed.map(d => d.kwh_imported),
                    ...exportDataTransformed.map(d => d.kwh_exported),
                    ...productionDataTransformed.map(d => d.kwh_produced),
                    ...powerDataTransformed.map(d => d.total_kwh)
                ]);

                const y = d3.scaleLinear()
                    .domain([0, maxY])
                    .range([height, 0]);

                svg.append("g")

                    .call(d3.axisLeft(y)
                        .tickSize(0)
                        .tickPadding(10))
                    .select(".domain")
                    .attr("stroke", "none")
                svg.selectAll(".tick text")
                    .style("fill", "#777")
                    .style("font-size", "14px");

                // Add horizontal gridlines
                svg.append("g")
                    .style("stroke-opacity", 0)
                    .attr("class", "grid")
                    .call(d3.axisLeft(y)
                        .tickSize(-width)
                        .tickFormat(''))
                    .selectAll("line")
                    .attr("stroke", "#e0e0e0") 
                    .attr("stroke-opacity", 0.5);  

                // Add paths for each dataset

                // Line for energy imported
                svg.append("path")
                    .datum(importDataTransformed)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 2)
                    .attr("d", d3.line()
                        .x(d => x(d.time))
                        .y(d => y(d.kwh_imported))
                        .curve(d3.curveBasis)
                    );

                // Line for energy exported
                svg.append("path")
                    .datum(exportDataTransformed)
                    .attr("fill", "none")
                    .attr("stroke-dasharray", ("10, 5"))
                    .attr("stroke", "orange")
                    .attr("stroke-width", 2)
                    .attr("d", d3.line()
                        .x(d => x(d.time))
                        .y(d => y(d.kwh_exported))
                        .curve(d3.curveBasis)
                    );

                // Line for power usage (kWh)
                svg.append("path")
                    .datum(powerDataTransformed)
                    .attr("fill", "none")
                    .attr("stroke", "green")
                    .attr("stroke-width", 2)
                    .attr("d", d3.line()
                        .x(d => x(d.time))
                        .y(d => y(d.total_kwh))
                        .curve(d3.curveBasis)
                    );

                // Line for solar production (kWh)
                svg.append("path")
                    .datum(productionDataTransformed)
                    .attr("fill", "none")
                    .attr("stroke-dasharray", ("10, 5"))
                    .attr("stroke", "purple")
                    .attr("stroke-width", 2)
                    .attr("d", d3.line()
                        .x(d => x(d.time))
                        .y(d => y(d.kwh_produced))
                        .curve(d3.curveBasis)
                    );

                // X-axis label
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", width / 2)
                    .attr("y", height + margin.bottom - 60)
                    .text("Time")
                    .style("fill", "#777")
                    .style("font-size", "14px");

                // Y-axis label
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -margin.left + 15)
                    .attr("x", -margin.top - height / 2 + 100)
                    .text("Energy (kWh)")
                    .style("fill", "#777")
                    .style("font-size", "14px");

                // Legend with Grid Import
                svg.append("circle").attr("cx", 310).attr("cy", 600).attr("r", 6).style("fill", "steelblue");
                svg.append("text").attr("x", 320).attr("y", 600).text(`From Grid (kWh): ${totalImport}`).style("font-size", "15px").attr("alignment-baseline", "middle");

                // Legend with Solar Export
                svg.append("circle").attr("cx", 510).attr("cy", 600).attr("r", 6).style("fill", "orange");
                svg.append("text").attr("x", 520).attr("y", 600).text(`Solar Exported (kWh): ${totalExport}`).style("font-size", "15px").attr("alignment-baseline", "middle");

                // Legend with Power Usage
                svg.append("circle").attr("cx", 100).attr("cy", 600).attr("r", 6).style("fill", "green");
                svg.append("text").attr("x", 110).attr("y", 600).text(`Consumption (kWh): ${totalPowerUsage}`).style("font-size", "15px").attr("alignment-baseline", "middle");

                // Legend with Solar Production
                svg.append("circle").attr("cx", 730).attr("cy", 600).attr("r", 6).style("fill", "purple");
                svg.append("text").attr("x", 740).attr("y", 600).text(`Solar Produced (kWh): ${totalProduction}`).style("font-size", "15px").attr("alignment-baseline", "middle");

                const bisect = d3.bisector(d => d.time).left;

                // Create a vertical line that follows the curve of the line
                const focusLine = svg.append('line')
                    .attr('stroke', '#777')
                    .attr('stroke-width', 1)
                    .attr('y1', 0)
                    .attr('y2', height)
                    .style('opacity', 0);

                // Create a text element for displaying time (hours and minutes)
                const focusTime = svg.append('text')
                    .style('opacity', 0)
                    .attr('text-anchor', 'left')
                    .attr('alignment-baseline', 'middle');

                // Create text elements for the labels, positioned at a constant vertical height
                const labelYPosition = height * 0.75; 
                const focusText = svg.append('g').selectAll('text')
                    .data([1, 2, 3, 4]) 
                    .enter()
                    .append('text')
                    .style('opacity', 0)
                    .attr('text-anchor', 'left')
                    .attr('alignment-baseline', 'middle');

                // Add a transparent rectangle to capture mouse movements
                svg.append('rect')
                    .style('fill', 'none')
                    .style('pointer-events', 'all')
                    .attr('width', width)
                    .attr('height', height)
                    .on('mouseover', mouseover)
                    .on('mousemove', mousemove)
                    .on('mouseout', mouseout);

                // Time format for displaying hours and minutes
                const timeFormat = d3.timeFormat("%H:%M");

                // Mouseover event handlers
                function mouseover() {
                    focusLine.style('opacity', 1);
                    focusTime.style('opacity', 1);
                    focusText.style('opacity', 1);
                }

                function mousemove(event) {
                    const x0 = x.invert(d3.pointer(event)[0]);  // Invert the x-coordinate to find the corresponding time
                    const i = bisect(powerDataTransformed, x0, 1);  // Find the closest data point for powerDataTransformed
                    const selectedData = powerDataTransformed[i];

                    if (selectedData) {
                        const time = selectedData.time;

                        // Update the vertical line position
                        focusLine
                            .attr('x1', x(time))
                            .attr('x2', x(time));

                        // Display the formatted time near the line
                        focusTime
                            .text(`Time: ${timeFormat(time)}`)
                            .attr('x', x(time) + 15)
                            .attr('y', labelYPosition - 40); 

                        // Display the data for all the lines at the closest time, at a fixed vertical position
                        focusText
                            .data([
                                { label: 'Consumption', value: powerDataTransformed[i]?.total_kwh },
                                { label: 'From Grid', value: importDataTransformed[i]?.kwh_imported },
                                { label: 'Solar Exported', value: exportDataTransformed[i]?.kwh_exported },
                                { label: 'Solar Produced', value: productionDataTransformed[i]?.kwh_produced }
                            ])
                            .text(d => `${d.label}: ${d.value} kWh`)
                            .attr('x', x(time) + 15)  // Position the text near the line
                            .attr('y', (d, index) => labelYPosition + index * 20);  // Stack the labels vertically below the middle
                    }
                }

                function mouseout() {
                    focusLine.style('opacity', 0);
                    focusTime.style('opacity', 0);
                    focusText.style('opacity', 0);
                }



            })

            .catch(error => {
                console.error('Error fetching or processing data:', error);
            });


        // Function to preprocess house consumption data
        function preprocessHouseConsumptionData(rawData) {
            const timestamps = new Set();
            const dataByHour = {};

            // Loop through all devices and their records
            Object.keys(rawData).forEach(device => {
                rawData[device].forEach(record => {
                    const wattage = record.watt;
                    const timestamp = record.timestamp;
                    if (!dataByHour[timestamp]) {
                        dataByHour[timestamp] = 0;
                    }
                    dataByHour[timestamp] += wattage;
                    timestamps.add(timestamp);
                });
            });

            const totalData = Array.from(timestamps).sort().map(timestamp => {
                const totalWattHours = dataByHour[timestamp]; // Convert to Watt-hours
                return {
                    time: new Date(timestamp * 1000),
                    total_kwh: totalWattHours / 1000 // Convert to kWh
                };
            });

            return totalData;
        }
    }, []);

    return <div ref={chartRef}></div>;
};

export default CombinedChart;
