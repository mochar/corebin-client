<template>
<div class="row" id="help">
    <div class="col-3 app-left">
        <div class="navigation" style="padding-bottom: .5rem">
            <div class="sidebar-button" @click="$router.go(-1)">
                <span class="fa fa-angle-left fa-lg text-muted" style="font-weight: bold"></span>
            </div>
            <div>
                <strong class="sidebar-title text-muted text-center" style="padding-bottom: 0">
                    HELP
                </strong>
            </div>
            <div></div>
        </div>
        <ul class="nav nav-pills flex-column" id="help-nav">
            <li class="nav-item">
                <a class="nav-link" href="#h-introduction">Introduction</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#h-ui">User interface</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#h-uploading">Uploading your data</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#h-binning">Metagenomic binning</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#h-demo-set">Demo data-set</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#h-demo-files">Demo data files</a>
            </li>
        </ul>
    </div>
    <div class="col-9 app-right">
        <div id="help-main" class="card card-body" data-spy="scroll" data-target="#help-nav" data-offset="0"
            style="border-left: 0">
            <h2>CoReBIN <small class="text-muted">Comparison and Refinement of metagenomic binning</small></h2>
            <hr>

            <h3 id="h-introduction">Introduction</h3>
            <p>
                CoReBIN is a user-friendly web-based tool to compare the results of different metagenomic binning methods and to aid manual refinement of the bins. The binning result of two different methods can be visually compared in a chord diagram. Individual bins can be inspected and refined using GC%, coverage and tetranucleotide frequencies.
            </p>

            <h3 id="h-ui">User interface</h3>
            <p>
            <img src="static/interface.png" style="margin:10px;">
            Within CoReBIN, four distinct views are available:
                <ul>
                    <li><b>Home:</b> Introduction and upload of metagenomic assemblies and bin-sets. </li>
                    <li><b>Compare:</b> Visually compare two different binning results.</li>
                    <li><b>Refine:</b> Visual refinement of bins using GC%, coverage, tetranucleotide frequencies. </li>
                    <li><b>Help:</b> Documentation of usage, file formats and demo data.</li>
                </ul>
            </p>

            <h3 id="h-uploading">Uploading your data</h3>

            <p>
            Users can upload their own data in the Home-panel. The following data is needed to analyse your metagenomic bins using CoReBIN:
                <ul>
                <li>Metagenomic assembly</li>
                <li>Coverage data <i>not required</i></li>
                <li>Metagenomic bins</li> (i.e. metagenomic binning results)
                </ul>
            First upload your metagenomic assembly and corresponding coverage data (if available) in the "1. Upload assembly"-box (this might take a while, be patient!) and subsequently upload your metagenomic bin set in the "2. Upload bin set".-box </br>Details on file format are given below.
            </p>

            <h4>1. Metagenomic assembly and Coverage data</h4>

            <h5>Metagenomic assembly</h5>
            <p>
                Fasta format. The headers have to correspond to the contig IDs used in the coverage table and the contig IDs used in the binning table(s). We have limited the upload of metagenomic assemblies to files up to xxx mb, larger metagenomic assemblies can not be analyzed using CoReBIN.
            </p>

            <img src="static/upload.png" style="float:right;margin:15px;">


            <h5>Coverage data</h5>
            <p>
                You can add a file containing coverage information when uploading a metagenomic assembly. Sequencing coverage describes the average number of reads that align to, or "cover," your metagenomic assembly. You can determine the coverage by mapping your reads to your assembly using tools such as <a href="http://bio-bwa.sourceforge.net/">BWA</a> and <a href="http://bowtie-bio.sourceforge.net/bowtie2/">Bowtie2</a>. Differential coverage information is utilized by many metagenomic binning methods and can be very useful to refine bins.
                </br></br>
                The input file should be a tab separated file with on each line a contigID followed by the coverage in one or more samples, i.e. if you have coverage data on one sample you have one additional column, if you have two different coverages you will need two additional columns. </br></br>
                ContigID1 <i>&lt;tab&gt;</i> Coverage_sample1  <i>&lt;tab&gt;</i>  Coverage_sample2  </br>
                ContigID2 <i>&lt;tab&gt;</i> Coverage_sample1  <i>&lt;tab&gt;</i>  Coverage_sample2  </br>
                ContigID3 <i>&lt;tab&gt;</i> Coverage_sample1  <i>&lt;tab&gt;</i>  Coverage_sample2  </br>
                ...<i>&lt;tab&gt;</i> ...  <i>&lt;tab&gt;</i>  ...  </br>
                ...<i>&lt;tab&gt;</i> ...  <i>&lt;tab&gt;</i>  ...  </br>
                </br>
                It is important that the contig IDs are exact matches with the ones in the fasta headers of the assembly.
                </br>
            </p>


            <h4>2. Metagenomic bins</h4>
            <p>
                ContigID1 <i>&lt;tab&gt;</i> BinId </br>
                ContigID4 <i>&lt;tab&gt;</i> BinId </br>
                ContigID2 <i>&lt;tab&gt;</i> BinId </br>
                ...<i>&lt;tab&gt;</i> ... </br>
                ...<i>&lt;tab&gt;</i> ... </br>
            </br>
            Again, it is important that the contig IDs are exact matches with the ones in the assembly. Unbinned contigs can be left out in this table and no specific ordering is required.
            </br>
            </p>


            <h3>Metagenomic binning</h3>
            <p>
            Recently published metagenomic binning programs and methods:
                <ul>
                <li><a href="https://github.com/BinPro/CONCOCT">CONCOCT</a>: Alneberg, Johannes, et al. "Binning metagenomic contigs by coverage and composition." <i>Nature methods</i> 11.11 (2014): 1144-1146.</li>
                <li><a href="https://bitbucket.org/berkeleylab/metabat">MetaBAT</a>: Kang, Dongwan D., et al. "MetaBAT, an efficient tool for accurately reconstructing single genomes from complex microbial communities." <i>PeerJ</i> 3 (2015): e1165.</i>
                <li><a href="http://ecogenomics.github.io/GroopM/">GroopM</a>: Imelfort, Michael, et al. "GroopM: an automated tool for the recovery of population genomes from related metagenomes." <i>PeerJ</i> 2 (2014): e603.</li>
                <li><a href="https://sourceforge.net/projects/maxbin/">MaxBin 2.0</a>: Wu, Yu-Wei, Blake A. Simmons, and Steven W. Singer. "MaxBin 2.0: an automated binning algorithm to recover genomes from multiple metagenomic datasets." <i>Bioinformatics</i> (2015): btv638.</li>
                <li><a href="http://claczny.github.io/VizBin/">VizBin</a>: Laczny, Cedric C., et al. "VizBin-an application for reference-independent visualization and human-augmented binning of metagenomic data." <i>Microbiome</i> 3.1 (2015): 1.</li>
                <li><a href="https://github.com/younglululu/COCACOLA">COCACOLA</a>: Lu, Yang Young, et al. "COCACOLA: binning metagenomic contigs using sequence COmposition, read CoverAge, CO-alignment, and paired-end read LinkAge." <i>Bioinformatics</i> (2016): btw290.</li>
                </ul>
            Most of these methods use differential coverage information. All programs will return a fasta file for each bin that they produce.
            </p>

            <h3>Demo data-set</h3>
            <p>
            A simulated dataset of short sequences consisting of three different samples, each containing 10.000.000  paired-end 100 nt reads, was created using the supplied error model for Illumina GA IIx with TrueSeq SBS Kit v5-GA using GemSim (<a href="http://www.ncbi.nlm.nih.gov/pubmed/22336055" target="_blank">McElroy, Luciani & Thomas, 2012</a>). Reads were derived from a set of 10 reference genomes and chosen with probability proportional to the species abundance and genome size (see table below).
            </p>
            <p>
            Subsequently, the simulated reads were co-assembled using MEGAHIT (<a href="http://www.ncbi.nlm.nih.gov/pubmed/25609793" target="_blank">Li et al, 2015</a>). Coverage for the three different samples was determined using bowtie2 (<a href="http://www.ncbi.nlm.nih.gov/pubmed/22388286" target="_blank">Langmead & Salzberg, 2012</a>). The assembly and differential coverage table were then used as input for two different binning programs (default parameters): MaxBin 2.0 (<a href="http://www.ncbi.nlm.nih.gov/pubmed/26515820" target="_blank">Wu, Simmons and Singer, 2015</a>) and MetaBAT (<a href="https://peerj.com/articles/1165/" target="_blank">Kang et al, 2015</a>).

            <table style="border-spacing: 10px; border-collapse: separate;">
                <tr style="font-weight: bolder;">
                    <td>Organism</td>
                    <td>GC%</td>
                    <td>Length (Mb)</td>
                    <td>Sample 1</td>
                    <td>Sample 2</td>
                    <td>Sample 3</td>
                </tr>
                <tr>
                    <td><i>Bacillus subtilis</i> subsp. <i>subtilis</i> str. 168</span></td>
                    <td>43.51</td>
                    <td>4.22</td>
                    <td>0.15</td>
                    <td>0.1</td>
                    <td>0.11</td>
                </tr>
                <tr>
                    <td><i>Escherichia coli</i> K12 substr. MG1655</td>
                    <td>50.79</td>
                    <td>4.64</td>
                    <td>0.02</td>
                    <td>0.04</td>
                    <td>0.14</td>
                </tr>
                <tr>
                    <td><i>Salmonella enterica</i> subsp. <i>enterica serovar Typhimurium</i> str. LT2</span></td>
                    <td>52.22</td>
                    <td>4.86</td>
                    <td>0.2</td>
                    <td>0.23</td>
                    <td>0.193</td>
                </tr>
                <tr>
                    <td><i>Shigella flexneri</i>  2a str. 2457T</td>
                    <td>50.9</td>
                    <td>4.61</td>
                    <td>0.14</td>
                    <td>0.13</td>
                    <td>0.092</td>
                </tr>
                <tr>
                    <td><i>Thioalkalivibrio sp.</i> K90mix</td>
                    <td>65.9</td>
                    <td>2.74</td>
                    <td>0.06</td>
                    <td>0.1</td>
                    <td>0.075</td>
                </tr>
                <tr>
                    <td><i>Lactococcus lactis</i> subsp. <i>lactis</i> Il1403</span></td>
                    <td>35.3</td>
                    <td>2.37</td>
                    <td>0.02</td>
                    <td>0.01</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td><i>Lactobacillus plantarum</i> WCFS1</td>
                    <td>44.5</td>
                    <td>3.31</td>
                    <td>0.17</td>
                    <td>0.13</td>
                    <td>0.14</td>
                </tr>
                <tr>
                    <td><i>Desulfovibrio vulgaris</i> str. Hildenborough</td>
                    <td>67.1</td>
                    <td>3.57</td>
                    <td>0.08</td>
                    <td>0.07</td>
                    <td>0.11</td>
                </tr>
                <tr>
                    <td><i>Streptococcus pneumoniae</i> R6</td>
                    <td>39.7</td>
                    <td>2.04</td>
                    <td>0.05</td>
                    <td>0.03</td>
                    <td>0.01</td>
                </tr>
                <tr>
                    <td><i>Rhodobacter sphaeroides</i> ATCC 1702</td>
                    <td>68.5</td>
                    <td>3.22</td>
                    <td>0.11</td>
                    <td>0.16</td>
                    <td>0.13</td>
                </tr>
            </table>


            </p>

            <h3 id="help_demo_files">Demo data files</h3>
            <p>
                <ul>
                    <li><a href="static/demo_assembly.fa" rel="nofollow">Assembly (30 mb)</a></li>
                    <li><a href="static/demo_differential_coverage.txt" rel="nofollow">Differential coverage table</a></li>
                    <li><a href="static/demo_maxbin_defaul_results.txt" rel="nofollow">Binning result (MaxBin, default settings)</a></li>
                    <li><a href="static/demo_metabat_default_results.txt" rel="nofollow">Binning result (MetaBAT, default settings)</a></li>

                </ul>
            </p>
        </div>
    </div>

    <footer-section></footer-section>
</div>
</template>

<script>
import FooterSection from 'components/FooterSection'

export default {
    components: {
        FooterSection
    }
}
</script>

<style>
.nav-link {
    color: #333 !important;
}

.nav-link.active {
    background: #ddd;
    border: 0;
}
</style>