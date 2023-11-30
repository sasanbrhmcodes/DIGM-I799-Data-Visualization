// Load the JSON data
d3.json("csvjson.json").then(data => {
    // Specify the dimensions for the SVG element
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    // Append an SVG element for the time series
    const svgTimeSeries = d3.select("#timeseries-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Parse the time format
    const parseTime = d3.timeParse("%m/%d/%Y %I:%M:%S %p");

    // Convert the time strings to JavaScript Date objects
    data.forEach(d => {
        d.Time = parseTime(d.Time);
        d.Value = +d.Value; // Convert to a number
    });

    // Create scales for x and y axes for the time series
    const xScaleTimeSeries = d3.scaleTime()
        .domain(d3.extent(data, d => d.Time))
        .range([margin.left, width - margin.right]);

    const yScaleTimeSeries = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Create x and y axes for the time series
    const xAxisTimeSeries = d3.axisBottom(xScaleTimeSeries);
    const yAxisTimeSeries = d3.axisLeft(yScaleTimeSeries);

    // Append x and y axes for the time series
    svgTimeSeries.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxisTimeSeries);

    svgTimeSeries.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxisTimeSeries);

svgTimeSeries.append('text')
    .attr('x', width / 2)
    .attr('y', height - margin.bottom / 2)
    .attr('text-anchor', 'middle')
    .text('Time (seconds)');

 svgTimeSeries.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', margin.left / 2)
    .attr('text-anchor', 'middle')
    .text('HR (bpm)');
    // Create a line generator for the time series
    const line = d3.line()
        .x(d => xScaleTimeSeries(d.Time))
        .y(d => yScaleTimeSeries(d.Value));

    // Draw the time series chart
    const path = svgTimeSeries.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Create a tooltip div
    const tooltip = d3.select("#timeseries-chart")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Create a circle for the tooltip
    const tooltipCircle = svgTimeSeries.append("circle")
        .attr("class", "tooltip-circle")
        .attr("r", 4)
        .style("opacity", 0);

    // Add event listeners to show/hide tooltip on mouse hover
    svgTimeSeries.on("mouseover", function() {
        tooltip.style("opacity", 1);
        tooltipCircle.style("opacity", 1);
    })
    .on("mouseout", function() {
        tooltip.style("opacity", 0);
        tooltipCircle.style("opacity", 0);
    })
    .on("mousemove", function(event) {
        const [x, y] = d3.pointer(event);
        const xValue = xScaleTimeSeries.invert(x);
        const bisectDate = d3.bisector(d => d.Time).left;
        const index = bisectDate(data, xValue, 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        const d = xValue - d0.Time > d1.Time - xValue ? d1 : d0;

        tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 30) + "px")
            .html(`Time: ${d.Time} <br> Value: ${d.Value}`);

        tooltipCircle.attr("cx", xScaleTimeSeries(d.Time))
            .attr("cy", yScaleTimeSeries(d.Value));
    });
});
