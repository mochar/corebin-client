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
        <div class="card info-card">
            <ul class="list-group">
                <li class="list-group-item" v-for="a in assemblies" :class="{ unselected: a !== assembly }"
                    @click="selectAssembly(a)">
                    <div class="card-block name-block">
                        <span class="name" id="assembly-name">{{ a.name }}</span>

                        <div class="dropdown float-xs-right" v-show="a === assembly">
                            <button class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" id="open-menu">
                                <span class="fa fa-ellipsis-v"></span>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="#">
                                    <span class="fa fa-pencil text-primary"></span> Rename
                                </a>
                                <a class="dropdown-item" href="#">
                                    <span class="fa fa-trash text-danger"></span> Delete
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="card-block" style="padding: .5rem 1rem;" v-if="a === assembly">
                        <div class="bin-set-list">
                            <div v-for="bs in binSets" class="list-item">
                                {{ bs.name }}
                                <a href="#" class="float-xs-right" @click.prevent="">Overview</a>
                            </div>
                            <button class="btn btn-outline-primary btn-sm btn-block">Add bin set</button>
                        </div>
                        <button class="btn btn-sm btn-primary btn-block" id="add-bs-btn" v-show="binSets.length">
                            <span class="fa fa-balance-scale"></span> Compare bin sets
                        </button>
                        <p class="card-text" style="margin-top: .5rem">
                            <small class="text-muted">Added one day ago</small>
                        </p>
                    </div>
                </li>
            </ul>
            <div class="card-footer text-muted" style="padding: 0">
                <button class="btn btn-outline-secondary btn-block" id="add-btn" style="color: #666" data-toggle="tooltip"
                    data-placement="bottom" title="Click me to begin">
                    <span class="fa fa-plus"></span> Assembly
                </button>
            </div>
        </div>
        
        <div class="float-xs-right">
            <small><a href="#help">Stuck or need more info?</a></small> <br>
            <small class="text-muted">Made by Mohammed Charrout</small> <br>
            <small class="text-muted">Supervised by Lex Overmars</small>
        </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

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
        },
        selectAssembly(assembly) {
            this.$store.dispatch('SELECT_ASSEMBLY', assembly).then(() => {
            })
        },
    },
    
    computed: {
        ...mapState([
            'assemblies',
            'assembly',
            'binSets'
        ])
    },
    
    beforeMount() {
        // Fetch data from server
        this.$store.dispatch('GET_ASSEMBLIES').then(() => {
            this.loading = false
            if (!this.assembly) $('[data-toggle="tooltip"]').tooltip('show')
        })
    }
}
</script>

<style>
#assembly-name::before {
    content: "Assembly ";
}

.bin-set-list {
    padding-left: 1rem;
    border-left: 1px solid #ccc;
}

.list-item {
    margin: .5rem 0; 
}

#add-bs-btn {
    margin-top: 1rem;
}

#add-btn {
    border: 0;
}

.unselected {
    opacity: .3;
}

.unselected span {
    font-size: large;
}

.unselected:hover {
    opacity: .9;
    transition: opacity .15s ease-in-out;
    cursor: pointer;
}

#open-menu {
    border: 0;
}
</style>

<style scoped>
.info-card {
    border-left-width: 1px;
}

.btn-sm {
    padding: .25rem .5rem; 
}

.list-group-item {
    padding: 0;
}

button.dropdown-toggle::after {
    display: none;
}

button.dropdown-toggle {
    padding: .5rem;
}
</style>