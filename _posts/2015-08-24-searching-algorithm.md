---
layout: post
title: "Searching Algorithm"
description: ""
category: Programming
tags: [Search,LeetCode]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}

# Binary Search

### Lowest Common Ancestor of a Binary Search Tree [in LeetCode](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)
1. Searching an item in a binary search tree is O(logn).
1. The solution to the problem is given as the following
{%highlight python linenos%}
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None
class Solution:
    # @param {TreeNode} root
    # @param {TreeNode} p
    # @param {TreeNode} q
    # @return {TreeNode}
    def lowestCommonAncestor(self, root, p, q):
        ppath = get_path(root,p)
        qpath = get_path(root,q)
        f = False
        for i in xrange(min(len(ppath),len(qpath))):
            print i,ppath[i].val,qpath[i].val
            if ppath[i] != qpath[i]:
                f = True
                break
        if f: return ppath[i-1]
        else: return ppath[i]
def get_path(root,p):
    path = []
    while True:
        if root.val == p.val:
            path.append(root)
            break
        elif root.val > p.val:
            path.append(root)
            root = root.left
        elif root.val < p.val:
            path.append(root)
            root = root.right
    return path
{%endhighlight%}

###Search insert position [in LeetCode](https://leetcode.com/problems/search-insert-position/)
1. Time complexity for binary search is O(logN).
1. The solution is given as the following
{%highlight python linenos%}
class Solution:
    # @param {integer[]} nums
    # @param {integer} target
    # @return {integer}
    def searchInsert(self, nums, target):
        if len(nums) == 0: return 0
        elif len(nums) == 1:
            if nums[0]>=target: return 0
            else: return 1
        else:
            return BinarySearch(nums,0,target)
def BinarySearch(nums,pos,target):
    print nums,pos,len(nums)/2
    '''
    binary serach to return a position in O(logN)
    '''
    if len(nums) == 1:
        if nums[0]>=target: return pos
        else: return pos+1
    #
    i = len(nums)/2
    if nums[i] == target: return pos+i
    elif nums[i] > target: return BinarySearch(nums[:i],pos,target)
    else: return BinarySearch(nums[i:],pos+i,target)
    pass
{%endhighlight%}

###Sqrt(x) [in LeetCode](https://leetcode.com/problems/sqrtx/)
1. The question can be reduced into a binary search problem.
1. In particular, we should search for a base number within the range.
1. The time complexity of finding the base number is O(logN)
1. The solution is given as the following
{%highlight python linenos%}
class Solution:
    # @param {integer} x
    # @return {integer}
    def mySqrt(self, x):
        return solution(x)
def solution(x):
    if x == 0: return x
    if x <= 3: return 1
    i,j = 1,x
    while True:
        if i**2 == x: return i
        if j**2 == x: return j
        if i**2 < x and j**2 > x and j-i == 1: return i
        m = i+(j-i)/2
        print i,j,m
        if m**2 == x: return m
        if m**2 > x: i,j = i,m
        if m**2 < x: i,j = m,j        
    pass
{%endhighlight%}


###Pow(x,n) [in LeetCode](https://leetcode.com/problems/powx-n/)

1. The problem uses recursion approach.
1. The number of multiplication operation is O(logN).

###Minimum Size Subarray Sum [in LeetCode](https://leetcode.com/problems/minimum-size-subarray-sum/)

1. Given an array of n positive integers and a positive integer s, find the minimal length of a subarray of which the sum ≥ s. If there isn't one, return 0 instead.

