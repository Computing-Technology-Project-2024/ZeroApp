import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
    // Pie chart's properties
    var w = 700;
    var h = 400;
    var radius = Math.min(w, h) / 2;
    
    var svg = d3.select("#second")
                .append("svg")
                .attr("id", "pie_chart")
                .attr("width", w)
                .attr("height", h)
                .append("g")



    svg.append("g")
        .attr("class", "slices");

    svg.attr("transform", "translate(" + w / 3.75 + "," + h / 2 + ")");

    var categories = ["Student - vocational education and training", "Student - higher education", "Student - other", "Skilled (temporary)", "Working holiday" ,"Visitors", "Other (temporary)"];

    // Set up colorscheme
    var color = d3.scaleOrdinal()
                    .domain(categories)
                    .range(['#8c510a','#d8b365','#f6e8c3','#f5f5f5','#c7eae5','#5ab4ac','#01665e']);

    // Zoooming function for the pie chart
    function handleZoom(e) {
        d3.select('svg g.slices')
            .attr('transform', e.transform);
    }
    
    let zoom = d3.zoom()
                .on('zoom', handleZoom)
                .translateExtent([[0, -h/5], [w, h]])
                .scaleExtent([1, 5]); //limits the zoom range
    
    d3.select('#pie_chart')
        .call(zoom);

    // Bar graph's properties
    var width = 700;
    var height = 400;
    var padding = 60;
    var xScale, yScale, xAxis, yAxis;
    var year_clicked; // stores the year selected
    
    // Color scale for the bar chart
    var bar_color; 

    var canvas = d3.select("#second")
                .append("svg")
                .attr("id", "second_bar")
                .attr("width", width)
                .attr("height", height);
    
    // Add tooltips for the bar chart
    var bar_tooltip = d3.select("#second")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip-bar");

    // Variables to store data for bar graphs
    // @bar_data: stores data for all visa types from 2017 - 2021
    // @single_bar_data: stores data for a single visa type in a specific year 
    // @state_name: Names of all states in Australia
    var bar_data;               
    var single_bar_data;     
    var state_name;

    // Load bars graph data 
    d3.json("./sources/bar_data.json").then(function(json){

        bar_data = json;
        state_name = bar_data.state_name;

        // set initial single bar data
        single_bar_data = bar_data.properties[0].data[0].value;
        year_clicked = 2017;

        // Draw the initial bar chart
        // Set the scales
        xScale = d3.scaleBand()
                    .domain(state_name)
                    .rangeRound([padding, width-padding])
                    .paddingInner(0.2); // padding value = 5% of the band width
        // Y scale for the bar    
        yScale = d3.scaleLinear()
                    .domain([d3.min(single_bar_data, function (d) {
                        return d;
                    }), 
                    d3.max(single_bar_data, function (d) {
                        return d;       
                        })
                    ])
                    .range([height - padding, padding]);
                    
        // Color scale
        bar_color = d3.scaleLinear()
                        .domain([d3.min(single_bar_data, function (d) {
                            return d;
                        }), 
                        d3.max(single_bar_data, function (d) {
                            return d;       
                            })
                        ])
                        .range(["#99d8c9", "#2ca25f"]);
        
        // Set axes
        xAxis = d3.axisBottom()
                    .ticks()
                    .scale(xScale);

        yAxis = d3.axisLeft()
                    .ticks()
                    .scale(yScale);
                        
        // Draw X Axis
        canvas.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(0, " + (height - padding) + ")")
            .call(xAxis)
            .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

        // Draw Y Axis
        canvas.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate(" + (padding - 5) + ", 0)")
            .call(yAxis);
        
        // Draw bars
        canvas.selectAll("rect")
            .data(single_bar_data)
            .enter()
            .append("rect")
            // Hovering effects
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(50)
                    .attr("stroke", "red")
                    .attr("stroke-width", 3);

                bar_tooltip.transition()
                        .duration(50)
                        .style("opacity", 1)
            })
            .on("mousemove", function(event, d) {
                let value = "Total number of visa granted: " + d.toString();
                bar_tooltip.html(value)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 15) + "px");
            })
            .on("mouseout", function(d) {
                    d3.select(this).transition()
                        .duration(50)
                        .attr("stroke", "transparent")

                    bar_tooltip.transition()
                        .duration(50)
                        .style("opacity", 0);
            })

            .attr("x", function(d, i) {
                return xScale(state_name[i]);
            })
            .attr("y", function(d) {
                return yScale(d);
            })
            .attr("width", function(d, i) {
                return xScale.bandwidth();
            })
            .attr("height", function(d) {
                return height - padding - yScale(d);
            })
            .attr("fill", function(d) {
                return bar_color(d);
            });

        // Add labels for the axes
        // X label
        canvas.append("text")
                .attr("class", "bar_label")
                .attr("text-anchor", "end")
                .attr("x", width - padding/3)
                .attr("y", height - padding*0.75)
                .attr("fill", "brown")
                .text("State");
        
        // Y label
        canvas.append("text")
                .attr("class", "bar_label")
                .attr("text-anchor", "end")
                .attr("x", -height/3)
                .attr("dy", "0.7em")
                .attr("transform", "rotate(-90)")
                .attr("fill", "brown")
                .text("Number of Visa");
        
        // Add title for the bar graph
        canvas.append("text")
                .attr("id", "second_bar_title")
                .attr("y", height - padding/10)
                .text("Figure 2.2: Student - vocational education and training visa type by states, 2017-2018");
    });

    // default 2017-2018 pie chart
    UpdatePie("2017-2018");
    UpdatePie("2017-2018");

    //legend squares
    var size = 15
    svg.selectAll("mydots")
        .data(categories)
        .enter()
        .append("rect")
        .attr("x", 165)
        .attr("y", function(d,i){ return -180 + i*18}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)});

    //add legend: 
    svg.selectAll("legend")
        .data(categories)
        .enter()
        .append("g")
        .append("text")
        .attr("x", 182)
        .attr("y", function(d,i){ return -172 + i*18}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", "black")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "14px")

    // Add title for the pie chart
    svg.append("text")
            .attr("id", "second_pie_title")
            .attr("x", -w/4)
            .attr("y", h*0.49)
            .text("Figure 2.1: Australia overseas migrant arrivals, by visa groupings, 2017-2018");

    function UpdatePie(period) {

        // Load pie data
        d3.csv("./sources/temporary_visas_arrivals.csv").then(function(data) {

            // Update the bar graph with new data
            function Update(new_data) {

                // Update the scales
                yScale.domain([d3.min(single_bar_data, function (d) {
                        return d;
                    }), 
                    d3.max(new_data, function (d) {
                        return d;       
                    })
                ]);

                bar_color.domain([d3.min(single_bar_data, function (d) {
                        return d;
                    }), 
                    d3.max(single_bar_data, function (d) {
                        return d;       
                    })
                ]);

                // Update Y Axis
                canvas.select("#y-axis")
                    .transition()
                    .call(yAxis);

                canvas.selectAll("rect")
                    .data(new_data)
                    .merge(canvas)
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(550)
                    .attr("x", function(d, i) {
                        return xScale(state_name[i]);
                    })
                    .attr("y", function(d) {
                        return yScale(d);
                    })
                    .attr("width", function(d, i) {
                        return xScale.bandwidth();
                    })
                    .attr("height", function(d) {
                        return height - padding - yScale(d);
                    })
                    .attr("fill", function(d) {
                        return bar_color(d);
                    });

                // Removed any disposed element
                canvas.exit().remove();
            }       

            // Update pie chart with new data
            // setup pie value
            var pie = d3.pie()
                        .sort(null)
                        .value(function(d) { return d[period]; });

            // define arc
            var arc = d3.arc()
                        .outerRadius(radius * 0.8)
                        .innerRadius(radius * 0.4);
            
            // define tooltip
            var tooltip = d3.select("#second")
                            .append("div")
                            .style("opacity", 0)
                            .attr("class", "tooltip-pie")

                    
            // define donut slices       
            var slice = svg.select(".slices").selectAll("path.slice")
                            .data(pie(data))

            slice.enter()
                .append("path")
                .style("fill", function(d) { return color(d.value); })
                .attr("class", "slice")
                .on("mouseover", function(event, d) {

                    // Transition for the pie chart
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', '.85')
                        .attr("stroke", "black")
                                            
                    tooltip.transition()
                        .duration(50)
                        .style("opacity", 1)
                    
                    // Update the bar data set when hovered
                    for(var i=0; i < bar_data.properties.length; i++) {
                        // Find the dataset corresponds to the year selected
                        if (bar_data.properties[i].year == year_clicked) {
                            // Find the data corresponds to the visa type
                            for(var j=0; j < bar_data.properties[i].data.length; j++) {

                                if (bar_data.properties[i].data[j].visa_type == d.data.types) {
                                    single_bar_data = bar_data.properties[i].data[j].value;
                                    //console.log(single_bar_data);
                                    break;
                                }
                            }
                        }
                    }

                    Update(single_bar_data);
                    
                    // Update bar title
                    canvas.select("#second_bar_title")
                            .text("Figure 2.2: " + d.data.types + " visa type by states, " + year_clicked + "-" + (year_clicked+1));

                })
                .on("mousemove", function(event, d) {
                    let num = d.value.toString() + '%';
                    tooltip.html(num)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 15) + "px");
                })
                .on("mouseout", function(d) {
                    d3.select(this).transition()
                        .duration(50)
                        .attr('opacity', '1')
                        .attr("stroke", "transparent")

                    tooltip.transition()
                        .duration(50)
                        .style("opacity", 0);
                });

            slice.transition()
                .duration(1000)
                .attrTween("d", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                });

            svg.select("#second_pie_title")
                .text("Figure 2.1: Australia overseas migrant arrivals, by visa groupings, " + period)
            // Remove any disposed element
            slice.exit().remove();  
        });
    }

    d3.select("#pie2017")
        .on("click", function() {
            UpdatePie("2017-2018");
            year_clicked = 2017;
        });

    d3.select("#pie2018")
        .on("click", function() {
            UpdatePie("2018-2019");
            year_clicked = 2018;
        });

    d3.select("#pie2019")
        .on("click", function() {
            UpdatePie("2019-2020");
            year_clicked = 2019;
        });

    d3.select("#pie2020")
        .on("click", function() {
            UpdatePie("2020-2021");
            year_clicked = 2020;
        });

    d3.select("#pie2021")
      .on("click", function() {
        UpdatePie("2021-2022");
        year_clicked = 2021;
      });
    });
}

export default BarChart;
