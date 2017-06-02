<template>
<div class="card-block">
    <div>
        <div class="d-flex justify-content-between">
            <span>X-axis</span>
            <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="xLog"> Log scale
            </label>
        </div>
        <select class="custom-select btn btn-secondary btn-xs col-6" v-model="xData">
            <optgroup label="Sequence">
                <option value="gc">GC%</option>
                <option value="length">Length (bp)</option>
            </optgroup>
            <optgroup label="Tetranucleotides (PCA)" v-if="assembly.hasFourmerfreqs">
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
    
    <div style="margin-top: .75rem">
        <div class="d-flex justify-content-between">
            <span>Y-axis</span>
            <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="yLog"> Log scale
            </label>
        </div>
        <select class="custom-select btn btn-secondary btn-xs col-6" v-model="yData">
            <optgroup label="Sequence">
                <option value="gc">GC%</option>
                <option value="length">Length (bp)</option>
            </optgroup>
            <optgroup label="Tetranucleotides (PCA)" v-if="assembly.hasFourmerfreqs">
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
    
    <div style="margin-top: .75rem">
        <span>Color by</span>
        <div class="row align-items-center">
            <div class="col-6">
                <select class="custom-select btn btn-secondary btn-xs" v-model="colorBy">
                    <option value="binSet">Bin set</option>
                    <option value="gc">GC%</option>
                </select>
            </div>
            <div class="col-6" v-show="colorBy === 'binSet'">
                <select class="custom-select btn btn-secondary btn-xs" v-model="colorBinSet">
                    <option v-for="bs in binSets" :value="bs.id">{{ bs.name }}</option>
                </select>
            </div>
        </div>
    </div>

    <div style="margin-top: .75rem">
        <span>
            <span class="fa fa-download"></span>
            Export
        </span>
        <div class="row align-items-center">
            <div class="col-6">
                <button class="btn btn-secondary btn-sm w-100" @click="showExportModal">
                    As PNG
                </button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    methods: {
        showExportModal() {
            $('#refine-export-modal').modal('show')
        }
    },

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