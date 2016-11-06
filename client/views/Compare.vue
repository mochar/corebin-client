<template>
<div class="card" v-if="binSet">
    <div class="row">
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
            ></chord>
            <span v-show="otherBins.length === 0" id="message" class="text-muted">
                Select a bin set and click on the Plot button.
            </span>
        </div>
        <div class="col-xs-4">
            <div class="card-block row">
                <div class="col-xs-9">
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
                <div class="col-xs-3">
                    <button class="btn" @click="plot" :disabled="!otherPotentialBinSet || otherBinSet === otherPotentialBinSet">Plot</button>
                </div>
            </div>
            <div class="card-block">
                <ul class="list-group">
                    <li v-for="bin in otherBins" class="list-group-item">
                        {{ bin.name }}
                        <button class="btn btn-link float-xs-right">Refine</button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Chord from '../charts/Chord'

/* "otherPotentialBinSet" is the selected bin set. "otherBinSet" is set to 
 * "otherPotentialBinSet" when the plot botton is clicked.
 */
export default {
    data() {
        return {
            plotData: { bins1: [], bins2: [], matrix: [] },
            otherBinSet: null,
            otherPotentialBinSet: null,
            otherBins: [],
            by: 'count'
        }
    },
    
    components: {
        Chord
    },

    methods: {
        plot() {
            this.otherBinSet = this.otherPotentialBinSet
            const params = { binset1: this.binSet.id, binset2: this.otherBinSet.id, by: this.by }
            const assemblyId = this.$store.state.assembly.id
            $.when(
                $.getJSON(`${ROOTURL}/a/${assemblyId}/matrix`, params),
                $.getJSON(`${ROOTURL}/a/${assemblyId}/bs/${this.otherBinSet.id}/b`)
            ).then((respMatrix, respBins) => {
                    this.otherBins = respBins[0].bins
                    this.plotData = respMatrix[0]
                }
            )
        }
    },

    computed: {
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

#message {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 5%;
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