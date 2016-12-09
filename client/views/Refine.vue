<template>
<div>
    <div class="card">
        <multiselect
            :multiple="true"
            :options="bins"
            :selected="selectedBins"
            :disabled="loading"
            @select="getContigs"
            @remove="removeContigs"
            selectLabel=""
            deselectLabel=""
            placeholder="Select bin"
            label="name"
            key="name">
        </multiselect>
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
import Multiselect from 'vue-multiselect'

export default {
    data() {
        return {
            tab: 'bins',
            contigs: [],
            xData: 'gc',
            yData: 'length',
            selectedBins: [],
            loading: false
        }
    },
    
    components: {
        Scatter,
        Multiselect
    },

    methods: {
        getContigs(bin) {
            this.loading = true
            const payload = {
                fields: 'id,length,gc,name',
                bins: bin.id,
                coverages: true,
                pca: this.assembly.hasFourmerFreqs,
                colors: true,
                items: this.assembly.size
            }
            $.getJSON(`${ROOTURL}/a/${this.assembly.id}/c`, payload).then(data => {
                data.contigs.forEach(c => c.bin = bin.id)
                this.contigs.push(...data.contigs)
                this.loading = false
            }, () => {
                console.log('fail getContigs')
                this.loading = false
            })
        },
        removeContigs(bin) {
            this.contigs = this.contigs.filter(c => c.bin !== bin.id)
        }
    },

    computed: {
        assembly() {
            return this.$store.state.assembly
        },
        bins() {
            return this.$store.state.bins
        }
    }
}
</script>

<style>
.multiselect > div {
    border-bottom: 0;
}
</style>