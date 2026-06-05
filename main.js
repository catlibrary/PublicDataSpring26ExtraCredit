// Set the dimensions for the SVG
const width = 900;
const height = 760;

// Create the SVG inside the chart div
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load the cleaned rent data
d3.csv("rent_bubble_clean.csv").then(function(data) {

    // Convert rent values from strings to numbers
    data.forEach(function(d) {
        d.rent = +d.rent;
    });

    // Scale bubble size by median rent
    const radiusScale = d3.scaleSqrt()
        .domain(d3.extent(data, d => d.rent))
        .range([8, 42]);

    // Color bubbles by rent category
    const colorScale = d3.scaleOrdinal()
        .domain(["Low", "Medium", "High"])
        .range(["#6BA368", "#E6B450", "#C94C4C"]);

    // Create tooltip div
    const tooltip = d3.select("#my_dataviz")
        .append("div")
        .attr("class", "tooltip");

    // Create circles
    const bubbles = svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", "bubbles")
        .attr("r", d => radiusScale(d.rent))
        .attr("fill", d => colorScale(d.category))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("opacity", 0.85)
        .on("mouseover", function(event, d) {
            tooltip
                .style("opacity", 1)
                .html(
                    `<strong>${d.area}</strong><br>
                    Median rent: $${d.rent}<br>
                    Category: ${d.category}`
                );

            d3.select(this)
                .attr("stroke", "#222")
                .attr("stroke-width", 3);
        })
        .on("mousemove", function(event) {
            tooltip
                .style("left", event.pageX + 15 + "px")
                .style("top", event.pageY - 20 + "px");
        })
        .on("mouseleave", function() {
            tooltip.style("opacity", 0);

            d3.select(this)
                .attr("stroke", "white")
                .attr("stroke-width", 2);
        });

    // Force simulation positions bubbles without overlap
    const simulation = d3.forceSimulation(data)
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("charge", d3.forceManyBody().strength(5))
        .force("collision", d3.forceCollide().radius(d => radiusScale(d.rent) + 2))
        .on("tick", function() {
            bubbles
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });

    // Add a simple legend
    const legendData = ["Low", "Medium", "High"];

    const legend = svg.selectAll(".legend")
        .data(legendData)
        .join("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(30, ${40 + i * 30})`);

    legend.append("circle")
        .attr("r", 8)
        .attr("fill", d => colorScale(d));

    legend.append("text")
        .attr("x", 18)
        .attr("y", 5)
        .text(d => d + " rent")
        .attr("class", "legend-text");
});