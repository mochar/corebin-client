<template>
<div id="plot-tab">
    <div class="row justify-content-center align-items-center">
        <div class="col-2">
            <span>Horizontal axis</span>
        </div>
        <div class="col-2">
            <select class="custom-select" style="width: 100%" v-model="x">
                <option value="gc">GC</option>
                <option value="length">Length</option>
            </select>
        </div>
        <div class="col-2">
            <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="xLogAxis">
                    Log scale
            </label>
        </div>
    </div>

    <div class="row justify-content-center align-items-center">
        <div class="col-2">
            <span>Vertical axis</span>
        </div>
        <div class="col-2">
            <select class="custom-select" style="width: 100%" v-model="y">
                <option value="gc">GC</option>
                <option value="length">Length</option>
            </select>
        </div>
        <div class="col-2">
            <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="yLogAxis">
                    Log scale
            </label>
        </div>
    </div>

    <div class="row justify-content-center align-items-center">
        <div class="col-2">
            <span>Color by</span>
        </div>
        <div class="col-2">
            <select class="custom-select" style="width: 100%" v-model="by">
                <option value="binSet">Bin set</option>
                <option value="gc">GC</option>
            </select>
        </div>
        <div class="col-2">
            <select class="custom-select" style="width: 100%" v-model="binSet"
                    v-if="by === 'binSet'">
                <option v-for="binSet in binSets" :value="binSet.id">
                    {{ binSet.name }}
                </option>
            </select>
            <label class="form-check-label" v-else>
                <input type="checkbox" class="form-check-input" v-model="legend">
                Legend
            </label>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: [
        'xData', 
        'yData', 
        'colorBy', 
        'colorBinSet', 
        'showLegend',
        'xLog',
        'yLog'
    ],

    computed: {
        binSets() {
            return this.$store.state.binSets
        },
        x: {
            get() { return this.xData },
            set(val) { this.$emit('updateX', val) }
        },
        y: {
            get() { return this.yData },
            set(val) { this.$emit('updateY', val) }
        },
        by: {
            get() { return this.colorBy },
            set(val) { this.$emit('updateBy', val) }
        },
        binSet: {
            get() { return this.colorBinSet },
            set(val) { this.$emit('updateColor', val) }
        },
        legend: {
            get() { return this.showLegend },
            set(val) { this.$emit('updateLegend', val) }
        },
        xLogAxis: {
            get() { return this.xLog },
            set(val) { this.$emit('updateXLog', val) }
        },
        yLogAxis: {
            get() { return this.yLog },
            set(val) { this.$emit('updateYLog', val) }
        }
    }
}
</script>

<style>
#plot-tab > div {
    margin-bottom: .5rem;
}
</style>