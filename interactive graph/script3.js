// Function to fetch JSON data
function fetchJSONAndCreateScatterPlot() {
    fetch('EnableDevs_7.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            // Extract "Player Speed" and "timeStamp" entries from the data
            const playerSpeedData = data.messages
                .filter(entry => entry.key === 'Player Speed')
                .map(entry => ({
                    timestamp: new Date(entry.timeStamp),
                    playerSpeed: parseFloat(entry.value.Value),
                }));

            // Create a container for the scatter plot
            const margin = { top: 20, right: 30, bottom: 30, left: 40 };
            const width = 600 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = d3.select('#scatterPlot')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Define scales for x and y axes
            const xScale = d3.scaleTime()
                .domain(d3.extent(playerSpeedData, d => d.timestamp))
                .range([0, width]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(playerSpeedData, d => d.playerSpeed)])
                .nice()
                .range([height, 0]);

            // Create x-axis and y-axis
            svg.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(xScale));

            svg.append('g')
                .attr('class', 'y-axis')
                .call(d3.axisLeft(yScale).ticks(5));


                  // Add labels for the axes
            svg.append('text')
                .attr('class', 'x-label')
                .attr('text-anchor', 'middle')
                .attr('x', width / 2)
                .attr('y', height + margin.bottom)
                .text('Time');

            svg.append('text')
                .attr('class', 'y-label')
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${-margin.left / 2}, ${height / 2}) rotate(-90)`)
                .text('Player Speed');

            // Create circles for data points
            svg.selectAll('circle')
                .data(playerSpeedData)
                .enter()
                .append('circle')
                .attr('cx', d => xScale(d.timestamp))
                .attr('cy', d => yScale(d.playerSpeed))
                .attr('r', 5) // Radius of the circles
                .attr('fill', 'steelblue')
                .append('title')
                .text(d => `Timestamp: ${d.timestamp.toISOString()}\nPlayer Speed: ${d.playerSpeed}`);



        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });
}

// Call the fetchJSONAndCreateScatterPlot function to fetch data and create the scatter plot
fetchJSONAndCreateScatterPlot();