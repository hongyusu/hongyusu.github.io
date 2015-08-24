---
layout: post
title: "BFS and DFS"
description: ""
category: Programming 
tags: [programming, algorithm, DFS, BFS, searching]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}

# Depth First Search (DFS)

### Recovery Binary Search Tree [in LeetCode](https://leetcode.com/problems/recover-binary-search-tree/)
1. I still need to figure out a solution with O(1) space.
1. Current solution first traverses the binary search tree with inorder traversal, and analyze the generated array of numbers. It identifies two numbers which are in wrong position and swap those numbers.
1. The time complexity of the current solution is O(n). 
1. In addition, another O(n) space is required to store the generated list of numbers.
1. An example Python code is given as the following
{% highlight python linenos %}
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None
class Solution(object):
    def recoverTree(self, root):
        """
        :type root: TreeNode
        :rtype: void Do not return anything, modify root in-place instead.
        """
        res = []
        solution(root,res)
        if len(res) == 2:  
            res[0][1].val,res[1][1].val = res[1][1].val,res[0][1].val
        else:
            m,n = None,None
            for i in range(1,len(res)):
                if res[i][0]<res[i-1][0]:
                    if m == None:
                        m = i-1
                        n=i
                    else:
                        n=i
                        break
            print m,n
            res[m][1].val,res[n][1].val = res[n][1].val,res[m][1].val    
def solution(root,res):
    if root.left == None and root.right == None :
        res.append((root.val,root))
        return
    if root.left != None:
        solution(root.left,res)
    res.append((root.val,root))
    if root.right != None:
        solution(root.right,res)
    pass
{% endhighlight %}

### Binary Tree Maximum Path Sum [in LeetCode](https://leetcode.com/problems/binary-tree-maximum-path-sum/)
1. An example Python code is given as the following
{% highlight python linenos %}
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None
class Solution(object):
    def maxPathSum(self, root):
        def solution(node):
            if node == None : return [-2**31]*2
            left  = solution(node.left)
            right = solution(node.right)
            return [node.val + max(left[0],right[0],0),max(left+right+[node.val+left[0]+right[0]])]
        return max(solution(root))
{% endhighlight %}

### Flatten Binary Tree to Linked List [in LeetCode](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/)
1. The flatten binary tree corresponds to preorder traversal of the original binary tree.
1. An example Python code is given as the following
{% highlight python linenos %}
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None
class Solution(object):
    def flatten(self, root):
        """
        :type root: TreeNode
        :rtype: void Do not return anything, modify root in-place instead.
        """
        solution(root)
def solution(root):
    if root == None : return None
    candidates = []
    if root.left != None : candidates.append(root.left)
    if root.right != None : candidates.append(root.right)
    p = root
    while len(candidates) >0:
        node = candidates.pop(0)
        if node.right != None : candidates = [node.right] + candidates
        if node.left != None : candidates = [node.left] + candidates
        p.left = None
        p.right = node
        p = p.right
    pass
{% endhighlight %}

### Construct Binary Tree from Inorder and Postorder Traversal [in LeetCode](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)
1. The trick is to realize the last item in the postorder traversal is the root node of the subtree.
1. The solution use recursion.
1. An example Python code is given as the following
{% highlight python linenos %}
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None
class Solution(object):
    def buildTree(self, inorder, postorder):
        """
        :type inorder: List[int]
        :type postorder: List[int]
        :rtype: TreeNode
        """
        return solution(inorder,postorder)
def solution(inorder, postorder):
    if len(inorder) == 0 : return None
    index = inorder.index(postorder.pop())
    root = TreeNode(inorder[index])
    root.right = solution(inorder[index+1:],postorder)
    root.left  = solution(inorder[:index],postorder)
    return root
{% endhighlight %}

### Construct Binary Tree from Preorder and Inorder Traversal [in LeetCode](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
1. The trick is to realize the first element of the preorder traversal is the root node of the subtree.
1. The solution uses recursion.
1. An example Python code is given as the following
{% highlight python linenos %}
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None
class Solution(object):
    def buildTree(self, preorder, inorder):
        """
        :type preorder: List[int]
        :type inorder: List[int]
        :rtype: TreeNode
        """
        if len(inorder) == 0: return None
        return solution(preorder,inorder)
def solution(preorder,inorder):
    if not inorder: return None
    ind = inorder.index(preorder.pop(0))
    root = TreeNode(inorder[ind])
    root.left  = solution(preorder,inorder[:ind])
    root.right = solution(preorder,inorder[ind+1:])
    return root
    pass
{% endhighlight %}

# Breadth First Search (BFS)

### Clone Graph [in LeetCode](https://leetcode.com/problems/clone-graph/)
1. The trick is to build two dictionaries one maps from node label to node object, the other maps from node label to neighbor labels. Once two dictionaries are built, one connect the objects from the first dictionary using the information from the second dictionary.
1. _BFS_ is used to acquire all neighbors of a particular node. 
1. An example Python solution is given as the following:
{% highlight python linenos %}
# Definition for a undirected graph node
# class UndirectedGraphNode(object):
#     def __init__(self, x):
#         self.label = x
#         self.neighbors = []
class Solution(object):
    def cloneGraph(self, node):
        """
        :type node: UndirectedGraphNode
        :rtype: UndirectedGraphNode
        """
        return solution(node)
