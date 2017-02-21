<template>
<popover :options="{ closeable: true }">
    <button slot="button" class="btn btn-secondary btn-xs">
        <span class="fa fa-line-chart"></span>
        Plot
    </button>

    <div slot="body" style="width: 25rem; overflow-x: hidden">
        <h5>Plot parameters</h5>

        <div class="row align-items-center" style="margin-bottom: .5rem">
            <div class="col-4">
                <span>X-axis</span>
            </div>
            <div class="col-4">
                <select class="custom-select btn btn-secondary btn-xs" style="width: 100%" v-model="x">
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
            <div class="col-4">
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" v-model="xLogAxis">
                        Log scale
                </label>
            </div>
        </div>

        <div class="row align-items-center" style="margin-bottom: .5rem">
            <div class="col-4">
                <span>Y-axis</span>
            </div>
            <div class="col-4">
                <select class="custom-select btn btn-secondary btn-xs" style="width: 100%" v-model="y">
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
            <div class="col-4">
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" v-model="yLogAxis">
                        Log scale
                </label>
            </div>
        </div>

        <div class="row align-items-center" style="margin-bottom: .5rem">
            <div class="col-4">
                <span>Color by</span>
            </div>
            <div class="col-4">
                <select class="custom-select btn btn-secondary btn-xs" style="width: 100%" v-model="by">
                    <option value="binSet">Bin set</option>
                    <option value="gc">GC%</option>
                </select>
            </div>
            <div class="col-4">
                <select class="custom-select btn btn-secondary btn-xs" style="width: 100%" v-model="binSet"
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
</popover>
</template>

<script>
import Popover from '../components/Popover'

export default {
    components: {
        Popover
    },

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
        assembly() {
            return this.$store.state.assembly
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
