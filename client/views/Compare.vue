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

        <div style="border-width: 0 0 1px 0">
            <div class="card-header" style="background: #F4F4F4">
                <ul class="nav justify-content-center card-header-tabs">
                    <li class="nav-item">
                        <a class="nav-link" href="#" 
                            :class="{active: tab === 'ComparePlotTab'}"
                            @click.prevent="tab = 'ComparePlotTab'">
                            <span class="fa fa-line-chart"></span>
                            Plot
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" 
                            :class="{active: tab === 'SelectionTab'}"
                            @click.prevent="tab = 'SelectionTab'">
                            <span class="fa fa-list"></span>
                            Selection
                        </a>
                    </li>
                </ul>
            </div>
            <div class="tab-body">
                <component 
                    :is="tab"

                    :selectedBin="selectedBin"
                    :connectedBins="connectedBins"
                    :subConnectedBins="subConnectedBins"
                    :hoveredBin="hoveredBin"
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
import ComparePlotTab from 'components/ComparePlotTab'
import SelectionTab from 'components/SelectionTab'

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
            tab: 'ComparePlotTab' 
        }
    },

    components: {
        Chord,
        FooterSection,
        ComparePlotTab,
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
                    this.loading = false
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
            const bin = this.selectedBin
            const binSet = this.selectedSet
            if (this.refineBinSet && this.refineBinSet.id !== binSet.id) {
                this.$store.commit('SET_POTENTIAL_REFINE_BIN', bin)
                this.$store.commit('SET_POTENTIAL_REFINE_SET', binSet)
                $('#open-refine-modal').modal('show')
                return
            }
            const binInRefine = this.$store.state.refineBins.map(b => b.id).includes(bin.id)
            if (bin && !binInRefine) {
                this.$store.dispatch('SELECT_BIN_SET', binSet).then(() => {
                    this.$store.dispatch('PUSH_REFINE_BIN', bin)
                })
            } 
            this.$store.commit('SET_REFINE_BIN_SET', binSet)
            this.$router.push({ path: 'refine' })
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
            return [...this.plotData_.bins1, ...this.plotData_.bins2]
        },
        selectedBinIndex() {
            if (!this.selectedBin) return null
            const all = [...this.plotData_.bins1, ...this.plotData_.bins2]
            return all.indexOf(this.selectedBin.id)
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
}
</style>