def solution(root):
    if root == None : return root
    candidates = [root]
    i2n = {}
    n2nb = {}
    while candidates:
        nextcandidates = []
        for node in candidates:
            if node.label not in n2nb:
                n2nb[node.label] = []
                i2n[node.label] = UndirectedGraphNode(node.label)
                for nb in node.neighbors:
                    if nb not in n2nb: nextcandidates.append(nb)
                    n2nb[node.label].append(nb.label)
        candidates = nextcandidates
    for node in n2nb:
        for nb in n2nb[node]:
            i2n[node].neighbors.append(i2n[nb])
    return i2n[root.label]
{% endhighlight %}

### Course Schedule [in LeetCode](https://leetcode.com/problems/course-schedule/)
1. The solution heuristics is to
   1. Build a directed graph based on the course dependency.
   1. Traverse the graph from root to leaves and remove a node from the graph if all its parents have been visited.
   1. Return `False` when there exist nodes that cannot be removed.
1. It is worth noting that the directed graph is represented as a link list implemented by Python `dictionary`. Therefore, it is easy to make update the number of parents for each node when a node is removed from the graph.
1. An example Python solution is given as the following:
{% highlight python linenos %}
class Solution(object):
    def canFinish(self, numCourses, prerequisites):
        """
        :type numCourses: int
        :type prerequisites: List[List[int]]
        :rtype: bool
        """
        return solution(numCourses, prerequisites)
def solution(N,pairs):
    pCount = [0 for i in range(N)]
    p2c = {}
    for i in range(N) : p2c[i] = []
    for i in range(len(pairs)):
        p2c[pairs[i][1]].append(pairs[i][0])
        pCount[pairs[i][0]]+=1
    availableNodes = set([i for i in range(N)])
    while availableNodes:
        freeNodes = set()
        for node in availableNodes:
            if pCount[node] == 0:
                freeNodes.add(node)
        if len(freeNodes) == 0 : return False
        availableNodes = availableNodes - freeNodes
        for node in freeNodes:
            for c in p2c[node]:
                pCount[c]-=1
    return True
{% endhighlight %}

### Course Schedule II [in LeetCode](https://leetcode.com/problems/course-schedule-ii/)
1. Build a dependency graph (direct graph) where pre-requisitions are parents and following courses are children.
1. Traverse the graph from root to leaves and pop a node to the result when all its parents are visited.
1. Return an empty array if there are nodes remained in the graph with unvisited parents. 
1. An example Python solution is given as the following:
{% highlight python linenos %}
class Solution:
    # @param {integer} numCourses
    # @param {integer[][]} prerequisites
    # @return {integer[]}
    def findOrder(self, numCourses, prerequisites):
        return solution(numCourses,prerequisites)
def solution(N,pairs):
    # special cases
    if not pairs:
        return [i for i in range(N)]
    # normal cases
    ## build a adj matrix
    p2c = [[0 for i in range(N)] for j in range(N)];
    pCount = [0 for i in range(N)]
    for i in range(len(pairs)):
        if p2c[pairs[i][1]][pairs[i][0]] == 0:
            p2c[pairs[i][1]][pairs[i][0]] = 1
            pCount[pairs[i][0]] += 1
    availNodes = set([i for i in range(N)])
    # process
    res = []
    while availNodes:
        parents = []
        if N==10 : print pCount
        for node in availNodes:
            if pCount[node] == 0 : parents.append(node)
        if N==10 : print res
        if len(parents)>0:
            res.extend(parents)
        else:
            return []
        availNodes = availNodes - set(parents)
        for node in parents:
            for k in range(N):
                if p2c[node][k]==1:
                    pCount[k] -=1
                    p2c[node][k] =0
    return res
{% endhighlight%}

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

### Word Ladder II [in LeetCode](https://leetcode.com/problems/word-ladder-ii/)
1. The solution is similar as [Word Ladder](https://leetcode.com/problems/word-ladder/).
1. In stead of double end _BFS_, we  only do _breadth first search_ from the head. Meanwhile, we maintain a dictionary to store all paths up to current word.
1. Keep in mind the we can use `union` operation on `set` object.
1. An example Python solution is shown as the following
{% highlight python linenos %}
class Solution(object):
    def findLadders(self, start, end, dict):
        """
        :type start: str
        :type end: str
        :type dict: Set[str]
        :rtype: List[List[int]]
        """
        return solution(start,end,dict)
import string
def solution(start,end,words):
    # special cases
    ct = 0
    for i in range(len(start)):
        if start[i] != end[i]: ct+=1
    if ct == 1: return [[start,end]]
    # normal cases
    head = [start]
    words.discard(start)
    d = {start:[[start]]}
    while head:
        valid = []
        newd = {}
        for word in head:
            for i in range(len(end)):
                for c in string.ascii_lowercase:
                    newword = word[:i] + c + word[i+1:]
                    if newword in words:
                        valid.append(newword)
                        val = (l+[newword] for l in d[word])
                        if not newword in newd: newd[newword] = []
                        newd[newword].extend(val)
        if set(valid)&set([end]):
            return newd[end]
        else:
            head = set(valid)
            d = newd
            words = words-head
    return []
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


