<template>
<div class="modal" id="refine-modal" tabindex="-1">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-body">

    <h5 class="modal-title">Refine</h5>

    <div class="card-block">
        <div class="align-items-center">
            <span>Move {{ selectedContigs.length }} contigs to bin </span>
            <select class="btn btn-secondary btn-xs" v-model="toBin">
                <option v-for="bin in bins" :value="bin">{{ bin.name }}</option>
            </select>
        </div>
        <small>Move to unbinned if you wish to delete the contigs.</small>
    </div>

    <div class="d-flex justify-content-between" style="margin-top: 1rem">
        <button class="btn btn-link btn-sm" @click="hide">Cancel</button>

        <button class="btn btn-primary btn-sm submit-button" :disabled="loading || !toBin" @click="refine">
            <span v-show="loading" class="fa fa-refresh fa-spin"></span>
            Confirm
        </button> 
    </div>

</div>
</div>
</div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            loading: false,
            toBin: null
        }
    },

    methods: {
        hide() {
            $(this.$el).modal('hide')
        },
        refine() {
            this.loading = true
            const selectedContigs = this.selectedContigs
                .filter(c => c.bin != this.toBin.id)
                .map(c => c.id)
            const data = { action: 'move', contigs: selectedContigs, to_bin: this.toBin.id }
            $.ajax({
                url: `${ROOTURL}/a/${this.assembly.id}/bs/${this.binSet.id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(data)
            }).then(() => {
                let contigs = $.extend(true, [], this.$store.state.contigs) // deep-copy

                // First, update the bin attr of the selected contigs
                contigs.forEach(contig => {
                    if (selectedContigs.indexOf(contig.id) > -1) {
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
                
                this.done()
            }, () => {
                this.done()
            })
        },
        done() {
            this.loading = false
            this.hide()
        }
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
