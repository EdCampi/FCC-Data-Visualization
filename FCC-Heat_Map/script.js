fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(response => response.json())
  .then(data => {
  console.clear()
  var obj = data['monthlyVariance']
  
  const h = 510;
  const w = 1200;
  
  var svg = d3.select('#viz')
              .append('svg')
              .attr('height', h)
              .attr('width', w)
  
  var myColor = d3.scaleLinear()
  .range(["white", "#69b3a2"])
  .domain([-100,100])
  
  //tooltip
  
  let toolDiv = d3.select('#viz')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0)
  
  
  // x Axis
  var x = d3.scaleTime()
  .domain([d3.min(obj, d => d['year']), d3.max(obj, d=> d['year'])])
  .range([80, w-50])
  
  svg.append('g')
  .attr('transform', 'translate(0,478)')
  .attr('id', 'x-axis')
  .call(d3.axisBottom(x).tickFormat(d3.format('d')))
  
  // y Axis
  
  var y = d3.scaleTime()
    .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
    .range([10, h-32]);
  
  var monthFormat = d3.timeFormat('%B')
  
  var yAxis = d3.axisLeft(y)
                .tickFormat(monthFormat)
  
  
  
  svg.append('g')
     .attr('transform', 'translate(80,0)')
     .call(yAxis)
  .attr('id', 'y-axis')
  
  // rect part
  
  var months= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
  
  var colAr = obj.map(d=>d.variance/10)
  
  var color = function(val) {
    //var colValue = 
    if (val < -6) {
        return '#482173'      
    }
    if (val < -5) {
      return '#433e85'
    }
    if (val < -4) {
      return '#38588c'
    }
    if (val < -3) {
      return '#2d708e'
    }
    if (val < -2) {
      return '#25858e'
    }
    if (val < -1) {
      return '#1e9b8a'
    }
    if (val < 0) {
      return '#2ab07f'
    }
    if (val < 1) {
      return '#52c569'      
    }
    if (val < 2) {
       return '#86d549'      
    }
    if (val < 3) {
       return '#c2df23'      
    }
    if (val < 4) {
       return '#fde725'      
    }
    if (val < 5) {
      return '#fce028'
    }
    return '#fcae28'
  }
  
  svg.selectAll('rect')
      .data(obj)
  .enter()
  .append('rect')
  .attr('class', 'cell')
  .attr('data-month', d=> new Date(2012, d.month-1,01).getMonth())
  .attr('data-year', d=> d.year)
  .attr('data-temp', d=> 8.66+d.variance)
  .attr('width', d => (w)/parseInt(obj.length/12))
  .attr('height',  function (d) {
          if (d.month == 12 || d.month == 11 || d.month == 9 || d.month == 6 || d.month == 4) {
            return ((h-30)/12)-1
          } else if (d.month == 2) {
            return ((h-30)/12)-2
          } else {
            return (h-30)/12
          };
        })
  .attr('x', d => x(d.year)+1)
  .attr('y', function(d) {
    return y(new Date(2012, d.month-1,01))
      })
  .style('fill', function(d) {
    return color(d.variance)
  })
  .on('mouseover', function(d,i) {
    d3.select(this)
      .style('stroke', 'black')
      .style('stroke-width', 2)
    let data = i;
    var temp = (8.66+data.variance).toFixed(2)
    toolDiv
    .style('opacity', 1)
    .html('<p>'+months[data.month-1]+' - '+data.year+'<br>Temperature: '+temp +'°C<br>Variance: '+(data.variance).toFixed(2)+'</p>')
    .attr('data-year', data.year)
    .style("top", (event.pageY-scrollY + 10)+"px")
    .style("left",(event.pageX-scrollX + 20)+"px")
  })
  .on('mousemove', function(d,i) {
    toolDiv
      .style("top", (event.pageY-scrollY + 10)+"px")
      .style("left",(event.pageX-scrollX + 20)+"px")
  })
  .on('mouseout', function(d,i) {
    toolDiv.style('opacity', 0)
    d3.select(this).style('stroke', 'none')
  })
  
  //legend part
  
  var lc = d3.select('#viz').append('div')
  .attr('id', 'legend')
  .append('svg')
  
  lc.select('svg')
  
  var myColors = [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5],
      myRow = ['Temp variation (in C°)'];
  
  var myColData = [{row: 'a1', value: -6}, {row: 'a1', value: -5}, {row: 'a1', value: -4}, {row: 'a1', value: -3}, {row: 'a1', value: -2}, {row: 'a1', value: -1}, {row: 'a1', value: 0}, {row: 'a1', value: 1}, {row: 'a1', value: 2}, {row: 'a1', value: 3}, {row: 'a1', value: 4}, {row: 'a1', value: 5}]
  
  var neoX = d3.scaleBand().range([0,200]).domain(myColors)
  
  lc.append('g').call(d3.axisBottom(neoX)).attr('transform', 'translate(180,25)')
  
  lc.select('.tick line, .domain').style('display', 'none')
  
  lc.selectAll('.tick text').attr('transform', 'translate(0,-5)')
  
  var neoY = d3.scaleBand().range([0,25]).domain(myRow)
  
  lc.append('g').call(d3.axisLeft(neoY)).attr('transform', 'translate(180,0)')
  
  lc.selectAll('.tick line, .domain').style('display', 'none')
  
  lc.selectAll('rect')
    .data(myColData)
    .enter()
    .append('rect')
    .attr('height', 25)
    .attr('width', 200/11)
    .attr('x', d => neoX(d.value)+180)
    .attr('y', d=> neoY(d.row))
    .style('fill', d => color(d.value))
  })