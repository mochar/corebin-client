<template>
<div class="card row bin-container">
    <div class="col-xs-10 bin-info">
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
    <div class="col-xs-2 buttons">
        <button class="btn btn-sm btn-secondary btn-block">
            View
        </button>
        <button class="btn btn-sm btn-secondary btn-block">
            Refine
        </button>
    </div>
</div>
</template>

<script>
export default {
    props: ['bin', 'maxSize', 'minSize'],
    
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
.buttons > button {
    padding-top: .25rem;
    padding-bottom: .25rem;
}
</style>