<template>
<div class="card-body">
    <div>
        <div class="d-flex justify-content-between">
            <span>X-axis</span>
            <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="xLog"> Log scale
            </label>
        </div>
        <select class="custom-select btn btn-secondary btn-xs col-6" v-model="xData"
                style="background-color: rgba(255, 255, 255, 0.67) !important">
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
        <select class="custom-select btn btn-secondary btn-xs col-6" v-model="yData"
                style="background-color: rgba(255, 255, 255, 0.67) !important">
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
                <select class="custom-select btn btn-secondary btn-xs" v-model="colorBy"
                        style="background-color: rgba(255, 255, 255, 0.67) !important">
                    <option value="binSet">Bin set</option>
                    <option value="gc">GC%</option>
                </select>
            </div>
            <div class="col-6" v-show="colorBy === 'binSet'">
                <select class="custom-select btn btn-secondary btn-xs" v-model="colorBinSet"
                        style="background-color: rgba(255, 255, 255, 0.67) !important">
                    <option v-for="bs in binSets" :value="bs.id">{{ bs.name }}</option>
                </select>
            </div>
        </div>
    </div>

    <div style="margin-top: .75rem">
        <span>
            <span class="fa fa-download"></span>
            <span class="fw-500" style="font-size: .8rem">EXPORT</span>
        </span>
        <div class="row align-items-center">
            <div class="col-6">
                <button class="btn btn-secondary btn-sm w-100" @click="showExportModal"
                        style="background-color: rgba(255, 255, 255, 0.67) !important">
                    As PNG
                </button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: [
        'xData_',
        'yData_',
        'xLog_',
        'yLog_',
        'colorBy_',
        'colorBinSet_'
    ],

    methods: {
        showExportModal() {
            $('#refine-export-modal').modal('show')
        }
    },

    computed: {
        ...mapState([
            'assembly',
            'binSets',
        ]),
        xData: {
            get() { return this.xData_ },
            set(value) { this.$emit('update:xData_', value) }
        },
        yData: {
            get() { return this.yData_ },
            set(value) { this.$emit('update:yData_', value) }
        },
        xLog: {
            get() { return this.xLog_ },
            set(value) { this.$emit('update:xLog_', value) }
        },
        yLog: {
            get() { return this.yLog_ },
            set(value) { this.$emit('update:yLog_', value) }
        },
        colorBy: {
            get() { return this.colorBy_ },
            set(value) { this.$emit('update:colorBy_', value) }
        },
        colorBinSet: {
            get() { return this.colorBinSet_ },
            set(value) { this.$emit('update:colorBinSet_', value) }
        }
    }
}
</script>

<style scoped>
select {
    width: 100%;
}
</style>