<template>
<div class="row" id="compare">
    <div class="col-3 app-left">
        <div class="navigation" style="padding-bottom: .5rem">
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

        <div class="card-block">
            <div>
                <span>Bin-set right</span>
                <select class="custom-select btn btn-secondary btn-xs w-100" v-model="binSet"
                        style="background-color: rgba(255, 255, 255, 0.67) !important">
                    <option v-for="bs in binSets" :value="bs">{{ bs.name }}</option>
                </select>
            </div>
            <div style="margin-top: .75rem">
                <span>Bin-set left</span>
                <select class="custom-select btn btn-secondary btn-xs w-100" v-model="otherBinSet"
                        style="background-color: rgba(255, 255, 255, 0.67) !important">
                    <option v-for="bs in binSets" :value="bs">{{ bs.name }}</option>
                </select>
            </div>
            <div style="margin-top: .75rem">
                <span>Similarity by</span>
                <select class="custom-select btn btn-secondary btn-xs col-6" v-model="by"
                        style="background-color: rgba(255, 255, 255, 0.67) !important">
                    <option value="count">Shared contigs</option>
                    <option value="bp">Basepairs</option>
                </select>
            </div>
            <button style="margin-top: .75rem" class="btn btn-primary btn-xs" @click="plot"
                    :disabled="loading">
                <span v-show="loading" class="fa fa-refresh fa-spin fa-lg"></span>
                Plot
            </button>
        </div>
    </div>
    <div class="col-9 app-right">
        <div id="chord">
            <chord 
                :plotData="plotData" 
                :bins="bins"
                :otherBins="otherBins"
                :selected="selectedBin"
                :selectedBinSet="selectedSet"
                :unselectedBinSet="unselectedSet"
                :connected="connectedBins"
                :binsMap="binsMap"
                :binSet="binSet"
                :otherBinSet="otherBinSet"
                @binSelected="selectBin"
                @refine="refineBin"
            ></chord>
            <span v-show="otherBins.length === 0" class="text-muted empty-state-message">
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
import Chord from '../charts/Chord'
import FooterSection from 'components/FooterSection'

export default {
    data() {
        return {
            binSet: null,
            otherBinSet: null,
            by: 'bp',
            loading: false,
            plotData: { bins1: [], bins2: [], matrix: [] },
            bins: [],
            otherBins: [],
            selectedBin: null,
            selectedSet: null,
            unselectedSet: null
        }
    },

    components: {
        Chord,
        FooterSection
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
                    this.bins = respBins[0].bins
                    this.otherBins = respOtherBins[0].bins
                    this.plotData = respMatrix[0]
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
        }
    },
    
    computed: {
        ...mapState([
            'assembly',
            'binSets',
            'refineBinSet'
        ]),
        binsMap() {
            return d3Map([...this.bins, ...this.otherBins], bin => bin.id)
        },
        connectedBins() {
            if (!this.selectedBin) return []
            const id = this.selectedBin.id
            const all = [...this.plotData.bins1, ...this.plotData.bins2]
            return this.plotData.matrix[all.indexOf(id)]
                .reduce(function(connected, cur, i) {
                    if (cur === 0) return connected
                    const connectedBin = { percentage: 100, id: all[i] }
                    connected.push(connectedBin)
                    return connected
                }, [])
        }
    },

    watch: {
        assembly() {
            this.plotData = { bins1: [], bins2: [], matrix: [] }
            this.otherBins = []
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