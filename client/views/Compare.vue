<template>
<div class="card" id="compare">
    <div id="compare-form">
        <form class="form-inline justify-content-center">
            <div class="form-group">
                <div class="dropdown">
                    <button class="btn btn-link compare-btn dropdown-toggle" data-toggle="dropdown" 
                            style="font-size: .9rem; border-right: 0">
                        <strong>Bin-set left</strong>
                        {{ otherBinSet ? otherBinSet.name : '' }}
                    </button>
                    <div class="dropdown-menu">
                        <a
                            v-for="bs in binSets"
                            class="dropdown-item"
                            href="#"
                            @click.prevent="otherBinSet = bs"
                        >{{ bs.name }}
                        </a>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="dropdown">
                    <button class="btn btn-link compare-btn dropdown-toggle" data-toggle="dropdown" 
                            style="font-size: .9rem; border-right: 0">
                        <strong>Bin-set right</strong>
                        {{ binSet ? binSet.name : '' }}
                    </button>
                    <div class="dropdown-menu">
                        <a
                            v-for="bs in binSets"
                            class="dropdown-item"
                            href="#"
                            @click.prevent="binSet = bs"
                        >{{ bs.name }}
                        </a>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="dropdown">
                    <button class="btn btn-link compare-btn dropdown-toggle" data-toggle="dropdown"
                            style="font-size: .9rem; border-right: 0">
                        <strong>Similarity by</strong>
                        {{ byName }}
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#" @click.prevent="by = 'count'">shared contigs</a>
                        <a class="dropdown-item" href="#" @click.prevent="by = 'bp'">basepairs</a>
                    </div>
                </div>
            </div>
            <button class="btn btn-outline-primary float-right" @click="plot" :disabled="loading" id="plot-btn">
                <span v-show="loading" class="fa fa-refresh fa-spin fa-lg"></span>
                PLOT
            </button>
        </form>
    </div>

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
        <span id="message" v-show="otherBins.length === 0" class="text-muted">
            <span class="fa fa-balance-scale fa-3x" id="scale-icon"></span>
            <span style="font-size: 90%">SELECT THE BIN SETS TO COMPARE AND CLICK ON THE PLOT BUTTON</span>
        </span>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { map as d3Map } from 'd3'
import Chord from '../charts/Chord'

export default {
    data() {
        return {
            plotData: { bins1: [], bins2: [], matrix: [] },
            binSet: null,
            otherBinSet: null,
            bins: [],
            otherBins: [],
            by: 'count',
            loading: false,
            selectedBin: null,
            selectedSet: null,
            unselectedSet: null
        }
    },
    
    components: {
        Chord
    },

    methods: {
        plot() {
            this.loading = true
            const params = { binset1: this.binSet.id, binset2: this.otherBinSet.id, by: this.by }
            const assemblyId = this.$store.state.assembly.id
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
        setBinSets() {
            this.binSet = this.binSet ? this.binSet : this.binSets[0]
            const otherBinSet = this.binSets[this.binSets.length === 1 ? 0 : 1]
            this.otherBinSet = this.otherBinSet ? this.otherBinSet : otherBinSet
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
        byName() {
            return this.by === 'count' ? 'shared contigs' : 'basepairs'
        },
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
        },
        maxSize() {
            const bins = [this.selectedBin, ...this.connectedBins]
            return Math.max(...bins.map(bin => this.binsMap.get(bin.id).size))
        },
        minSize() {
            const bins = [this.selectedBin, ...this.connectedBins]
            return Math.min(...bins.map(bin => this.binsMap.get(bin.id).size))
        }
    },

    watch: {
        assembly() {
            this.plotData = { bins1: [], bins2: [], matrix: [] }
            this.binSet = null
            this.otherBinSet = null
            this.otherBins = []
            this.selectedBin = null
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
#connected > div:not(:last-child) {
    border-bottom: 0;
}

#compare {
    min-height: 100vh;
    border-right: 0;
    display: flex;
    align-items: stretch;
}

#scale-icon {
    display: block;
    padding-bottom: 1rem;
}

#compare-form {
    padding: 1.25rem;
    padding-bottom: 0;
}

#chord {
    /*padding: 0 .5rem;*/
    flex: 1;
}

#plot-btn {
    margin-left: .5rem;
    font-weight: 500;
    font-size: .9rem;
    letter-spacing: .05rem;
    border-top-width: 1px;
}

.compare-btn, .compare-btn:hover, .compare-btn:focus {
    color: #333;
}
</style>

<style scoped>
#message {
    position: absolute;
    top: 50%;
    left: 15%;
    right: 0;
    bottom: 0;
    text-align: center;
    height: 5rem;
    width: 70%;
}
</style>