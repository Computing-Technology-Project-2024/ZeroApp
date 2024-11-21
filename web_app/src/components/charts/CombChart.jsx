import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const CombinedChart = ({ timeframe, selectedDate }) => {
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);
    const [staticData, setStaticData] = useState({
        importData: [],
        exportData: [],
        productionData: [],
    });

    const getTimeRange = () => {
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
            default:
                startTime = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 0, 0, 0);
                endTime = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 23, 59, 59);
        }

        return { starttime: Math.floor(startTime.getTime() / 1000), endtime: Math.floor(endTime.getTime() / 1000) };
    };

    useEffect(() => {
        const loadStaticData = async () => {
            try {
                const [importResponse, exportResponse, productionResponse] = await Promise.all([
                    fetch(`${process.env.PUBLIC_URL}/Grid_Import.txt`),
                    fetch(`${process.env.PUBLIC_URL}/Solar_Export.txt`),
                    fetch(`${process.env.PUBLIC_URL}/Solar_Production.txt`),
                ]);

                if (!importResponse.ok || !exportResponse.ok || !productionResponse.ok) {
                    throw new Error('Failed to fetch static data');
                }

                const [importData, exportData, productionData] = await Promise.all([
                    importResponse.json(),
                    exportResponse.json(),
                    productionResponse.json(),
                ]);

                setStaticData({
                    importData: importData.intervals[0],
                    exportData: exportData.intervals[0],
                    productionData: productionData.intervals,
                });
            } catch (error) {
                setErrorMessage(error.message || 'Failed to load static data');
                console.error('Error loading static data:', error);
            }
        };

        loadStaticData();
    }, []);

    useEffect(() => {
        console.log("Selected Date:", selectedDate, "Timeframe:", timeframe); // Debugging

        const { starttime, endtime } = getTimeRange();
        setLoading(true);
        setErrorMessage('');

        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.edgeapi-v1.com/swinburn/getloaddata/interval/2385?starttime=${starttime}&endtime=${endtime}`, {
                    method: 'GET',
                    headers: { 'x-api-key': process.env.REACT_APP_XCONN_API },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch dynamic data');
                }

                const powerUsageData = await response.json();
                console.log("Power Usage Data:", powerUsageData); // Log fetched data

                const powerDataTransformed = preprocessHouseConsumptionData(powerUsageData);

                const importDataTransformed = staticData.importData.map(item => ({
                    time: new Date(item.end_at * 1000),
                    kwh_imported: (item.wh_imported / 1000).toFixed(2),
                }));

                const exportDataTransformed = staticData.exportData.map(item => ({
                    time: new Date(item.end_at * 1000),
                    kwh_exported: (item.wh_exported / 1000).toFixed(2),
                }));

                const productionDataTransformed = staticData.productionData.map(item => ({
                    time: new Date(item.end_at * 1000),
                    kwh_produced: (item.wh_del / 1000).toFixed(2),
                }));

                // Validate data before rendering
                console.log("Transformed Data:", { importDataTransformed, exportDataTransformed, productionDataTransformed });

                d3.select(chartRef.current).select("svg").remove();
                
                // D3 chart rendering logic
                const margin = { top: 20, right: 100, bottom: 100, left: 60 };
                const width = 1200 - margin.left - margin.right;
                const height = 650 - margin.top - margin.bottom;

                const svg = d3.select(chartRef.current)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

                const x = d3.scaleTime()
                    .domain(d3.extent([...importDataTransformed, ...exportDataTransformed, ...productionDataTransformed], d => d.time))
                    .range([0, width]);

                const y = d3.scaleLinear()
                    .domain([0, d3.max([d3.max(importDataTransformed, d => d.kwh_imported), d3.max(exportDataTransformed, d => d.kwh_exported), d3.max(productionDataTransformed, d => d.kwh_produced), d3.max(powerDataTransformed, d => d.total_kwh)])])
                    .range([height, 0]);

                // X Axis
                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H")))
                    .style("stroke-opacity", 0);

                // Y Axis
                svg.append("g")
                    .call(d3.axisLeft(y).tickSize(0).tickPadding(10))
                    .select(".domain").attr("stroke", "none");

                // Lines for imported, exported, produced, and power usage
                svg.append("path")
                    .datum(importDataTransformed)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 2)
                    .attr("d", d3.line().x(d => x(d.time)).y(d => y(d.kwh_imported)).curve(d3.curveBasis));

                svg.append("path")
                    .datum(exportDataTransformed)
                    .attr("fill", "none")
                    .attr("stroke", "orange")
                    .attr("stroke-dasharray", "10,5")
                    .attr("stroke-width", 2)
                    .attr("d", d3.line().x(d => x(d.time)).y(d => y(d.kwh_exported)).curve(d3.curveBasis));

                svg.append("path")
                    .datum(powerDataTransformed)
                    .attr("fill", "none")
                    .attr("stroke", "green")
                    .attr("stroke-width", 2)
                    .attr("d", d3.line().x(d => x(d.time)).y(d => y(d.total_kwh)).curve(d3.curveBasis));

                svg.append("path")
                    .datum(productionDataTransformed)
                    .attr("fill", "none")
                    .attr("stroke", "purple")
                    .attr("stroke-dasharray", "10,5")
                    .attr("stroke-width", 2)
                    .attr("d", d3.line().x(d => x(d.time)).y(d => y(d.kwh_produced)).curve(d3.curveBasis));

                setLastUpdated(new Date());
            } catch (error) {
                setErrorMessage(error.message || 'Failed to load API data');
                console.error('Error loading API data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDate, timeframe, staticData]);

    function preprocessHouseConsumptionData(data) {
        return data.intervals.map(interval => ({
            time: new Date(interval.end_at * 1000),
            total_kwh: (interval.wh_total / 1000).toFixed(2),
        }));
    }

    return (
        <div>
            {loading && <p>Loading...</p>}
            {errorMessage && <p>Error: {errorMessage}</p>}
            <div ref={chartRef}></div>
            {lastUpdated && <p>Last updated: {lastUpdated.toLocaleString()}</p>}
        </div>
    );
};

export default CombinedChart;
