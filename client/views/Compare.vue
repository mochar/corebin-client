<template>
<div class="row" id="compare">
    <div class="col-3 app-left">
        <div class="navigation">
            <div class="sidebar-button" @click="$router.go(-1)">
                <span class="fa fa-angle-left fa-lg text-muted" style="font-weight: bold"></span>
            </div>
            <div>
                <strong class="sidebar-title text-muted text-center" style="padding-bottom: 0">
                    COMPARE
                </strong>
                <strong class="sidebar-sub text-muted text-center">
                    {{ assembly.name }}
                </strong>
            </div>
            <div></div>
        </div>

        <div class="card card2 mt-3">
            <ul class="nav nav-pills nav-fill pl-2 pr-2 pt-1">
                <li class="nav-item">
                    <a class="nav-link" href="#" 
                        :class="{active: tab === 'PlotTab'}"
                        @click.prevent="tab = 'PlotTab'">
                        <span class="fa fa-line-chart"></span>
                        Plot
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" 
                        :class="{active: tab === 'SelectionTab'}"
                        @click.prevent="tab = 'SelectionTab'">
                        <span class="fa fa-list"></span>
                        Bins
                    </a>
                </li>
            </ul>

            <component 
                :is="tab"

                :selectedBin="selectedBin"
                :selectedSet="selectedSet"
                :unselectedSet="unselectedSet"
                :connectedBins="connectedBins"
                :subConnectedBins="subConnectedBins"
                :hoveredBin="hoveredBin"
                :leftSelected="leftSelected"
                :bins_="bins_"
                :otherBins_="otherBins_"
                @binSelected="selectBin"
                @binHovered="b => hoveredBin = b"
                
                :binSet_.sync="binSet"
                :otherBinSet_.sync="otherBinSet"
                :by_.sync="by"
                :loading="loading"
                @plot="plot">
            </component>
        </div>

    </div>
    <div class="col-9 app-right">
        <div id="chord">
            <chord 
                :plotData="plotData" 
                :hoveredBin="hoveredBin"
                :selected="selectedBin"
                :selectedBinSet="selectedSet"
                :unselectedBinSet="unselectedSet"
                :binsMap="binsMap"
                :binSet="binSet"
                :otherBinSet="otherBinSet"
                @binSelected="selectBin"
                @binHovered="b => hoveredBin = b"
                @refine="refineBin"
            ></chord>
            <div v-show="otherBins_.length > 0">
                <h5 class="fw-500" style="position: absolute; right: .5rem; top: .5rem">{{ showBinSet }}</h5>
                <h5 class="fw-500" style="position: absolute; left: .5rem; top: .5rem">{{ showOtherBinSet }}</h5>
            </div>
            <span v-show="otherBins_.length === 0" class="text-muted empty-state-message">
                <span class="fa fa-balance-scale fa-3x scale-icon"></span>
                <span style="font-size: 90%">SELECT THE BIN SETS TO COMPARE AND CLICK ON THE PLOT BUTTON</span>
            </span>
        </div>
    </div>

    <footer-section></footer-section>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { map as d3Map } from 'd3'
import Chord from 'charts/Chord'
import FooterSection from 'components/FooterSection'
import PlotTab from 'components/CompareTabs/PlotTab'
import SelectionTab from 'components/CompareTabs/SelectionTab'

