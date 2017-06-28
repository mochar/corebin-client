<template>
<div class="card-block d-flex flex-column" style="padding-top: 0">
    <!--<div class="d-flex justify-content-around align-items-center w-100">
        <span class="mini-chord-btn" :class="{kek: showSet.id === otherBinSet_.id}"
            @click="showConnected=!showConnected">
            <span class="fa fa-eye"></span>
        </span>
        <mini-chord></mini-chord>
        <span class="mini-chord-btn" :class="{kek: showSet.id === binSet_.id}"
            @click="showConnected=!showConnected">
            <span class="fa fa-eye"></span>
        </span>
    </div>-->
    <div v-if="selectedBin">
        <div class="d-flex justify-content-between align-items-center" style="margin: .5rem 0">
            <button class="btn btn-secondary btn-sm btn-bin">
                <span class="fw-500 text-uppercase" @click="showConnected = !showConnected">
                    {{ showSet.name }}
                </span>
            </button>
            <button class="btn btn-primary btn-sm">
                <span class="fa fa-wrench"></span>
                Refine bins
            </button>
        </div>
        <div v-for="bin in showBins" 
            :key="bin.id"
            @click="select(bin)"
            @mouseover="hover(bin)"
            @mouseout="hover(null)"
            style="cursor: pointer;"
            :class="{ 'bin-selected': bin.id === selectedBin.id }" 
            class="bin d-flex justify-content-between align-items-center">
            <span>{{ bin.name }}</span>
            <div>
                <span class="text-muted">100%</span>
                <button class="btn btn-secondary btn-sm btn-bin" @click.stop="refine(bin)">
                    <span class="fa fa-wrench"></span>
                </button>
                <bin-info :bin="bin"></bin-info>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import BinInfo from 'components/BinInfo'
import MiniChord from 'charts/MiniChord'

export default {
    data() {
        return {
            showConnected: true
        }
    },

    props: [
        'selectedBin',
        'selectedSet',
        'unselectedSet',
        'connectedBins',
        'subConnectedBins',
        'hoveredBin',
        'binSet_',
        'otherBinSet_',
        'leftSelected'
    ],

    components: {
        BinInfo,
        MiniChord
    },

    methods: {
        select(bin) {
            if (!this.selectedBin) {
                this.$emit('binSelected', bin)
            } else if (bin.id === this.selectedBin.id) {
                this.$emit('binSelected', null)
                this.$emit('binHovered', null)
            } else {
                this.$emit('binSelected', bin.id === this.selectedBin.id ? null : bin)
            }
        },
        hover(bin) {
            this.$emit('binHovered', bin)
        },
        refine(bin) {
            this.$store.dispatch('REFINE', { bin, binSet: this.showSet })
        },
    },

    computed: {
        refineBinSet() {
            return this.$store.state.refineBinSet
        },
        subBins() {
            // Bad name: selectedBin + subConnectedBins
            return [this.selectedBin, ...this.subConnectedBins]
        },
        showSet() {
            return this.showConnected ? this.unselectedSet : this.selectedSet
        },
        showBins() {
            return this.showConnected ? this.connectedBins : this.subBins
        }
    },

    watch: {
        selectedBin() {
            this.showConnected = true
        }
    }
}
</script>

<style>
.mini-chord-btn {
    /*color: #0275d8;*/
    color: #333;
    cursor: pointer;
}
.mini-chord-btn::before {
    content: "[ ";
}
.mini-chord-btn::after {
    content: " ]";
}

.kek {
    color: grey;
}
</style>