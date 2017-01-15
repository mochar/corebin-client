<template>
<div class="card" id="refine">
    <div style="display: flex">
        <multiselect
            v-model="selectedBins"
            :multiple="true"
            :options="bins"
            :disabled="loading"
            :custom-tag-style="option => { return {'background': option.color} }"
            @select="getContigs"
            @remove="removeContigs"
            selectLabel=""
            deselectLabel=""
            placeholder="Select bin"
            label="name"
            track-by="name">
        </multiselect>
    </div>
    <scatter
        :contigs="contigs"
        :xData="xData"
        :yData="yData"
        :xLog="xLog"
        :yLog="yLog"
        :colorBy="colorBy"
        :colorBinSet="colorBinSet"
        :showLegend="showLegend"
        @selected="selected => { selectedContigs = selected }"
    ></scatter>

    <div class="card" style="border-width: 1px 0 0 0">
        <div class="card-header" style="font-size: 1rem">
            <ul class="nav nav-tabs card-header-tabs" id="refine-nav">
                <li class="nav-item">
                    <a 
                        class="nav-link" 
                        href="#" 
                        :class="{ 'active': tab === 'PlotTab' }"
                        @click.prevent="tab = 'PlotTab'">
                        <span class="fa fa-line-chart"></span>
                        Plot
                    </a>
                </li>
                <li class="nav-item">
                    <a 
                        class="nav-link" 
                        href="#" 
                        :class="{ 'active': tab === 'SelectionTab' }"
                        @click.prevent="tab = 'SelectionTab'">
                        <span class="fa fa-tasks"></span>
                        Selection
                    </a>
                </li>
                <li class="nav-item">
                    <a 
                        class="nav-link" 
                        href="#"
                        :class="{ 'active': tab === 'RefinementTab' }"
                        @click.prevent="tab = 'RefinementTab'">
                        <span class="fa fa-wrench"></span>
                        Refinement
                    </a>
                </li>
            </ul>
        </div>
        <div class="card-block" style="font-size: 1rem">
            <component 
                :is="tab"

                :xData="xData"
                :yData="yData"
                :colorBy="colorBy"
                :colorBinSet="colorBinSet"
                :showLegend="legend"
                :xLog="xLog"
                :yLog="yLog"
                @updateX="x => { xData = x }"
                @updateY="y => { yData = y }"
                @updateBy="by => { colorBy = by }"
                @updateColor="bs => { colorBinSet = bs }"
                @updateLegend="show => { showLegend = show }"
                @updateXLog="log => { xLog = log }"
                @updateYLog="log => { yLog = log }"

                :contigs="selectedContigs"
            >
            </component>
        </div>
    </div>
</div>
</template>

<script>
import Scatter from '../charts/Scatter'
import Multiselect from 'vue-multiselect'
import PlotTab from '../components/PlotTab'
import SelectionTab from '../components/SelectionTab'
import RefinementTab from '../components/RefinementTab'

export default {
    data() {
        return {
            tab: 'PlotTab',
            contigs: [],
            xData: 'gc',
            yData: 'length',
            selectedBins: [],
            selectedContigs: [],
            loading: false,
            colorBy: 'binSet',
            colorBinSet: this.$store.state.binSet.id,
            showLegend: true,
            xLog: false,
            yLog: false
        }
    },
    
    components: {
        Scatter,
        Multiselect,
        PlotTab,
        SelectionTab,
        RefinementTab
    },

    methods: {
        getContigs(bin) {
            this.loading = true
            const payload = {
                fields: 'id,length,gc,name',
                bins: bin.id,
                coverages: true,
                pca: this.assembly.hasFourmerFreqs,
                colors: true,
                items: this.assembly.size
            }
            $.getJSON(`${ROOTURL}/a/${this.assembly.id}/c`, payload).then(data => {
                data.contigs.forEach(c => c.bin = bin.id)
                this.contigs.push(...data.contigs)
                this.loading = false
            }, () => {
                console.log('fail getContigs')
                this.loading = false
            })
        },
        removeContigs(bin) {
            this.contigs = this.contigs.filter(c => c.bin !== bin.id)
        }
    },

    computed: {
        assembly() {
            return this.$store.state.assembly
        },
        bins() {
            return this.$store.state.bins
        },
        binSet() {
            return this.$store.state.binSet
        }
    },

    watch: {
        binSet(binSet) {
            this.colorBinSet = binSet.id
        }
    }
}
</script>

<style>
.multiselect > div {
    border: 0;
}

#refine {
    border-right: 0;
    min-height: 100vh;
}

#refine-nav {
}
</style>