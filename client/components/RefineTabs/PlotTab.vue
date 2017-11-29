<template>
<div class="p-3">
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <span>X-axis</span>
            <label class="custom-control custom-checkbox align-items-center m-1">
                <input type="checkbox" class="custom-control-input" v-model="xLog" :disabled="xIsPC">
                <span class="custom-control-indicator"></span>
                <span class="custom-control-description">Log scale</span>
            </label>
        </div>
        <select class="custom-select btn btn-secondary btn-xs" v-model="xData"
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
                <option v-for="sample in assembly.samples" :value="sample" :key="sample">
                    {{ sample }}
                </option>
            </optgroup>
        </select>
    </div>
    
    <div style="margin-top: .75rem">
        <div class="d-flex justify-content-between align-items-center">
            <span>Y-axis</span>
            <label class="custom-control custom-checkbox align-items-center m-1">
                <input type="checkbox" class="custom-control-input" v-model="yLog" :disabled="yIsPC">
                <span class="custom-control-indicator"></span>
                <span class="custom-control-description">Log scale</span>
            </label>
        </div>
        <select class="custom-select btn btn-secondary btn-xs" v-model="yData"
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
                <option v-for="sample in assembly.samples" :value="sample" :key="sample">
                    {{ sample }}
                </option>
            </optgroup>
        </select>
    </div>
    
    <div style="margin-top: .75rem">
        <div class="d-flex align-items-baseline justify-content-between">
            <span>Color by</span>
            <span class="fa fa-question-circle" title="Color the contigs by the bins of a bin-set or by their GC percentage.">
            </span>
        </div>
        <select class="custom-select btn btn-secondary btn-xs" v-model="colorBy" v-if="colorBy === 'gc'">
            <option value="gc">GC%</option>
            <optgroup label="Bin-set">
                <option v-for="bs in binSets" :key="bs.id" @click.prevent="setColorBinSet(bs.id)">
                    {{ bs.name }}
                </option>
            </optgroup>
        </select>
        <select class="custom-select btn btn-secondary btn-xs" v-model="colorBinSet" v-else>
            <option @click.prevent="colorBy = 'gc'">GC%</option>
            <optgroup label="Bin-set">
                <option v-for="bs in binSets" :value="bs.id" :key="bs.id">
                    {{ bs.name }}
                </option>
            </optgroup>
        </select>
    </div>

    <div class="mt-2">
        <a href="#" @click.prevent="showMore = !showMore">
            <span v-if="showMore">Less</span>
            <span v-else>More</span>
        </a>
        <div class="ml-2" v-if="showMore">
            <label class="custom-control custom-checkbox align-items-center">
                <input type="checkbox" class="custom-control-input" v-model="evenResolution">
                <span class="custom-control-indicator"></span>
                <span class="custom-control-description">Even resolution</span>
            </label>
        </div>
    </div>

    <div class="mt-3 d-flex justify-content-between align-items-center">
        <button class="btn btn-primary btn-sm pl-3 pr-3" :disabled="plot_" @click="$emit('update:plot_', true)">
            Plot
        </button>
        <slot name="export-btn"></slot>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            VAL_TO_NAME: {
                'gc': 'GC%',
                'length': 'Length (bp)',
                'pc_1': 'PC 1',
                'pc_2': 'PC 2',
                'pc_3': 'PC 3'
            }
        }
    },

    props: [
        'xData_',
        'yData_',
        'xLog_',
        'yLog_',
        'colorBy_',
        'colorBinSet_',
        'plot_',
        'showMore_',
        'evenResolution_'
    ],

    methods: {
        isPC(data) { 
            return data.substring(0, 3) === 'pc_' 
        },
        valToName(val) {
            return this.VAL_TO_NAME[val] || val
        },
        setColorBinSet(bs) {
            this.colorBy = 'binSet'
            this.colorBinSet = bs
        }
    },

    computed: {
        ...mapState([
            'assembly',
            'binSets',
        ]),
        xIsPC() {
            return this.isPC(this.xData)
        },
        yIsPC() {
            return this.isPC(this.yData)
        },
        xData: {
            get() { return this.xData_ },
            set(value) { 
                if (this.isPC(value)) this.xLog = false
                this.$emit('update:xData_', value)
            }
        },
        yData: {
            get() { return this.yData_ },
            set(value) { 
                if (this.isPC(value)) this.yLog = false
                this.$emit('update:yData_', value) 
            }
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
        },
        showMore: {
            get() { return this.showMore_ },
            set(value) { this.$emit('update:showMore_', value) }
        },
        evenResolution: {
            get() { return this.evenResolution_ },
            set(value) { this.$emit('update:evenResolution_', value) }
        }
    }
}
</script>

<style scoped>
select {
    width: 100%;
}
</style>