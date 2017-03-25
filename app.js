const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"

d3.json(url, (err, data) => {
  if (err !== null) {
    console.error(err)
  }
  else {
    let GDPData = data.data.map(([date, val]) => {
      return [new Date(date), val]
    })
    console.log(GDPData)
    document.getElementById("chart").onload = makeChart(GDPData, (GDPData.length*3 + 35*3), 500)
  }
})

const makeChart = function(dataset, width, height) {
  const padding = 35
  const barWidth = (width - padding*3) / dataset.length
  
  const minDate = d3.min(dataset, d => d[0])
  const maxDate = d3.max(dataset, d => d[0])
  
  const xScale = d3.scaleTime()
                    .domain([ minDate, maxDate ])
                    .range([padding*2, width - padding])
                    
  
  const yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, d => d[1])])
                    .range([height - padding, padding])

  var svg = d3.select("#chart")
                .append("div")
                  .attr("id", "chart-container")
                  .style("width", width + "px")
                  .style("height", height + "px")
                .append("svg")                
                  .attr("width", width)
                  .attr("height", height)
  
  // X Axis
  var xAxis = d3.axisBottom(xScale).tickSizeOuter(0)
  
  svg.append("g")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - padding) + ")")
  
  svg.append("text").text("Year").attr("width", width).attr("text-anchor", "middle")
      .attr("transform", "translate("+ ((width - padding*3)/2 + padding*2) + "," + (height - 5)+")")

  // Y Axis
  var yAxis = d3.axisLeft(yScale).tickSizeOuter(0)
  
  svg.append("g")
      .call(yAxis)
      .attr("transform", "translate(" + padding*2 + ",0)")
  
  svg.append("text")
      .text("GDP (Billion)")
        .attr("width", height)
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (padding/2) + "," +(height/2)+")rotate(-90)")
  
  // Title
  svg.append("text")
      .text("Quarterly United States Gross Domestic Product (1946 DEC - 2015 JUN)")
        .attr("text-anchor", "middle")
        .attr("font-size", 20)
        .attr("transform", "translate(" + width/2 + "," + padding + ")")
  
  // Bars
  var bars = svg.selectAll("circle")
                  .data(dataset).enter()
                    .append("rect")
                      .attr("class", "bar")
                      .attr("x", (d, i) => padding*2 + i * barWidth)
                      .attr("y", d => yScale(d[1]))
                      .attr("width", d => barWidth)
                      .attr("height", d => height - yScale(d[1]) - padding)
                    .on("mouseover", mouseOver)
                    .on("mouseout", mouseOut)
                    .on("mousemove", mouseMove)

  var tooltip = d3.select("#chart")
                  .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0)
  
  function mouseOver() {
     tooltip.transition()
             .duration(100)
             .style("opacity", 1)
   }

  function mouseMove(d) {
    tooltip.html("$" + d[1].toLocaleString('en-US', {minimumFractionDigits: 2}) + " Billion" + "<br />" + parseDate(d[0]) )
            .style("left", (d3.event.pageX - 75) + "px")
            .style("top", (d3.event.pageY - 40) + "px")        
  }

  function mouseOut() {
    tooltip.transition()
            .duration(100)
            .style("opacity", 0)
  }
  
  function parseDate(date) {
    let d = new Date(date)
    let year = d.getFullYear()
    const monthText = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    let month = monthText[d.getMonth()]
    return year + " " + month
  }
}