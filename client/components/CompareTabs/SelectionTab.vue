<template>
<div class="d-flex flex-column">
    <div class="row p-3">
        <select class="custom-select btn btn-secondary btn-xs col-10" v-model="showSet"
                style="background-color: rgba(255, 255, 255, 0.67) !important">
            <option v-for="bs in [binSet_, otherBinSet_]" :key="bs.id" :value="bs">{{ bs.name }}</option>
        </select>
        <button class="btn btn-secondary btn-bin btn-xs col-2" title="Refine bins" @click="refine(showBins)">
            <span class="fa fa-wrench"></span>
        </button>
    </div>
    <div class="pl-1 pr-1">
        <div v-for="bin in showBins" 
            :key="bin.id"
            @click="select(bin)"
            @mouseover="hover(bin)"
            @mouseout="hover(null)"
            style="cursor: pointer;"
            :class="{ 'bin-selected': selectedBin && bin.id === selectedBin.id }" 
            :style="{ 'border-left': `3px solid ${bin.color}` }"
            class="bin d-flex justify-content-between align-items-center">
            <span>{{ bin.name }}</span>
            <div>
                <!-- <span class="text-muted">100%</span> -->
                <button class="btn btn-secondary btn-sm btn-bin" @click.stop="refine([bin])">
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

export default {
    data() {
        return {
            showSet: null
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
        'leftSelected',
        'bins_',
        'otherBins_'
    ],

    components: {
        BinInfo,
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
        refine(bins) {
            this.$store.dispatch('REFINE', { bins, binSet: this.showSet })
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
        showBins() {
            if (!this.selectedSet)
                return this.showSet.id === this.binSet_.id ? this.bins_ : this.otherBins_
            return this.showSet.id === this.selectedSet.id ? this.subBins : this.connectedBins 
        }
    },

    watch: {
        binSet_() {
            this.showSet = this.binSet_
        }
    },

    created() {
        this.showSet = this.binSet_
    }
}
</script>

<style>
</style>