---
layout: post
title: "Track my exercises"
description: ""
category: Life
tags: [Life, Exercise]
---
{% include JB/setup %}

<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>

_This is a fairly old post with continuous update._

Step into 30, I start to care more about myself :smiley: Then I decide to record the amount of exercises I have done with the hope that the diary will push me to do more and more. Basically, the exercises I love to do include

1. `push up`, for chest muscle
1. `pull up`, for back and arm 
1. `bar dip`, for back and arm
1. `wheel roll`, for abs :laughing:
1. some lifting exercises, for arms :muscle:


<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>

<style>

body {
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
{'date': '2015-11-10', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 60  , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-10-30', 'pull_up': 50, 'push_up': 70  , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-10-27', 'pull_up':  0, 'push_up': 150 , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-10-23', 'pull_up': 50, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 70  , 'gym': 1, 'arm': 0  , 'shoulder': 40, 'bouldering': 0 },
{'date': '2015-10-20', 'pull_up': 50, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 40  , 'gym': 1, 'arm': 40 , 'shoulder': 40, 'bouldering': 0 },
{'date': '2015-10-19', 'pull_up': 10, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-10-15', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 1, 'arm': 0  , 'shoulder': 60, 'bouldering': 0 },
{'date': '2015-10-13', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 1, 'arm': 0  , 'shoulder': 40, 'bouldering': 0 },
{'date': '2015-10-10', 'pull_up':  0, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 1 },
{'date': '2015-09-18', 'pull_up': 50, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 50  , 'gym': 1, 'arm': 0  , 'shoulder': 30, 'bouldering': 0 },
{'date': '2015-09-15', 'pull_up': 60, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 100 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-09-13', 'pull_up':  0, 'push_up': 100 , 'ab_wheel_roll': 0  , 'bar_dip':   0 , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-09-12', 'pull_up':  0, 'push_up': 20  , 'ab_wheel_roll': 0  , 'bar_dip':   0 , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-09-11', 'pull_up': 50, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 100 , 'gym': 1, 'arm': 10 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-09-09', 'pull_up': 50, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 100 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-09-04', 'pull_up': 50, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 110 , 'gym': 1, 'arm': 40 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-09-02', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-29', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 100 , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-26', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 100 , 'gym': 1, 'arm': 40 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-21', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 100 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-18', 'pull_up': 0 , 'push_up': 100 , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-15', 'pull_up': 45, 'push_up': 0   , 'ab_wheel_roll': 10 , 'bar_dip': 100 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-14', 'pull_up': 20, 'push_up': 100 , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-08-12', 'pull_up': 0 , 'push_up': 100 , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-31', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 130 , 'gym': 1, 'arm': 60 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-28', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 130 , 'gym': 1, 'arm': 60 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-25', 'pull_up': 20, 'push_up': 30  , 'ab_wheel_roll': 0  , 'bar_dip': 130 , 'gym': 1, 'arm': 60 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-21', 'pull_up': 20, 'push_up': 40  , 'ab_wheel_roll': 40 , 'bar_dip': 140 , 'gym': 1, 'arm': 60 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-18', 'pull_up':  0, 'push_up': 150 , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-16', 'pull_up':  0, 'push_up': 100 , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-14', 'pull_up':  0, 'push_up': 10  , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-11', 'pull_up':  0, 'push_up': 80  , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-10', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 10  , 'gym': 1, 'arm': 50 , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-07-03', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 75  , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-06-12', 'pull_up': 30, 'push_up': 0   , 'ab_wheel_roll': 20 , 'bar_dip': 110 , 'gym': 1, 'arm': 100, 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-06-09', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 20 , 'bar_dip': 100 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-05-29', 'pull_up': 40, 'push_up': 0   , 'ab_wheel_roll': 0  , 'bar_dip': 100 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-05-16', 'pull_up': 0 , 'push_up': 0   , 'ab_wheel_roll': 30 , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-05-15', 'pull_up': 35, 'push_up': 0   , 'ab_wheel_roll': 20 , 'bar_dip': 120 , 'gym': 1, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-05-13', 'pull_up': 20, 'push_up': 100 , 'ab_wheel_roll': 20 , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-05-11', 'pull_up': 20, 'push_up': 100 , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
{'date': '2015-05-08', 'pull_up': 20, 'push_up': 100 , 'ab_wheel_roll': 0  , 'bar_dip': 0   , 'gym': 0, 'arm': 0  , 'shoulder': 0 , 'bouldering': 0 },
];


/*-----------------------------*/

var width    = 900,
    height   = 300,
    cellSize = 13; // cell size

var no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
var shift_up = cellSize * 3;

var day = d3.time.format("%w"), // day of the week
    day_of_month = d3.time.format("%e") // day of the month
    day_of_year = d3.time.format("%j")
    week = d3.time.format("%U"), // week number of the year
    month = d3.time.format("%m"), // month number
    year = d3.time.format("%Y"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");


var color = d3.scale.linear().range(["white", 'red']).domain([0, 250])
var dateParse = d3.time.format("%Y-%m-%d");

var svg = d3.select("example1").selectAll("svg")
    .data(d3.range(2015, 2016))
    .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
    .append("g")

svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });

var rect = svg.selectAll(".day")
        .data(function(d) { 
          return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
      .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
          var month_padding = 1.2 * cellSize*7 * ((month(d)-1) % (no_months_in_a_row));
          return day(d) * cellSize + month_padding; 
        })
        .attr("y", function(d) { 
          var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
          var row_level = Math.ceil(month(d) / (no_months_in_a_row));
          return (week_diff*cellSize) + row_level*cellSize*8 - cellSize/2 - shift_up;
        })
        .datum(format);

var month_titles = svg.selectAll(".month-title")  // Jan, Feb, Mar and the whatnot
      .data(function(d) { 
        return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("text")
      .text(monthTitle)
      .attr("x", function(d, i) {
        var month_padding = 1.2 * cellSize*7* ((month(d)-1) % (no_months_in_a_row));
        return month_padding;
      })
      .attr("y", function(d, i) {
        var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
        var row_level = Math.ceil(month(d) / (no_months_in_a_row));
        return (week_diff*cellSize) + row_level*cellSize*8 - cellSize - shift_up;
      })
      .attr("class", "month-title")
      .attr("d", monthTitle);

var year_titles = svg.selectAll(".year-title")  // Jan, Feb, Mar and the whatnot
      .data(function(d) { 
        return d3.time.years(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
      .enter().append("text")
      .text(yearTitle)
      .attr("x", function(d, i) { return width/2 - 100; })
      .attr("y", function(d, i) { return cellSize*5.5 - shift_up; })
      .attr("class", "year-title")
      .attr("d", yearTitle);

var tooltip = d3.select("body")
  .append("div").attr("id", "tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .text("a simple tooltip");

d3.json("", function(error, data) {

  sessions.forEach(function(d) {
    d.dd = format(dateParse.parse(d.date));
  });

  var nest = d3.nest()
    .key(function(d) { return d.dd; })
    .map(sessions);

  rect.filter(function(d) { return d in nest; })
    .attr("class", function(d) { return "day"; })
    .style("fill", function(d) { return color(nest[d][0].pull_up+nest[d][0].push_up+nest[d][0].ab_wheel_roll+nest[d][0].bar_dip+nest[d][0].arm+nest[d][0].shoulder); })


   //  Tooltip
  rect.on("mouseover", mouseover);
  rect.on("mouseout", mouseout);

  function mouseover(d) {
    tooltip.style("visibility", "visible");

    var textcontent = (nest[d] !== undefined) ?  "\n pull up:\t\t" + nest[d][0].pull_up + "\n push up:\t\t" + nest[d][0].push_up + "\n ab wheel roll:\t" + nest[d][0].ab_wheel_roll + "\n bar dip:\t\t" + nest[d][0].bar_dip + "\n arm:\t\t\t" + nest[d][0].arm + "\n shoulder:\t\t" + nest[d][0].shoulder: '\n No GYM ?? Kidding me ??';
    var textdata = d + ":" + textcontent;

    tooltip.transition()        
      .duration(200)      
      .style("opacity", 1);  
    
    tooltip.html(textdata)  
      .style("left", (d3.event.pageX)+30 + "px")     
      .style("top", (d3.event.pageY) + "px"); 
   }

  function mouseout (d) {
    tooltip.transition()
      .duration(500)      
      .style("opacity", 0); 
    var $tooltip = $("#tooltip");
    $tooltip.empty();
   }
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

function dayTitle (t0) {
  return t0.toString().split(" ")[2];
}
function monthTitle (t0) {
  return t0.toString().split(" ")[1];
}
function yearTitle (t0) {
  return t0.toString().split(" ")[3];
}


/*-----------------------------*/


// The table generation function
function tabulate(data, columns) {
	
    var table = d3.select("example1").append("table")
            .attr("style", "margin-left: 0px"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier") // sets the font style
        .html(function(d) { return d.value; });

    return table;
}

// render the table
var peopleTable = tabulate(sessions, ["date", "pull_up", "push_up", "ab_wheel_roll", "bar_dip", "gym", "arm", "shoulder", "	bouldering"]);




</script>

</example1>



               
                

