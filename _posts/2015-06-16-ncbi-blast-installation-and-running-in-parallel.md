---
layout: post
title: "Large-scale multiple sequence alignment search with NCBI BLAST"
description: ""
category: Lessons
tags: [Programming, BLAST, Bioinformatics]
---
{% include JB/setup %}



This post will illustrate how to install NCBI BLAST package on your local compute, how to install private sequence databases for BLAST search, how to run BLAST search with sequence databases, and how to write a parallel python script for running BLAST search no a computer cluster.

## BLAST installation

### Install BLAST software

1. NCBI BLAST tool can be obtained from the [software download page](http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE_TYPE=BlastDocs&DOC_TYPE=Download). In particular, I downloaded the source code package `ncbi-blast-2.2.31+-src.tar.gz` from the NCBI FTP server.

1. A instruction of BLAST toolkit can be found from [NCBI books](http://www.ncbi.nlm.nih.gov/books/NBK279690/).

1. I will install BLAST on a linux based machine. The following instruction will work for this purpose. 

1. Locate a random place in disk and unpack the `.tar.gz` file with the following command

   `tar -xzvf ncbi-blast-2.2.31+-src.tar.gz`

1. Change to the newly created directory and configure the c++ BLAST package with the following command

	`cd c++; ./configure`

1. Compile the c++ code with following command

	`cd ReleaseMT/build; make all_r`

   The compiling process gonna take long, so be patient.
	
### Install BLAST database

1. This section will help make our own BLAST database of protein sequences and align our amino acid sequences with the database. Basically, we will be using `makeblastdb` application to achieve this goal.

1. Some more instruction can be found from [NCBI website](http://www.ncbi.nlm.nih.gov/books/NBK279688/).

1. The current project will be focusing on transporter proteins, so we download the data file of all transporter proteins from the transporter protein data base [TCDB](http://www.ncbi.nlm.nih.gov/books/NBK279688/).

1. Usage of the `makeblastdb` command can be found also from the BLAST package with the following command

   `makeblastdb -help`

1. To make the BLAST database with an arbitrary FASTA file, I use the following command 

   `./makeblastdb -in tcdb -parse_seqids -dbtype prot`

   However, make sure that there is no replicated sequence name in the FASTA file.

### Perform BLAST

1. Perform BLAST search with the following command

   `./blastp  -evalue 0.01 -num_threads 4 -outfmt "6 qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore" -db tcdb -query tmp -out tmp.out`




	
## Run BLAST in parallel

1. TO BE COMPLETED


# InterProScan

## Installation

1. Some useful instruction for InterProScan can be found from [Google code](wget ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/5.13-52.0/interproscan-5.13-52.0-64-bit.tar.gz.md5).
1. This instruction is meant for installing and running InterProScan on a Linux machine.
   1. Install InterProScan
   1. Make a directory for the software package
      `mkdir myinterproscan; cd myinterproscan`
   1. Download the software package and MD5 checksum with the following command
      `wget ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/5.13-52.0/interproscan-5.13-52.0-64-bit.tar.gz`
      `wget ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/5.13-52.0/interproscan-5.13-52.0-64-bit.tar.gz.md5`
   1. Check the MD5 checksum to make sure the download is successful with the following command
      `md2sum -c md5sum -c interproscan-5.13-52.0-64-bit.tar.gz.md5`
   1. Unpack the InterProScan package with the following command
      `tar -pxvzf interproscan-5.13-52.0-*-bit.tar.gz`
1. Install Panther models
   1. Panther model should be install in the `data` directory under the directory of InterProScan
      `mkdir data`
   1. Down load the Panther model with the following command
      `wget ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/data/panther-data-9.0.tar.gz`
      `wget ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/data/panther-data-9.0.tar.gz.md5`
   1. Check the download is successful with the following command
      `md5sum -c panther-data-9.0.tar.gz.md5`
   1. Unpack Panther model data with the following command
      ``












