<template>
<div class="card row bin-container">
    <div class="col-xs-2 bin-name-container text-xs-center">
        <div class="row">
            <div class="col-xs-3 left-buttons">
                <button class="btn btn-sm btn-xs btn-secondary">
                    <span class="fa fa-fw fa-pencil"></span>
                </button>
                <button class="btn btn-sm btn-xs btn-secondary">
                    <span class="fa fa-fw fa-trash text-danger"></span>
                </button>
            </div>
            <div class="col-xs-9">
                <div class="bin-name">
                    <small class="text-muted">Bin</small>
                    <h5 class="align-middle">{{ bin.name }}</h5>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-xs-8 bin-info">
        <div class="row">
            <div class="col-xs-2"><small class="text-muted">Size (bp)</small></div>
            <div class="col-xs-9"><div class="bar" :style="{ width: sizeBarPercent + '%', 'background-color': bin.color }"></div></div>
            <div class="col-xs-1"><small class="text-muted">{{ bin.size }}</small></div>
            <br>
            <div class="col-xs-2"><small class="text-muted">GC</small></div>
            <div class="col-xs-9"><div class="bar" :style="{ width: gc + '%', 'background-color': bin.color }"></div></div>
            <div class="col-xs-1"><small class="text-muted">{{ gc }}%</small></div>
            <br>
            <div class="col-xs-2"><small class="text-muted">contamination</small></div>
            <div class="col-xs-9"><div class="bar" :style="{ width: contamination + '%', 'background-color': bin.color }"></div></div>
            <div class="col-xs-1"><small class="text-muted">{{ contamination }}%</small></div>
            <br>
            <div class="col-xs-2"><small class="text-muted">completeness</small></div>
            <div class="col-xs-9"><div class="bar" :style="{ width: completeness + '%', 'background-color': bin.color }"></div></div>
            <div class="col-xs-1"><small class="text-muted">{{ completeness }}%</small></div>
        </div>
    </div>
    
    <div class="col-xs-2 bin-actions-container">
        <div class="bin-actions">
            <router-link to="/refine" class="btn btn-sm btn-xs btn-secondary btn-block">
                Refine
            </router-link>
            <button class="btn btn-link btn-sm btn-xs btn-block" @click="more = true" v-show="!more">
                <span class="fa fa-caret-down"></span> More
            </button>
            <button class="btn btn-link btn-sm btn-xs btn-block" @click="more = false" v-show="more">
                <span class="fa fa-caret-up"></span> Less
            </button>
        </div>
    </div>
    
    <div v-if="more" class="col-xs-12 more-container">
        <div class="row">
            <div class="col-xs-4">
            </div>
            <div class="col-xs-4">
                <h6>Contig GC%</h6>
                <histogram :plotData="gcData"></histogram>
            </div>
            <div class="col-xs-4">
                <h6>Contig length</h6>
                <histogram :plotData="lengthData" :format="true"></histogram>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import Histogram from '../charts/Histogram'

export default {
    data() {
        return {
            more: false,
            gcData: {bins: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], hist: [0, 0, 0, 21, 908, 520, 1982, 66, 0, 0]},
            lengthData: {bins: [1005.0, 2463.923076923077, 3922.846153846154, 5381.7692307692305, 6840.692307692308, 8299.615384615385, 9758.538461538461, 11217.461538461539, 12676.384615384615, 14135.307692307691, 15594.23076923077, 17053.153846153844, 18512.076923076922, 19971.0], hist: [139, 26, 10, 5, 6, 8, 3074, 37, 36, 43, 43, 33, 37]}
        }
    },
    
    props: ['bin', 'maxSize', 'minSize'],
    
    components: {
        Histogram
    },
    
    computed: {
        sizeBarPercent() {
            const percentage = ((this.bin.size - this.minSize) * 100) / (this.maxSize - this.minSize)
            return +percentage.toFixed(2)
        },
        gc() {
            return +(this.bin.gc * 100).toFixed(2)
        },
        contamination() {
            return this.bin.contamination * 100
        },
        completeness() {
            return this.bin.completeness * 100
        }
    }
}
</script>

<style>
.bin-container {
    border-left-width: 3px;
    transition: border-left-width .15s ease-in-out; 
}

.bin-container:hover {
    border-left-width: 6px;
}

.bin-name {
    border-right: 1px solid #eee;
    padding: .25rem;
}

.bin-actions {
    border-left: 1px solid #eee;
    padding: .25rem;
    padding-left: .5rem;
}

.bin-name-container, .bin-actions-container {
    padding: .5rem .5rem;
}

.bar {
    background-color: red;
    padding: 3px;
    margin: .4rem 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.more-container {
    padding: 1rem;
    border-top: 1px dashed #eee;
}

.left-buttons > button {
    border: 0;
    opacity: 0;
    transition: opacity .15s ease-in-out; 
}

.bin-container:hover .left-buttons > button {
    opacity: 1;
}
</style>