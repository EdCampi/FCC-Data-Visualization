const api = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

fetch(api).
then(response => response.json()).
then(data => {


  const stringObj = JSON.stringify(data);
  const obj = JSON.parse(stringObj);

  const w = 900;
  const h = 450;

  var svg = d3.select('#viz').
  append('svg').
  attr('height', h).
  attr('width', w);

  svg.append('text').
  text('Time in Min-Sec').
  style('font-size', 15).
  style('font-family', 'Didact Gothic').
  attr('transform', 'rotate(-90)').
  attr('y', 11).
  attr('x', -280);

  //tooltip

  let tooltip = d3.select('#viz').
  append('div').
  attr('id', 'tooltip').
  style('opacity', 0);


  //xPart
  var parseTime = d3.timeParse("%Y");
  var timeArrayX = [];

  obj.forEach(function (value) {
    timeArrayX.push(parseTime(value.Year));
  });

  const xMin = d3.min(obj, d => d.Year);
  const xMax = d3.max(obj, d => d.Year);

  const xScale = d3.scaleTime().
  domain([xMin - 1, xMax + 1]).
  range([50, w - 50]);

  const xAxis = d3.axisBottom(xScale).
  tickFormat(d3.format('d'));


  //yPart

  var timeParse = d3.timeParse('%M:%S');
  var timeFormat = d3.timeFormat('%M:%S');
  var timeArrayY = [];
  obj.forEach(function (value) {
    timeArrayY.push(timeParse(value.Time));
  });
  const yMin = d3.min(timeArrayY, d => d);
  const yMax = d3.max(timeArrayY, d => d);

  const yScale = d3.scaleLinear().
  domain([yMin, yMax]).
  rangeRound([50, h - 50]);


  const yAxis = d3.axisLeft(yScale).
  tickFormat(timeFormat);



  svg.selectAll('circle').
  data(obj).
  enter().
  append('circle').
  attr('class', 'dot').
  attr('cx', d => xScale(d.Year)).
  attr('cy', d => yScale(timeParse(d.Time))).
  attr('data-xvalue', d => d.Year).
  attr('data-yvalue', function (d) {
    var time = d.Time.split(':');
    return new Date(1960, 01, 01, 00, Number(time[0]), Number(time[1]));
  }).
  attr('r', d => 7).
  attr('fill', function (d) {
    if (d.Doping == '') {
      return '#d5001f';
    } else {
      return '#813BF6';
    }
  }).
  on('mouseover', function (d, i) {
    tooltip.
    style('opacity', 1).
    html('<p>' + i['Name'] + ': ' + i['Nationality'] + '<br>' + 'Year: ' + i['Year'] + ', Time: ' + i['Time'] + '<br>' + i['Doping'] + '<p>').
    style('background-color', 'white').
    attr('data-year', i['Year']).
    style("top", event.pageY - scrollY + 10 + "px").
    style("left", event.pageX - scrollX + 10 + "px").
    attr('width', 250).
    style('z-index', '100');
  }).
  on('mouseout', function (d, i) {
    tooltip.
    style('opacity', 0).
    style('z-index', '-1');
  });


  svg.append('g').
  attr('transform', 'translate(10,' + (h - 50) + ')').
  attr('id', 'x-axis').
  call(xAxis);

  svg.append('g').
  attr('transform', 'translate(60,0)').
  attr('id', 'y-axis').
  call(yAxis);

  let legend = d3.select('#viz').
  append('div').
  attr('id', 'legend');

  legend.append('div').
  attr('id', 'div-1').
  append('p').
  text('Doping allegations').
  append('svg').
  attr('height', 20).
  attr('width', 40).
  append('rect').
  attr('height', 20).
  attr('width', 20).
  style('fill', '#813bf6').
  attr('transform', 'translate(20,1)');

  legend.append('div').
  attr('id', 'div-2').
  append('p').
  text('No doping allegations').
  append('svg').
  attr('height', 20).
  attr('width', 25).
  append('rect').
  attr('height', 20).
  attr('width', 20).
  style('fill', '#d5001f').
  attr('transform', 'translate(3.45,0)');
});