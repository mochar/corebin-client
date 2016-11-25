<template>
<div>
    <div class="card card-block">
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

        <div id="chord-set-settings">
            <label class="form-check-label">
                <input type="checkbox" class="form-check-input">
                Color by bins
            </label>
            <label class="form-check-label">
                <input type="checkbox" class="form-check-input">
                Show names
            </label>
        </div>

        <div id="chord">
            <chord 
                :plotData="plotData" 
                :name="name" 
                :otherName="otherName"
                :bins="bins"
                :otherBins="otherBins"
                @binSelected="selectBin"
            ></chord>
            <span v-show="otherBins.length === 0" class="message text-muted">
                Select the bin sets and click on the Plot button
            </span>
        </div>
    </div>

    <div class="card card-block">
        <span class="message text-muted" v-show="otherBins.length > 0 && !selectedBin">
            Select a bin by left-clicking.
        </span>
        <div class="card" v-if="selectedBin" id="bin-info">
            <div class="card-block">
                <h4>{{ selectedBin.name }}</h4>
                <button class="btn btn-secondary btn-sm float-xs-right">Hide</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Chord from '../charts/Chord'

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
        Chord
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
#chord:hover #chord-set-settings {
    opacity: 1;
    transition: opacity .15s ease-in-out;
}

#chord-set-settings {
    opacity: 0;
    position: absolute;
    left: 2em;
    top: 1em;
    right: 1em;
}

.message {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 10%;
    width: 50%;
    margin: auto;
    position: absolute;
    text-align: center !important;
}

#settings {
    background-color: #f5f5f5;
    border: 1px solid #e3e3e3;
    margin: .3rem;
    padding: 0 .5rem;
}

#settings > h6 {
    font-size: .9rem;
    font-weight: bold;
    margin-top: .5rem;
    color: #555;
}
</style>

<style scoped>
#bin-info {
    background-color: rgba(0,0,0,.125);
    border: 1px solid rgba(0,0,0,.25);
}
</style>