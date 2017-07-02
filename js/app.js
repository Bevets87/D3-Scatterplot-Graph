(function(d3) {

  'use strict'

  const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

  const getDataSet = function (url,cb) {
    fetch(url)
    .then(function (response) {
      response.json().then(function (data) {
        cb(data)
      })
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  const visualizeData = function (dataset) {
   // set svg parameters to display bar graph

   var margin = {top: 80, right: 250, bottom: 80, left: 150};
   var w  = 800 - margin.left - margin.right;
   var h = 700 - margin.top - margin.bottom;
   // make tooltip
    const div = d3.select('body').append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0);
   // set svg
    const svg = d3.select('#app')
                  .append('svg')
                  .attr('width', w + margin.left + margin.right)
                  .attr('height', h + margin.top + margin.bottom)
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // parse time
    const parseTimeToSeconds = function(string){
      var minToSec = parseInt(string.toString().split(':')[0]) * 60
      var sec = parseInt(string.toString().split(':')[1])
      var totalSeconds = minToSec + sec
      return totalSeconds
    }
    // set domain and range for x-linear-scale
    const minTime = d3.min(dataset, function(d){
      return parseTimeToSeconds(d.Time)
     })

    const maxTime = d3.max(dataset, function(d){
      return parseTimeToSeconds(d.Time)
    })
    const xScale = d3.scaleLinear()
                   .domain([maxTime - minTime, 0])
                   .range([0,w])

   // set domain and range for y-linear-scale
    const maxPlacing = d3.max(dataset, function(d){
       return d.Place
    })
    const yScale = d3.scaleLinear()
                   .domain([1, maxPlacing])
                   .range([0,h])
   // display scatterplot graph
                   svg.selectAll('circle')
                   .data(dataset)
                   .enter()
                   .append('circle')
                   .attr('cx', function(d){
                     d.Time = parseTimeToSeconds(d.Time)
                     console.log(d.Time -minTime)
                     return xScale(d.Time - minTime)
                   })
                   .attr('cy', function(d){
                     return yScale(d.Place)
                   })
                   .attr('r', '7.5')
                   .style('fill', 'darkgray')
                   .style('cursor','pointer')
                   .on('mouseover', function(d) {
                     div.transition()
                      .duration(1000)
                      .style('opacity', .9)
                      div.html(`<br>Name: ${d.Name}<br>
                             Time: ${Math.floor(d.Time/60)}:${d.Time % 60}<br>
                             Ranking: ${d.Place}<br>
                             Country: ${d.Nationality}<br>
                             <p class='doping'>${d.Doping}</p>`)
                        })
                        .style('left', ( w/2) + 'px')
                        .style('top', (280) + 'px')

                   .on('mouseout', function(d){
                     div.transition()
                     .duration(0)
                     .style('opacity', 0)
                     .style('fill','darkgray')
                   })

                  //display text on each circle
                  svg.selectAll('text')
                  .data(dataset)
                  .enter()
                  .append('text')
                  .attr('x', function(d) {
                    return xScale(d.Time - minTime);
                  })
                  .attr('y', function(d) {
                    return yScale(d.Place);
                  })
                  .attr('class','names')
                  .attr('transform','translate(10, 0)' )
                  .style('fill','white')
                  .text(function(d) {return d.Name})



                  svg.append('text')
                  .attr('x', (w / 2))
                  .attr('y', -margin.top/1.5)
                  .attr('text-anchor', "middle")
                  .attr('class', 'title')
                  .text('Doping in Professional Bicycle Racing');




   // make x-axis and label it
    const xAxis = d3.axisBottom(xScale)
                  svg.append('g')
                  .attr('transform','translate(0,' + yScale(maxPlacing) + ')')
                  .style('font-size', '15px')
                  .call(xAxis)
                  .append('text')
                  .attr('text-anchor','middle')
                  .attr('x', w / 2)
                  .attr('y', 50)
                  .style('fill', 'white')
                  .style('font-weight','bold')
                  .text('Seconds Behind Fastest Time')
  // make y-axis and label it
    const yAxis = d3.axisLeft(yScale)
                  svg.append('g')
                  .attr('transform','translate('+ xScale(maxTime - minTime) +',0)')
                  .style('font-size', '15px')
                  .call(yAxis)
                  .append('text')
                  .attr('transform','rotate(-90)')
                  .attr('x', -100)
                  .attr('y', -40)
                  .style('fill', 'white')
                  .style('font-weight','bold')
                  .text('Rankings')

                  xAxis.ticks(10);
                  yAxis.ticks(10);
 }
  getDataSet(url,visualizeData)
})(d3)
