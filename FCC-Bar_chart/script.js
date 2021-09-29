const api = `https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json`;

fetch(api).
then(response => response.json()).
then(data => {
  var dataString = JSON.stringify(data);
  var fullData = JSON.parse(dataString)['data'];

  var information = [];

  for (let i = 0; i < fullData.length; i++) {
    information.push(fullData[i]);
  }

  //API READY TO GO
  const w = 890;
  const h = 385;
  const svg = d3.select('#viz').
  append('svg').
  attr('width', w).
  attr('height', h);

  let tooltip = d3.select('#viz').
  append('div').
  attr("id", "tooltip").
  style("opacity", 0);




  svg.selectAll('rect').
  data(information).
  enter().
  append('rect').
  attr('class', 'bar').
  attr('y', d => {
    return h - 20 - d[1] / 50;
  }).
  attr("x", (d, i) => {
    return i * 3 + 50;
  }).
  attr('height', (d, i) => {
    return d[1] / 50;
  }).
  attr('width', 5).
  attr('data-date', d => d[0]).
  attr('data-gdp', d => d[1]).
  attr('id', d => d[0]).
  on('mouseover', function (d, i) {


    var body = document.getElementById('bodi');
    var posBody = body.getBoundingClientRect();

    var main = document.getElementById('main');
    var pos = main.getBoundingClientRect();

    var total = posBody.left + posBody.right;
    if (total <= 1000) {
      var x = d.clientX + scrollX;
      tooltip.
      style('left', x + 'px').
      style('top', -150 + 'px');
    } else if (total > 1000) {
      var posTotal = pos.left;
      var x = d.clientX + scrollX - posTotal / 1.3;
      tooltip.
      style('left', x + 'px').
      style('top', -150 + 'px');
    }


    var theOne = i[0];
    let date = i[0].replace(/-/, ",");
    tooltip.
    html('Date: ' + new Date(date).toDateString() + '<br/>GDP: $' + i[1] + ' b').
    style('opacity', 1).

    attr('data-date', theOne);
  }).
  on('mouseout', function (d) {
    tooltip.style('opacity', 0);
  });


  const xScale = d3.scaleTime().
  domain([new Date(d3.min(information, d => d[0])), new Date(d3.max(information, d => d[0]))]).
  rangeRound([0, w - 64]);

  const xAxis = d3.axisBottom(xScale);

  svg.append("g").
  attr("transform", "translate(50, " + (h - 20) + ")").
  attr('class', 'tick').
  attr('id', 'x-axis').
  call(xAxis);

  const yScale = d3.scaleLinear().
  domain([0, d3.max(information, d => d[1])]).
  range([h - 20, 5]);

  const yAxis = d3.axisLeft(yScale);

  svg.append('g').
  attr('transform', 'translate(50, ' + 0 + ')').
  attr('class', 'tick').
  attr('id', 'y-axis').
  call(yAxis);
});