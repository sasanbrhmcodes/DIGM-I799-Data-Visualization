async function loadAndDrawGraph() {
  try {
    const response = await fetch('Biopack.json');
    console.log('Response status:', response.status);
    const data = await response.json();

    const hrData = [];

    for (const message of data.messages) {
      if (message.key === 'Biometric Data') {
        const biometricData = message.value.data;
        const time = parseFloat(biometricData.time);
        const hrValue = parseFloat(biometricData.HR.Value);

      if (!isNaN(time) && (hrValue === 0 || !isNaN(hrValue))) {
  hrData.push({ time, value: hrValue });
} else {
  console.error('Invalid HR Data Point:', biometricData);
}
      }
    }

    if (hrData.length === 0) {
      console.error('Warning: No valid HR data found in Biopack.json');
    } else {
      console.log('Valid HR Data:', hrData.slice(0, 5)); // Sample the first 5 data points

      const svg = d3.select('#graph')
        .append('svg')
        .attr('width', 600)
        .attr('height', 400);

      const xScale = d3.scaleLinear()
        .domain([0, d3.max(hrData, d => d.time)])
        .range([0, svg.attr('width')]);

      const yScale = d3.scaleLinear()
        .domain([40, d3.max(hrData, d => d.value)])
        .range([svg.attr('height'), 0]);

      const hrLine = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.value));

      svg.append('path')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('d', hrLine(hrData));

      svg.append('text')
        .attr('x', xScale(d3.max(hrData, d => d.time) / 2))
        .attr('y', svg.attr('height') - 10)
        .text('Time (seconds)');

      svg.append('text')
        .attr('x', -20)
        .attr('y', yScale(d3.max(hrData, d => d.value) / 2))
        .attr('transform', 'rotate(-90)')
        .text('HR (bpm)');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

loadAndDrawGraph();
