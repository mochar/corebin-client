<template>
<div class="row">
    <div class="col-xs-9">
        <div class="card card-block">
            <h2>CoReBIN <small class="text-muted">Comparison and Refinement of metagenomic binning</small></h2>
            <hr>

            <p>
                CoReBIN is a user-friendly web-based tool to compare the results of different binning methods and to aid manual refinement of the bins. The binning result of two different methods can be visually compared in a chord diagram. Individual bins can be inspected and refined using GC%, coverage and tetranucleotide frequencies.               
            </p>
            
            <h4>Getting started</h4>
            <p>
                <ol>
                <li><b>Upload your metagenomic assembly (fasta format)</b> in the "1. Upload assembly"-box; enter a name, select your file and click "Save assembly". It is beneficial to also upload a table with (differential-) coverage information on your assembly.</li>
                <li>Next you can <b>upload your metagenomic binning results </b> in the "2. Upload bin set"-box. To do so, you need a file in which the contig ID if followed by the bin number (e.g. contig </t> binID).</li>
                <li>Now, <b>inspect your metagenomic assembly and bins</b> in the "Overview"-tab and <b>refine individual bins</b> in the "Refine"-tab.</li>
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
    </div>
    <div class="col-xs-3">
        <div class="card">
            <div class="card-header">
                <strong>1. Upload assembly</strong>
            </div>
            <div class="card-block">
                <form name="assembly-form" method="post"
                      enctype="multipart/form-data" @submit.prevent="submitAssembly">
                    <div class="form-group">
                        <label for="name">Assembly name</label>
                        <input type="text" class="form-control form-control-sm" name="name">
                    </div>
                    
                    <div class="form-group">
                        <label for="contigs">Assembly file (fasta)</label>
                        <input type="file" name="contigs" class="form-control-file form-control-sm">
                    </div>
                    
                    <div class="form-check">
                        <label class="form-check-label">
                            <input type="checkbox" class="form-check-input" name="fourmers"> 
                            Calculate tetranucleotide frequencies
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label for="fasta">Coverage table</label>
                        <input type="file" name="coverage" class="form-controle-file form-control-sm">
                    </div>
                    
                    <button type="submit" class="btn btn-secondary float-xs-right btn-sm" :disabled="assemblyLoading">
                        <span class="fa fa-refresh fa-spin" v-show="assemblyLoading"></span>
                        Save Assembly
                    </button>
                </form>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <strong>2. Upload binning results</strong>
            </div>
            <div class="card-block">
                <form name="bin-set-form" method="post"
                      enctype="multipart/form-data">
                    
                    <div class="form-group">
                        <label for="name">Bin-set name</label>
                        <input type="text" class="form-control form-control-sm" name="name">
                    </div>
                    
                    <div class="form-group">
                        <label for="bins">Bin-set file</label>
                        <input type="file" class="form-control-file form-control-sm" name="bins">
                    </div>
                
                    <button type="submit" class="btn btn-secondary float-xs-right btn-sm" :disabled="binSetLoading">
                        <span class="fa fa-refresh fa-spin" v-show="binSetLoading"></span>
                        Save bin-set
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            assemblyLoading: false,
            binSetLoading: false
        }
    },

    methods: {
        submitAssembly(event) {
            const formData = new FormData(event.srcElement)
            this.$store.dispatch('SUBMIT_ASSEMBLY', { formData })
        }
    },
    
    beforeMount() {
        // Fetch data from server
        this.$store.dispatch('GET_ASSEMBLIES').then(() => {
            this.loading = false
        })
    }
}
</script>

<style>
</style>