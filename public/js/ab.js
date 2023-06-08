var margin = {top: 60, right: 20, bottom: 50, left: 60};
var width = 450 - margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;

var svg = d3.select("#my_data")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 450 350")
    .attr("preserveAspectRatio", "xMinYMin")
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("../csv/Classeur2.csv")
.then(function(data){


var xScaleMale = d3.scaleLinear()
  .domain([0, d3.max(data, d => +d.male)])
  .range([width/2, 0]);
svg
  .append("g")
      .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xScaleMale).tickSize(0).tickPadding(3).ticks(7, "%"))
  .call(function(d) { return d.select(".domain").remove()});

var xScaleFemale = d3.scaleLinear()
  .domain([0, d3.max(data, d => +d.female)])
  .range([width/2, width]);
svg
  .append("g")
      .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xScaleFemale).tickSize(0).tickPadding(3).ticks(7, "%"))
  .call(function(d) { return d.select(".domain").remove()});

var GridLineF = function() { return d3.axisBottom().scale(xScaleFemale)};
svg
  .append("g")
    .attr("class", "grid")
  .call(GridLineF()
    .tickSize(height,0,0)
    .tickFormat("")
    .ticks(7)
);
var GridLineM = function() { return d3.axisBottom().scale(xScaleMale)};
svg
  .append("g")
    .attr("class", "grid")
  .call(GridLineM()
    .tickSize(height,0,0)
    .tickFormat("")
    .ticks(7)
);

var yScale = d3.scaleBand()
    .domain(data.map(d => d.ages))
    .range([height, 0])
    .padding(.25);
svg
    .append("g")
    .call(d3.axisLeft(yScale).tickSize(0).tickPadding(15))
    .call(d => d.select(".domain").remove());

var tooltip = d3.select("body")
  .append("div")
    .attr("class", "tooltip");

var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "#EF4A60")
      .style("opacity", .5)
};
var mousemove1 = function(event,d) {

    tooltip
    .html( `${d.male*100}%`)
      .style("top", event.pageY - 10 + "px")
      .style("left", event.pageX + 10 + "px");
};
var mousemove2 = function(event,d) {
  tooltip
  .html( `${d.female*100}%`)
    .style("top", event.pageY - 10 + "px")
    .style("left", event.pageX + 10 + "px")
};
var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1)
};

svg
  .selectAll(".maleBar")
    .data(data)
  .join("rect")
    .attr("class", "barMale")
    .attr("x", d => xScaleMale(d.male))
    .attr("y", d => yScale(d.ages))
    .attr("width", d => width/2 - xScaleMale(d.male))
    .attr("height", yScale.bandwidth())
    .style("fill", "#8b0000")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove1)
  .on("mouseleave", mouseleave)

svg
    .selectAll(".femaleBar")
      .data(data)
    .join("rect")
      .attr("class", "barFemale")
      .attr("x", xScaleFemale(0))
      .attr("y", d => yScale(d.ages))
      .attr("width", d => xScaleFemale(d.female) - xScaleFemale(0))
      .attr("height", yScale.bandwidth())
      .style("fill", "#e60000 ")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove2)
    .on("mouseleave", mouseleave)

svg
  .append("text")
    .attr("class", "chart-title")
    .attr("x", -(margin.left)*0.7)
    .attr("y", -(margin.top)/1.5)
    .attr("text-anchor", "start")
  .text("Patients")


svg
    .append("rect")
        .attr("x", -(margin.left)*0.7)
        .attr("y", -(margin.top/3))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#8b0000")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", -(margin.left)*0.6+15)
        .attr("y", -(margin.top/5.5))
    .text("Male")
svg
    .append("rect")
        .attr("x", 40)
        .attr("y", -(margin.top/3))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#e60000")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 60)
        .attr("y", -(margin.top/5.5))
    .text("Female")

})