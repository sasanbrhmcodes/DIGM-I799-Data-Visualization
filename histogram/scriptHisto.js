// Load the JSON data
d3.json("csvjson.json").then(data => {
    // Specify the dimensions for the SVG element
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    // Append an SVG element for the histogram
    const svgHistogram = d3.select("#histogram-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a histogram generator
    const histogram = d3.histogram()
        .value(d => d.Value)
        .domain([0, d3.max(data, d => d.Value)])
        .thresholds(10);

    // Generate the histogram data
    const bins = histogram(data);

    // Calculate the maximum bin count for scaling
    const maxBinCount = d3.max(bins, d => d.length);

    // Create x and y axes for the histogram
    const xScaleHistogram = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value)])
        .nice()
        .range([margin.left, width - margin.right]);

    const yScaleHistogram = d3.scaleLinear()
        .domain([0, maxBinCount])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const xAxisHistogram = d3.axisBottom(xScaleHistogram);
    const yAxisHistogram = d3.axisLeft(yScaleHistogram);

    // Append x and y axes for the histogram
    svgHistogram.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxisHistogram);

    svgHistogram.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxisHistogram);

    svgHistogram.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - 5) // Adjusted the y-position for the x-label
        .text("Time in Seconds");

    // Modify the y-label for the second graph
    svgHistogram.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2) // Adjust x and y coordinates for the left side
        .attr("y", -margin.left + 50) // Adjust y-coordinate for proper alignment
        .attr("transform", "rotate(-90)") // Rotate the label
        .attr("dy", "0.75em")
        .style("fill", "black")
        .style("font-size", "12px")
        .text("Heart Rate");

    // Function to update bar colors based on checkbox selection
    function updateBarColors() {
        const redChecked = document.getElementById("redCheckbox").checked;
        const blueChecked = document.getElementById("blueCheckbox").checked;
        const greenChecked = document.getElementById("greenCheckbox").checked;

        // Update bar colors based on checkbox selection
        svgHistogram.selectAll("rect")
            .data(bins)
            .transition()
            .duration(500)
            .attr("fill", function(d) {
                                if (redChecked && !blueChecked && !greenChecked) {
                    return "red";
                } else if (!redChecked && blueChecked && !greenChecked) {
                    return "blue";
                } else if (!redChecked && !blueChecked && greenChecked) {
                    return "green";
                } else if (redChecked && blueChecked && !greenChecked) {
                    return d3.interpolateReds(d.x0 / d3.max(bins, d => d.x1));
                } else if (redChecked && !blueChecked && greenChecked) {
                    return d3.interpolateGreens(d.x0 / d3.max(bins, d => d.x1));
                } else if (!redChecked && blueChecked && greenChecked) {
                    return d3.interpolateBlues(d.x0 / d3.max(bins, d => d.x1));
                } else if (redChecked && blueChecked && greenChecked) {
                    return d3.interpolateViridis(d.x0 / d3.max(bins, d => d.x1));
                } else {
                    return "steelblue"; // Default color if no checkboxes are selected
                }



                // if (redChecked && !blueChecked && !greenChecked) {
                //     return "red";
                // } else if (!redChecked && blueChecked && !greenChecked) {
                //     return "blue";
                // } else if (!redChecked && !blueChecked && greenChecked) {
                //     return "green";
                // } else if (redChecked && blueChecked && !greenChecked) {
                //     return "purple"; // Example combination
                // } else if (redChecked && !blueChecked && greenChecked) {
                //     return "orange"; // Example combination
                // } else if (!redChecked && blueChecked && greenChecked) {
                //     return "teal"; // Example combination
                // } else if (redChecked && blueChecked && greenChecked) {
                //     return "black"; // Example combination
                // } else {
                //     return "steelblue"; // Default color if no checkboxes are selected
                // }
            });
    }

    // Function to show the value in an alert when a bar is clicked
    function showValueOnClick(event, d) {
        alert("Value: " + d.length);
    }

    // Draw the histogram bars
    svgHistogram.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", d => xScaleHistogram(d.x0) + 1)
        .attr("y", d => yScaleHistogram(d.length))
        .attr("width", d => Math.max(0, xScaleHistogram(d.x1) - xScaleHistogram(d.x0) - 1))
        .attr("height", d => height - margin.bottom - yScaleHistogram(d.length))
        .attr("fill", "steelblue")
        .on("click", showValueOnClick); // Add click event listener

    // Add event listeners to the checkboxes
    document.getElementById("redCheckbox").addEventListener("change", updateBarColors);
    document.getElementById("blueCheckbox").addEventListener("change", updateBarColors);
    document.getElementById("greenCheckbox").addEventListener("change", updateBarColors);
});