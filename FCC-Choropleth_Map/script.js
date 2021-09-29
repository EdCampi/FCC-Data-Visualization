var US_EDU_DATA = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json',
    US_C_DATA = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

var h = 600;
var w = 950;

 var legendC = d3.select('#viz')
                .append('svg')
                .attr('id', 'legend')
                .attr('width', 250)
                .attr('height', 20)
 .attr('transform', 'translate(620, 95)')

var svg = d3.select('#viz')
            .append('svg')
            .attr('height', h)
            .attr('width', w)

var tooltip = d3.select('#viz')
                .append('div')
                .attr('id', 'tooltip')
                .style('opacity', 0)

//legend

var col = d3.scaleThreshold()
.domain(d3.range(2.6,75.1,(75.1-2.6)/8)).range(d3.schemeBlues[9])

const usedCol = [];
  
  for(let i=2.6; i<=75.1; i+=((75.1)-(2.6))/8) {
    usedCol.push(i);
  }
  
  var lW = 250;
  var lH = 20;
  
  var lCW = lW / usedCol.length;

var xScale = d3.scaleLinear()
.domain([2.6, 75.1])
.range([0,249])

var xAxis = d3.axisBottom(xScale).ticks(10)
  
  legendC.selectAll('rect')
  .data(usedCol)
  .enter()
  .append('rect')
  .attr('x', (d,i) => i * lCW)
  .attr('y', 0)
  .attr('height', lH-10)
  .attr('width', lCW)
  .attr('fill', d => col(d))

legendC.append('g')
.attr('transform', 'translate(0,3)')
.call(xAxis)


//USA GRAPH

var promises = [
  d3.json(US_EDU_DATA),
  d3.json(US_C_DATA)
]

Promise.all(promises).then(ready)

function ready([edu, c]) {
 //console.clear()
  
  var edu_dat = edu;
  var c_dat = c;
  
  //console.log(d3.min(edu_dat.map(d=> d.bachelorsOrHigher)), d3.max(edu_dat.map(d=> d.bachelorsOrHigher)))
  
  var myCol = d3.scaleThreshold()
.domain(d3.range(d3.min(edu_dat.map(d=> d.bachelorsOrHigher)), d3.max(edu_dat.map(d=> d.bachelorsOrHigher)), ((75.1)-(2.6))/8))
.range(d3.schemeBlues[9])
 d3.select('#title').append('h1').text('United States Educational Attainment')
  d3.select('#description').append('h3').text('Percentage of adults age 25 and older with a bachelor\'s degree or higher (2010-2014)')
  
  svg.append('g')
  .attr('class', 'counties')
  .selectAll('path')
  .data(topojson.feature(c, c.objects.counties).features)
  .enter()
  .append('path')
  .attr('class', 'county')
  .attr('fill', function(d) {
    //console.log(d)
    var eduData = edu.filter(f => f.fips == d.id)
    var color = myCol(eduData[0].bachelorsOrHigher)
    if(eduData[0]){
      return color
    }
  })
  .attr('d', d3.geoPath())
  .attr('data-fips', function(d) {
    var eduData = edu.filter(f => f.fips == d.id)
    return eduData[0].fips
  })
  .attr('data-education', function (d) {
    var eduData = edu.filter(f => f.fips == d.id)
    return eduData[0].bachelorsOrHigher
  })
  .on('mouseover', function(e,d) {
    var eduData = edu.filter(f => f.fips == d.id)
    //console.log(edu_tl)
      d3.select(this).attr('stroke', 'black')
    
    tooltip
    .style('opacity', 1)
    .html('<p>'+eduData[0].area_name+', '+eduData[0].state+': '+eduData[0].bachelorsOrHigher+'%</p>')
    .attr('data-education', function(d) {
      return eduData[0].bachelorsOrHigher
    })
    .style('top', event.pageY-scrollY+20+ 'px')
    .style('left', event.pageX-scrollX+20 + 'px')
      })
  .on('mousemove', function(e,d) {
    tooltip
    .style('top', event.pageY-scrollY+20+ 'px')
    .style('left', event.pageX-scrollX+20 + 'px')
  })
  .on('mouseout', function(e,d) {
    d3.select(this).attr('stroke', 'none')
    
    tooltip
    .style('opacity', 0)
    .html('')
  })
  
  svg.append('path')
  .datum(topojson.mesh(c, c.objects.states, (a,b) => a !== b))
  .attr('class', 'state')
  .attr('d', d3.geoPath())
  .attr('fill', 'none')
  .attr('stroke', 'white')
  
  //legend Part
}