---
layout: post
title: "SQL related"
description: ""
category: Programming
tags: [SQL, LeetCode]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}

# SQL basics

# SQL query on Spark

Spark SQL guide is available from [Spark documentation](http://spark.apache.org/docs/latest/sql-programming-guide.html).

# External references

Here are some good external references for learning and practicing SQL, e.g., websites and online coding exercises.

## Online sources

1. Some of this post is based on a very good online tutorial and exercises available from [sqlzoo](http://sqlzoo.net/wiki/SELECT_basics).
1. [LeetCode SQL exercise](https://leetcode.com/problemset/database/) is yet another very good source to practice.

## LeetCode SQL coding exercises

The following LeetCode problems are order by their difficulties in which hard problems are discussed first and medium problems are then presented. However, I will not list all easy problems :laughing:

### Trips and Users [in LeetCode](https://leetcode.com/problems/trips-and-users/)
1. Date variable can be compared using `between...and`.
1. Use `round` for rounding.
1. Use `count(*)` followed by `group by` for line counting.
1. use `case when <> then <> else <> end` to compute and avoid the `null` cases

```sql
select T.Request_at,
round(sum(case when T.Status like 'can%' then 1 else 0 end)/count(*),2) as ratio
from Trips as T join Users as U on T.Client_Id = U.Users_Id
where U.banned = 'No' and U.Role = 'client' and T.Request_at between '2013-10-01' and '2013-10-03'
group by T.Request_at
```

### Department Top Three Salaries [in LeetCode](https://leetcode.com/problems/department-top-three-salaries/)
1. Count unique line is achieved with `count(distince [colname])`.
1. If ranking is required
   1. Absolute rank, join table with itself and count distinct line with `count(distinct [colname])...group by...`.
   1. Non-redudent rank, join table with itself and count line with `count([colname])...group by...`.

```sql
select Department.Name,tmp.name,tmp.s1
from 
(select e1.Departmentid id, e1.Name name, e1.Salary s1, count(distinct e2.Salary) rk
from Employee e1 join Employee e2 on e1.DepartmentId = e2.DepartmentId
where e1.Salary<=e2.Salary
group by e1.Name) tmp
join Department on tmp.id = Department.Id
where tmp.rk<=3
```

### Nth Highest Salary [in LeetCode](https://leetcode.com/problems/nth-highest-salary/)
1. Assign value to variable with e.g.,  `set n=n-1;`.
1. The N+1 th item can be obtained with `limit 1 offset N`.

```sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
set n=N-1;
RETURN (
select tmp.s1
from
(select distinct e1.Salary s1, count( e2.Salary) rk
from Employee e1 join Employee e2
where e1.Salary<=e2.Salary
group by e1.Id)tmp
order by tmp.rk
limit 1 offset n 
  );
END
```

### Rank Score [in LeetCode](https://leetcode.com/problems/rank-scores/)
1. This problem is to assign ranks to values.
1. The solution is to join the table with itself.
1. Distinct rank is not to use `distinct` in `count()`.
1. Non-redundant rank is to use `distinct` in `count()`.
1. Remember to use `group by` and `order by`. 

```sql
select s1.Score, count(distinct s2.Score) as rk
from Scores s1 join Scores s2
where s1.Score<=s2.Score
group by s1.Id
order by rk
```

### Consecutive Numbers [in LeetCode](https://leetcode.com/problems/consecutive-numbers/)
1. The key is to join the table with itself.
1. Consecutive is realized by adding constraints on IDs.

```sql
select distinct l1.Num
from Logs l1 join Logs l2 on l1.Id+1 = l2.Id
join Logs l3 on l2.Id+1 = l3.Id
where l1.Num = l2.Num and l2.Num=l3.Num
```

### Department Highest Salary [in LeetCode](https://leetcode.com/problems/department-highest-salary/)
1. The key is to join the table with itself.
1. 'count' the value of the column in the second table `group by` the corresponding column of the first table.

```sql
select d.Name, tmp.Name, tmp.Salary
from Department d join
(select e1.Name, e1.Salary, count(distinct e2.Salary) as ct, e1.DepartmentId
from Employee e1 join Employee e2 
where e1.DepartmentId = e2.DepartmentId and e1.Salary<=e2.Salary
group by e1.Id) tmp
on tmp.DepartmentId = d.Id
where tmp.ct = 1
```

### Delete Duplicate Email [in LeetCode](https://leetcode.com/problems/delete-duplicate-emails/)
1. The table to be operated on cannot be used in `where` clause.
1. Use e.g., `min()` or `max()` functions followed by `group by`

```sql
delete from Person
where Person.Id not in
(select * from (select min(Id) from Person group by Email)tmp)
```

