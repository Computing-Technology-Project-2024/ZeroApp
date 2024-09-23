import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const StackedAreaChart = ({ timeframe }) => {
    const chartRef = useRef(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleCircuits, setVisibleCircuits] = useState(null);
    const [totalEnergyByCircuit, setTotalEnergyByCircuit] = useState({});

    const getTimeRange = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;  // Adjust for local timezone
        let startTime, endTime;
    
        switch (timeframe) {
            case 'Day':
                startTime = new Date(now.setHours(0, 0, 0, 0) - offset);
                endTime = new Date(now.setHours(23, 59, 59, 999) - offset);
                break;
            case 'Week':
                startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 - offset);
                endTime = now;
                break;
            case 'Month':
                startTime = new Date(now.getFullYear(), now.getMonth(), 1);
                endTime = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                break;
            case 'Year':
                startTime = new Date(now.getFullYear(), 0, 1);
                endTime = new Date(now.getFullYear() + 1, 0, 1);
                break;
            default:
                startTime = new Date(now.setHours(0, 0, 0, 0));
                endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        }
    
        return {
            starttime: Math.floor(startTime.getTime() / 1000),
            endtime: Math.floor(endTime.getTime() / 1000)
        };
    };
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { starttime, endtime } = getTimeRange();
                console.log(`Fetching data from ${starttime} to ${endtime}`);
        
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
                console.log('API Response for Day:', result);
        
                if (Object.keys(result).length === 0) {
                    console.error('No data returned for the specified day range.');
                    throw new Error('No data returned from API.');
                }
        
                const aggregatedData = preprocessData(result);
                const energyData = calculateTotalEnergy(result);
        
                console.log('Aggregated Data:', aggregatedData);
        
                setData(aggregatedData);
                setVisibleCircuits(Object.keys(aggregatedData[0]).filter(d => d !== 'timestamp'));
                setTotalEnergyByCircuit(energyData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        
        

        fetchData();
    }, [timeframe]);

    const preprocessData = (rawData) => {
        console.log('Raw Data before processing:', rawData);
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
                totalEnergy += (watt / 1000) * 0.25;
            });
            energyByCircuit[device] = totalEnergy;
        });

        return energyByCircuit;
    };

    useEffect(() => {
        if (data && visibleCircuits && data.length > 0) {  // Add a guard clause to check if data exists and is not empty
            console.log('Chart Data:', data);
            console.log('Visible Circuits:', visibleCircuits);
            createStackedAreaChart(data);
        } else {
            console.log("Data or visible circuits are undefined or empty.");
        }
    
        function createStackedAreaChart(data) {
            if (!data || data.length === 0) return;  // Further protection
    
            d3.select(chartRef.current).select('svg').remove();
    
            const margin = { top: 20, right: 100, bottom: 150, left: 70 },
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
                .y1(d => y(d[1]));
    
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
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x)
                    .ticks(d3.timeHour.every(1))
                    .tickFormat(d3.timeFormat('%H:%M')));

            svg.append('g').call(d3.axisLeft(y));

            svg.append('text')
                .attr('text-anchor', 'end')
                .attr('x', width / 2)
                .attr('y', height + margin.bottom - 100)
                .text('Time of day');

            svg.append('text')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-90)')
                .attr('y', -margin.left + 20)
                .attr('x', -height / 2)
                .text('Power (kW/h)');

            const legend = svg.selectAll('.legend')
                .data(keys)
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', (d, i) => {
                    const row = Math.floor(i / 5);
                    const col = i % 5;
                    const xPos = col * 225;
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

            legend.append('rect')
                .attr('x', 25)
                .attr('y', 0)
                .attr('width', 18)
                .attr('height', 18)
                .style('fill', d => visibleCircuits.includes(d) ? color(d) : 'white')
                .style('stroke', color);

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
                <div ref={chartRef}></div>
            )}
        </div>
    );
};

export default StackedAreaChart;
