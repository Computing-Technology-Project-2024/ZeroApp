import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const StackedAreaChart = ({ timeframe, selectedDate }) => {
    const chartRef = useRef(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleCircuits, setVisibleCircuits] = useState(null);
    const [totalEnergyByCircuit, setTotalEnergyByCircuit] = useState({});
    const [lastUpdated, setLastUpdated] = useState(null);

    const getTimeRange = () => {
        const selected = new Date(selectedDate);  // Use selectedDate instead of current date

        let startTime, endTime;

        switch (timeframe) {
            case 'Day':
                // Set start time to the start of the selected day in AEST
                startTime = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 0, 0, 0);
                endTime = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 23, 59, 59);
                break;
            case 'Week':
                // Get the start of the week (Monday) in AEST
                const dayOfWeek = selected.getDay(); // Day of week (0 is Sunday, 6 is Saturday)
                const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek; // Calculate how many days to subtract to get to Monday
                startTime = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() + diffToMonday, 0, 0, 0);
                endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate() + 6, 23, 59, 59);
                break;
            case 'Month':
                // Set start time to the first day of the selected month
                startTime = new Date(selected.getFullYear(), selected.getMonth(), 1, 0, 0, 0);
                // Set end time to the last day of the selected month
                endTime = new Date(selected.getFullYear(), selected.getMonth() + 1, 0, 23, 59, 59);
                break;
            case 'Year':
                // Set start time to January 1st of the selected year
                startTime = new Date(selected.getFullYear(), 0, 1, 0, 0, 0);
                // Set end time to December 31st of the selected year
                endTime = new Date(selected.getFullYear(), 11, 31, 23, 59, 59);
                break;
            default:
                // Default to the selected day if no timeframe is matched
                startTime = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 0, 0, 0);
                endTime = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 23, 59, 59);
        }

        // Convert times to UTC for the API (since the backend may expect Unix timestamps in UTC)
        const startTimeUTC = Math.floor(startTime.getTime() / 1000); // Convert to Unix timestamp in seconds
        const endTimeUTC = Math.floor(endTime.getTime() / 1000);

        return {
            starttime: startTimeUTC,
            endtime: endTimeUTC
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { starttime, endtime } = getTimeRange();

                const response = await fetch(
                    `https://api.edgeapi-v1.com/swinburn/getloaddata/interval/2385?starttime=${starttime}&endtime=${endtime}`,
                    {
                        method: 'GET',
                        headers: { 'x-api-key': 'JjsFazxTPd7GVoPYGdEI34HrudDZHq695FqKKnmU' },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();

                if (Object.keys(result).length === 0) {
                    console.error('No data returned for the specified day range.');
                    throw new Error('No data returned from API.');
                }

                const aggregatedData = preprocessData(result);
                const energyData = calculateTotalEnergy(result);

                setData(aggregatedData);
                setVisibleCircuits(Object.keys(aggregatedData[0]).filter(d => d !== 'timestamp'));
                setTotalEnergyByCircuit(energyData);
                setLoading(false);
                setLastUpdated(new Date());  // Set the current time as the last updated time
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        void fetchData();
    }, [timeframe, selectedDate]);

    const preprocessData = (rawData) => {
        const aggregatedData = {};
        const allDevices = Object.keys(rawData);

        allDevices.forEach(device => {
            rawData[device].forEach(({ timestamp }) => {
                if (!aggregatedData[timestamp]) {
                    aggregatedData[timestamp] = { timestamp: parseInt(timestamp) };
                }
                aggregatedData[timestamp][device] = 0;
            });
        });

        allDevices.forEach(device => {
            rawData[device].forEach(({ timestamp, watt }) => {
                aggregatedData[timestamp][device] += watt / 1000;
            });
        });

        return Object.values(aggregatedData).sort((a, b) => a.timestamp - b.timestamp);

    };

    const calculateTotalEnergy = (rawData) => {
        const energyByCircuit = {};
        const allDevices = Object.keys(rawData);

        allDevices.forEach(device => {
            let totalEnergy = 0;
            rawData[device].forEach(({ watt }) => {
                totalEnergy += (watt / 1000);
            });
            energyByCircuit[device] = totalEnergy;
        });

        return energyByCircuit;
    };

    useEffect(() => {
        if (data && visibleCircuits && data.length > 0) {  // Add a guard clause to check if data exists and is not empty
            createStackedAreaChart(data);
        }

        function createStackedAreaChart(data) {
            if (!data || data.length === 0) return;  // Further protection

            d3.select(chartRef.current).select('svg').remove();

            const margin = { top: 20, right: 100, bottom: 100, left: 70 },
                width = 1200 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

            const svg = d3.select(chartRef.current)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const keys = Object.keys(data[0]).filter(d => d !== 'timestamp');
            if (keys.length === 0) return;  // If no keys are found, don't proceed

            const stack = d3.stack().keys(keys);
            const stackedData = stack(data);

            const x = d3.scaleTime()
                .domain(d3.extent(data, d => new Date(d.timestamp * 1000)))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
                .range([height, 0]);

            const color = d3.scaleOrdinal(d3.schemeCategory10).domain(keys);

            const area = d3.area()
                .x(d => x(new Date(d.data.timestamp * 1000)))
                .y0(d => y(d[0]))
                .y1(d => y(d[1]))
                .curve(d3.curveBasis);


            svg.selectAll('path')
                .data(stackedData)
                .enter()
                .append('path')
                .attr('fill', d => color(d.key))
                .style('display', d => visibleCircuits.includes(d.key) ? null : 'none')
                .attr('d', area);

            svg.append('rect')
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'none')
                .style('pointer-events', 'all')
                .on('click', function (event) {
                    const [mouseX] = d3.pointer(event);
                    const xDate = x.invert(mouseX);
                    const bisect = d3.bisector(d => new Date(d.timestamp * 1000)).left;
                    const index = bisect(data, xDate);
                    const closestData = data[index];

                    svg.selectAll('.hover-info').remove();

                    svg.append('text')
                        .attr('class', 'hover-info')
                        .attr('x', 10)
                        .attr('y', 20)
                        .text(`Time: ${d3.timeFormat('%Y-%m-%d %H:%M')(new Date(closestData.timestamp * 1000))}`);

                    let yPosition = 40;
                    visibleCircuits.forEach((circuit) => {
                        const circuitPower = closestData[circuit] || 0;
                        svg.append('text')
                            .attr('class', 'hover-info')
                            .attr('x', 10)
                            .attr('y', yPosition)
                            .text(`${circuit}: ${circuitPower.toFixed(2)} kW`);
                        yPosition += 20;
                    });
                });

            svg.append('g')
            .style("stroke-opacity", 0)
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x)
                    .ticks(d3.timeHour.every(1))  // Control tick frequency
                    .tickFormat(d3.timeFormat('%H'))  // Time format
                )
            svg.selectAll(".tick text")
                .style("fill", "#777")
                .style("font-size", "14px"); // Rotate labels for better fit

            //x-axis
            svg.append('text')
                .attr('text-anchor', 'end')
                .attr('x', width / 2)
                .attr('y', height + margin.bottom - 60)
                .text('Time (hour)')
                .style("fill", "#777")
                .style("font-size", "14px");

            //y-axis
            svg.append('g')
                .call(d3.axisLeft(y))
                .style("stroke-opacity", 0)
            svg.selectAll(".tick text")
                .style("fill", "#777")
                .style("font-size", "14px");

            svg.append('text')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-90)')
                .attr('y', -margin.left + 20)
                .attr('x', -height / 2 + 50)
                .text('Energy (kW/h)')
                .style("fill", "#777")
                .style("font-size", "14px");

                svg.append("g")
                    .style("stroke-opacity", 0)
                    .attr("class", "grid")
                    .call(d3.axisLeft(y)
                        .tickSize(-width)   // Make the ticks span across the width of the chart
                        .tickFormat('')     // Remove the tick labels
                    )
                    .selectAll("line")      // Select all the horizontal gridlines
                    .attr("stroke", "#e0e0e0") // Set the gridline color to grey
                    .attr("stroke-opacity", 0.5);

            const legend = svg.selectAll('.legend')
                .data(keys)
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', (d, i) => {
                    const row = Math.floor(i / 4);
                    const col = i % 4;
                    const xPos = 60 + col * 275;
                    const yPos = height + margin.bottom - 50 + (row * 30);
                    return `translate(${xPos}, ${yPos})`;
                })
                .on('click', (event, d) => {
                    const newVisibleCircuits = visibleCircuits.includes(d)
                        ? visibleCircuits.filter(circuit => circuit !== d)
                        : [...visibleCircuits, d];
                    setVisibleCircuits(newVisibleCircuits);
                });

            legend.append('text')
                .attr('x', -50)
                .attr('y', 9)
                .attr('dy', '.35em')
                .text(d => `${totalEnergyByCircuit[d].toFixed(2)} kWh`);

            legend.append('circle')
                .attr('cx', 35) // Adjust x position
                .attr('cy', 9) // Adjust y position
                .attr('r', 7) // Radius of the circle
                .style('fill', d => visibleCircuits.includes(d) ? color(d) : 'white') // Change color based on visibility
                .style('stroke', d => color(d)) // Border color
                .style('cursor', 'pointer');

            legend.append('text')
                .attr('x', 45)
                .attr('y', 9)
                .attr('dy', '.35em')
                .text(d => d);
        }
    }, [data, visibleCircuits]);

    return (
        <div>
            {loading ? (
                <div className="loading-spinner">Loading data, please wait...</div>
            ) : (
                <>
                <div ref={chartRef}></div>
                {lastUpdated && (
                    <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#777' }}>
                        <p>Click Individual Circuits in Legend to toggle view.</p>
                        Last updated: {lastUpdated.toLocaleString()}
                        </div>
                )}
            </>
            )}
        </div>
    );
};

export default StackedAreaChart;
