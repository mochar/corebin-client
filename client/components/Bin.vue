<template>
<div class="card info-card" id="bin-card" :style="{ 'border-left-color': bin.color }">
    <div class="row">
        <div class="col-xs-5" style="padding-right: 0">
            <div class="card-block name-block">
                <span class="name" id="bin-name">{{ bin.name }}</span>
                <div class="action-buttons float-xs-right">
                    <button type="button" class="btn btn-link">
                        <span class="fa fa-pencil text-primary"></span>
                    </button>
                    <button type="button" class="btn btn-link">
                        <span class="fa fa-trash text-danger"></span>
                    </button>
                </div>
            </div>
            
            <div class="card-block" id="content-card">
                <h6><span class="fa fa-cog fa-lg fa-pull-right"></span> Actions</h6>
                <hr style="margin-top: 0">
                <ul>
                    <li>
                        <a href="#" @click.prevent="">Assess quality</a>
                    </li>
                    <li>
                        <a href="#refine" @click="">Refine</a>
                    </li>
                    <li>
                        <a href="#compare" @click="">Compare</a>
                    </li>
                </ul>

                <h6 style="margin-top: 23px"><span class="fa fa-tasks fa-lg fa-pull-right"></span> Contigs</h6>
                <hr style="margin-top: 0">
            </div>
        </div>
        <div class="col-xs-7" id="plots">
            <h6>Contig GC%</h6>
            <histogram :plotData="gcData"></histogram>
            <hr>
            <h6>Contig length</h6>
            <histogram :plotData="lengthData" :format="true"></histogram>
        </div>
    </div>
</div>
</template>

<script>
import Histogram from '../charts/Histogram'

export default {
    data() {
        return {
            gcData: {bins: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], hist: [0, 0, 0, 21, 908, 520, 1982, 66, 0, 0]},
            lengthData: {bins: [1005.0, 2463.923076923077, 3922.846153846154, 5381.7692307692305, 6840.692307692308, 8299.615384615385, 9758.538461538461, 11217.461538461539, 12676.384615384615, 14135.307692307691, 15594.23076923077, 17053.153846153844, 18512.076923076922, 19971.0], hist: [139, 26, 10, 5, 6, 8, 3074, 37, 36, 43, 43, 33, 37]}
        }
    },
    
    components: {
        Histogram
    },
    
    computed: {
        bins() {
            return this.$store.state.bins
        },
        bin() {
            return this.$store.state.bin
        }
    },
    
    methods: {
    },

    created: function() {
        setTimeout(() => this.gcData.hist[0] = 1000, 3000)
    }
}
</script>

<style>
#bin-card {
}

#content-card {
    padding: 1.5rem .75rem;
}

#bin-name::before {
    content: "Bin ";
}

#plots {
    padding-top: .5rem;
    padding-left: 0;
    border-left: 1px solid #eee;
}

#plots > h6 {
    padding-left: 1rem;
}
</style>
