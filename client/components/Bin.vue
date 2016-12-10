<template>
<router-link 
    class="card card-block bin-container"
    tag="div"
    :to="`/overview/${bin.id}`" 
    @mouseover="hover = true" 
    @mouseout="hover = false">
    <div class="row"> 
        <div class="col-xs-5">
            <h6>{{ bin.name }}</h6>
        </div>
        <div class="col-xs-7">
        </div>
    </div>

    <div class="row bars">
        <div class="col-xs-3">
            <small class="text-muted" v-show="!hover">Size (bp)</small>
            <small class="text-muted" v-show="hover">{{ bin.size }}</small>
        </div>
        <div class="col-xs-9 bar-container">
            <div class="bar" :style="{ width: sizeBarPercent + '%', 'background-color': bin.color }"></div>
        </div>
        <br>
        <div class="col-xs-3">
            <small class="text-muted" v-show="!hover">GC</small>
            <small class="text-muted" v-show="hover">{{ gc }}%</small>
        </div>
        <div class="col-xs-9 bar-container">
            <div class="bar" :style="{ width: gc + '%', 'background-color': bin.color }"></div>
        </div>
        <br>
        <div class="col-xs-3">
            <small class="text-muted" v-show="!hover">contamination</small>
            <small class="text-muted" v-show="hover">{{ contamination }}%</small>
        </div>
        <div class="col-xs-9 bar-container">
            <div class="bar" :style="{ width: contamination + '%', 'background-color': bin.color }"></div>
        </div>
        <br>
        <div class="col-xs-3">
            <small class="text-muted" v-show="!hover">completeness</small>
            <small class="text-muted" v-show="hover">{{ completeness }}%</small>
        </div>
        <div class="col-xs-9 bar-container">
            <div class="bar" :style="{ width: completeness + '%', 'background-color': bin.color }"></div>
        </div>
    </div>
</router-link>
</template>

<script>
import { mapMutations } from 'vuex'
import Popover from '../components/Popover'

export default {
    data() {
        return {
            hover: false
        }
    },
    
    props: ['bin', 'maxSize', 'minSize', 'simple'],
    
    components: {
        Popover
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

<style scoped>
.bin-container:hover {
    -webkit-box-shadow: inset 0px 0px 1px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: inset 0px 0px 1px 0px rgba(0,0,0,0.75);
    box-shadow: inset 0px 0px 1px 0px rgba(0,0,0,0.75);
    cursor: pointer;
}
</style>

<style>
.bin-container {
    padding: .5rem 1rem;
    margin-bottom: 0;
    border-left: 0;
    border-right: 0;
}

.bar {
    padding: 3px;
    margin: .4rem 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.bar-container {
    padding-left: 0;
}

.bin-name {
    font-weight: 500;
}

.bars .col-xs-3 {
    text-align: right;
}
</style>