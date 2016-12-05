---
layout: imt-post
title: "Some useful Coding techniques"
description: ""
category: Programming
tags: [GitHub, Python]
---
Some useful Coding techniques

# Table of content
* auto-gen TOC:
{:toc}

#Git

###Remove bad commit from remote
- Move head to the good commit `git reset --hard <good commit id>`
- Force push the good commit to git `git push origin HEAD --force`

###Revert to some previous commit
- Check all previous commits by `git log`
- Pick up a commit by commit code, e.g., 

	commit 955cd428160a6d61a260564b193b175ae26f43c2

- As a alternative, you can check the commit with commit id in GitHub webpage or client.
- Revert to the selected commit
```bash
git checkout 955cd428160a6d61a260564b193b175ae26f43c2
```

###Remove files from Git but keep local copies
- Check files that are tracked by Git
```bash
git ls-files
```

- Remove files from Git tracking system
```bash
git rm --cached filename
```

- Check the revision of the repository
```bash
git status
```

- Modify the tracked file list
```bash
git add -u
```

- Commit changes
```bash
git commit -m'commit message'
```

#Python

###Repeat a string
```python
'this is a string' * 100
```

###Sort a list `nums` and return index
```python
>>> nums=[1,2,3,4,2,2,1,2,3,2,1,2,3,4,5]
>>> ind = sorted(range(len(nums)), key = lambda x: nums[x])
```

###Iterate over a list with index and value
```python
for i,v in enumerate(mylist):
  print i,v
```

###Pair up value in lists
```python
for v1,v2 in zip(None,v1List,v2List):
  print v1,v2
```

###Product of lists
```python
import itertools
for v1,v2 in list(itertools.product(v1List,v2List))
  print v1,v2 
```

### `pop()`
1. `l.pop()` is to get and remove the last item from the list.
1. `l.pop(i)` is to get and remove the ith item from the list.
