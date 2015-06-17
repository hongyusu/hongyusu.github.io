---
layout: post
title: "Extract protein features via InterProScan"
description: ""
category: Lessons
tags: [Programming, InterProScan, Bioinformatics, Feature Extraction, Protein]
---
{% include JB/setup %}

# InterProScan

This post aims to illustrate the installation and running InterProScan on a local machine. InterProScan is frequently used in Bioinformatics data analysis the goal of which is to extract various protein features based on sequence alignment of database search.
As scanning a protein sequence is time consuming even on a local machine, we install the lookup database based on which features of known protein can be directed extracted from the database.

## Installation

1. Some useful instruction for InterProScan can be found from [Google code documentation](wget ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/5.13-52.0/interproscan-5.13-52.0-64-bit.tar.gz.md5).

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
   1. Panther model should be install in the `data` directory under the directory of InterProScan.
   1. Down load the Panther model with the following command

      `wget ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/data/panther-data-9.0.tar.gz`
      `wget ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/data/panther-data-9.0.tar.gz.md5`

   1. Check the download is successful with the following command

      `md5sum -c panther-data-9.0.tar.gz.md5`

   1. Unpack Panther model data with the following command

      `tar -pxvzf panther-data-9.0.tar.gz`

1. Install lookup service

   1. Lookup service enables extracting features of known proteins without scanning the sequences.

   1. Lookup service can be installed in any directory with the following command

      `mkdir i5_lookup_service`
      `cd i5_lookup_service`

   1. Download data files for lookup services with the following commands

      `wget ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/lookup_service/lookup_service_5.12-52.0.tar.gz`
      `wget ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/lookup_service/lookup_service_5.12-52.0.tar.gz.md5`

   1. Check the MD5 checksum to make the download is successful with the following commnand

      `md5sum -c lookup_service_5.12-52.0.tar.gz.md5`

   1. Unpack the download package with the following command

      `tar -pxvzf lookup_service_5.12-52.0.tar.gz`

      This takes very long, so be patient.

## Run InterProScan

1. In scanning mode

   1. InterProScan in scanning mode will align/scan protein sequences based on various databases.
   1. Some instruction of running InterProScan can be found from [Google code documentation](https://code.google.com/p/interproscan/wiki/HowToRun).

   1. Simply, the software can be invoked with the following command for the test protein sequence in the InterProScan home directory

      `./interproscan.sh -i test_proteins.fasta`

   1. We can also take a look at the command line usage of InterProScan with the following command

      `./interproscan.sh`

1. In lookup mode 

   1. In loopup mode, the software will extract sequence features from the database directly without scanning the sequence assuming that the sequence information is  known, e.g., all sequences in UniProtKB.





