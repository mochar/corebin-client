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
        PlotPopover,
        BinsPopover,
        RefinePopover
    },

    methods: {
        getContigs(bin) {
            this.loading = true
            const payload = {
                fields: 'id,length,gc,name',
                bins: bin.id,
                coverages: true,
                pca: this.assembly.hasFourmerfreqs,
                colors: true,
                items: this.assembly.size
            }
            $.getJSON(`${ROOTURL}/a/${this.assembly.id}/c`, payload).then(data => {
                data.contigs.forEach(c => c.bin = bin.id)
                this.contigs.push(...data.contigs)
                this.loading = false
            }, () => {
                this.loading = false
            })
        },
        removeContigs(bin) {
            this.contigs = this.contigs.filter(c => c.bin !== bin.id)
        },
        moveContigs(toBin) {
            this.loading = true
            const data = { action: 'move', contigs: this.selectedContigs, to_bin: toBin.id }
            $.ajax({
                url: `${ROOTURL}/a/${this.assembly.id}/bs/${this.binSet.id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(data)
            }).then(() => {
                // First, update the bin attr of the selected contigs
                this.contigs.forEach(contig => {
                    if (this.selectedContigs.indexOf(contig.id) > -1) {
                        contig.bin = toBin.id
                        contig[`color_${this.binSet.id}`] = toBin.color
                    } 
                })
                // Then, unselect all contigs as these have now been moved
                this.selectedContigs = []
                // Then, filter out the contigs which have been moved to an unselected bin
                const selectedBins = this.selectedBins.map(bin => bin.id)
                this.contigs = this.contigs.filter(contig => {
                    return selectedBins.indexOf(contig.bin) > -1
                })
                // Finally, update refetch bins
                this.$store.dispatch('GET_BINS').then(() => this.loading = false)
            }, () => {
                this.loading = false
            })
        },
        removeBin(bin) {
            this.loading = true
            this.selectedBins = this.selectedBins.filter(bin => bin.id !== bin.id)
            this.removeContigs(bin)
            this.loading = false
        },
        pushBin(bin) {
            this.selectedBins.push(bin)
            this.getContigs(bin)
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