<template>
<div class="card card-block" id="compare">
    <form class="form-inline">
        <div class="form-group">
            <label>Bin-set (left)</label>
            <select class="custom-select" v-model="potentialBinSet">
                <!-- <option v-for="bs in binSets" :value="bs">{{ bs.name }}</option> -->
                <option 
                    v-for="(bs, index) in binSets" 
                    :selected="index === 0"
                    :value="bs">
                    {{ bs.name }}
                </option>
            </select>
        </div>
        <div class="form-group">
            <label>Bin-set (right)</label>
            <select class="custom-select" v-model="otherPotentialBinSet">
                <option v-for="bs in binSets" :value="bs">{{ bs.name }}</option>
            </select>
        </div>
        <div class="form-group">
            <label>By</label>
            <select class="custom-select">
                <option @click="potentialBy = 'count'"># shared contigs</option>
                <option @click="potentialBy = 'bp'"># bp</option>
            </select>
        </div>
        <button class="btn btn-primary float-xs-right" @click="plot" :disabled="plotButtonDisabled">
            <span v-show="!loading">Plot</span>
            <span v-show="loading" class="fa fa-refresh fa-spin fa-lg float-xs-right"></span>
        </button>
    </form>

    <div id="chord">
        <chord 
            :plotData="plotData" 
            :name="name" 
            :otherName="otherName"
            :bins="bins"
            :otherBins="otherBins"
            :selected="selectedBin"
            :connected="connectedBins"
            :binsMap="binsMap"
            @binSelected="selectBin"
        ></chord>
        <span id="message" v-show="otherBins.length === 0" class="text-muted">
            <span class="fa fa-balance-scale fa-3x" id="scale-icon"></span>
            <!-- Select the bin sets to compare and click on the Plot button -->
            <span style="font-size: 90%">SELECT THE BIN SETS TO COMPARE AND CLICK ON THE PLOT BUTTON</span>
        </span>
    </div>

    <div v-if="selectedBin">
        <div>
            <strong style="font-size: .9rem">SELECTED BIN</strong>
            <a href="#" @click.prevent="selectedBin = null">
                <small>deselect</small>
            </a>
            <compare-bin 
                :bin="selectedBin" 
                :simple="true"
                :minSize="minSize"
                :maxSize="maxSize">
            </compare-bin>
        </div>

        <div style="margin-top: 1rem" id="connected">
            <strong style="font-size: .9rem">CONNECTED BINS</strong>
            <compare-bin 
                v-for="bin in connectedBins"
                :bin="binsMap.get(bin.id)"
                :simple="true"
                :minSize="minSize"
                :maxSize="maxSize">
            </compare-bin>
        </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { map as d3Map } from 'd3'
import Chord from '../charts/Chord'
import CompareBin from '../components/CompareBin'

/* "otherPotentialBinSet" is the selected bin set. "otherBinSet" is set to 
 * "otherPotentialBinSet" when the plot botton is clicked. Same for potentialBy.
 */
export default {
    data() {
        return {
            plotData: { bins1: [], bins2: [], matrix: [] },
            binSet: null,
            potentialBinSet: null,
            otherBinSet: null,
            bins: [],
            otherPotentialBinSet: null,
            otherBins: [],
            by: null,
            potentialBy: 'count',
            loading: false,
            selectedBin: null
        }
    },
    
    components: {
        Chord,
        CompareBin
    },

    methods: {
        plot() {
            this.loading = true
            this.otherBinSet = this.otherPotentialBinSet
            this.binSet = this.potentialBinSet
            this.by = this.potentialBy
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
        selectBin(bin) {
            this.selectedBin = bin
        }
    },

    computed: {
        ...mapState([
            'assembly',
            'binSets'
        ]),
        name() {
            return this.binSet ? this.binSet.name : ''
        },
        otherName() {
            return this.otherBinSet ? this.otherBinSet.name : ''
        },
        byName() {
            return this.potentialBy === 'count' ? '# contigs' : '# bp'
        },
        plotButtonDisabled() {
            return (!this.otherPotentialBinSet && !this.otherBinSet) ||
                   (this.otherBinSet === this.otherPotentialBinSet &&
                    this.binSet === this.potentialBinSet &&
                    this.by === this.potentialBy)
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
            this.otherBinSet = null
            this.otherPotentialBinSet = null
            this.otherBins = []
            this.selectedBin = null
        }
    }
}
</script>

<style>
#connected > div:not(:last-child) {
    border-bottom: 0;
}

#compare {
    height: 100vh;
    overflow-y: scroll;
}

#scale-icon {
    display: block;
    padding-bottom: 1rem;
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