export default {
    data() {
        return {
            binSet: null,
            otherBinSet: null,
            by: 'bp',
            loading: false,
            plotData_: null,
            bins_: [],
            otherBins_: [],
            hoveredBin: null,
            selectedBin: null,
            selectedSet: null,
            unselectedSet: null,
            tab: 'PlotTab',
            showBinSet: '',
            showOtherBinSet: ''
        }
    },

    components: {
        Chord,
        FooterSection,
        PlotTab,
        SelectionTab
    },

    methods: {
        setBinSets() {
            this.binSet = this.binSet ? this.binSet : this.binSets[0]
            const otherBinSet = this.binSets[this.binSets.length === 1 ? 0 : 1]
            this.otherBinSet = this.otherBinSet ? this.otherBinSet : otherBinSet
        },
        plot() {
            this.loading = true
            const params = { binset1: this.binSet.id, binset2: this.otherBinSet.id, by: this.by }
            const assemblyId = this.assembly.id
            $.when(
                $.getJSON(`${ROOTURL}/a/${assemblyId}/matrix`, params),
                $.getJSON(`${ROOTURL}/a/${assemblyId}/bs/${this.binSet.id}/b`),
                $.getJSON(`${ROOTURL}/a/${assemblyId}/bs/${this.otherBinSet.id}/b`)
            ).then((respMatrix, respBins, respOtherBins) => {
                    this.selectBin(null)
                    this.bins_ = respBins[0].bins
                    this.otherBins_ = respOtherBins[0].bins
                    this.plotData_ = respMatrix[0]
                    this.showBinSet = this.binSet.name
                    this.showOtherBinSet = this.otherBinSet.name
                    this.loading = false
                    this.tab = 'SelectionTab'
                }
            )
        },
        selectBin(bin) {
            if (bin) {
                this.selectedSet = bin.binSetId == this.binSet.id ? this.binSet : this.otherBinSet
                this.unselectedSet = bin.binSetId == this.binSet.id ? this.otherBinSet : this.binSet
                this.selectedBin = bin
            } else {
                this.selectedSet = null
                this.unselectedSet = null
                this.selectedBin = null
            }
        },
        refineBin() {
            const binSet = this.selectedSet
            this.$store.dispatch('REFINE', { bins: [this.selectBin], binSet })
        },
        findConnectedIndices(index) {
            return this.plotData_.matrix[index]
                .reduce(function(connected, cur, i) {
                    if (cur > 0) connected.push(i)
                    return connected
                }, [])
        }
    },
    
    computed: {
        ...mapState([
            'assembly',
            'binSets',
            'refineBinSet'
        ]),
        binsMap() {
            return d3Map([...this.bins_, ...this.otherBins_], bin => bin.id)
        },
        allBinIds() {
            if (!this.plotData_) return []
            return [...this.plotData_.bins1, ...this.plotData_.bins2]
        },
        selectedBinIndex() {
            if (!this.selectedBin) return null
            return this.allBinIds.indexOf(this.selectedBin.id)
        },
        connectedIndices() {
            // Indices of the bins connected to selected bin
            if (!this.selectedBin) return []
            return this.findConnectedIndices(this.selectedBinIndex)
        },
        connectedBins() {
            return this.connectedIndices
                .map(i => this.binsMap.get(this.allBinIds[i]))
        },
        subConnectedIndices() {
            // Indices of the bins connected to the connected bins
            if (!this.selectedBin) return []
            let indices = this.connectedIndices
                .map(index => this.findConnectedIndices(index))
            indices = Array.prototype.concat(...indices) // flatten
            indices = [...new Set(indices)] // remove duplicates
            return indices.filter(x => x !== this.selectedBinIndex)
        },
        subConnectedBins() {
            return this.subConnectedIndices
                .map(i => this.binsMap.get(this.allBinIds[i]))
        },
        allIndices() {
            // All indices shown in subnetwork 
            return [this.selectedBinIndex, ...this.connectedIndices, 
                    ...this.subConnectedIndices]
        },
        plotData() {
            if (!this.selectedBin) return this.plotData_
            const all = this.allBinIds
            const matrix = this.plotData_.matrix.slice()
                .filter((d, i) => this.allIndices.includes(i))
                .map(x => x.filter((d, i) => this.allIndices.includes(i)))
            const selectedBins = all.filter((d, i) => this.selectedBinIndex === i || 
                                            this.subConnectedIndices.includes(i))
            const unselectedBins = all.filter((d, i) => this.connectedIndices.includes(i))
            return {
                bins1: this.leftSelected ? selectedBins : unselectedBins,
                bins2: this.leftSelected ? unselectedBins :selectedBins,
                matrix
            }
        },
        leftSelected() {
            // True if the selected bin belongs to the left bin set. Otherwise false.
            // This also means that the value is false when there is no bin selected.
            return this.selectedBin && this.plotData_.bins1.includes(this.selectedBin.id)
        },
    },

    watch: {
        assembly() {
            this.plotData_ = null
            this.otherBins_ = []
            this.selectedBin = null
            this.binSet = null
            this.otherBinSet = null
        },
        binSets() {
            this.setBinSets()
        }
    },

    created() {
        this.setBinSets()
    }
}
</script>

<style>
#compare {
    background-color: white;
}

#chord {
    height: 100%;
    overflow: hidden;
}
</style>

<style scoped>
.nav-link.active {
    border-bottom: 2px solid #444;
}
.nav-item .active {
    font-weight: normal;
    background-color: inherit;
}
</style>