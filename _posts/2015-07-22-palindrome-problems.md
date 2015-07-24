---
layout: post
title: "Palindrome problems"
description: ""
category: algorithm
tags: [Algorithm, Palindrome]
---

{% include JB/setup %}

### [Palindrome partitioning](https://leetcode.com/submissions/detail/33825539/)
1. Given a string s, partition s such that every substring of the partition is a palindrome.
1. Solution is given as the following
{%highlight python%}
class Solution:
    # @param {string} s
    # @return {string[][]}
    def partition(self, s):
        res = []
        solution(s,[],res)
        return res
def solution(s,path,res):
    if len(s)==0:
        res.append(path)
    else:
        for i in xrange(len(s)):
            cur_s = s[:i+1]
            if cur_s == cur_s[::-1]:
                solution(s[i+1:],path + [cur_s],res)
{%endhighlight%}