var mapData;
var margin = {top: 30, right: 30, bottom: 30, left: 30};
width = 450 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

var myGroup = ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]
var myVars = ["1","2","3","4","5","6","7","8","9","10"]

document.addEventListener('DOMContentLoaded', function() {

  svg = d3.select("#map")
  Promise.all([d3.csv('data/Data.csv')])
          .then(function(values){
    
    mapData = values[0];
    
    drawHeatMap();
  })

});

function drawHeatMap(scale){
  svg.selectAll("*").remove();
  var day = document.getElementById('day').value;
  var feature = document.getElementById('feature').value;
  var cscale = document.getElementById('cscale').value;

  let reqData = mapData.filter(function(d){
    return parseInt(d.day) == parseInt(day)
  });

  svg.append("svg")
      .attr("width", 1000)
      .attr("height", 600)
      .append("g")
      // .attr("transform", "translate(200,150)");
      // .attr("transform", `translate(${margin.left},${margin.top})`);
    
  var x = d3.scaleBand()
            .range([0,800])
            .domain(myGroup)
            .padding(0.01);
  svg.append("g")
      .attr("transform", "translate(100,440)")
      .call(d3.axisBottom(x));

  var y = d3.scaleBand()
            .range([height,0])
            .domain(myVars)
            .padding(0.01);
  svg.append("g")
      .attr("transform", "translate(100,50)")
      .call(d3.axisLeft(y));

  var myColor = d3.scaleLinear()
                  .domain(d3.ticks(0, 50, 11))
                  .range(["white", "#69b3a2"])
                  .domain([1,cscale]);
  
  var tooltip = d3.select("body")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
  
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      tooltip.style("opacity", 1)
    }
    var mousemove = function(d) {
      tooltip
        .html("The exact value of<br>this cell is: " + d[feature])
        .style("left", (d3.mouse(this)[0]+270) + "px")
        .style("top", (d3.mouse(this)[1]+140) + "px")

    }
    var mouseleave = function(d) {
      tooltip.style("opacity", 0)
    }
  

  svg.append("g")
      .attr("transform", "translate(100,50)")
      .selectAll()
      .data(reqData)
      .join("rect")
      .attr("x", function(d) { return x(d.hour) })
      .attr("y", function(d) { return y(d.intensity) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d[feature])} )
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

  svg.append('text')
        .attr('class','axis-label')
        .attr('transform','rotate(-90)')
        .attr('text-anchor','middle')
        .attr('y','70')
        .attr('x','-240')
        .text('Intensity')
        .style("font-size", "20px")
        
  svg.append('text')
        .attr('class','axis-label')
        .attr('text-anchor','middle')
        .attr('x','500')
        .attr('y','480')
        .text('Hour of Day')
        .style("font-size", "20px")
      
}  