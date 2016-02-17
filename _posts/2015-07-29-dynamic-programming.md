---
layout: post
title: "Dynamic programming related problems"
description: ""
category: Programming
tags: [Algorithm, LeetCode]
---
{% include JB/setup %}

Here are some interesting algorithmic problems related to dynamic programming

### [Maximal Square](https://leetcode.com/problems/maximal-square/)
- Given a 2D binary matrix filled with 0's and 1's, find the largest square containing all 1's and return its area.
- The problem can be formulated as a DP problem where in each step we compute the value of matrix[i][j] by analyzing other three values in its block (matrix[i-1][j-1],matrix[i][j-1],matrix[i-1][j]).
- A Python solution is given as the following
```python
class Solution:
    # @param {character[][]} matrix
    # @return {integer}
    def maximalSquare(self, matrix):
        '''
        54-18: 24 -> think about dp
        18-32: 14 -> code dp
        '''
        return solution(matrix)
def solution(matrix):
    newmatrix = []
    for item in matrix:
        newmatrix.append(list(item))
    matrix = newmatrix
    if len(matrix) == 0: return 0
    matrix[0][0] = eval(matrix[0][0])
    res = matrix[0][0]
    # first line
    m,n = len(matrix),len(matrix[0])
    i=0
    for j in xrange(1,n):
        matrix[i][j] = eval(matrix[i][j])
        if matrix[i][j] > res: res = matrix[i][j]
    j=0
    for i in xrange(1,m):
        matrix[i][j] = eval(matrix[i][j])
        if matrix[i][j] > res: res = matrix[i][j]
        
    for i in xrange(1,m):
        for j in xrange(1,n):
            matrix[i][j] = eval(matrix[i][j])
            if matrix[i][j] == 0:
                continue
            else:
                curlist = [ matrix[i-1][j-1],matrix[i-1][j],matrix[i][j-1] ]
                if min(curlist) == 0:
                    continue
                else:
                    matrix[i][j] = matrix[i][j] + min(curlist)
                    if matrix[i][j] > res:
                        res = matrix[i][j]
    if len(matrix) == 2: print matrix 
    return res**2
```
