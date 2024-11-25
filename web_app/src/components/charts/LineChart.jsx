import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const LineChart = ({ timeframe, selectedDate, tariffRate, electricityCost, lineRent }) => {
    const svgRef = useRef();
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const gridData = await d3.json(`${process.env.PUBLIC_URL}/Grid_Import.txt`);
            const solarData = await d3.json(`${process.env.PUBLIC_URL}/Solar_Export.txt`);

            const gridIntervals = gridData.intervals[0];
            const solarIntervals = solarData.intervals[0];

            const parsedData = gridIntervals.map((grid, index) => {
                const date = new Date(grid.end_at * 1000); // Convert Unix timestamp to JS Date
                const daysSinceStart = Math.ceil((date - new Date(gridIntervals[0].end_at * 1000)) / (1000 * 60 * 60 * 24)); // Calculate total days at that point

                return {
                    date,
                    wh_imported: grid.wh_imported,
                    wh_exported: solarIntervals[index]?.wh_exported || 0, // Match the same index
                    daysSinceStart,
                };
            });

            const processedData = parsedData.map((d) => ({
                date: d.date,
                moneyEarned: (d.wh_exported / 1000) * tariffRate, // Convert to kWh and calculate
                moneySpent: (d.wh_imported / 1000) * electricityCost + d.daysSinceStart * lineRent, // Dynamic days calculation
            }));

            setChartData(processedData); // Set processed data to state
        };

        fetchData();
    }, [tariffRate, electricityCost, lineRent]);

    useEffect(() => {
        if (chartData.length === 0) return;

        const width = 800;
        const height = 400;
        const margin = { top: 40, right: 30, bottom: 50, left: 50 };

        const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
        svg.selectAll("*").remove(); // Clear previous content

        // Calculate dynamic y-axis range
        const maxYValue = d3.max(chartData, (d) => Math.max(d.moneyEarned, d.moneySpent));
        const yMax = maxYValue ? Math.ceil(maxYValue * 1.2) : 10; // Add 20% buffer or set minimum to 10
        const yMin = 0;

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(chartData, (d) => d.date))
            .range([margin.left, width - margin.right]);

        const yScale = d3
            .scaleLinear()
            .domain([yMin, yMax])
            .range([height - margin.bottom, margin.top]);

        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d")));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(
                d3.axisLeft(yScale)
                    .ticks(yMax) // Set number of ticks dynamically
                    .tickFormat(d3.format(".0f")) // Format tick values as integers
            );

        // Line generators
        const lineEarned = d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.moneyEarned));

        const lineSpent = d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.moneySpent));

        // Add lines
        svg.append("path")
            .datum(chartData)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 2)
            .attr("d", lineEarned);

        svg.append("path")
            .datum(chartData)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("d", lineSpent);

        // Add chart title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Money Earned vs Money Spent");

        // Hover effect: Vertical line and tooltip
        const overlay = svg
            .append("rect")
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom)
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .style("fill", "none")
            .style("pointer-events", "all");

        const focusLine = svg
            .append("line")
            .attr("stroke", "black")
            .attr("stroke-dasharray", "4 2")
            .attr("opacity", 0)
            .attr("y1", margin.top)
            .attr("y2", height - margin.bottom);

        const tooltip = d3
            .select("body")
            .append("div")
            .style("position", "absolute")
            .style("background", "rgba(255, 255, 255, 0.9)")
            .style("border", "1px solid #ccc")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.1)")
            .style("display", "none")
            .style("pointer-events", "none");

        overlay
            .on("mousemove", (event) => {
                const [mouseX] = d3.pointer(event, svg.node()); // Get mouse position relative to the SVG container
                const xDate = xScale.invert(mouseX);

                // Find the closest data point
                const closestIndex = d3.bisector((d) => d.date).left(chartData, xDate);
                const closestData = chartData[closestIndex - 1] || chartData[closestIndex];

                if (closestData) {
                    const focusX = xScale(closestData.date);
                    focusLine
                        .attr("x1", focusX)
                        .attr("x2", focusX)
                        .attr("opacity", 1);

                    tooltip
                        .style("display", "block")
                        .html(
                            `<strong>Date:</strong> ${d3.timeFormat("%b %d, %Y")(closestData.date)}<br/>
                    <strong>Earned:</strong> $${closestData.moneyEarned}<br/>
                    <strong>Spent:</strong> $${closestData.moneySpent}`
                        )
                        .style("left", `${event.clientX + 10}px`) // Adjust tooltip position
                        .style("top", `${event.clientY - 10}px`); // Align with mouse pointer
                }
            })
            .on("mouseout", () => {
                focusLine.attr("opacity", 0);
                tooltip.style("display", "none");
            });

        // Add a group for the legend
        const legendWidth = 200; // Approximate width of the legend
        const legend = svg.append("g")
            .attr(
                "transform",
                `translate(${(width - legendWidth) / 2}, ${height - margin.bottom + 30})`
            );
        // Legend items
        legend.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 5)
            .attr("fill", "green");

        legend.append("text")
            .attr("x", 10)
            .attr("y", 5)
            .style("font-size", "12px")
            .text("Money Earned");

        legend.append("circle")
            .attr("cx", 120) // Horizontal spacing
            .attr("cy", 0)
            .attr("r", 5)
            .attr("fill", "red");

        legend.append("text")
            .attr("x", 130) // Horizontal spacing
            .attr("y", 5)
            .style("font-size", "12px")
            .text("Money Spent");
    }, [chartData]);

    return (
        <div style={{ position: "relative", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
            <svg ref={svgRef}></svg>
        </div>
    );
};


export default LineChart;
