// Fetching JSON data from newJ.json file using D3
d3.json("newJ.json").then(function (data) {
    const chart = d3.select("#chart");

    const maxValue = d3.max(data, (d) => d.Value);
    const barWidth = 50; // Width of each bar
    const barPadding = 20; // Space between bars (adjust for more space)
    const chartHeight = maxValue + 80; // Adjusting chart height for better visibility

    chart.style("height", chartHeight + "px");

    const bars = chart.append("div")
        .attr("class", "bar-container")
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("div")
        .attr("class", (d) => `bar ${d.Value === maxValue ? 'highest' : ''}`)
        .style("width", barWidth + "px")
        .style("margin-right", barPadding + "px")
        .style("height", (d) => d.Value + "px")
        .style("position", "relative"); // Add relative positioning to the bars

    bars.append("div")
        .attr("class", "circle")
        .text((d) => d.Value)
        .style("bottom", (d) => (d.Value - 10) + "px"); // Adjust circle position

    bars.append("div")
        .text((d) => {
            const time = new Date(d.Time);
            const date = time.getDate();
            const month = time.toLocaleString('default', { month: 'short' });
            return `${date} ${month}`;
        })
        .attr("class", "label")
        .style("text-align", "center");
});
