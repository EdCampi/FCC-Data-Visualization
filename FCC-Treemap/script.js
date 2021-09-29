function pos(i) {
  if(i < 2) return 80;
  if (i < 4) return 220;
  if (i < 6) return 370;
  if (i < 8) return 470;
  if (i < 10) return 600;
  if (i < 12) return 700;
  if (i < 14) return 820;
  if (i < 16) return 920
  if (i < 18) return 1010;
  return 0;
}

var url_api = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'

fetch(url_api)
  .then(response => response.json())
  .then(data => {
  
  console.clear()
  
  //console.log(data)
  
  var h = 1000;
  var w = 1200;
  
  var keyW = ["Product Design", "Tabletop Games", "Gaming Hardware", "Video Games", "Sound", "Television", "Narrative Film", "Web", "Hardware", "Games", "3D Printing", "Technology", "Wearables", "Sculpture", "Apparel", "Food", "Art", "Gadgets", "Drinks"]
  
  var keyC = ['#f08a5d', '#b83b5e', '#6a2c70', '#0278ae', '#51adcf', '#a5ecd7', '#e8ffc1', '#d789d7', '#9d65c9', '#5d54a4', '#f0a500', '#cf7500', '#28df99', '#99f3bd', '#d2f6c5', '#f6f7d4', '#cccccc', '#c2b0c9', '#fb5b5a']
  
   var col = d3.scaleOrdinal()
                  .domain(keyW)
                  .range(keyC)
    
  var svg = d3.select('#viz')
              .append('svg')
              .attr('width', w)
              .attr('height', h);
  
  var root = d3.hierarchy(data)
               .sum(d => d.value);
  
  var treemap = d3.treemap()
                  .size([w, h])
                  .padding(2)
                  (root);
  
  let tooltip = d3.select('#viz')
                  .append('div')
                  .attr('id', 'tooltip')
                  .style('opacity', 0);
  
  var mouseO = function(e,d) {
    d3.select(this)
      .attr('stroke', 'black')
    
    tooltip.style('opacity', 1)
           .html('<p>Name: '+d.data.name+'<br>Category: '+d.data.category+'<br>Value: '+d.data.value+'</p>')
           .style('top', event.pageY-scrollY+20+'px')
           .style('left', event.pageX-scrollX+20+'px')
           .attr('data-value', d.data.value)
  }
  
  var mouseM = function (d,e) {
    tooltip.style('top', event.pageY-scrollY+20+'px')
           .style('left', event.pageX-scrollX+20+'px')
  }
  
  var mouseOU = function(d,e) {
    d3.select(this)
      .attr('stroke', 'none')
    
    tooltip.style('opacity',0)
           .html('')
  }
  
  var rectA = svg.selectAll('g')
                 .data(root.leaves())
                 .enter()
                 .append('g');
  
  
  rectA.append('rect')
       .attr('class', 'tile')
       .attr('data-name', d => d.data.name)
       .attr('data-category', d => d.data.category)
       .attr('data-value', d => d.data.value)
       .attr('x', d => d.x0)
       .attr('y', d => d.y0)
       .attr('height', d => d.y1 - d.y0)
       .attr('width', d => d.x1 - d.x0)
       .attr('fill', d => col(d.data.category))
       .on('mouseover', mouseO)
       .on('mousemove', mouseM)
       .on('mouseout', mouseOU);
  
  rectA.append('text')
       .selectAll('tspan')
       .data(function(d) {
              return d.data.name.split(/(?=[A-Z][^A-Z])/g).map(function(v) {
                  return {
                      text: v,
                      x0: d.x0,
                      y0: d.y0
                  }
              });
      })
       .enter()
       .append('tspan')
         .attr('x', (d) => 3+d.x0)
         .attr("y", (d, i) => 10 + d.y0 + (i * 10))
         .style('font-size', 8)
         .text(d => d.text);
  
  var legendContainer = d3.select('#legendDiv')
                          .append('svg')
                          .attr('id', 'legend');
  
  var legendC = d3.select('#legend')
  
  var s = 20;
  
  legendC.selectAll('mydots')
  .data(keyW)
  .enter()
  .append("rect")
    .attr('class', 'legend-item')
    .attr("x", function (d,i) {
          return pos(i)
    })
    .attr("y", function(d,i){
      if (i % 2 == 0) {
        return 8
      } else {
        return 38
      }
    })
    .attr("width", s)
    .attr("height", s)
    .style("fill", function(d){return col(d)});
  
  legendC.selectAll("mylabels")
  .data(keyW)
  .enter()
  .append("text")
    .attr("x", function (d,i) {
          return pos(i)+25
          })
    .attr("y", function(d,i){if (i % 2 == 0) {
    return 20
  } else {
    return 50
  }})
    .style("fill", 'black')
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
  
})