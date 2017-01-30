<template>
<div class="card" id="refine">
    <div class="text-center" id="plot-btns">
        <plot-popover
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
            @updateYLog="log => { yLog = log }">
        </plot-popover>
        <refine-popover
            :loading="loading"
            @move="moveContigs"
            :selectedCount="selectedContigs.length">
        </refine-popover>
        <bins-popover 
            @remove="removeBin"
            @get="pushBin"
            :loading="loading" 
            :selected="selectedBins">
        </bins-popover>
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
</div>
</template>

<script>
import Scatter from '../charts/Scatter'
import PlotPopover from '../components/PlotPopover'
import BinsPopover from '../components/BinsPopover'
import RefinePopover from '../components/RefinePopover'

export default {
    data() {
        return {
            xData: 'gc',
            yData: 'length',
            // selectedBins: [],
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
        PlotPopover,
        BinsPopover,
        RefinePopover
    },

    methods: {
        moveContigs(toBin) {
            this.loading = true
            const data = { action: 'move', contigs: this.selectedContigs, to_bin: toBin.id }
            $.ajax({
                url: `${ROOTURL}/a/${this.assembly.id}/bs/${this.binSet.id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(data)
            }).then(() => {
                let contigs = $.extend(true, [], this.contigs) // deep-copy

                // First, update the bin attr of the selected contigs
                contigs.forEach(contig => {
                    if (this.selectedContigs.indexOf(contig.id) > -1) {
                        contig.bin = toBin.id
                        contig[`color_${this.binSet.id}`] = toBin.color
                    } 
                })
                // Then, unselect all contigs as these have now been moved
                this.selectedContigs = []
                // Then, filter out the contigs which have been moved to an unselected bin
                const selectedBins = this.selectedBins.map(bin => bin.id)
                contigs = contigs.filter(contig => {
                    return selectedBins.indexOf(contig.bin) > -1
                })
                // Then, commit to store
                this.$store.commit('SET_CONTIGS', contigs)
                // Finally, update refetch bins
                this.$store.dispatch('GET_BINS').then(() => this.loading = false)
            }, () => {
                this.loading = false
            })
        },
        removeBin(bin) {
            this.loading = true
            this.$store.commit('REMOVE_REFINE_BIN', bin)
            this.loading = false
        },
        pushBin(bin) {
            this.loading = true
            this.$store.dispatch('PUSH_REFINE_BIN', bin).then(() => {
                this.loading = false
            })
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
        },
        selectedBins() {
            return this.$store.state.refineBins
        },
        contigs() {
            return this.$store.state.contigs
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
#refine {
    border-right: 0;
    min-height: 100vh;
}

#plot-btns {
    display: block;
    position: absolute;
    width: 50%;
    right: 25%;
}

#plot-btns button {
    padding: .2rem 1rem;
}
</style>