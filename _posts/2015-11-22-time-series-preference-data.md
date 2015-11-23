---
layout: post
title: "Time series preference data"
description: ""
category: Programming
tags: []
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}

# Permanent links

- Permanent links to this page [link](http://www.hongyusu.com/programming/2015/11/22/time-series-preference-data/).
- permanent links to code [link]().

# Coding

I would use Python for coding on top of Spark environment. Some Python packages involved which is also worth of mentioning are as follows.

- `numpy` for array and matrix operation.
- `pandas` for data preprocessing and machine learning model, e.g., random forest regression running on a single cpu core.
- `mllib`, Spark machine learning library for machine learning models e.g., collaborative filtering running parallel on Spark environment.
- `matplotlib` for plotting.
- `pyspark` Spark python context enabling python on Spark.

The reasons are

- It is essentially log data generated possibly from some streaming system e.g., Kafka. The example data file is small compared to the real situation. The preprocessing and learning should be able to scale on very large dataset. Therefore, the given task naturally requires framework like Spark or Hadoop.
- During the data preprocessing and exploration, a lot of operations are done based on key/value pairs. `MapReduce` heuristics will naturally optimize these key/value operations.
- Machine learning is also expected to be scalable on large scale data. Spark has a machine learning library with parallelized learning algorithms.

# Question 1

I would use collaborative filtering to impute missing values then random forest regression trained locally for each individual keyword. 

## Data exploration

### Overview

- There are 93 days. It seems there are logs available for each day.

  ||First day|Last day|
  |:--|--:|--:|
  |**Actual date**|2015-08-17| 2015-11-17|
  |**Index**|0|92|

- About 1.19% criterions are not unique to ad group meaning that keyword can be defined as `adgroup_id+criterion_id`. On the hand, 57.04% keywords are not unique to campaign meaning that we cannot combine `keyword_id` and `campaign_id`. Different campaigns share keywords.

- The histogram of the number of logs for campaign, keyword and date are shown in the following figure.

  ![photo]({{ site.url }}/myimages/campanja_frequency.png)

- The availability of logs in campaign/keyword/date is shown in the following figure. The figure demonstrates 
  - The date can be seen as a preference matrix of keywords on campaigns over time (time series preference matrix).
  - Different campaigns share keywords.
  - Data are very sparse.

  ![photo]({{ site.url }}/myimages/campanja_3dplot.png)

- Ideally, I would model the data in all these thress dimensions (campaign, keyword, time). However, due to the sparseness, I will collapse the campaign-keyword-time matrix to a keyword-time matrix by summing along the campaign dimension.
- In particular, I will work with the keyword-time matrix in the following part of the analysis.


### Behavior of an `average` keyword over time

- The following plot shows the global behavior (mean keyword) over time, averaged over `match_type` and the number of `click` for individual log.

  ![photo]({{ site.url }}/myimages/campanja_global1.png)

- There is some `heart beat` pattern in the plot above. However, the different between different `match_type` is quite small. Again, I would ideally model the data with different `match_type`. However, I would average over `match_type` due to the sparsness.
- The following plot shows the global behavior over time, without making difference on `match_type`.

  ![photo]({{ site.url }}/myimages/campanja_global2.png)

### Behavior of individual keyword over time

- Looking at the behavior of individual keyword, I also observe the periodical pattern of having high `click` typically on Monday and Sunday and low `click` during the working days. However, the patterns are quite different from one keyword to another as shown in the following plot.

  ![photo]({{ site.url }}/myimages/campanja_local1.png)

- If there is a pattern base on weekdays, how about average over weekdays? The following plot shows the behavior of individual keyword averaged over weekdays. The pattern is somehow more clear that people did more search at the beginning or towards the end of the week while did very few search during the week.

  ![photo]({{ site.url }}/myimages/campanja_local2.png)

- The observation suggest that it might be a good idea to build a regression model based on weekdays. For example, use data from previous Monday to Sunday to predict current Monday, and use data from previous Tuesday to this Monday to predict this Tuesday.

## Missing data 

For now the practical problem is really how much data we actually have or can use. The following plots show all available data points in keyword-time matrix in terms of different `match type`. The plot demonstrates that

- Different matching type generate different entries in the data matrix since the individual percentages sum up to the `all`.
- Interesting! This actually says that different `match type` did not generate overlapped data.
- In addition, we only have about 10% data available in the matrix by putting together data generated from different `match type`.
- It actually suggests that to deal with sparseness we should really pool data together other than model them in high resolution.

  ![photo]({{ site.url }}/myimages/campanja_missing.png)

## Learning and prediction

So far, the hints from basic analysis are 

- I should pool `keyword` data from different campaigns and match types to tackle the sparseness.
- The data is still very sparse even pooling logs from different dimensions. We still need to work out the missing values in the matrix. 
- There is a `heart beat` or `weekday` pattern for different keywords across time which essentially goes up at the beginning or towards the end of the week and goes down during the week. The pattern suggests that the preference of different keywords are somehow correlated because of the human behaviour. In machine learning, it allows `collaborative` analysis e.g., collaborative filtering.
- Behavior of individual keywords are quite different which means that local regression model built based on individual keyword might be a good idea.
- I should focus on predicting `click` and `conversion` data, as the ratio is the conversion rate.

### Missing value imputation

- As already mentioned, the first problem is that we need to compute the missing value in the keyword-time matrix of click data and conversion data.
- This can be tackled by collaborative filtering. The technique is well known for recommender system and is implemented in Spark machine learning library. The actual algorithm running in the backend is alternating least square ALS.
- In particular, I am working on a matrix

  |Item | Value|
  |:--|--:|
  |missing | 443835 |
  |all| 490947|
  |missing percentage| 90.40 % |
  |keywords| 5279|
  |Time| 93 |

- Parameter selection on `click` data

  |Rank | Lambda | NumIter | RMSE|
  |:--|:--|:--|:--|
  |30	|0.100|10|1.64|
  |30	|0.100|15|1.62|
  |30	|0.100|20|1.60|
  |30	|0.010|10|1.50|
  |30	|0.010|15|1.45|
  |30	|0.010|20|**1.42**|
  |30	|0.001|10|1.50|
  |30	|0.001|15|1.44|
  |30	|0.001|20|1.44|
  |20	|0.100|10|2.27|
  |20	|0.100|15|2.24|
  |20	|0.100|20|2.22|
  |20	|0.010|10|2.16|
  |20	|0.010|15|2.13|
  |20	|0.010|20|2.14|
  |20	|0.001|10|2.20|
  |20	|0.001|15|2.10|
  |20	|0.001|20|2.14|
  |10	|0.100|10|3.40|
  |10	|0.100|15|3.44|
  |10	|0.100|20|3.45|
  |10	|0.010|10|3.37|
  |10	|0.010|15|3.36|
  |10	|0.010|20|3.33|
  |10	|0.001|10|3.43|
  |10	|0.001|15|3.30|
  |10	|0.001|20|3.34|

- Compare collaborative filtering approach with mean imputation approach on `click` data.

  |Method|RMSE|
  |:--|--:|
  |CF	|1.42|
  |Mean imputation|	93.47|

- The following figure shows the results of imputation on `click` data. Each subplot shows the `click` number of `keyword` along time. Vertical lines correspond to non-missing data.

  ![photo]({{ site.url }}/myimages/campanja_imputation_click.png)


- Parameter selection on `conversion` data

  |Rank | Lambda | NumIter | RMSE|
  |:--|:--|:--|:--|
  | 30	  | 0.100	  | 10	  | 1.63  |
  | 30	  | 0.100	  | 15	  | 1.62  |
  | 30	  | 0.100	  | 20	  | 1.60  |
  | 30	  | 0.010	  | 10	  | 1.50  |
  | 30	  | 0.010	  | 15	  | 1.45  |
  | 30	  | 0.010	  | 20	  | 1.43  |
  | 30	  | 0.001	  | 10	  | 1.51  |
  | 30	  | 0.001	  | 15	  | 1.45  |
  | 30	  | 0.001	  | 20	  | **1.42**  |
  | 20	  | 0.100	  | 10	  | 2.27  |
  | 20	  | 0.100	  | 15	  | 2.22  |
  | 20	  | 0.100	  | 20	  | 2.22  |
  | 20	  | 0.010	  | 10	  | 2.15  |
  | 20	  | 0.010	  | 15	  | 2.13  |
  | 20	  | 0.010	  | 20	  | 2.13  |
  | 20	  | 0.001	  | 10	  | 2.17  |
  | 20	  | 0.001	  | 15	  | 2.13  |
  | 20	  | 0.001	  | 20	  | 2.13  |
  | 10	  | 0.100	  | 10	  | 3.55  |
  | 10	  | 0.100	  | 15	  | 3.41  |
  | 10	  | 0.100	  | 20	  | 3.42  |
  | 10	  | 0.010	  | 10	  | 3.35  |
  | 10	  | 0.010	  | 15	  | 3.30  |
  | 10	  | 0.010	  | 20	  | 3.29  |
  | 10	  | 0.001	  | 10	  | 3.37  |
  | 10	  | 0.001	  | 15	  | 3.34  |
  | 10	  | 0.001	  | 20	  | 3.29  |

- Compare collaborative filtering approach with mean imputation approach on `conversion` data.

  |Method|RMSE|
  |:--|--:|
  |CF	|1.42|
  |Mean imputation|	93.47|


- The following figure shows the results of imputation on `conversion` data. Each subplot shows the `conversion` number of `keyword` along time. Vertical lines correspond to non-missing data.

  ![photo]({{ site.url }}/myimages/campanja_imputation_conversion.png)

### Localized regression model

- The idea is to build a regression model for each keyword considering weekday pattern.
- For each keyword, we have data from day 0 to day 92.
- As training data x and y, we use

  |X(Feature)|Y(Label)|
  |:--|--:|
  |day 0 - day 6|7|
  |day 1 - day 7|8|
  |...|...|
  |day 85 - day 91|92|
  |day 86 - day 92|?|

- We use random forest regression model from scikit-learn. The training and test RMSE are shown in the following plot.

  ![photo]({{ site.url }}/myimages/campanja_regression.png)



## Other possibilities

- The approach described here is collaborative filter for missing value imputation + local regression model based on weekdays for individual keyword.
- Other possibilities base on current data

  - Missing value imputation + global regression for all keyword. The only difference here is to train a global regression model with all keyword data instead of having one regression model for individual keyword. **Pro:** Consider more information when making a prediction. More flexible for distributed computation. **Con:** Not sure whether other keywords are actually related to the current one.

  - Missing value imputation + group regression. Divide keywords into groups according to campaign information, then build a regression model for each group. **Pro:** Consider other keyword in the same group. **Con:** Sparse data which is difficult to find the keyword group.

  - Missing value imputation + time series prediction model e.g., autoregression model, autoregressive–moving-average model. Previous regression models are built based on the observation that there is a weekday pattern on the number of `click` or `conversions`. However, data here is essentially time series of the preference of keywords. The time series regression can be applied here. **Pro:** Data is essentially time series. **Con:** Local model on individual keyword. Neglect weekday pattern.

  - Ensemble models combining multiple local/global regression models.

- Given more data, it is really to make regression model on fine-tuned groups

  - When `click`/`conversion` can be segmented on devices, it makes sense to predict `click`, `conversion`, `conversion rate` for each device.
  - When more information about keywords are available, it is then realistic  to put keywords into different groups and run regression/missing value imputation on different group.

# Question 2

# Question 3

In order to compare the performance of two models (model A and model B) in term of predicting conversion rate, one can work on

- Historical data
  - by comparing rooted mean square error (RMSE) computed from all available test data points.
- Future data
  - by comparing rooted mean square error (RMSE) computed from all available test data points.
  - by performing an `A/B test` in order to claim that updating keywords by deploying model A significantly (statistically) boots the conversion rate compared to deploying model B.

## On historical data

### RMSE as measure of success

Conversion rate ($$R_{j}$$) of a keyword $$j$$ is defined as the ratio between the number of conversions and the number of clicks during a fixed sample period as

$$ ConversionRate = \frac{Conversion}{Click} $$

The sample period can be 1 day or a few hours. Essentially, the number of clicks and the number of conversions during the period are collected and assigned to the sample point at the end of the sample period. The conversion rate for the period is computed accordingly and also assigned to the sample point.
The measure of success is the rooted mean square error (RMSE) between the true conversion rate $$R$$ and the predicted conversion rate $$\hat{R}$$ defined as 

$$RMSE = \sqrt{\sum_{j=1}^{M}\sum_{i=1}^{N}(R_{ij}-\hat{R}_{ij})^2}$$

assuming there are $$M$$ keywords and $$N$$ time points.

The test procedure can be described as follows.

- Assume we have historical data of conversion rate of $$M$$ keywords on N time points (e.g., N days)

  $${\{R_{ij}\}_{i=1}^{N}}_{j=1}^{M}$$

- With model A we are able to predict the conversion rate of $$M$$ keywords on N time points

  $${\{\hat{R}^A_{ij}\}_{i=1}^{N}}_{j=1}^{M}$$

- With model B we are able to predict the conversion rate of $$M$$ keywords on N time points
  
  $${\{\hat{R}^B_{ij}\}_{i=1}^{N}}_{j=1}^{M}$$

- Rooted mean square error of two models are computed according to

  $$RMSE_A = \sqrt{\sum_{i=1}^{N}\sum_{j=1}^{M}(R_{ij}-\hat{R}^A_{ij})^2}$$

  $$RMSE_B = \sqrt{\sum_{i=1}^{N}\sum_{j=1}^{M}(R_{ij}-\hat{R}^B_{ij})^2}$$

- We say model A outperforms model B in predicting conversion rate if RMSE of A is smaller than RMSE of B.
- **Pro:** 
  - The test is fast and cheap.
- **Con:**
  - The problem is that the difference between two RMSEs might be very small or due to some randomness. Therefore, the claim based on RMSE might not be very well justified. 
  - Overfit training data if the test is not conducted in a proper way.

## On future data

In stead of testing the model on historical data, one can perform the test on line. For example, if the sample period is 1 day, one can predict the conversion rate of tomorrow using all data available upto today; then repeat on the following days.

### RMSE as measure of success

In stead of testing the model on historical data, one can perform the test on line. For example, if the sample period is 1 day, one can predict the conversion rate of tomorrow using all data available upto today; then repeat on the following days.

- Assume we have some data available for training that allow us to predict (with model A or model B) the conversion rate of of $M$ keywords for tomorrow (day 1)

  $$\{\hat{R}^B_{j1}\}_{j=1}^{M} , \{\hat{R}^B_{j1}\}_{j=1}^{M}$$

- The next day we will collect the real conversion rates for $$M$$ keywords

  $$\{R^B_{j1}\}_{j=1}^{M}$$

- The procedure can be repeated for $$N$$ days in the future. In the end we will collect the true conversion rates of $$M$$ keywords

  $${\{R_{ij}\}_{i=1}^{N}}_{j=1}^{M}$$

  conversion rates of $$M$$ keywords predicted by model A

  $${\{\hat{R}^A_{ij}\}_{i=1}^{N}}_{j=1}^{M}$$
 
  conversion rates of $$M$$ keywords predicted by model B

  $${\{\hat{R}^B_{ij}\}_{i=1}^{N}}_{j=1}^{M}$$

- Rooted mean square error of two models are computed according to

  $$RMSE_A = \sqrt{\sum_{i=1}^{N}\sum_{j=1}^{M}(R_{ij}-\hat{R}^A_{ij})^2}$$

  $$RMSE_B = \sqrt{\sum_{i=1}^{N}\sum_{j=1}^{M}(R_{ij}-\hat{R}^B_{ij})^2}$$

- We say model A outperforms model B in predicting conversion rate if RMSE of A is smaller than RMSE of B.
  - **Pro:** 
    - Less likely to overfit training data compared to testing on historical data
  - **Con:**
    - The problem is that the difference between two RMSEs might be very small or due to some randomness. Therefore, the claim based on RMSE might not be very well justified. 


### Conversion rate as measure of success (`A/B test`)

The model developed for predicting conversion rates of keywords is eventually applied to picking keywords during the campaign. Therefore, to compare model A and model B, it also make sense to measure the conversion rate over a collection of clicks from keywords suggested by model A and a collection clicks from keywords by model B over a certain time period.

- The first problem is how many clicks are needed for the experiments. Assume the conversion rate in the group where model A is applied is $$p=60\%$$. In order to say, with statistical power of $$\beta = 90\%$$ and confident level of $$\alpha = 99\%$$, that I can detect the conversion rate of q in group where model B is applied that is significantly different from p in A, I need $$M$$ clicks (samples). $$M$$ can be computed from 

  $$M = 2(t_{\frac{\alpha}{2}} + t_{\beta})^2\frac{p(1-p)}{|q-p|^2}$$

  where $$t_{\frac{\alpha}{2}} = 2.58$$ and $$t_{\beta} = 1.29$$ are from the standard norm distribution table.

  In particular, the sample size $$M$$ is shown in the following table when conversion rate from model A is $$60\%$$

  |Conversion rate from Model B, q| Number of clicks|
  |:---|---:|
  |0.61|71889|
  |0.62|17972|
  |0.63|7988|
  |0.64|4493|
  |0.65|2876|

- The next thing is to collect click data. One has to make there is no bias towards special date, people, product, region, etc.
- After sample collection, we have minimum clicks collected from group A and group B. We also know how many conversions are from each group. After that, I would use standard G test.




# Side note

- Learning can be improved by applying parameter selection on a training/validation/test partition other than current training/test partition. 
- Parameter selection should be added to local random forest regression. For now, I only have parameter selection on collaborative filtering not for random forest regression.








