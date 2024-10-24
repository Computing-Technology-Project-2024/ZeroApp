import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CombinedBarChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const margin = { top: 20, right: 100, bottom: 100, left: 60 },
            width = 1200 - margin.left - margin.right,
            height = 650 - margin.top - margin.bottom;

        // Fetch Solar Import, Solar Export, Solar Production, House Consumption, and Power Usage data from the API
        Promise.all([
            fetch(`${process.env.PUBLIC_URL}/Grid_Import.txt`),
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
                const powerDataTransformed = preprocessHouseConsumptionData(powerUsageData);

                // Transform and accumulate total kWh for each category across all intervals
                let totalImport = 0, totalExport = 0, totalProduction = 0, totalConsumption = 0;

                const importDataTransformed = importData.intervals[0].map(item => {
                    const kwhImported = item.wh_imported / 1000;
                    totalImport += kwhImported;
                    return { time: new Date(item.end_at * 1000), kwh_imported: kwhImported.toFixed(2) };
                });

                const exportDataTransformed = exportData.intervals[0].map(item => {
                    const kwhExported = item.wh_exported / 1000;
                    totalExport += kwhExported;
                    return { time: new Date(item.end_at * 1000), kwh_exported: kwhExported.toFixed(2) };
                });

                const productionDataTransformed = productionData.intervals.map(item => {
                    const kwhProduced = item.wh_del / 1000;
                    totalProduction += kwhProduced;
                    return { time: new Date(item.end_at * 1000), kwh_produced: kwhProduced.toFixed(2) };
                });

                powerDataTransformed.forEach(item => {
                    totalConsumption += item.total_kwh;
                });

                d3.select(chartRef.current).select("svg").remove();

                const svg = d3.select(chartRef.current)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

                // Aggregate time data into hours (0-23)
                const timeData = powerDataTransformed.map(d => d.time.getHours());

                // Define x scale: now mapping to hours (0-23)
                const x = d3.scaleBand()
                    .domain(d3.range(0, 24))  // Only show 0-23
                    .range([0, width])
                    .padding(0.2);

                // Define subgroups (bars for each category within the same hour)
                const xSubgroup = d3.scaleBand()
                    .domain(['import', 'export', 'production', 'consumption'])
                    .range([0, x.bandwidth()])
                    .padding(0.05);

                // Calculate max Y
                const maxY = d3.max([
                    ...importDataTransformed.map(d => d.kwh_imported),
                    ...exportDataTransformed.map(d => d.kwh_exported),
                    ...productionDataTransformed.map(d => d.kwh_produced),
                    ...powerDataTransformed.map(d => d.total_kwh)
                ]);

                // Define y scale
                const y = d3.scaleLinear()
                    .domain([0, maxY+.3])
                    .range([height, 0]);

                // Create the x-axis with single 0-23 hour range
                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x).tickFormat(d => d))
                    .selectAll("text")
                    .style("fill", "#777")
                    .style("font-size", "14px");

                // Add y-axis
                svg.append("g")
                    .call(d3.axisLeft(y)
                        .tickSize(0)
                        .tickPadding(10))
                    .select(".domain")
                    .attr("stroke", "none")
                svg.selectAll(".tick text")
                    .style("fill", "#777")
                    .style("font-size", "14px");

                // Add gridlines
                svg.append("g")
                    .style("stroke-opacity", 0)
                    .attr("class", "grid")
                    .call(d3.axisLeft(y)
                        .tickSize(-width)
                        .tickFormat(''))
                    .selectAll("line")
                    .attr("stroke", "#e0e0e0")
                    .attr("stroke-opacity", 0.5);

                // Define color scale for subgroups
                const color = d3.scaleOrdinal()
                    .domain(['import', 'export', 'production', 'consumption'])
                    .range(['steelblue', 'orange', 'purple', 'green']);

                // Combine data for bar rendering
                // Modify the barData creation process to sum all data points within each hour

                const barData = d3.range(0, 24).map(hour => {
                    // Filter data points for the current hour and sum the kWh for each category
                    const importSum = importDataTransformed
                        .filter(d => d.time.getHours() === hour)
                        .reduce((sum, d) => sum + parseFloat(d.kwh_imported), 0);

                    const exportSum = exportDataTransformed
                        .filter(d => d.time.getHours() === hour)
                        .reduce((sum, d) => sum + parseFloat(d.kwh_exported), 0);

                    const productionSum = productionDataTransformed
                        .filter(d => d.time.getHours() === hour)
                        .reduce((sum, d) => sum + parseFloat(d.kwh_produced), 0);

                    const consumptionSum = powerDataTransformed
                        .filter(d => d.time.getHours() === hour)
                        .reduce((sum, d) => sum + parseFloat(d.total_kwh), 0);

                    return {
                        hour,
                        import: importSum,
                        export: exportSum,
                        production: productionSum,
                        consumption: consumptionSum
                    };
                });


                // Tooltip setup
                const tooltipLabels = {
                    import: 'Grid Import',
                    export: 'Solar Export',
                    production: 'Solar Production',
                    consumption: 'Consumption'
                };
                
                // Tooltip setup
                const tooltip = d3.select(chartRef.current)
                    .append("div")
                    .style("position", "absolute")
                    .style("visibility", "hidden")
                    .style("background", "rgba(0, 0, 0, 0.7)")
                    .style("color", "#fff")
                    .style("padding", "5px")
                    .style("border-radius", "4px")
                    .style("font-size", "12px");
                
                // Render bars
                svg.append("g")
                    .selectAll("g")
                    .data(barData)
                    .enter()
                    .append("g")
                    .attr("transform", d => `translate(${x(d.hour)},0)`)
                    .selectAll("rect")
                    .data(d => [
                        { key: 'import', value: d.import, hour: d.hour },
                        { key: 'export', value: d.export, hour: d.hour },
                        { key: 'production', value: d.production, hour: d.hour },
                        { key: 'consumption', value: d.consumption, hour: d.hour }
                    ])
                    .enter()
                    .append("rect")
                    .attr("x", d => xSubgroup(d.key))
                    .attr("y", d => y(d.value))
                    .attr("width", xSubgroup.bandwidth())
                    .attr("height", d => height - y(d.value))
                    .attr("fill", d => color(d.key))
                    .on("mouseover", (event, d) => {
                        const label = tooltipLabels[d.key];  // Get the custom label
                        tooltip.style("visibility", "visible")
                            .html(`Hour: ${d.hour}:00<br>${label}: ${Number(d.value).toFixed(2)} kWh`);  // Use the custom label and format kWh
                    })
                    .on("mousemove", (event) => {
                        tooltip.style("top", `${event.pageY - 20}px`)
                            .style("left", `${event.pageX - 220}px`);
                    })
                    .on("mouseout", () => {
                        tooltip.style("visibility", "hidden");
                    });
                

                // Add x-axis label
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", width / 2)
                    .attr("y", height + margin.bottom - 60)
                    .text("Time (hour)")
                    .style("fill", "#777")
                    .style("font-size", "14px");

                // Add y-axis label
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -margin.left + 20)
                    .attr("x", -margin.top - height / 2 + 50)
                    .text("Energy (kWh)")
                    .style("fill", "#777")
                    .style("font-size", "14px");

                // Add legend
                const legendData = [
                    { color: 'green', label: `Consumption: ${totalConsumption.toFixed(2)} kWh` },
                    { color: 'steelblue', label: `From Grid: ${totalImport.toFixed(2)} kWh` },
                    { color: 'orange', label: `Solar Exported: ${totalExport.toFixed(2)} kWh` },
                    { color: 'purple', label: `Solar Produced: ${totalProduction.toFixed(2)} kWh` }
                ];

                legendData.forEach((d, i) => {
                    svg.append("circle").attr("cx", 130 + i * 200).attr("cy", 600).attr("r", 6).style("fill", d.color);
                    svg.append("text").attr("x", 140 + i * 200).attr("y", 600).text(d.label).style("font-size", "15px").attr("alignment-baseline", "middle");
                });

            })
            .catch(error => {
                console.error('Error fetching or processing data:', error);
            });

        // Preprocessing function for house consumption data
        function preprocessHouseConsumptionData(rawData) {
            const dataByHour = {};

            Object.keys(rawData).forEach(device => {
                rawData[device].forEach(record => {
                    const wattage = record.watt;
                    const timestamp = record.timestamp;
                    const hour = new Date(timestamp * 1000).getHours();
                    if (!dataByHour[hour]) {
                        dataByHour[hour] = 0;
                    }
                    dataByHour[hour] += wattage;
                });
            });

            return Object.entries(dataByHour).map(([hour, wattHours]) => ({
                time: new Date(0, 0, 0, hour),  // Simulated date with the correct hour
                total_kwh: wattHours / 1000
            }));
        }
    }, []);

    return <div ref={chartRef}></div>;
};

export default CombinedBarChart;
