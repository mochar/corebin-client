<template>
<div class="card-block">
    <div>
        <span class="text-muted">Horizontal axis</span>
        <div class="row align-items-center">
            <div class="col-6">
                <select class="custom-select btn btn-secondary btn-xs col-6" v-model="xData">
                    <optgroup label="Sequence">
                        <option value="gc">GC</option>
                        <option value="length">Length</option>
                    </optgroup>
                    <optgroup label="PCA" v-if="assembly.hasFourmerfreqs">
                        <option value="pc_1">PC 1</option>
                        <option value="pc_2">PC 2</option>
                        <option value="pc_3">PC 3</option>
                    </optgroup>
                    <optgroup label="Coverage" v-if="assembly.samples.length > 0">
                        <option v-for="sample in assembly.samples" :value="sample">
                            {{ sample }}
                        </option>
                    </optgroup>
                </select>
            </div>
            <div class="col-6">
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" v-model="xLog"> Log scale
                </label>
            </div>
        </div>
    </div>
    
    <div style="margin-top: .5rem">
        <span class="text-muted">Vertical axis</span>
        <div class="row align-items-center">
            <div class="col-6">
                <select class="custom-select btn btn-secondary btn-xs col-6" v-model="yData">
                    <optgroup label="Sequence">
                        <option value="gc">GC</option>
                        <option value="length">Length</option>
                    </optgroup>
                    <optgroup label="PCA" v-if="assembly.hasFourmerfreqs">
                        <option value="pc_1">PC 1</option>
                        <option value="pc_2">PC 2</option>
                        <option value="pc_3">PC 3</option>
                    </optgroup>
                    <optgroup label="Coverage" v-if="assembly.samples.length > 0">
                        <option v-for="sample in assembly.samples" :value="sample">
                            {{ sample }}
                        </option>
                    </optgroup>
                </select>
            </div>
            <div class="col-6">
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" v-model="yLog"> Log scale
                </label>
            </div>
        </div>
    </div>
    
    <div style="margin-top: .5rem">
        <span class="text-muted">Color by</span>
        <div class="row align-items-center">
            <div class="col-6">
                <select class="custom-select btn btn-secondary btn-xs" v-model="colorBy">
                    <option value="binSet">Bin set</option>
                    <option value="gc">GC</option>
                </select>
            </div>
            <div class="col-6" v-show="colorBy === 'binSet'">
                <select class="custom-select btn btn-secondary btn-xs" v-model="colorBinSet">
                    <option v-for="bs in binSets" :value="bs.id">{{ bs.name }}</option>
                </select>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    computed: {
        assembly() {
            return this.$store.state.assembly
        },
        binSets() {
            return this.$store.state.binSets
        },
        xData: {
            get() { return this.$store.state.xData },
            set(value) { this.$store.commit('SET_PLOT_VALUE', { key: 'xData', value }) }
        },
        yData: {
            get() { return this.$store.state.yData },
            set(value) { this.$store.commit('SET_PLOT_VALUE', { key: 'yData', value }) }
        },
        xLog: {
            get() { return this.$store.state.xLog },
            set(value) { this.$store.commit('SET_PLOT_VALUE', { key: 'xLog', value }) }
        },
        yLog: {
            get() { return this.$store.state.yLog },
            set(value) { this.$store.commit('SET_PLOT_VALUE', { key: 'yLog', value }) }
        },
        colorBy: {
            get() { return this.$store.state.colorBy },
            set(value) { this.$store.commit('SET_PLOT_VALUE', { key: 'colorBy', value }) }
        },
        colorBinSet: {
            get() { return this.$store.state.colorBinSet },
            set(value) { this.$store.commit('SET_PLOT_VALUE', { key: 'colorBinSet', value }) }
        }
    }
}
</script>

<style scoped>
select {
    width: 100%;
}
</style>