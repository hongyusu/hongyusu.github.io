---
layout: post
title: "Build a web app on Amazon"
description: ""
category: Technology
tags: [Amazon, DeepLearning, WebApp]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>


![photo1]({{ site.url }}/myimages/ss_20160112_0.jpg)



# Table of content
* auto-gen TOC:
{:toc}

coming soon :laughing:


# Main



1. Set up environment variables

   ```bash
   source_bucket=hongyusuoriginal
   target_bucket=${source_bucket}resized
   function=CreateThumbnail
   lambda_execution_role_name=lambda-$function-execution
   lambda_execution_access_policy_name=lambda-$function-execution-access
   lambda_invocation_role_name=lambda-$function-invocation
   lambda_invocation_access_policy_name=lambda-$function-invocation-access
   log_group_name=/aws/lambda/$function
   ```

1. Create buckets in S3 and upload a sample image

   ```bash
   aws s3 mb s3://$source_bucket
   aws s3 mb s3://$target_bucket
   aws s3 cp HappyFace.jpg s3://$source_bucket/
   ```

1. Create a lambda function deployment package

   ```bash
   wget -q -O $function.js http://run.alestic.com/lambda/aws-examples/CreateThumbnail.js
   npm install async gm
   zip -r $function.zip $function.js node_modules
   ```
   
1. Create an IAM role for lambda function

   ```bash
   lambda_execution_role_arn=$(aws iam create-role \
     --role-name "$lambda_execution_role_name" \
     --assume-role-policy-document '{
         "Version": "2012-10-17",
         "Statement": [
           {
             "Sid": "",
             "Effect": "Allow",
             "Principal": {
               "Service": "lambda.amazonaws.com"
             },
             "Action": "sts:AssumeRole"
           }
         ]
       }' \
     --output text \
     --query 'Role.Arn'
   )
   echo lambda_execution_role_arn=$lambda_execution_role_arn
   ```
   
   Define the scope which can be accessed by lambda function.
   ```bash
   aws iam put-role-policy \
     --role-name "$lambda_execution_role_name" \
     --policy-name "$lambda_execution_access_policy_name" \
     --policy-document '{
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "logs:*"
           ],
           "Resource": "arn:aws:logs:*:*:*"
         },
         {
           "Effect": "Allow",
           "Action": [
             "s3:GetObject"
           ],
           "Resource": "arn:aws:s3:::'$source_bucket'/*"
         },
         {
           "Effect": "Allow",
           "Action": [
             "s3:PutObject"
           ],
           "Resource": "arn:aws:s3:::'$target_bucket'/*"
         }
       ]
     }'
   ```
   
1. Upload the deployment package and test it manully

   ```bash
   aws lambda create-function \
     --region us-west-2 \
	 --function-name "$function" \
	 --zip "fileb://$function.zip" \
	 --role "$lambda_execution_role_arn" \
	 --handler "$function.handler" \
	 --timeout 30 \
	 --runtime nodejs 
	 --timeout 10 
	 --memory-size 1024
   ```
   
1. Define a fake S3 event

   ```bash
   cat > $function-data.json <<EOM
   {  
      "Records":[  
         {  
            "eventVersion":"2.0",
            "eventSource":"aws:s3",
            "awsRegion":"us-east-1",
            "eventTime":"1970-01-01T00:00:00.000Z",
            "eventName":"ObjectCreated:Put",
            "userIdentity":{  
               "principalId":"AIDAJDPLRKLG7UEXAMPLE"
            },
            "requestParameters":{  
               "sourceIPAddress":"127.0.0.1"
            },
            "responseElements":{  
               "x-amz-request-id":"C3D13FE58DE4C810",
               "x-amz-id-2":"FMyUVURIY8/IgAtTv8xRjskZQpcIZ9KG4V5Wp6S7S/JRWeUWerMUE5JgHvANOjpD"
            },
            "s3":{  
               "s3SchemaVersion":"1.0",
               "configurationId":"testConfigRule",
               "bucket":{  
                  "name":"$source_bucket",
                  "ownerIdentity":{  
                     "principalId":"A3NL1KOZZKExample"
                  },
                  "arn":"arn:aws:s3:::$source_bucket"
               },
               "object":{  
                  "key":"HappyFace.jpg",
                  "size":1024,
                  "eTag":"d41d8cd98f00b204e9800998ecf8427e",
                  "versionId":"096fKKXTRTtl3on89fVO.nfljtsv6qko"
               }
            }
         }
      ]
   }
   EOM
   ```
   
   Invoke the lambda function, passing in the fake S3 event data
   
   ```bash
   aws lambda invoke-async \
     --function-name "$function" \
     --invoke-args "$function-data.json"
   ```
   
   
   
   



# Extra reading materials

There are always very good external reading materials available on the web. 

1. For example, this article ['A beginner's guide to Amazon S3 and web hosting'](http://www.smalldatajournalism.com/projects/one-offs/using-amazon-s3/) is a part of the website which is built for a practical course 'Small data journalism'. It offers very good introductory knowledge on hosting a website with Amazon services.
1. In addition, you can reed this article ['How to serve 100k users without breaking server'](http://blogging.alastair.is/how-i-served-100k-users-without-crashing-and-only-spent-0-32/) for more practical details on building a website with Amazon S3.
1. Still, ['Getting started with AWS and Python'](http://aws.amazon.com/articles/Amazon-EC2/3998) offers a excellent running example :question: of running an small web application on Amazon using S3, EC2, and SQS.
1. And maybe ['Setting up EC2 and Django'](http://markhops.blogspot.fi/2012/05/how-to-setting-up-ec2-and-django.html) is also useful for our purpose.
1. Also [Hosting a web app on Amazon web service](http://docs.aws.amazon.com/gettingstarted/latest/wah-linux/web-app-hosting-intro.html).











