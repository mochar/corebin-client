<template>
<div class="card card-body" id="home-main">
    <h2>
        <img src="logo.svg" style="height: 5rem"> CoReBIN
        <small class="text-muted">Comparison and Refinement of metagenomic bins</small>
    </h2>

    <p class="lead rounded" id="lead">
        CoReBIN is a user-friendly web-based tool to compare the results of different binning methods and to aid manual refinement of the bins. The binning result of two different methods can be visually compared in a chord diagram. Individual bins can be inspected and refined using GC%, coverage and tetranucleotide frequencies.
    </p>

    <nav class="d-flex align-items-baseline justify-content-between">
        <span class="fw-500" style="font-size: 1.1rem">How it works</span>

        <div class="nav">
            <a class="nav-link" href="#" @click.prevent="toStep(1)" :class="{ active: step === 1 }">
                <span class="fa fa-upload fa-fw"></span>
                1. Upload
            </a>
            <a class="nav-link" href="#" @click.prevent="toStep(2)" :class="{ active: step === 2 }">
                <span class="fa fa-balance-scale fa-fw"></span>
                2. Compare
            </a>
            <a class="nav-link" href="#" @click.prevent="toStep(3)" :class="{ active: step === 3 }">
                <span class="fa fa-wrench fa-fw"></span>
                3. Refine
            </a>
        </div>
    </nav>

    <div>
        <p v-if="step === 1">
            Upload your assembly contigs and the binning results.
        </p>
        <p v-if="step === 2">
            Compare different sets of bins in a chord diagram.
        </p>
        <p v-if="step === 3">
            Examine the differences further in the refine plot, and refine the bins to your liking.
        </p>
    </div>

    <transition-group :name="name" tag="div" class="card-body" id="guide-div">
        <div v-if="step === 1" key="1" class="guide-item">
            <div class="d-flex align-items-center flex-column">
                <assembly :assembly="assembly" style="width: 260px"></assembly>
                <svg width="260" height="43">
                    <defs>
                        <marker id="arrowhead" viewBox="-0 -5 10 10" refX="5" refY="0"
                            markerWidth="4" markerHeight="4" orient="auto">
                            <path d="M0,-5L10,0L0,5" fill="#ccc" stroke="none"></path>
                        </marker>
                    </defs>

                    <line x1="130" y1="0" x2="130" y2="20" stroke-width="3"
                        stroke="#ccc"></line>
                    <line x1="130" y1="20" x2="40" y2="20" stroke-width="3"
                        stroke="#ccc"></line>
                    <line x1="130" y1="20" x2="230" y2="20" stroke-width="3"
                        stroke="#ccc"></line>
                    <line x1="229" y1="20" x2="229" y2="38" stroke-width="3"
                        stroke="#ccc" marker-end="url(#arrowhead)"></line>
                    <line x1="41" y1="20" x2="41" y2="38" stroke-width="3"
                        stroke="#ccc" marker-end="url(#arrowhead)"></line>
                </svg>
            </div>
        </div>
        <div v-if="step === 1 || step === 2" key="1-2" class="guide-item">
            <div class="d-flex justify-content-center" style="position: relative"
                 :id="step === 1 ? 'bin-sets-1': 'bin-sets-2'">
                <bin-set-mock :bin-set="binSet1" ></bin-set-mock>
                <bin-set-mock :bin-set="binSet2" style="margin-bottom: .2rem"></bin-set-mock>
            </div>
        </div>
        <div class="guide-item" v-if="step === 2" key="2">
            <div class="d-flex justify-content-center">
                <img src="chord.png" style="max-height: 300">
            </div>
        </div>
        <div v-if="step === 3" key="3" class="guide-item">
            <span class="d-flex justify-content-center">
                oh <b>HECK</b>! did me a good <span class="text-danger">frighten</span> fren
            </span>
        </div>
    </transition-group>
</div>
</template>

<script>
import Assembly from 'components/Assembly'
import BinSetMock from 'components/BinSetMock'

export default {
    data() {
        return {
            assembly: {
                "hasFourmerfreqs": false,
                "size": 2061,
                "name": "Assembly",
                "genesSearched": false,
                "samples": [],
                "submitDate": "3 days",
                "binSets": 2,
                "id": 1,
                "plotData": {"length":{"bins":[1003.0,71630.92307692308,142258.84615384616,212886.76923076925,283514.6923076923,354142.6153846154,424770.5384615385,495398.46153846156,566026.3846153846,636654.3076923077,707282.2307692308,777910.1538461539,848538.076923077,919166.0],"hist":[1953,65,21,9,6,3,2,0,0,0,0,1,1]},"gc":{"bins":[0.0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0],"hist":[0,0,3,183,617,1093,162,3,0,0]}}
            },
            binSet1: {
                "submitDate": "3 days",
                "bins": [],
                "name": "Bin-set 1",
                "color": "#060168",
                "assembly": 1,
                "colors":[{"percentage":0.4881125667151868,"color":"#268e09"},{"percentage":0.14750121300339641,"color":"#637a06"},{"percentage":0.0849102377486657,"color":"#ba2110"},{"percentage":0.07763221737020863,"color":"#049663"},{"percentage":0.061620572537603106,"color":"#1c0101"},{"percentage":0.042212518195050945,"color":"#078467"},{"percentage":0.038816108685104316,"color":"#12007c"},{"percentage":0.033964095099466275,"color":"#098e66"},{"percentage":0.023289665211062592,"color":"#0d7093"},{"percentage":0.0019408054342552159,"color":"#939393"}],
                "id": 1
            },
            binSet2: {
                "submitDate": "3 days",
                "bins": [],
                "name": "Bin-set 2",
                "color": "#c47011",
                "assembly": 1,
                "colors":[{"percentage":0.5924308588064047,"color":"#939393"},{"percentage":0.17758369723435224,"color":"#090a66"},{"percentage":0.059194565744784086,"color":"#c005c6"},{"percentage":0.033964095099466275,"color":"#1b027f"},{"percentage":0.030082484230955848,"color":"#013a84"},{"percentage":0.026200873362445413,"color":"#1b0c8c"},{"percentage":0.021348859776807377,"color":"#b52d03"},{"percentage":0.019408054342552158,"color":"#4b0f96"},{"percentage":0.017467248908296942,"color":"#04126d"},{"percentage":0.012130033964095099,"color":"#0d9940"},{"percentage":0.010189228529839884,"color":"#15088e"}],
                "id": 2
            },
            step: 1,
            name: 'guide'
        }
    },

    components: {
        Assembly,
        BinSetMock
    },

    methods: {
        toStep(num) {
            this.name = this.step < num ? 'guide' : 'guide-reverse'
            this.step = num
        }
    }
}
</script>

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

#guide-div {
    overflow: hidden;
    position: relative;
}

#bin-sets-2 > div:first-child {
    transform: translateX(-150px);
}
#bin-sets-2 > div:last-child {
    transform: translateX(150px);
}

.guide-item {
  transition: all .2s;
  display: inline-block;
  width: 100%;
}
.guide-enter {
  opacity: 0;
  transform: translateY(150px);
}
.guide-leave-to {
  opacity: 0;
  transform: translateY(-150px);
}
.guide-leave-active {
  position: absolute;
}

.guide-reverse-enter {
  opacity: 0;
  transform: translateY(-150px);
}
.guide-reverse-leave-to {
  opacity: 0;
  transform: translateY(150px);
}
.guide-reverse-leave-active {
  position: absolute;
}
</style>

<style scoped>
.btn-outline-secondary {
    color: #333 !important;
}

.bin-set {
    width: 260px;
    transition: all 300ms ease-out;
}
</style>