<template>
<div class="card card-block" id="home">
    <h2>CoReBIN <small class="text-muted">Comparison and Refinement of metagenomic bins</small></h2>
    <hr>

    <p class="lead rounded" id="lead">
        CoReBIN is a user-friendly web-based tool to compare the results of different binning methods and to aid manual refinement of the bins. The binning result of two different methods can be visually compared in a chord diagram. Individual bins can be inspected and refined using GC%, coverage and tetranucleotide frequencies.
    </p>

    <h4>Getting started</h4>
    <p>
        <ol>
        <li>To <b>upload your metagenomic assembly (fasta format)</b>, click the + icon at the top in the left side-bar. Next, enter a name, select your file and click "Upload assembly". It is beneficial to also upload a table with (differential-) coverage information on your assembly.</li>
        <li>Next you can <b>upload your metagenomic binning results</b> by clicking the "Analyze"-buttom in the left side-bar and subsequently clicking the + icon. To do so, you need a file in which the contig ID if followed by the bin number (e.g. contig </t> binID).</li>
        <li>Now, <b>inspect your bins</b> by clicking the "Overview"-button. Click on the tools icon to <b>refine individual bins</b>.</li>
        </ol>
    </p>

    <h4>Input data</h4>
    <p>
        <ul>
            <li>Metagenomic assembly (fasta format; <a href="#help">see details</a>)</li>
            <li>Coverage table (<a href="#help">see details</a>) <i>not required</i></li>
            <li>One or more binning results (<a href="#help">see details</a>)</li>
        </ul>
        First want to try CoReBIN with demo-data? A simulated data-set is provided <a href="#help">here</a>).
    </p>

    <h4>Metagenomic binning</h4>
    <p>
    Here are some suggestions of recently published metagenomic binning programs and methods:
        <ul>
        <li><a href="https://github.com/BinPro/CONCOCT">CONCOCT</a>: Alneberg, Johannes, et al. "Binning metagenomic contigs by coverage and composition." <i>Nature methods</i> 11.11 (2014): 1144-1146.</li>
        <li><a href="https://bitbucket.org/berkeleylab/metabat">MetaBAT</a>: Kang, Dongwan D., et al. "MetaBAT, an efficient tool for accurately reconstructing single genomes from complex microbial communities." <i>PeerJ</i> 3 (2015): e1165.</i>
        <li><a href="http://ecogenomics.github.io/GroopM/">GroopM</a>: Imelfort, Michael, et al. "GroopM: an automated tool for the recovery of population genomes from related metagenomes." <i>PeerJ</i> 2 (2014): e603.</li>
        <li><a href="https://sourceforge.net/projects/maxbin/">MaxBin 2.0</a>: Wu, Yu-Wei, Blake A. Simmons, and Steven W. Singer. "MaxBin 2.0: an automated binning algorithm to recover genomes from multiple metagenomic datasets." <i>Bioinformatics</i> (2015): btv638.</li>
        <li><a href="http://claczny.github.io/VizBin/">VizBin</a>: Laczny, Cedric C., et al. "VizBin-an application for reference-independent visualization and human-augmented binning of metagenomic data." <i>Microbiome</i> 3.1 (2015): 1.</li>
        </ul>
    </p>
</div>
</template>

<style>
#home {
    height: 100vh;
    overflow-y: auto;
    border-right: 0;
}

#lead {
    background-color: #fafafa;
    padding: 1rem;
}
</style>
