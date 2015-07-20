---
layout: post
title: "SQL refreshment"
description: ""
category: Programming 
tags: [programming, SQL]
---
{% include JB/setup %}


##A brief overview of important SQL statements

### `select` statement
1. pay attention to `distinct` and `like` in `where` statement.
1. `%` can be used as wild card in `like` statement.
1. An example code is given as the following:

{%highlight SQL%}
select distinct name
from empinfo
where age > 40 and firstname like 'bob%'
{%endhighlight%}

###Aggregation functions
1. Aggregation functions include `distinct`, `min`, `max`, `sum`, `avg`, `count`, and `count(*)` where return the number of rows.
1. An example code is given as the following:

{%highlight SQL%}
select max(salary), firstname, lastname
from empinfo
{%endhighlight%}

###`group by` statement
1. `group by` statement will group rows with same attribute. It is usually followed with aggregation function.
1. An example code is given as the following:

{%highlight SQL%}
select max(salary), department
from empinfo
group by department
{%endhighlight%} 

###`having` statement
1. `having` statement usually follows `group by` statement.
1. The difference between `having` and `where` statements are the followings:
   1. Aggregation functions, e.g., `avg()`, cannot be used in `where` statement, but can be used in `having` statement.
   1. `where` can be used in `insert`, `delete`, `select` statements, but `having` can only be used in `select` statement.
   1. `having` can only use with `group by` statement.
1. An example code is given as the following:

{%highlight SQL%}
select max(salary),department
from empinfo
where department like 'elec%'
group by department
having avg(salary) > 5000
{%endhighlight%}

###`order by` statement
1. `order by` statement can be used with two options `ASC` or `DESC`.
1. An example code is given as the following:

{%highlight SQL%}
select employee_id, department, firstname, lastname
from empinfor
where department like 'core%'
order by salary DESC, name ASC
{%endhighlight%}

###`in` and `between` statements
1. `in` and `between` statements can be combined to make more powerful boolean clauses.
1. Two example codes are given as the following:

{%highlight SQL%}
select employee_id, salary, department, firstname, lastname
from empinfor
where firstname in ('John', 'Bob', 'William')
and (salary between 2000 and 5000)
{%endhighlight%} 

{%highlight SQL%}
select title from movie
where id in ('11768','11955','21191')
{%endhighlight%} 

###`join` statement
1. `join` statement makes ralational database _ralational_.
1. `join` statement can make the database operation easier. For example, one can use `join` statement instead of writing a complicated code using `select` and `where` statements.
1. For example, we have a database table of custom information and other table about purchaes. An example code of operating on there two tables is given as followings:

{%highlight SQL%}
select customers.firstname, customers.lastname, purchases.id, purchases.name, purchases.price
from customer, purchases
where customer.id == purchases.customerid
{%endhighlight%}

{%highlight SQL%}
select customers.firstname, customers.lastname, purchases.id, purchases.name, purchases.price
from customer inner join purchases
on customer.id == purchases.customerid
{%endhighlight%}


###Arithmetic operation
1. Arithmetic operation can be used to generate new column of the data table
1. An example code is given as the following:
{%highlight SQL%}
select name, gdp/population
from world
where area > 500000
{%endhighlight%}

###Check the difference in date
1. Function `datediff()` can be used to check the difference in date variables.
1. An example code is given as the following:
{%highlight SQL%}
select w2.Id
from Weather w1 join Weather w2
on datediff(w2.Date,w1.Date) = 1
where w1.Temperature < w2.Temperature
{%endhighlight%}


