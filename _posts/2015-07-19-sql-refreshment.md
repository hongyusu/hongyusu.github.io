---
layout: post
title: "SQL refreshment"
description: ""
category: Programming 
tags: [programming, SQL]
---
{% include JB/setup %}

##Good references
1. A very good online tutorial and exercise is available from [sqlzoo](http://sqlzoo.net/wiki/SELECT_basics).

##Some brief overview of the laugange

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
1. An example code is given as the following:

{%highlight SQL%}
select employee_id, salary, department, firstname, lastname
from empinfor
where firstname in ('John', 'Bob', 'William')
and (salary between 2000 and 5000)
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




















   