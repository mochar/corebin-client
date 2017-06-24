<template>
<div class="card-block d-flex flex-column">
    <div v-if="selectedBin">
        <div class="d-flex justify-content-between align-items-center" style="margin-top: .5rem">
            <small class="fw-500 text-center text-uppercase">{{ binSet_.name  }}</small>
            <small class="btn-link"><span class="fa fa-wrench"></span></small>
        </div>
        <div v-for="bin in subBins" 
            :key="bin.id"
            @click="select(bin)"
            @mouseover="hover(bin)"
            @mouseout="hover(null)"
            style="cursor: pointer;"
            :class="{ 'bin-selected': bin.id === selectedBin.id }" 
            class="bin d-flex justify-content-between align-items-center">
            <span>{{ bin.name }}</span>
            <bin-info :bin="bin"></bin-info>
        </div>

        <div class="d-flex justify-content-between align-items-center" style="margin-top: .5rem">
            <small class="fw-500 text-center text-uppercase">{{ otherBinSet_.name  }}</small>
            <small class="btn-link"><span class="fa fa-wrench"></span></small>
        </div>
        <div v-for="bin in connectedBins" 
            :key="bin.id"
            @click="select(bin)"
            @mouseover="hover(bin)"
            @mouseout="hover(null)"
            style="cursor: pointer;"
            class="bin d-flex justify-content-between align-items-center">
            <span>{{ bin.name }}</span>
            <bin-info :bin="bin"></bin-info>
        </div>
    </div>
</div>
</template>

<script>
import BinInfo from 'components/BinInfo'

export default {
    props: [
        'selectedBin',
        'connectedBins',
        'subConnectedBins',
        'hoveredBin',
        'binSet_',
        'otherBinSet_'
    ],

    components: {
        BinInfo
    },

    methods: {
        select(bin) {
            this.$emit('binSelected', bin)
        },
        hover(bin) {
            this.$emit('binHovered', bin)
        }
    },

    computed: {
        subBins() {
            // Bad name: selectedBin + subConnectedBins
            return [this.selectedBin, ...this.subConnectedBins]
        }
    }
}
</script>

<style>
</style>