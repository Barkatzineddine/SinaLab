var margin = {top: 10, right: 100, bottom: 30, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#my_data")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../csv/ac.csv", function(data) {

  
    var allGroup = ["Ventes", "Stock"]

    
    d3.select("#Button")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
        
    var x = d3.scaleLinear()
      .domain([0,12])
      .range([ 0, width ])
    svg.append("g")
      .attr("class","xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
      

    var y = d3.scaleLinear()
      .domain( [0,500])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));


    svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", width/2 + margin.left)
  .attr("y", height + margin.top + 30)
  .text("Months");

    var line = svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.time) })
          .y(function(d) { return y(+d.p) })
        )
        .attr("stroke", "black")
        .style("stroke-width", 4)
        .style("fill", "none")

    var dot = svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
        .attr("cx", function(d) { return x(+d.time) })
        .attr("cy", function(d) { return y(+d.Ventes) })
        .attr("r", 7)
        .style("fill", "#8b0000")


    function update(selectedGroup) {

      
      var dataFilter = data.map(function(d){return {time: d.time, value:d[selectedGroup]} })
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(+d.time) })
            .y(function(d) { return y(+d.value) })
          )
      dot
        .data(dataFilter)
        .transition()
        .duration(1000)
          .attr("cx", function(d) { return x(+d.time) })
          .attr("cy", function(d) { return y(+d.value) })
    }

    
    d3.select("#Button").on("change", function(d) {
        
        var selectedOption = d3.select(this).property("value")
        update(selectedOption)
  
    })
  

})