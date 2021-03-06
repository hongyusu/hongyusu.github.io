---
layout: amt-post
title: "Documentation and test modules for Python"
description: ""
category: Programming
tags: [Test, Python]
---
 
This article is dedicated to discuss Python documentation and test modules.

# Table of content
* auto-gen TOC:
{:toc}


# Code

- Complete Python code for the following content can be found from my [Github](https://github.com/hongyusu/TeaserSolution/blob/master/solution_with_unittest.py).
- The code is designed for solving the [Teaser challenge](http://www.hongyusu.com/programming/2015/10/29/teaser-solution/).


# Documentation 

## `pydoc` module

### Write documentation

- `pydoc` module will generate a `man`-like documentation for Python functions.
- To write documentation just use a commented test after the function definition as shown in the following code

  ```python
  def dist(x1,y1, x2,y2, x3,y3):
  '''
  compute distance from a point to line segment
  x3,y3 is the point
  perform the following test
  >>> dist(-7.83434151195,17.378188238,-17.5348765366,0.375603802,-0.0,0.0)
  15.416540040627943
  '''
  px = x2-x1
  py = y2-y1
  something = px*px + py*py
  u =  ((x3 - x1) * px + (y3 - y1) * py) / float(something)
  if u > 1:
    u = 1
  elif u < 0:
    u = 0
  x = x1 + u * px
  y = y1 + u * py
  dx = x - x3
  dy = y - y3
  dist = math.sqrt(dx*dx + dy*dy)
  return dist
  ```

- It also allows documentation for classes as shown in the following code

  ```python
  class TestMethods(unittest.TestCase):
  '''
  class to define a set of unit test with Python unittest module
  '''
  def test_dist(self):
    '''
    test the function dist()
    '''
    self.assertEqual(dist(-7.83434151195,17.378188238,-17.5348765366,0.375603802,-0.0,0.0), 15.416540040627943)
  def test_GPS2POS(self):
    '''
    test GPS2POS function
    '''
    self.assertEqual(GPS2POS((52.516288,13.377689)), (-6.48982764810209, 9.159322471000536))
  pass
  ```

### Generate documentation

- When finishing writing the documentation for the delivered functions, the document of the function can be seen with the following command in the command line.

  ```bash
  pydoc solution
  ```

- The documentation of the function will print on the screen.

  ```bash
Help on module solution:

NAME
    solution

FILE
    /Users/su/GitHub/tmpSolution/solution.py

DESCRIPTION
    Python script to solve the teaser puzzle from Zalando
    document for this script can be generate with $pydoc solution
    unit text for this script can be triggled with $python solutin.py -v

CLASSES
    unittest.case.TestCase(__builtin__.object)
        TestMethods

    class TestMethods(unittest.case.TestCase)
     |  class to define a set of unit test with Python unittest module
     |  
     |  Method resolution order:
     |      TestMethods
     |      unittest.case.TestCase
     |      __builtin__.object
     |  
     |  Methods defined here:
     |  
     |  test_GPS2POS(self)
     |      test GPS2POS function
     |  
     |  test_dist(self)
     |      test the function dist()
     |  
     |  ----------------------------------------------------------------------
     |  Methods inherited from unittest.case.TestCase:
     |  
     |  __call__(self, *args, **kwds)

FUNCTIONS
    GPS2POS((lat, lng))
        transform from GPS to coordinate system (POS)
        perform the following test:
        >>> GPS2POS((52.516288,13.377689))
        (-6.48982764810209, 9.159322471000536)

    POS2GPS((x, y))
        transform from coordinate system (POS) to GPS

    compute_joint_probability(ss, gatePOS, satellitePOS, riverPOS)
        compute joint probability of all point in the search space

    dist(x1, y1, x2, y2, x3, y3)
        compute distance from a point to line segment
        x3,y3 is the point
        perform the following test
        >>> dist(-7.83434151195,17.378188238,-17.5348765366,0.375603802,-0.0,0.0)
        15.416540040627943

    find_her()
        the function is designed to output locations and probabilities

    plot_res(res)

    prob_gate(pointPOS, gatePOS)
        compute probability according to lognormal distribution base on gate

    prob_river(pointPOS, riverPOS)
        compute probability according to Gaussian distribution base on river

    prob_satellite(pointPOS, satellitePOS)
        compute probability according to Gaussian distribution for satellite

    save_probability(res)
        save probability to file

    show_result(res)
        show results on google map

    transformation(riverGPS, satelliteGPS, gateGPS, startGPS, stopGPS)
        wrapper function to transform the distance from GPS to locations POS

DATA
    __author__ = 'Hongyu Su'
    __else__ = 'other information can be documented here'
    __version__ = '1.0'
    gateGPS = (52.516288, 13.377689)
    lognorm = <scipy.stats._continuous_distns.lognorm_gen object>
    norm = <scipy.stats._continuous_distns.norm_gen object>
    riverGPS = [(52.529198, 13.274099), (52.531835, 13.29234), (52.522116,...
    satelliteGPS = [(52.590117, 13.39915), (52.437385, 13.553989)]
    startGPS = (52.434011, 13.274099)
    stopGPS = (52.564011, 13.554099)

VERSION
    1.0

AUTHOR
    Hongyu Su
  ```

# Unit test

This brings an old topic of test-driven development (TDD) which is to design a software/function/programme starting with writing test case. After that write the expected outcome of the test case. Finally, implement the functionalities to pass the test case.

## `doctest` module

### Build test case

- `doctest` module is a Python builtin which allows building test case into the source code, in particular documentation, of the function. 
- Import the `doctest` module into your script with the following code `import doctest`.
- Each line in documentation part of the source code starting with `>>>` will run as if under the interactive Python shell, which is counted as a test case.
- The return from the test case should match exactly the following line written in the documentation part of the Python code.
- For example, the following code will compute the shortest distance of a point to a line segment, and a test case is written into the documentation part of the code.

  ```python
  def dist(x1,y1, x2,y2, x3,y3):
  '''
  compute distance from a point to line segment
  x3,y3 is the point
  perform the following test
  >>> dist(-7.83434151195,17.378188238,-17.5348765366,0.375603802,-0.0,0.0)
  15.416540040627943
  '''
  px = x2-x1
  py = y2-y1
  something = px*px + py*py
  u =  ((x3 - x1) * px + (y3 - y1) * py) / float(something)
  if u > 1:
    u = 1
  elif u < 0:
    u = 0
  x = x1 + u * px
  y = y1 + u * py
  dx = x - x3
  dy = y - y3
  dist = math.sqrt(dx*dx + dy*dy)
  return dist 
  ```

- In particular, this is a test case in the code which compute the distance with function `dist(-7.83434151195,17.378188238,-17.5348765366,0.375603802,-0.0,0.0)` with expected return value `15.416540040627943`.

### Run test case

- There are two ways to run the test case
- To enable the test, add `doctest.testmod()` to the Python script. For example, in my code it looks like 

  ```python
  if __name__ == '__main__':
  '''
  __name__ to make sure the function be excuted when used as a script not as a loaded module
  '''
  # doc test
  doctest.testmod()

  # unit test
  unittest.main()

  # run actual code
  find_her() 
  pass
  ```

  Then run the test with the following command

  ```bash
  python solution.py -v
  ```

  The command line argument `-v` will enable verbosity output which print detail information of the test. As mentioned already, this requires adding the above `doctest.testmod()` into your code.

- As alternative, the test can be perform with the following command

  ```bash
  python -m doctest -v solution.py
  ```

  This is more flexible and does not need to add the above `doctest.testmod()` into your code.

- The above command will generate the following information printed to the screen. Oh I have another function `GPS2POS` under test as well.

  ```bash
Trying:
    GPS2POS((52.516288,13.377689))
Expecting:
    (-6.48982764810209, 9.159322471000536)
ok
Trying:
    dist(-7.83434151195,17.378188238,-17.5348765366,0.375603802,-0.0,0.0)
Expecting:
    15.416540040627943
ok
14 items had no tests:
    __main__
    __main__.POS2GPS
    __main__.TestMethods
    __main__.TestMethods.test_GPS2POS
    __main__.TestMethods.test_dist
    __main__.compute_joint_probability
    __main__.find_her
    __main__.plot_res
    __main__.prob_gate
    __main__.prob_river
    __main__.prob_satellite
    __main__.save_probability
    __main__.show_result
    __main__.transformation
2 items passed all tests:
   1 tests in __main__.GPS2POS
   1 tests in __main__.dist
2 tests in 16 items.
2 passed and 0 failed.
Test passed.
  ```

- Another nice thing about `doctest` is that you can write you test code separately into a txt file and perform the test with `python -m doctest -v txtfilefortest.txt`.


## `unittest` module

Python unit test module `unittest` is sometimes referred as PyUnit. There are a few concept closely related to the `unittest` module, including

- Test fixture, to perform preparation and cleanup actions
- Test Case, to test a functionality of the code
- Test suite, to combine multiple test case
- Test runner, to execute test

The work flow of performing a unit test with `unittest` is 

- Build up class for test derived from `unittest` class.
- Write test function with name starts with `test_`.

### Build test cases

- Build up a class for test by defining a class and test functions

  ```python
  class TestMethods(unittest.TestCase):
  '''
  class to define a set of unit test with Python unittest module
  '''
  def test_dist(self):
    '''
    test the function dist()
    '''
    self.assertEqual(dist(-7.83434151195,17.378188238,-17.5348765366,0.375603802,-0.0,0.0), 15.416540040627943)
  def test_GPS2POS(self):
    '''
    test GPS2POS function
    '''
    self.assertEqual(GPS2POS((52.516288,13.377689)), (-6.48982764810209, 9.159322471000536))
  pass
  ```

- Basically, the test use a variety of `assert` arguments shown in the following table

  |Method | Checks that | 
  |:--|--:|
  |assertEqual(a, b)	|a == b	 
  |assertNotEqual(a, b)	|a != b	 
  |assertTrue(x)	     |   bool(x) is True	 
  |assertFalse(x)	      |  bool(x) is False	 
  |assertIs(a, b)	  |      a is b	
  |assertIsNot(a, b)|	    a is not b
  |assertIsNone(x)	 |       x is None
  |assertIsNotNone(x)|	    x is not None
  |assertIn(a, b)	  |      a in b	
  |assertNotIn(a, b)|	    a not in b	
  |assertIsInstance(a, b)	|isinstance(a, b)
  |assertNotIsInstance(a, b)|	not isinstance(a, b)

### Run test

- Add `unittest.main()` to your Python script. For example, my code looks like the following.

  ```python
  if __name__ == '__main__':
  '''
  __name__ to make sure the function be excuted when used as a script not as a loaded module
  '''

  # doc test
  print "------------------- doctest -------------------"
  doctest.testmod()

  # unit test
  print "------------------- unittest -------------------"
  unittest.main()

  print "--------------- unittest fine tuned ------------"
  suite = unittest.TestSuite()
  suite.addTest(TestMethods('test_dist'))
  suite.addTest(TestMethods('test_GPS2POS'))
  unittest.TextTestRunner(verbosity=2).run(suite)

  # run actual code
  find_her() 
  pass
  ```

- With command `python solution.py -v` all test defined in the class `TestMethods` will be executed and functions returns when all tests finished (without the rest of the function being executed). 
- This can be avoided by defining a test suite with the following commands.

  ```python
  suite = unittest.TestSuite()
  suite.addTest(TestMethods('test_dist'))
  suite.addTest(TestMethods('test_GPS2POS'))
  unittest.TextTestRunner(verbosity=2).run(suite)
  ```

- The test suite will run all test defined within the suite and continue with the rest of the code when tests are done. The test will generate the following information printed on the screen.

  ```bash
  test_dist (__main__.TestMethods) ... ok
  test_GPS2POS (__main__.TestMethods) ... ok
  ```

- As a alternative to `main` function and test suite, test functions defined in unit test class can be executed from command line directly.

  ```bash
guest37:tmpSolution su$ python -m unittest -v solution.TestMethods.test_dist
test_dist (solution.TestMethods) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
guest37:tmpSolution su$ python -m unittest -v solution.TestMethods.test_GPS2POS
test_GPS2POS (solution.TestMethods) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
guest37:tmpSolution su$ python -m unittest -v solution.TestMethods
test_GPS2POS (solution.TestMethods) ... ok
test_dist (solution.TestMethods) ... ok

----------------------------------------------------------------------
Ran 2 tests in 0.000s

OK
  ```

### Other functionalities

- Run unit test with `unittest` for files with suffix `.py` in the directory with the following command.

  ```bash
  $ python -m unittest discover -v -p *py
  ```

- `setup` and `teardown` methods.

## `nose` module

`nose` is a third party module which does not come by default with Python. An installation is required. However, I don't think I manage to install the package. But `nose` is at least working well for some basic test cases.

### Write test case

The test case for `nose` is quite similar as `unittest` but is much simpler. I don't need to define classes. Just go straight forwards to write a test function. The function that implemented the same test case as described above can be coded simply as the following.

  ```python
def test_dist():
  '''unit test with nose'''
  assert dist(-7.83434151195,17.378188238,-17.5348765366,0.375603802,-0.0,0.0) == 15.416540040627943
  pass

def test_GPS2POS():
  '''unit test with nose'''
  assert GPS2POS((52.516288,13.377689)) == (-6.48982764810209, 9.159322471000536)
  pass
  ```

### Run test

- With the following command, we can run a unit test built with `nose`. The command can also run unit test coded with `unittest`.

```bash
nosetests -v solution.py
```

The command line argument `-v` is same as before which is to print detailed test information on screen. The result is shown as the follows.

```bash
test GPS2POS function ... ok
test the function dist() ... ok
unit test with nose ... ok
unit test with nose ... ok

----------------------------------------------------------------------
Ran 4 tests in 0.002s

OK
```

There are 4 tests in total in which the first two tests are built with `unittest` and the last two tests are built with `nose`.

- Use the following command to run all tests in a folder `nosetest -v *test.py`.

### `setup` and `teardown` functions in `nose`

- With `nose`, the setup and teardown functionalities can be implemented with simple Python function calls with prefix `setup_` and `teardown_`. They are applied to test by calling a decorator `@with_setup(setup_func,teardown_func)`.
- The following Python code implements a simple test with `setup` and `teardown` functionalities to initialize and destroy a global variable for the unit test.

  ```python
from nose.tools import *
#--------------------- test with nose: decorator ---------------------------
_globals = {'tmpPoint':None}

def setup_test_GPS2POS():
  _globals['tmpPoint'] = (52.516288,13.377689)
  pass

def teardown_test_GPS2POS():
  _globals['tmpPoint'] = None
  pass

@with_setup(setup_test_GPS2POS,teardown_test_GPS2POS)
def test():
  tmpPoint = _globals['tmpPoint']
  assert GPS2POS(tmpPoint) == (-6.48982764810209, 9.159322471000536)
  ```

### Other functionalities with `nose`

- See [a complete collection of `nose` plugins](http://nose.readthedocs.org/en/latest/plugins/builtin.html). In particular, there are several interesting plugins
  - Run doctest with `nose`, `nosetests --with-doctest -v solution_with_unittest`
  - Profile code coverage with `nosetests --with-doctest --with-coverage -v solution_with_unittest`. The command will cover all Python modules imported after the code has been executed. 


# External references

- [Beginning test-driven development in Python](http://code.tutsplus.com/tutorials/beginning-test-driven-development-in-python--net-30137)
- [Official Python document for `unittest`](https://docs.python.org/2/library/unittest.html)
- [Documentation for `nose` package](http://nose.readthedocs.org/en/latest/writing_tests.html)
- [Doctest introduction](http://pythontesting.net/framework/doctest/doctest-introduction/) is a tutorial about `pydoc` package to do unit test.
- [Pytest introduction](http://pythontesting.net/framework/pytest/pytest-introduction/#no_boilerplate) is a tutorial about `unittest` module to to unit test
- [Nose introduction](http://pythontesting.net/framework/nose/nose-introduction/#example) is a tutorial `nose` package for unit test.











