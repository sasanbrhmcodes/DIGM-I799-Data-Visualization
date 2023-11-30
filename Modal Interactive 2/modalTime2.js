// Define scales globally
const xScaleTimeSeries = d3.scaleTime();
const yScaleTimeSeries = d3.scaleLinear();

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

  // Update scale domains based on data
  xScaleTimeSeries.domain(d3.extent(data, d => d.Time))
    .range([margin.left, width - margin.right]);

  yScaleTimeSeries.domain([0, d3.max(data, d => d.Value)])
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

  // Create a circle for the cursor
  const cursorCircle = svgTimeSeries.append("circle")
    .attr("r", 6)
    .attr("fill", "red")
    .style("display", "none");

// Create a container for the tooltip modal and set its position to the right of the screen
const tooltipContainer = d3.select("body")
  .append("div")
  .style("position", "fixed")
  .style("top", "50%")
  .style("right", "70px")
  .style("transform", "translateY(-50%)")
  .style("pointer-events", "none"); // Ensure the container doesn't interfere with mouse events

// Create a tooltip modal within the container
const tooltipModal = tooltipContainer.append("div")
  .attr("class", "tooltip")
  .style("display", "none")
  .style("border", "1px solid #ccc")
  .style("background-color", "#fff")
  .style("padding", "10px");

  // Create a line function for the time series
  const line = d3.line()
    .x(d => xScaleTimeSeries(d.Time))
    .y(d => yScaleTimeSeries(d.Value));

  // Append the line to the SVG
  svgTimeSeries.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

    svgTimeSeries.append('text')
    .attr('x', width / 2)
    .attr('y', height - margin.bottom / 2.5)
    .attr('text-anchor', 'middle')
    .text('Time (seconds)');

 svgTimeSeries.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', margin.left / 2)
    .attr('text-anchor', 'middle')
    .text('HR (bpm)');

  svgTimeSeries.on("mousemove", function (event) {
    const [x, y] = d3.pointer(event);
    const xValue = xScaleTimeSeries.invert(x);
    const bisectDate = d3.bisector(d => d.Time).left;
    const index = bisectDate(data, xValue, 1);
    const hoveredData = data[index];

    cursorCircle.attr("cx", xScaleTimeSeries(hoveredData.Time))
      .attr("cy", yScaleTimeSeries(hoveredData.Value))
      .style("display", "block");

    tooltipModal.style("display", "block")
      .html(`Time: ${hoveredData.Time} <br> Value: ${hoveredData.Value} 
        <span class="close" onclick="this.parentElement.style.display='none'">&times;</span>`)
      .style("top", `${y}px`)
      .style("left", `${x + margin.left}px`);
  });

  svgTimeSeries.on("mouseout", function () {
    cursorCircle.style("display", "none");
    tooltipModal.style("display", "none");
  });
});
