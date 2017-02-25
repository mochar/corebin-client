<template>
<div class="card-block">
    <div class="align-items-center">
        <span>Move {{ selectedContigs.length }} contigs to bin </span>
        <select class="btn btn-secondary btn-xs" v-model="toBin">
            <option v-for="bin in bins" :value="bin">{{ bin.name }}</option>
        </select>
        <button class="btn btn-primary btn-xs" @click="moveContigs" :disabled="loading || !toBin">
            <span v-show="loading" class="fa fa-refresh fa-spin"></span>
            Go
        </button>
    </div>
    <small>Move to unbinned if you wish to delete the contigs.</small>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            toBin: null,
            loading: false
        }
    },

    methods: {
        moveContigs() {
            this.loading = true
            const data = { action: 'move', contigs: this.selectedContigs, to_bin: this.toBin.id }
            $.ajax({
                url: `${ROOTURL}/a/${this.assembly.id}/bs/${this.binSet.id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(data)
            }).then(() => {
                let contigs = $.extend(true, [], this.$store.state.contigs) // deep-copy

                // First, update the bin attr of the selected contigs
                contigs.forEach(contig => {
                    if (this.selectedContigs.indexOf(contig.id) > -1) {
                        contig.bin = this.toBin.id
                        contig[`color_${this.binSet.id}`] = this.toBin.color
                    } 
                })
                // Then, unselect all contigs as these have now been moved
                this.$store.commit('SET_SELECTED_CONTIGS', [])
                // Then, filter out the contigs which have been moved to an unselected bin
                const selectedBins = this.$store.state.refineBins.map(bin => bin.id)
                contigs = contigs.filter(contig => {
                    return selectedBins.indexOf(contig.bin) > -1
                })
                // Then, commit to store
                this.$store.commit('SET_CONTIGS', contigs)
                // Finally, update refetch bins
                this.$store.dispatch('GET_BINS').then(() => this.loading = false)
            }, () => {
                this.loading = false
            })
        }
    },

    created() {
        this.toBin = this.bins[0]
    },

    computed: {
        ...mapState([
            'selectedContigs',
            'binSet',
            'bins',
            'assembly'
        ])
    },

    watch: {
        binSet() {
            this.toBin = this.bins[0]
        }
    }
}
</script>