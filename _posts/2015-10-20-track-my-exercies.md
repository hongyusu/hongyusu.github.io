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


<example1>
	
<script type="text/javascript">



  var sessions = [
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

  console.log(d3.keys(sessions[0]));
  // create the table header
  var thead = d3.select("example1").selectAll("th")
    .data(d3.keys(sessions[0]))
    .enter().append("th").text(function(d){return d  +  ' '});
  // fill the table
  // create rows
  var tr = d3.select("example1").selectAll("tr")
    .data(sessions).enter().append("tr")
  // cells
  var td = tr.selectAll("td")
    .data(function(d){return d3.values(d)})
    .enter().append("td")
    .text(function(d) {return d})

</script>

</example1>

At the age of 30, I start to care more about myself :smiley: Later I decide to record the amount of exercises I have done with the hope that it will fire me up :gun: to do more and more. Basically, the exercises I love to do include

1. `push up`, for my chest muscle
1. `pull up`, for my back muscle
1. `bar dip`, for my back muscle
1. `wheel roll`, for my abs :laughing:
1. some lifting exercises, for my arms :muscle:

               
                

