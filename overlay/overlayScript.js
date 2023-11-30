// Constants
const margin = { top: 40, right: 40, bottom: 40, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG element
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load your JSON data
d3.json("Biopack.json")
  .then(data => {
    // Filter data for "Biometric Data" key
    const biometricData = data.messages
      .filter(d => d.key === "Biometric Data");

    // Extract HR and GSR data points
    const hrData = biometricData.map(d => {
      const hrValue = d.value.data.HR.Value;
      const time = new Date(d.value.time);
      return { hrValue, time };
    });

    const gsrData = biometricData.map(d => {
      const gsrValue = d.value.data.GSR.Value;
      const time = new Date(d.value.time);
      return { gsrValue, time };
    });

    // X and Y scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(biometricData, d => new Date(d.value.time)))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(biometricData, d => Math.max(d.value.data.HR.Value, d.value.data.GSR.Value))])
      .range([height, 0]);

    // X and Y axes
    const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%H:%M:%S"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    // Line generator for HR
    const hrLine = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.hrValue));

    // Line generator for GSR
    const gsrLine = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.gsrValue));

    // Create HR line chart (initially hidden)
    const hrPath = svg.append("path")
      .data([hrData])
      .attr("class", "line")
      .attr("d", hrLine)
      .style("stroke", "blue")
      .style("display", "block"); // Change to "none" to hide it initially

    // Create GSR line chart (initially hidden)
    const gsrPath = svg.append("path")
      .data([gsrData])
      .attr("class", "line")
      .attr("d", gsrLine)
      .style("stroke", "red")
      .style("display", "block"); // Change to "none" to hide it initially



    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 35) // Adjusted the y-position for the x-label
        .text("Time in Seconds");

    // Modify the y-label for the second graph
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2) // Adjust x and y coordinates for the left side
        .attr("y", -margin.left + 20) // Adjust y-coordinate for proper alignment
        .attr("transform", "rotate(-90)") // Rotate the label
        .attr("dy", "0.75em")
        .style("fill", "black")
        .style("font-size", "12px")
        .text("Rate");

    // Checkbox event handlers
    d3.select("#hr-checkbox").on("change", function () {
      hrPath.style("display", this.checked ? "block" : "none");
    });

    d3.select("#gsr-checkbox").on("change", function () {
      gsrPath.style("display", this.checked ? "block" : "none");
    });
  })
  .catch(error => {
    console.error(error);
  });
