<template>
<div class="modal" id="refine-modal" tabindex="-1">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-body">

    <h5 class="modal-title">Refine</h5>

    <div class="card-block d-flex flex-column justify-content-center">
        <div class="d-flex align-items-center">
            <span>Move {{ selectedContigs.length }} contigs to bin </span>
            <select class="btn btn-secondary btn-xs m-2" v-model="toBin">
                <option v-for="bin in bins" :value="bin">{{ bin.name }}</option>
            </select>
        </div>
        <small class="text-muted">Move to unbinned if you wish to delete the contigs.</small>

        <transition name="fade">
            <div v-if="toBin && assembly.genesSearched" 
                class="d-flex flex-column justify-content-center m-1"
                style="border-top: 1px dashed #ddd">
                <button class="btn btn-sm btn-link" :disabled="assessLoading" 
                        style="margin: 1rem 0" @click="assess">
                    <span class="fa fa-refresh fa-spin" v-if="assessLoading"></span>
                    Assess contamination and completeness
                </button>

                <div v-if="assessement">
                    <div class="d-flex align-items-end">
                        <span class="fw-500 w-100 text-center" style="font-size: smaller">
                            CONTAMINATION
                        </span>
                        <span class="fw-500 w-100 text-center" style="font-size: smaller">
                            COMPLETENESS
                        </span>
                    </div>
                    <div v-for="d in assessement">
                        <small>{{ d.bin.name }}</small>
                        <div class="d-flex">
                            <div class="w-100 text-center" v-for="x in ['contamination', 'completeness']">
                                <span>{{ (d.before[x] * 100).toFixed(2) }}%</span>
                                <span class="fa fa-long-arrow-right"></span>
                                <span>{{ (d.after[x] * 100).toFixed(2) }}%</span>
                                <span class="fa fa-long-arrow-up text-success fw-500 float-right" 
                                    v-if="d.after[x] - d.before[x] > 0"></span>
                                <span class="fa fa-long-arrow-down text-danger fw-500 float-right" 
                                    v-if="d.after[x] - d.before[x] < 0"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>

    <div class="d-flex justify-content-between" style="margin-top: 1rem">
        <button class="btn btn-link btn-sm" @click="hide">Cancel</button>

        <button class="btn btn-primary btn-sm submit-button fw-500" :disabled="loading || !toBin" @click="refine">
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
            toBin: null,
            assessLoading: false,
            assessement: null
        }
    },

    methods: {
        hide() {
            $(this.$el).modal('hide')
        },
        assess() {
            this.assessLoading = true
            const binSet = this.binSet
            const data = { contigs: this.selectedContigsIds, to_bin: this.toBin.id }
            $.ajax({
                url: `${ROOTURL}/a/${binSet.assembly}/bs/${binSet.id}/assess`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(data)
            }).then(data => {
                this.assessLoading = false
                this.assessement = data.bins
            })
        },
        refine() {
            this.loading = true
            const selectedContigs = this.selectedContigsIds
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
        ]),
        selectedContigsIds() {
            return this.selectedContigs
                .filter(c => c.bin != this.toBin.id)
                .map(c => c.id)
        }
    },

    watch: {
        binSet() {
            this.toBin = this.bins[0]
        }
    }
}
</script>
