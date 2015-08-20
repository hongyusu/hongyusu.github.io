---
layout: post
title: "BFS and DFS"
description: ""
category: 
tags: []
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}


# Breadth First Search

### Word Ladder [in LeetCode](https://leetcode.com/problems/word-ladder/)
1. The solution is by performing double end _breadth first search_ in which we search for all possible words from a small end to find out if the possible words include any word from the other end.
1. To check if two collections of words are overlap, we use union operation `&` of set.
1. The following solution is based on the [discussion](https://leetcode.com/discuss/48083/share-python-solutions-concise-160ms-optimized-solution-100ms)
{% highlight python linenos %}
class Solution(object):
    def ladderLength(self, beginWord, endWord, wordDict):
        """
        :type beginWord: str
        :type endWord: str
        :type wordDict: Set[str]
        :rtype: int
        """
        return solution(beginWord, endWord, wordDict)
import string
def solution(start,end,words):
    length = 2
    head,tail = set([start]), set([end])
    words.discard(start)
    while head:
        tmp = []
        for word in head:
            for i in range(len(end)):
                for c in string.ascii_lowercase:
                    tmp.append(word[:i]+c+word[i+1:])
        valid = words&set(tmp)
        if valid&tail: return length
        length+=1
        head = valid
        if len(head) > len(tail):
            tail,head = head,tail
        words-=head
    return 0
    pass
{% endhighlight %}

### Binary Tree Right Side View [in LeetCode](https://leetcode.com/problems/binary-tree-right-side-view/)
1. The heuristics for solving the problem is to perform the _breadth first search_ on the binary tree level by level. During the processing of the tree node, always first put the right child and then the left child.
1. An example Python solution is shown as the following.
{% highlight python linenos %}
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None
class Solution(object):
    def rightSideView(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        05
        """
        return solution(root)
def solution(root):
    if root == None: return []
    nodelist = [root]
    res = []
    while len(nodelist) >0:
        newnodelist = []
        res.append(nodelist[0].val)
        for node in nodelist:
            if node.right != None:
                newnodelist.append(node.right)
            if node.left != None:
                newnodelist.append(node.left)
        nodelist = newnodelist
    return res
    pass
{% endhighlight%}

# Union Find

Unior find is one type of problems where the goal is find a union of same objects from a region. The region is usually represented by a matrix. The strategy for the problems of this kind is to scan the item one by another and perform _breadth first search_ as soon as one special element is found. The _BFS_ will discovery the union of elements of same kind.

### Surrounded Region [in LeetCode](https://leetcode.com/problems/surrounded-regions/)

1. The heuristics is straight forward: apply _breadth first search_.
1. In particular, we scan the table and perform _BFS_ as soon as we find an 'O'. The _BFS_ will find the whole 'O' region. Then the whole region is flipped to 'X' if any element is on the boarder of the chess board.
1. An example python solution is shown as the following
{% highlight python linenos %}
class Solution:
    # @param {character[][]} board
    # @return {void} Do not return anything, modify board in-place instead.
    def solve(self, board):
        solution(board)
def solution(board):
    if len(board) < 3: return board
    for i in range(len(board)):
        for j in range(len(board[0])):
            if board[i][j] != 'O':
                continue
            nodelist = [(i,j)]
            board[i][j] = 'V'
            nodecollection = []
            flag = 1
            while len(nodelist) > 0:
                node = nodelist[0]
                if len(board) == 3:print flag,nodelist
                nodelist = nodelist[1:]
                nodecollection.append(node)
                # left
                if node[0]-1>=0:
                    if board[node[0]-1][node[1]] == 'V':
                        pass
                    elif board[node[0]-1][node[1]] == 'X':
                        pass
                    elif board[node[0]-1][node[1]] == 'O':
                        board[node[0]-1][node[1]] = 'V'
                        nodelist.append((node[0]-1,node[1]))
                else:
                    flag = 0
                # right
                if node[0]+1<len(board):
                    if board[node[0]+1][node[1]] == 'V':
                        pass
                    elif board[node[0]+1][node[1]] == 'X':
                        pass
                    elif board[node[0]+1][node[1]] == 'O':
                        board[node[0]+1][node[1]] = 'V'
                        nodelist.append((node[0]+1,node[1]))
                else:
                    flag = 0
                # up
                if node[1]-1>=0:
                    if board[node[0]][node[1]-1] == 'V':
                        pass
                    elif board[node[0]][node[1]-1] == 'X':
                        pass
                    elif board[node[0]][node[1]-1] == 'O':
                        board[node[0]][node[1]-1] = 'V'
                        nodelist.append((node[0],node[1]-1))
                else:
                    flag = 0
                # down
                if node[1]+1<len(board[0]):
                    if board[node[0]][node[1]+1] == 'V':
                        pass
                    elif board[node[0]][node[1]+1] == 'X':
                        pass
                    elif board[node[0]][node[1]+1] == 'O':
                        board[node[0]][node[1]+1] = 'V'
                        nodelist.append((node[0],node[1]+1))
                else:
                    flag = 0
                if len(board)==3:print nodelist
            if flag == 1:
                for node in nodecollection:
                    board[node[0]][node[1]] = 'X'
            if len(board) == 3:print board
    for i in range(len(board)):
        for j in range(len(board[0])):
            if board[i][j] == 'V':
                board[i][j] = 'O'
    pass
{% endhighlight %}


### Number of Islands [in LeetCode](https://leetcode.com/problems/number-of-islands/)
1. The strategy is to use _breadth first search_.
1. In particular, we scan the table and perform _BFS_ as soon as we find an `1`. The _BFS_ will find all `1` in the same island. Then we mark the island and continue to scan the table for other islands.
1. An example Python code is shown as the following
{% highlight python linenos %}
class Solution:
    # @param {character[][]} grid
    # @return {integer}
    def numIslands(self, grid):
        return solution(grid)
def solution(grid):
    '''
    42-05: 23
    '''
    if len(grid) == 0:
        return 0
    ct = 0
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] != '1': continue
            nodelist = [(i,j)]
            print nodelist
            ct += 1
            while len(nodelist) > 0:
                node = nodelist[0]
                if grid[node[0]][node[1]] == '2':
                    nodelist = nodelist[1:]
                    continue
                else:
                    grid[node[0]][node[1]] = '2'
                    nodelist = nodelist[1:]
                # right
                if node[0]+1<len(grid) and grid[node[0]+1][node[1]] == '1':
                    nodelist.append((node[0]+1,node[1]))
                # left
                if node[0]-1>=0 and grid[node[0]-1][node[1]] == '1':
                    nodelist.append((node[0]-1,node[1]))
                # down
                if node[1]+1<len(grid[0]) and grid[node[0]][node[1]+1] == '1':
                    nodelist.append((node[0],node[1]+1))
                # up
                if node[1]-1>=0 and grid[node[0]][node[1]-1] == '1':
                    nodelist.append((node[0],node[1]-1))
                #print node,nodelist
    return ct
    pass
{% endhighlight %}


