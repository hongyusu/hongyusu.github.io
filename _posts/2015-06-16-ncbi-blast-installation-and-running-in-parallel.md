---
layout: post
title: "NCBI BLAST installation and running in parallel"
description: ""
category: Lessons
tags: [Programming, BLAST, Bioinformatics]
---
{% include JB/setup %}


This post is about how to install NCBI BLAST sequence alignment tool in your local computer and run BLAST in parallel.

## BLAST installation

### Install BLAST software

1. NCBI BLAST tool can be obtained from the [software download page](http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE_TYPE=BlastDocs&DOC_TYPE=Download). In particular, I downloaded the source code package `ncbi-blast-2.2.31+-src.tar.gz` from the NCBI FTP server.

1. A instruction of BLAST toolkit can be found from [NCBI books](http://www.ncbi.nlm.nih.gov/books/NBK279671/).

1. I will install BLAST on a linux based machine. The following instruction will work for this purpose. 

1. Locate a random place in disk and unpack the `.tar.gz` file with the following command

   `tar -xzvf ncbi-blast-2.2.31+-src.tar.gz`

1. Change to the newly created directory and configure the c++ BLAST package with the following command

	`cd c++; ./configure`

1. Compile the c++ code with following command

	`cd ReleaseMT/build; make all_r`

   The compiling process gona take a while, so be patient.
	
### Install BLAST database

1. 
	
## Run BLAST in parallel

1. 