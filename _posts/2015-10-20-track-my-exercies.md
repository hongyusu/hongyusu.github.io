---
layout: post
title: "Track my exercies"
description: ""
category: Life
tags: [Life, Exercise]
---
{% include JB/setup %}

<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>

<style>

example1 {
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

<script>
var width = 960,
    height = 136,
    cellSize = 17; // cell size

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

var svg = d3.select('example1').selectAll("svg")
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


d3.json("", function(error, data) {

  var data = 	[{
	 "category": "business",
	 "date": "01/10/2015",
	 "city": "New York"
	 },
	 {
	 "category": "holidays",
	 "date": "02/10/2015",
	 "city": "New York"
	 },
	 {
	 "category": "business",
	 "date": "03/10/2015",
	 "city": "New York"
	 },
	 {
	 "category": "family",
	 "date": "03/10/2015",
	 "city": "New York"
	 },
	 {
	 "category": "holidays",
	 "date": "01/10/2015",
	 "city": "San Francisco"
	 },
	 {
	 "category": "family",
	 "date": "02/10/2015",
	 "city": "San Francisco"
	 },
	 {
	 "category": "holidays",
	 "date": "03/10/2015",
	 "city": "San Francisco"
	 },
	 {
	 "category": "family",
	 "date": "01/10/2015",
	 "city": "Austin"
	 },
	 {
	 "category": "holidays",
	 "date": "02/10/2015",
	 "city": "Austin"
	 },
	 {
	 "category": "family",
	 "date": "03/10/2015",
	 "city": "Austin"
	 }
	 ]


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

At the age of 30, I start to care more about myself :smiley: Later I decide to record the amount of exercises I have done with the hope that it will fire me up :gun: to do more and more. Basically, the exercises I love to do include

1. `push up`, for my chest muscle
1. `pull up`, for my back muscle
1. `bar dip`, for my back muscle
1. `wheel roll`, for my abs :laughing:
1. some lifting exercises, for my arms :muscle:

| Year | Month | Date | Pull up | Push up | Ab wheel rollout | Bar dip | Gym | Arm | Shoulder | Bouldering |
|--:|---:|:---:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
|2015|10|30|50|70  |0  |0  |1|0 |0 |0 |
|2015|10|27| 0|150 |0  |0  |0|0 |0 |0 |
|2015|10|23|50|0   |0  |70 |1|0 |40|0 |
|2015|10|20|50|0   |0  |40 |1|40|40|0 |
|2015|10|19|10|0   |0  |0  |0|0 |0 |0 |
|2015|10|15|40|0   |0  |0  |1|0 |60|0 |
|2015|10|13|40|0   |0  |0  |1|0 |40|0 |
|2015|10|10| 0|0   |0  |0  |0|0 |0 |1 |
|2015|9|18|50|0   |0  |50  |1|0 |30|0 |
|2015|9|15|60|0   |0  |100 |1|0 |0 |0 |
|2015|9|13| 0|100 |0  |  0 |0|0 |0 |0 |
|2015|9|12| 0|20  |0  |  0 |0|0 |0 |0 |
|2015|9|11|50|0   |0  |100 |1|10|0 |0 |
|2015|9|09|50|0   |0  |100 |1|0 |0 |0 |
|2015|9|04|50|0   |0  |110 |1|40|0 |0 |
|2015|9|02|40|0   |0  |0   |0|0 |0 |0 |
|2015|8|29|40|0   |0  |100 |0|0 |0 |0 |
|2015|8|26|40|0   |0  |100 |1|40|0 |0 |
|2015|8|21|40|0   |0  |100 |1|0 |0 |0 |
|2015|8|18|0 |100 |0  |0   |0|0 |0 |0 |
|2015|8|15|45|0   |10 |100 |1|0 |0 |0 |
|2015|8|14|20|100 |0  |0   |0|0 |0 |0 |
|2015|8|12|0 |100 |0  |0   |0|0 |0 |0 |
|2015|7|31|40|0   |0  |130 |1|60|0 |0 |
|2015|7|28|40|0   |0  |130 |1|60|0 |0 |
|2015|7|25|20|30  |0  |130 |1|60|0 |0 |
|2015|7|21|20|40  |40 |140 |1|60|0 |0 |
|2015|7|18|0|150  |0  |0   |0|0 |0 |0 |
|2015|7|16|0|100  |0  |0   |0|0 |0 |0 |
|2015|7|14|0|10   |0  |0   |0|0 |0 |0 |
|2015|7|11|0|80   |0  |0   |0|0 |0 |0 |
|2015|7|10|40|0   |0  |10  |1|50|0 |0 |
|2015|7|03|40|0   |0  |75  |1|0 |0 |0 |
|2015|6|12|30|0   |20 |110 |1|100|0|0 |
|2015|6|09|40|0   |20 |100 |1|0 |0 |0 |
|2015|5|29|40|0   |0  |100 |1|0 |0 |0 |
|2015|5|16|0 |0   |30 |0   |0|0 |0 |0 |
|2015|5|15|35|0   |20 |120 |1|0 |0 |0 |
|2015|5|13|20|100 |20 |0   |0|0 |0 |0 |
|2015|5|11|20|100 |0  |0   |0|0 |0 |0 |
|2015|5|8 |20|100 |0  |0   |0|0 |0 |0 |



