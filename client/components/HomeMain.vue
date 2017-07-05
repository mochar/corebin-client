<template>
<div class="card card-block" id="home-main">
    <h2>
        <img src="logo.svg" style="height: 5rem"> CoReBIN
        <small class="text-muted">Comparison and Refinement of metagenomic bins</small>
    </h2>

    <p class="lead rounded" id="lead">
        CoReBIN is a user-friendly web-based tool to compare the results of different binning methods and to aid manual refinement of the bins. The binning result of two different methods can be visually compared in a chord diagram. Individual bins can be inspected and refined using GC%, coverage and tetranucleotide frequencies.
    </p>

    <div class="card-group">
        <div class="card text-center">
            <div class="card-block">
                <h4 class="card-title">
                    <span class="fa fa-upload fa-fw"></span>
                    Upload
                </h4>
                <p class="card-text">Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proeftekst in deze bedrijfstak sinds de 16e eeuw, toen een onbekende drukker een zethaak met letters nam en ze door elkaar husselde om een font-catalogus te maken. </p>
            </div>
        </div>
        <div class="card text-center">
            <div class="card-block">
                <h4 class="card-title">
                    <span class="fa fa-balance-scale fa-fw"></span>
                    Compare
                </h4>
                <p class="card-text">Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proeftekst in deze bedrijfstak sinds de 16e eeuw, toen een onbekende drukker een zethaak met letters nam en ze door elkaar husselde om een font-catalogus te maken. </p>
            </div>
        </div>
        <div class="card text-center">
            <div class="card-block">
                <h4 class="card-title">
                    <span class="fa fa-wrench fa-fw"></span>
                    Refine
                </h4>
                <p class="card-text">Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proeftekst in deze bedrijfstak sinds de 16e eeuw, toen een onbekende drukker een zethaak met letters nam en ze door elkaar husselde om een font-catalogus te maken. </p>
            </div>
        </div>
    </div>

    <div style="margin-top: 2rem">
        <h4>Demo data-set</h4>
        <p>
        A simulated dataset of short sequences consisting of three different samples, each containing 10.000.000  paired-end 100 nt reads, was created using the supplied error model for Illumina GA IIx with TrueSeq SBS Kit v5-GA using GemSim (<a href="http://www.ncbi.nlm.nih.gov/pubmed/22336055" target="_blank">McElroy, Luciani & Thomas, 2012</a>). Reads were derived from a set of 10 reference genomes and chosen with probability proportional to the species abundance and genome size (see table below).
        </p>
        <p>
        Subsequently, the simulated reads were co-assembled using MEGAHIT (<a href="http://www.ncbi.nlm.nih.gov/pubmed/25609793" target="_blank">Li et al, 2015</a>). Coverage for the three different samples was determined using bowtie2 (<a href="http://www.ncbi.nlm.nih.gov/pubmed/22388286" target="_blank">Langmead & Salzberg, 2012</a>). The assembly and differential coverage table were then used as input for two different binning programs (default parameters): MaxBin 2.0 (<a href="http://www.ncbi.nlm.nih.gov/pubmed/26515820" target="_blank">Wu, Simmons and Singer, 2015</a>) and MetaBAT (<a href="https://peerj.com/articles/1165/" target="_blank">Kang et al, 2015</a>).
        </p>

        <p><router-link to="/help">Read more in the help page.</router-link></p> 
    </div>
</div>
</template>

<style>
#lead {
    background-color: #fafafa;
    padding: 1rem;
}

#home-main {
    border: 0;
    height: 100%;
    overflow-y: hidden;
}
</style>

<style scoped>
.fa {
    margin-bottom: 1rem;
}
</style>