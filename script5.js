/*
// Load the JSON data
d3.json("csvjson.json").then(data => {
    // Define variables for the SVG dimensions and margins
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    // Define the ID for the div elements containing the charts
    const timeSeriesDivId = "timeseries-chart";
    const histogramDivId = "histogram-chart";

    // Call a function to create the time series chart
    createTimeSeriesChart(data, width, height, margin, timeSeriesDivId);

    // Call a function to create the histogram chart
    createHistogramChart(data, width, height, margin, histogramDivId);
});

// Function to create the time series chart
function createTimeSeriesChart(data, width, height, margin, divId) {
    const svg = d3.select(`#${divId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Rest of the code for the time series chart goes here, using width, height, and other variables.
}

// Function to create the histogram chart
function createHistogramChart(data, width, height, margin, divId) {
    const svg = d3.select(`#${divId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Rest of the code for the histogram chart goes here, using width, height, and other variables.
}