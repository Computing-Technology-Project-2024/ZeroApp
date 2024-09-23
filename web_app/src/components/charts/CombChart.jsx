import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CombinedChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const margin = { top: 20, right: 100, bottom: 60, left: 60 },
              width = 1200 - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

        // Fetch Solar Import, Solar Export, Solar Production, House Consumption, and Power Usage data from the API
        Promise.all([
            fetch(`${process.env.PUBLIC_URL}/Solar_Import.txt`),
            fetch(`${process.env.PUBLIC_URL}/Solar_Export.txt`),
            fetch(`${process.env.PUBLIC_URL}/Solar_Production.txt`),
            fetch(`${process.env.PUBLIC_URL}/House_Consumption.txt`),
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
        .then(([importData, exportData, productionData, houseConsumptionData, powerUsageData]) => {
            console.log("Import data:", importData);
            console.log("Export data:", exportData);
            console.log("Solar Production data:", productionData);
            console.log("House Consumption data:", houseConsumptionData);
            console.log("Power usage data from API:", powerUsageData);

            // Preprocess the power usage and house consumption data
            const powerDataTransformed = preprocessPowerData(powerUsageData);
            const houseConsumptionDataTransformed = preprocessHouseConsumptionData(houseConsumptionData);

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
            const totalHouseConsumption = d3.sum(houseConsumptionDataTransformed, d => +d.total_kwh).toFixed(2);

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
    .domain([
        d3.min([d3.min(importDataTransformed, d => d.time), d3.min(powerDataTransformed, d => d.time), d3.min(houseConsumptionDataTransformed, d => d.time)]),
        d3.max([d3.max(importDataTransformed, d => d.time), d3.max(powerDataTransformed, d => d.time), d3.max(houseConsumptionDataTransformed, d => d.time)])
    ])
    .range([0, width]);


            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H")));

            // Y-axis scale (energy and power)
            const maxY = d3.max([
                ...importDataTransformed.map(d => d.kwh_imported),
                ...exportDataTransformed.map(d => d.kwh_exported),
                ...productionDataTransformed.map(d => d.kwh_produced),
                ...powerDataTransformed.map(d => d.total_kwh),
                ...houseConsumptionDataTransformed.map(d => d.total_kwh)
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

            // Line for power usage (kWh)
            svg.append("path")
                .datum(powerDataTransformed)
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(d => x(d.time))
                    .y(d => y(d.total_kwh))
                    .curve(d3.curveMonotoneX)
                );

            // Line for solar production (kWh)
            svg.append("path")
                .datum(productionDataTransformed)
                .attr("fill", "none")
                .attr("stroke", "purple")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(d => x(d.time))
                    .y(d => y(d.kwh_produced))
                    .curve(d3.curveMonotoneX)
                );

            // Line for house consumption (kWh)
            svg.append("path")
                .datum(houseConsumptionDataTransformed)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(d => x(d.time))
                    .y(d => y(d.total_kwh))
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
                .text("Energy (kWh)");

            // Add legend with total kWh sums

            // Legend with Solar Import
            svg.append("circle").attr("cx", 900).attr("cy", 50).attr("r", 6).style("fill", "steelblue");
            svg.append("text").attr("x", 920).attr("y", 50).text(`From Grid (kWh): ${totalImport}`).style("font-size", "15px").attr("alignment-baseline", "middle");

            // Legend with Solar Export
            svg.append("circle").attr("cx", 900).attr("cy", 80).attr("r", 6).style("fill", "orange");
            svg.append("text").attr("x", 920).attr("y", 80).text(`Solar Exported (kWh): ${totalExport}`).style("font-size", "15px").attr("alignment-baseline", "middle");

            // Legend with Power Usage
            svg.append("circle").attr("cx", 900).attr("cy", 110).attr("r", 6).style("fill", "green");
            svg.append("text").attr("x", 920).attr("y", 110).text(`Power Usage (kWh): ${totalPowerUsage}`).style("font-size", "15px").attr("alignment-baseline", "middle");

            // Legend with Solar Production
            svg.append("circle").attr("cx", 900).attr("cy", 140).attr("r", 6).style("fill", "purple");
            svg.append("text").attr("x", 920).attr("y", 140).text(`Solar Produced (kWh): ${totalProduction}`).style("font-size", "15px").attr("alignment-baseline", "middle");

            // Legend with House Consumption
            svg.append("circle").attr("cx", 900).attr("cy", 170).attr("r", 6).style("fill", "red");
            svg.append("text").attr("x", 920).attr("y", 170).text(`House Consumption (kWh): ${totalHouseConsumption}`).style("font-size", "15px").attr("alignment-baseline", "middle");
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
        });

        // Function to preprocess the power usage data from the API
        function preprocessPowerData(rawData) {
            const timestamps = Object.keys(rawData).sort();
            const dataByHour = {};

            timestamps.forEach((timestamp) => {
                dataByHour[timestamp] = 0;
            });

            Object.keys(rawData).forEach(device => {
                rawData[device].forEach(record => {
                    const wattage = record.watt;
                    const timestamp = record.timestamp;
                    dataByHour[timestamp] += wattage;
                });
            });

            const totalData = Object.keys(dataByHour).map(timestamp => {
                const totalWattHours = dataByHour[timestamp] * 0.25;
                return {
                    time: new Date(timestamp * 1000),
                    total_kwh: totalWattHours / 1000
                };
            });

            return totalData;
        }

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
                const totalWattHours = dataByHour[timestamp] * 0.25; // Convert to Watt-hours
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
