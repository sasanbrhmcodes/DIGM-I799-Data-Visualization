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



            svgTimeSeries.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - 5) // Adjusted the y-position for the x-label
        .text("Time");

    svgTimeSeries.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2) // Adjust x and y coordinates for the left side
        .attr("y", -margin.left + 50) // Adjusted the y-coordinate
        .attr("transform", "rotate(-90)") // Rotate the label
        .attr("dy", "0.75em")
        .style("fill", "black")
        .style("font-size", "12px")
        .text("Heart Rate");
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

    // Add event listener to the line to show the modal with coordinates
    path.on("click", function(event, d) {
        const [x, y] = d3.pointer(event);
        const xValue = xScaleTimeSeries.invert(x);
        const yValue = yScaleTimeSeries.invert(y);

        // Display in the modal
        const modal = document.getElementById("myModal");
        const modalContent = document.getElementById("modalContent");

        modal.style.display = "block";
        modalContent.textContent = `X: ${xValue}, Y: ${yValue}`;

        // Close the modal on clicking close
        const span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
            modal.style.display = "none";
        };

        // Close the modal when clicking outside
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    });
});