###`coalesce` statement
1. `coalesce` statement will replace the `null` entries with `0`.
1. Two example codes are given as the following, which is the answer to the 13th question from the [exerciese](http://sqlzoo.net/wiki/The_JOIN_operation).
{%highlight SQL%}
select name,coalesce(mobile,'07986 444 2266')
from teacher
{%endhighlight%}
{%highlight SQL%}
select c.m1,team1,COALESCE(s1,0),team2,COALESCE(s2,0)
from
(
select id id1,mdate m1,team1,s1
from game
left join
(
select id tmpid,m1,team1 tmpteam1,sum(score1) s1
from
(
SELECT id,mdate m1,team1,
  CASE WHEN teamid=team1 THEN 1 ELSE 0 END score1
  FROM game JOIN goal ON matchid = id
)a
group by tmpid
)b
on id = tmpid
)c
join
(
select id id2,mdate m2,team2,s2
from game
left join
(
select id tmpid,m2,team2 tmpteam2,sum(score2) s2
from
(
SELECT id,mdate m2,team2,
  CASE WHEN teamid=team2 THEN 1 ELSE 0 END score2
  FROM game JOIN goal ON matchid = id
)d
group by tmpid
)e
on id = tmpid
)f
on c.id1 = f.id2
order by m1
{%endhighlight%}

###`isnull()` function
1. `isnull()` function is usually worked with `where` to form boolean claus.
1. An example code is given as the followings which is the solution to the [first exercise](http://sqlzoo.net/wiki/Using_Null).
{%highlight SQL%}
select name from teacher where isnull(dept)
{%endhighlight%}

### Different `join` statements
1. There are several join statements include `inner join`, `left outer join`, and `full outer join`.
1. The following illustration is based on [a post](http://stackoverflow.com/questions/38549/difference-between-inner-and-outer-joins) from stackoverflow.
   1. Suppose there are two tables

      |a|b|
      |:-:|:-:|
      |1|3|
      |2|4|
      |3|5|
      |4|6|

   1. `inner join` is the intersection of two tables. For example, the query `select * from a INNER JOIN b on a.a = b.b` will generate the following table

      |a|b|
      |:-:|:-:|
      |3|3|
      |4|4|
   
   1. `left outer join` will also be the intersection of two tables. In addition, it keeps the elements from the first table and keep `null` values from the second one. For example, the query `select * from a left outer join b on a.a = b.b` will generate the following table

      |a|b|
      |:-:|:-:|
      |1|null|
      |2|null|
      |3|3|
      |4|4|

   1. `full outer join` is the union of two tables. For example, the query `select * from a FULL OUTER JOIN b on a.a = b.b` will generate the following table
      
      |a|b|
      |:-:|:-:|
      |1|null|
      |2|null|
      |3|3|
      |4|4|
      |null|5|
      |null|6|
1. In addition, `left join` is the same as `left outer join`, and `right join` is the same as `right outer join`.
1. A nice image illustration is given as the following 
![SQL join illustration]({{ site.url }}/myimages/hMKKt.jpg)

###`case` statement
1. `case` allows SQL query returns different values under different conditions.
1. If there is no conditions match then `Null` is returned.
1. `case` statement takes the following form

   	CASE WHEN condition1 THEN value1 
   		WHEN condition2 THEN value2  
   		ELSE def_value 
   	END
1. Example codes are given as the following where the third code is from the [sqlzoo](http://sqlzoo.net/wiki/CASE).
{%highlight SQL%}
select name,
case when dept=1 or dept=2 then 'Sci' else 'Art' end
from teacher
{%endhighlight%}
{%highlight SQL%}
SELECT id,mdate m2,team2,
  CASE WHEN teamid=team2 THEN 1 ELSE 0 END score2
  FROM game JOIN goal ON matchid = id
{%endhighlight%}
{%highlight SQL%}
SELECT name, population
      ,CASE WHEN population<1000000 
            THEN 'small'
            WHEN population<10000000 
            THEN 'medium'
            ELSE 'large'
       END
  FROM bbc
{%endhighlight%}

###`cast()` function
1. Use `cast()` function to transfer, e.g., `char` to `int`.
1. An example code is `ORDER BY CAST(thecolumn AS int)`.

###`concat()` function
1. `concat()` function is used to combine, e.g., two strings.
1. An example code of using `concat()` function is given as the following which is the solution to the fifth exercise in [sqlzoo](http://sqlzoo.net/wiki/SELECT_within_SELECT_Tutorial).
{%highlight SQL%}
select name, concat(round(population/(select population from world where name = 'Germany')*100),'%')
from world
where continent = 'Europe'
{%endhighlight%}


###`all` statement
1. `all` statement allows boolean operators `>`,`<`,`>=`,`<=` act on a set of numbers.
1. One can also apply `max()` or `min()` operators first on the set of numbers.
1. An example code is given as the following
{%highlight SQL%}
select name from world
where gdp >= all(select coalesce(gdp,0) from world where continent = 'Europe') and continent != 'Europe'
{%endhighlight%}

###Nested `select` statements
1. Variables in the outer `select` statement can be used in the inner `select` statement.
1. An example code is given as following which is the solution to the 7th exercises in [sqlzoo](http://sqlzoo.net/wiki/SELECT_within_SELECT_Tutorial).
{%highlight SQL%}
select continent, name,area
from world x
where area >= all
(select area from world y
where x.continent = y.continent and y.area > 0)
{%endhighlight%}

###`not exist` statement
1. The solution to the 9th exercises in [sqlzoo](http://sqlzoo.net/wiki/SELECT_within_SELECT_Tutorial).
{%highlight SQL%}
select name,continent,population
from world x
where not exists (
select *
from world y
where y.continent = x.continent and y.population> 25000000
)
{%endhighlight%}

###More about `in` statement
1. The expression `in` can be used as a value - it will be 0 or 1.
1. An example code is given as the following
{%highlight SQL%}
SELECT winner, subject, subject IN ('Physics','Chemistry') ord
  FROM nobel
 WHERE yr=1984
 ORDER BY ord,subject,winner
{%endhighlight%}




##Some good external references
1. Some of this post is based on a very good online tutorial and exercise available from [sqlzoo](http://sqlzoo.net/wiki/SELECT_basics).











