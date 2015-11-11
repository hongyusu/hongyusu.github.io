---
layout: post
title: "Track my exercises"
description: ""
category: Life
tags: [Life, Exercise]
---
{% include JB/setup %}

<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>


At the age of 30, I start to care more about myself :smiley: Later I decide to record the amount of exercises I have done with the hope that it will fire me up :gun: to do more and more. Basically, the exercises I love to do include

1. `push up`, for chest muscle
1. `pull up`, for back muscle
1. `bar dip`, for back muscle
1. `wheel roll`, for abs :laughing:
1. some lifting exercises, for arms :muscle:


<style>

body {
  font: 10px sans-serif;
  shape-rendering: crispEdges;
}

.day {
  fill: #fff;
  stroke: #ccc;
}

.month {
  fill: none;
  stroke: #000;
  stroke-width: 2px;
}

.RdYlGn .q0-11{fill:rgb(165,0,38)}
.RdYlGn .q1-11{fill:rgb(215,48,39)}
.RdYlGn .q2-11{fill:rgb(244,109,67)}
.RdYlGn .q3-11{fill:rgb(253,174,97)}
.RdYlGn .q4-11{fill:rgb(254,224,139)}
.RdYlGn .q5-11{fill:rgb(255,255,191)}
.RdYlGn .q6-11{fill:rgb(217,239,139)}
.RdYlGn .q7-11{fill:rgb(166,217,106)}
.RdYlGn .q8-11{fill:rgb(102,189,99)}
.RdYlGn .q9-11{fill:rgb(26,152,80)}
.RdYlGn .q10-11{fill:rgb(0,104,55)}

</style>

<example1>
	
<script type="text/javascript">



  var sessions = [
{'date': '2015-11-11', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 60  , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-10-30', 'pull-up': 50, 'push-up': 70  , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-10-27', 'pull-up':  0, 'push-up': 150 , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-10-23', 'pull-up': 50, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 70  , 'gym': 1, 'arm': 0  , 'shoulder': 40, 'bouldering': 0 },
{'date': '2015-10-20', 'pull-up': 50, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 40  , 'gym': 1, 'arm': 40 , 'shoulder': 40, 'bouldering': 0 },
{'date': '2015-10-19', 'pull-up': 10, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-10-15', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 1, 'arm': 0  , 'shoulder': 60, 'bouldering': 0 },
{'date': '2015-10-13', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 1, 'arm': 0  , 'shoulder': 40, 'bouldering': 0 },
{'date': '2015-10-10', 'pull-up':  0, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 1 },
{'date': '2015-09-18', 'pull-up': 50, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 50  , 'gym': 1, 'arm': 0  , 'shoulder': 30, 'bouldering': 0 },
{'date': '2015-09-15', 'pull-up': 60, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 100 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-09-13', 'pull-up':  0, 'push-up': 100 , 'ab-wheel-roll': 0  , 'bar-dip':   0 , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-09-12', 'pull-up':  0, 'push-up': 20  , 'ab-wheel-roll': 0  , 'bar-dip':   0 , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-09-11', 'pull-up': 50, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 100 , 'gym': 1, 'arm': 10 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-09-09', 'pull-up': 50, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 100 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-09-04', 'pull-up': 50, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 110 , 'gym': 1, 'arm': 40 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-09-02', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-29', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 100 , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-26', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 100 , 'gym': 1, 'arm': 40 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-21', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 100 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-18', 'pull-up': 0 , 'push-up': 100 , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-15', 'pull-up': 45, 'push-up': 0   , 'ab-wheel-roll': 10 , 'bar-dip': 100 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-14', 'pull-up': 20, 'push-up': 100 , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-12', 'pull-up': 0 , 'push-up': 100 , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-31', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 130 , 'gym': 1, 'arm': 60 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-28', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 130 , 'gym': 1, 'arm': 60 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-25', 'pull-up': 20, 'push-up': 30  , 'ab-wheel-roll': 0  , 'bar-dip': 130 , 'gym': 1, 'arm': 60 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-21', 'pull-up': 20, 'push-up': 40  , 'ab-wheel-roll': 40 , 'bar-dip': 140 , 'gym': 1, 'arm': 60 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-18', 'pull-up':  0, 'push-up': 150 , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-16', 'pull-up':  0, 'push-up': 100 , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-14', 'pull-up':  0, 'push-up': 10  , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-11', 'pull-up':  0, 'push-up': 80  , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-10', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 10  , 'gym': 1, 'arm': 50 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-03', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 75  , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-06-12', 'pull-up': 30, 'push-up': 0   , 'ab-wheel-roll': 20 , 'bar-dip': 110 , 'gym': 1, 'arm': 100, 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-06-09', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 20 , 'bar-dip': 100 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-05-29', 'pull-up': 40, 'push-up': 0   , 'ab-wheel-roll': 0  , 'bar-dip': 100 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-05-16', 'pull-up': 0 , 'push-up': 0   , 'ab-wheel-roll': 30 , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-05-15', 'pull-up': 35, 'push-up': 0   , 'ab-wheel-roll': 20 , 'bar-dip': 120 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-05-13', 'pull-up': 20, 'push-up': 100 , 'ab-wheel-roll': 20 , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-05-11', 'pull-up': 20, 'push-up': 100 , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-05-08', 'pull-up': 20, 'push-up': 100 , 'ab-wheel-roll': 0  , 'bar-dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
];


/*-----------------------------*/


/*-----------------------------*/

  // create the table header
  var thead = d3.select("example1").selectAll("th")
    .data(d3.keys(sessions[0]))
    .enter().append("th").text(function(d){return ' | ' + d });
  var tr = d3.select("example1").selectAll("tr")
    .data(sessions).enter().append("tr")
  var td = tr.selectAll("td")
    .data(function(d){return d3.values(d)})
    .enter().append("td")
    .text(function(d) {return d})




var width = 960,
    height = 136,
    cellSize = 15; // cell size

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

/*
   var color = d3.scale.quantize()
    .domain([-.05, .05])
    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));
    */

var color = d3.scale.category10();
var dateParse = d3.time.format("%m/%d/%Y");

var svg = d3.select("example1").selectAll("svg")
    .data(d3.range(2015, 2016))
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });

var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return week(d) * cellSize; })
    .attr("y", function(d) { return day(d) * cellSize; })
    .datum(format);

rect.append("title")
    .text(function(d) { return d; });

svg.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);

//d3.csv("dji.csv", function(error, csv) {
d3.json("data3.json", function(error, data) {
  /*var data = d3.nest()
    .key(function(d) { return d.Date; })
    .rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
    .map(csv);
    */

  data.forEach(function(d) {
    d.dd = format(dateParse.parse(d.date));
  });

  var nest = d3.nest()
    .key(function(d) { return d.dd; })
    .map(data);

  color.domain(d3.set(data.map(function(d) { return d.category; })).values());

  rect.filter(function(d) { return d in nest; })
      //.attr("class", function(d) { return "day " + color(data[d]); })
      .attr("class", function(d) { return "day"; })
      .style("fill", function(d) { return color(nest[d][0].category); })
    .select("title")
      //.text(function(d) { return d + ": " + percent(data[d]); });
      .text(function(d) { return d + ": " + nest[d][0].city; });
});

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = +day(t0), w0 = +week(t0),
      d1 = +day(t1), w1 = +week(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}

//d3.select(self.frameElement).style("height", "2910px");

</script>

</example1>



               
                

