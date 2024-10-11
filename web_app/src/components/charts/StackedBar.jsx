import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';

const StackedBarChart = ({ timeframe, selectedDate }) => {
    const chartRef = useRef(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleCircuits, setVisibleCircuits] = useState(null);
    const [totalEnergyByCircuit, setTotalEnergyByCircuit] = useState({});
    const [lastUpdated, setLastUpdated] = useState(null);
    const [errorMessage, setErrorMessage] = useState(''); // New state for error messages

    const getTimeRange = useCallback(() => {
        const selected = new Date(selectedDate);
        let startTime, endTime;

        switch (timeframe) {
            case 'Day':
                startTime = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 0, 0, 0);
                endTime = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 23, 59, 59);
                break;
            case 'Week':
                const dayOfWeek = selected.getDay();
                const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
                startTime = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() + diffToMonday, 0, 0, 0);
                endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate() + 6, 23, 59, 59);
                break;
            case 'Month':
                startTime = new Date(selected.getFullYear(), selected.getMonth(), 1, 0, 0, 0);
                endTime = new Date(selected.getFullYear(), selected.getMonth() + 1, 0, 23, 59, 59);
                break;
            case 'Year':
                startTime = new Date(selected.getFullYear(), 0, 1, 0, 0, 0);
                endTime = new Date(selected.getFullYear(), 11, 31, 23, 59, 59);
                break;
            default:
                startTime = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 0, 0, 0);
                endTime = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 23, 59, 59);
        }

        return {
            starttime: Math.floor(startTime.getTime() / 1000),
            endtime: Math.floor(endTime.getTime() / 1000)
        };
    }, [timeframe, selectedDate]);

    useEffect(() => {
        const fetchData = async () => {
            const now = new Date();
            const selected = new Date(selectedDate);

            // Check if the selected date is in the future
            if (selected > now) {
                setErrorMessage('Invalid date range(Please Check Selected Date)');
                setLoading(false);
                return;
            } else {
                setErrorMessage(''); // Clear any previous error messages
            }

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
                const aggregatedData = preprocessData(result);
                const energyData = calculateTotalEnergy(result);

                setData(aggregatedData);
                setVisibleCircuits(Object.keys(aggregatedData[0]).filter(d => d !== 'timestamp'));
                setTotalEnergyByCircuit(energyData);
                setLastUpdated(new Date());
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [getTimeRange, selectedDate]);

    const preprocessData = useCallback((rawData) => {
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
    }, []);

    const calculateTotalEnergy = useCallback((rawData) => {
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
    }, []);

    // Memoize the chart creation to avoid unnecessary renders
    useEffect(() => {
        if (data && visibleCircuits && data.length > 0) {
            createStackedBarChart(data);
        }

        function createStackedBarChart(data) {
            // Re-use SVG if it exists
            const existingSvg = d3.select(chartRef.current).select('svg');
            if (!existingSvg.empty()) {
                return;
            }

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
            const stack = d3.stack().keys(keys);
            const stackedData = stack(data);

            const x = d3.scaleBand()
                .domain(data.map(d => {
                    const timestamp = new Date(d.timestamp * 1000);
                    return timeframe === 'Day'
                        ? d3.timeFormat('%H')(timestamp)
                        : d3.timeFormat('%Y-%m-%d')(timestamp);
                }))
                .range([0, width])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
                .range([height, 0]);

            const color = d3.scaleOrdinal(d3.schemeCategory10).domain(keys);

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

            svg.selectAll('g.layer')
                .data(stackedData)
                .enter()
                .append('g')
                .classed('layer', true)
                .attr('fill', d => color(d.key))
                .selectAll('rect')
                .data(d => d)
                .enter()
                .append('rect')
                .attr('x', d => x(timeframe === 'Day' ? d3.timeFormat('%H')(new Date(d.data.timestamp * 1000)) : d3.timeFormat('%Y-%m-%d')(new Date(d.data.timestamp * 1000))))
                .attr('y', d => y(d[1]))
                .attr('height', d => y(d[0]) - y(d[1]))
                .attr('width', x.bandwidth())
                .attr('rx', x.bandwidth() / 4)
                .attr('ry', (d, i) => i === 0 ? 10 : 0); // Rounds only the top side

                

            // Add X axis
            svg.append('g')
            .style("stroke-opacity", 0)
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x).tickFormat(d => d))
                svg.selectAll(".tick text")
                    .style("fill", "#777")
                    .style("font-size", "14px");

            svg.append('text')
                .attr('text-anchor', 'end')
                .attr('x', width / 2)
                .attr('y', height + margin.bottom - 60)
                .text('Time')
                .style("fill", "#777")
                .style("font-size", "14px");

            // Add Y axis
            svg.append('g')
            .style("stroke-opacity", 0)
                .call(d3.axisLeft(y))
                svg.selectAll(".tick text")
                .style("fill", "#777")
                .style("font-size", "14px");

                svg.append('text')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-90)')
                .attr('y', -margin.left + 20)
                .attr('x', -height / 2 + 50)
                .text('Energy (kWh)')
                .style("fill", "#777")
                .style("font-size", "14px");

                

            // Add legend
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

            ) : errorMessage ? ( 
                <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#777' }}>{errorMessage}</div>
            ) : (
                <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#777' }}>
                    <div ref={chartRef}></div>
                    {lastUpdated && <div>Last updated: {lastUpdated.toLocaleString()}</div>}
                </div>
            )}
        </div>
    );
};

export default StackedBarChart;
