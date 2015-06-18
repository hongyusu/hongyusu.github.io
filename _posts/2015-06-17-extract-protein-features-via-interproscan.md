---
layout: post
title: "Feature extraction for protein sequences via InterProScan"
description: ""
category: Lessons
tags: [Programming, InterProScan, Bioinformatics, Feature Extraction, Protein sequence]
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
   1. Panther is one of the database used in InterProScan and requires a separate installation.
   1. Panther model should be install in the `data` directory under the directory of InterProScan.
   1. Down load the Panther model with the following command

      `wget ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/data/panther-data-9.0.tar.gz`
      `wget ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/data/panther-data-9.0.tar.gz.md5`

   1. Check the download is successful with the following command

      `md5sum -c panther-data-9.0.tar.gz.md5`

   1. Unpack Panther model data with the following command

      `tar -pxvzf panther-data-9.0.tar.gz`

1. Install [_Phobius_](http://software.sbc.su.se/cgi-bin/request.cgi?project=phobius)
   1. Standalone Phobius tool can be obtained from [Phobius website](http://software.sbc.su.se/cgi-bin/request.cgi?project=phobius).
   1. Download the `.tar.gz` file `phobius101_linux.tar.gz`.
   1. Unpack the file with the following command

      `tar -xzvf phobius101_linux.tar.gz`

   1. Copy all files to the Phobius folder under InterProScan home directory with the following command

      `mv phobius/* interproscan-5.13-52.0/bin/phobius/1.01/`

   1. Then change the line in InterProScan configuration file 'interproscan.properties' to the following

      `binary.phobius.pl.path.1.01=bin/phobius/1.01/phobius.pl`

      Then you are done!

1. Install [_TMHMM_](http://www.cbs.dtu.dk/services/TMHMM/)
   1. The software can be obtain from the [TMHMM](http://www.cbs.dtu.dk/services/TMHMM/).
   2. Download the `.tar.gz ` package and unpack with the following command
      
      `tar -xzvf tmhmm-2.0c.Linux.tar.gz `
   
   3. Copy all file to the TMHMM directory under InterProScan directory

      `mv tmhmm-2.0c/* interproscan-5.13-52.0/bin/tmhmm/2.0/`

   1. Insert the correct path for perl 5.x in the first line of the scripts bin/tmhmm and bin/tmhmmformat.pl (if not /usr/local/bin/perl).
   1. Then change the line in InterProScan configuration file 'interproscan.properties' to the following

      `binary.tmhmm.path=bin/tmhmm/2.0/bin/decodeanhmm.Linux_x86_64`
      `tmhmm.model.path=bin/tmhmm/2.0/lib/TMHMM2.0.model`

      Then you are done!

1. Installation of [_Signalp_](http://www.cbs.dtu.dk/services/doc/signalp-4.1.readme)
   1. Installation of [_Signalp_](http://www.cbs.dtu.dk/services/doc/signalp-4.1.readme) is similar as intallations of TMHMM and Phobius.
   1. A brief instruction can be found from [Signalp project](http://www.cbs.dtu.dk/services/doc/signalp-4.1.readme).
   2. Finally, change the line in InterProScan configuration file 'interproscan.properties' to the following

      `binary.signalp.4.0.path=bin/signalp/4.1/signalp`

   1. Then you are done!

1. Current version of InterProScan supports several databases. The name and the version information are listed in the following table

   |Software and databases|Version|Information|
   |---:|---:|---:|
   |InterProScan|5.13-52.0|InterProScan package|
   |ProDom|2006.1|ProDom is a comprehensive set of protein domain families automatically generated from the UniProt Knowledge Database.|
   |HAMAP||High-quality Automated and Manual Annotation of Microbial Proteomes|
   |SMART|6.2|SMART allows the identification and analysis of domain architectures based on Hidden Markov Models or HMMs|
   |SuperFamily|1.75|SUPERFAMILY is a database of structural and functional annotation for all proteins and genomes.|
   |PRINTS|42.0|A fingerprint is a group of conserved motifs used to characterise a protein family|
   |Panther|9.0|The PANTHER (Protein ANalysis THrough Evolutionary Relationships) Classification System is a unique resource that classifies genes by their functions, using published scientific experimental evidence and evolutionary relationships to predict function even in the absence of direct experimental evidence.|
   |Gene3d|3.5.0|Structural assignment for whole genes and genomes using the CATH domain structure database|
   |PIRSF|3.01|The PIRSF concept is being used as a guiding principle to provide comprehensive and non-overlapping clustering of UniProtKB sequences into a hierarchical order to reflect their evolutionary relationships.|
   |PfamA|27.0|A large collection of protein families, each represented by multiple sequence alignments and hidden Markov models (HMMs)|
   |PrositeProfiles||PROSITE consists of documentation entries describing protein domains, families and functional sites as well as associated patterns and profiles to identify them|
   |TIGRFAM|15.0|TIGRFAMs are protein families based on Hidden Markov Models or HMMs|
   |PrositePatterns||PROSITE consists of documentation entries describing protein domains, families and functional sites as well as associated patterns and profiles to identify them|
   |Coils|2.2|Prediction of Coiled Coil Regions in Proteins|
   |TMHMM| 2.0| Prediction of transmembrane helices in proteins|
   |Phobius |1.01|A combined transmembrane topology and signal peptide predictor|
   |SignalP_GRAM_NEGATIVE |4.0|SignalP (organism type gram-negative prokaryotes) predicts the presence and location of signal peptide cleavage sites in amino acid sequences for gram-negative prokaryotes|
   |SignalP_EUK |4.0|SignalP (organism type eukaryotes) predicts the presence and location of signal peptide cleavage sites in amino acid sequences for eukaryotes.|
   |SignalP_GRAM_POSITIVE |4.0|SignalP (organism type gram-positive prokaryotes) predicts the presence and location of signal peptide cleavage sites in amino acid sequences for gram-positive prokaryotes|



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

   1. In lookup mode, the software will extract sequence features from the database directly without scanning the sequence assuming that the sequence information is  known, e.g., all sequences in UniProtKB.
   1. The lookup mode can be activated with option `-iprlookup` and by default, it will check the services provided by the remove EBI server. The command for enabling lookup model is shown as follows

      `./interproscan.sh -i ../../../Data/tcdb -iprlookup -f tsv`

   1. As we have downloaded the database for lookup service, we can start the service with the local machine via the following command

      `java -Xmx2000m -jar server-5.12-52.0-jetty-console.war`

      This command will take a while. The output will indicate the host and the port of the service e.g. in my case

      `1166522 [main] INFO org.eclipse.jetty.server.AbstractConnector - Started @0.0.0.0:8080`

   1. Now we have to modify the `interproscan.properties` file to acknowledge InterProScan use local lookup service. In particular, we are modifying the following line in the file

      `precalculated.match.lookup.service.url=http://0.0.0.0:8080`

   1. To verify that InterProScan is using lookup services, we use the command line option `-goterms` to force the software extract GO terms from the lookup database as in the following command

      `/interproscan.sh -i ../../../Data/tcdb -iprlookup -f tsv --goterms`

      If there are GO annotation in the result file, the lookup service is running fine.   








