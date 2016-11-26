<template>
<div>
    <div class="card">
        <scatter
            :contigs="contigs"
            :xData="xData"
            :yData="yData"
        ></scatter
    </div>
</div>
</template>

<script>
import Scatter from '../charts/Scatter'

export default {
    data() {
        return {
            tab: 'bins',
            contigs: [],
            xData: 'gc',
            yData: 'length'
        }
    },
    
    components: {
        Scatter
    },

    computed: {
        bins() {
            return this.$store.state.bins
        }
    }
}
</script>

<style>
</style>