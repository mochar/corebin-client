<template>
<div class="card" v-if="binSet">
    <div class="row" style="display: flex;">
        <div class="col-xs-8" id="compare-left">
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
            <chord 
                :plotData="plotData" 
                :name="name" 
                :otherName="otherName"
                :bins="bins"
                :otherBins="otherBins"
                @binSelected="selectBin"
            ></chord>
            <span v-show="otherBins.length === 0" class="message text-muted">
                Select a bin set and click on the Plot button.
            </span>
        </div>
        <div class="col-xs-4" style="padding-left: 0;">
            <div class="card-block row">
                <div class="col-xs-5" style="padding-right: 0;">
                    <div class="dropdown">
                        <button class="btn btn-secondary btn-block dropdown-toggle" data-toggle="dropdown">
                            <span v-if="otherPotentialBinSet">{{ otherPotentialBinSet.name }}</span>
                            <span v-if="!otherPotentialBinSet" class="text-muted">Bin set</span>
                            <span class="fa fa-caret-down float-xs-right"></span>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" href="#" @click.prevent="otherPotentialBinSet = bs" v-for="bs in binSets">{{ bs.name }}</a>
                        </div>
                    </div>
                </div>
                <div class="col-xs-4" style="padding-right: 0; padding-left: 5px;">
                    <div class="dropdown">
                        <button class="btn btn-secondary btn-block dropdown-toggle" data-toggle="dropdown">
                            <span>{{ byName }}</span>
                            <span class="fa fa-caret-down float-xs-right"></span>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" href="#" @click.prevent="potentialBy = 'count'" selected># shared contigs</a>
                            <a class="dropdown-item" href="#" @click.prevent="potentialBy = 'bp'"># bp</a>
                        </div>
                    </div>
                </div>
                <div class="col-xs-3">
                    <button class="btn" @click="plot" :disabled="plotButtonDisabled">
                        <span v-show="!loading">Plot</span>
                        <span v-show="loading" class="fa fa-refresh fa-spin fa-lg float-xs-right"></span>
                    </button>
                </div>
            </div>
            <div class="card-block" style="padding-top: 0">
                <span class="message text-muted" v-show="otherBins.length > 0 && !selectedBin">
                    Select a bin by left-clicking.
                </span>
                <div class="card rounded" v-if="selectedBin">
                    <div class="card-block" style="background-color: rgba(0,0,0,.125);">
                        <h4>{{ selectedBin.name }}</h4>
                        <button class="btn btn-secondary btn-sm float-xs-right">Hide</button>
                    </div>
                    <ul class="list-group" v-for="">
                        <li class="list-group-item">A</li>
                        <li class="list-group-item">B</li>
                        <li class="list-group-item">C</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Chord from '../charts/Chord'

/* "otherPotentialBinSet" is the selected bin set. "otherBinSet" is set to 
 * "otherPotentialBinSet" when the plot botton is clicked. Same for potentialBy.
 */
export default {
    data() {
        return {
            plotData: { bins1: [], bins2: [], matrix: [] },
            otherBinSet: null,
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
            this.by = this.potentialBy
            const params = { binset1: this.binSet.id, binset2: this.otherBinSet.id, by: this.by }
            const assemblyId = this.$store.state.assembly.id
            $.when(
                $.getJSON(`${ROOTURL}/a/${assemblyId}/matrix`, params),
                $.getJSON(`${ROOTURL}/a/${assemblyId}/bs/${this.otherBinSet.id}/b`)
            ).then((respMatrix, respBins) => {
                    this.otherBins = respBins[0].bins
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
        assembly() {
            return this.$store.state.assembly
        },
        binSet() {
            return this.$store.state.binSet
        },
        bins() {
            return this.$store.state.bins
        },
        binSets() {
            return this.$store.state.binSets
        },
        name() {
            return this.binSet.name || ''
        },
        otherName() {
            return this.otherBinSet ? this.otherBinSet.name : ''
        },
        byName() {
            return this.potentialBy === 'count' ? '# contigs' : '# bp'
        },
        plotButtonDisabled() {
            return !this.otherPotentialBinSet || 
                   (this.otherBinSet === this.otherPotentialBinSet &&
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
#compare-left:hover #chord-set-settings {
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
</style>

<style scoped>
button.dropdown-toggle::after {
    display: none;
}
</style>