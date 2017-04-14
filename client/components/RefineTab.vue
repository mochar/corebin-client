<template>
<div class="card-block">
    <span style="font-weight: 500">Selection of {{ contigs.length }} contigs</span>

    <bar id="bar-plot" :bars="bars"></bar>

    <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#refine-modal"
            :disabled="!contigs.length">
        Refine selected contigs
    </button>
</div>
</template>

<script>
import Bar from '../charts/Bar'

export default {
    data() {
        return {
        }
    },

    components: {
        Bar
    },

    computed: {
        contigs() {
            return this.$store.state.selectedContigs
        },
        bins() {
            return this.$store.state.refineBins
        },
        bars() {
            let counter = this.bins.map(bin => { return {bin: bin, count: 0} })
            const bins2 = this.bins.map(b => b.id)
            this.contigs.forEach(contig => counter[bins2.indexOf(contig.bin)].count++)
            return counter
        }
    }
}
</script>

<style scoped>
#bar-plot {
    margin: 1rem 0;
}
</style>