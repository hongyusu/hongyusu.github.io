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

<example1>

<script type="text/javascript">
//Width and height
var w = 600;
var h = 300;

//Original data
var dataset = {
    nodes: [
        { name: "Adam" },
        { name: "Bob" },
        { name: "Carrie" },
        { name: "Donovan" },
        { name: "Edward" },
        { name: "Felicity" },
        { name: "George" },
        { name: "Hannah" },
        { name: "Iris" },
        { name: "Jerry" }
    ],
    edges: [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 0, target: 3 },
        { source: 0, target: 4 },
        { source: 1, target: 5 },
        { source: 2, target: 5 },
        { source: 2, target: 5 },
        { source: 3, target: 4 },
        { source: 5, target: 8 },
        { source: 5, target: 9 },
        { source: 6, target: 7 },
        { source: 7, target: 8 },
        { source: 8, target: 9 }
    ]
};

//Initialize a default force layout, using the nodes and edges in dataset
var force = d3.layout.force()
                     .nodes(dataset.nodes)
                     .links(dataset.edges)
                     .size([w, h])
                     .linkDistance([50])
                     .charge([-100])
                     .start();

var colors = d3.scale.category10();

//Create SVG element
var svg = d3.select("example1")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

//Create edges as lines
var edges = svg.selectAll("line")
    .data(dataset.edges)
    .enter()
    .append("line")
    .style("stroke", "#ccc")
    .style("stroke-width", 1);

//Create nodes as circles
var nodes = svg.selectAll("circle")
    .data(dataset.nodes)
    .enter()
    .append("circle")
    .attr("r", 10)
    .style("fill", function(d, i) {
        return colors(i);
    })
    .call(force.drag);

//Every time the simulation "ticks", this will be called
force.on("tick", function() {

    edges.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });

    nodes.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; });

});

</script>

