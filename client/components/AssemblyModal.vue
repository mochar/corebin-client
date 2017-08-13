<template>
<div class="modal" id="assembly-modal" tabindex="-1">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-body" v-if="assembly">

    <div class="d-flex justify-content-between align-items-center">
        <h5 class="modal-title" id="assembly-name" @click="renaming = true" v-show="!renaming">
            {{ assembly.name }}
        </h5>
        <input @focusout="renaming = false" v-model="name" ref="newname" v-show="renaming"
            @keyup.esc="renaming = false" @keyup.enter="submitName" :disabled="loading">
        <small class="text-muted">Added {{ assembly.submitDate }}</small>
    </div>
    
    <div class="card-body">
        <div class="row">
            <span class="col-9 desc">Bin-sets</span>
            <span class="col-3">{{ assembly.binSets }}</span>

            <span class="col-9 desc">Contigs</span>
            <span class="col-3">{{ assembly.size }}</span>

            <span class="col-9 desc">Coverage samples</span>
            <span class="col-3">{{ assembly.samples.length }}</span>

            <span class="col-9 desc">Tetranucleotide frequencies</span>
            <span class="col-3">{{ assembly.hasFourmerfreqs ? '&#10004' : '&times' }}</span>

            <span class="col-9 desc">Marker genes</span>
            <span class="col-3">{{ assembly.genesSearched ? '&#10004' : '&times' }}</span>
        </div>
    </div>

    <div class="w-100" v-if="assembly.plotData" id="histograms">
        <small class="fw-500">Length</small>
        <histogram :plotData="assembly.plotData.length" :format="true" :size="10"></histogram>
        <small class="fw-500">GC</small>
        <histogram :plotData="assembly.plotData.gc" :format="false" :size="10"></histogram>
    </div>

    <div v-if="!removeConfirm" style="margin-top: 1rem">
        <button class="btn btn-link btn-sm text-primary-hover" @click.prevent="hide">Cancel</button>

        <button class="btn btn-link btn-sm text-danger text-danger-hover" @click="removeConfirm = true">
            Remove
        </button>

        <button class="btn btn-primary float-right submit-button btn-sm" :disabled="viewDisabled"
            @click="view">
            View
        </button>
    </div>

    <div style="margin-top: 1rem" class="text-center" v-else>
        <span>Remove this assembly?</span>

        <div class="btn-group">
            <button class="btn btn-sm btn-link" @click="removeConfirm = false">Cancel</button>
            <button class="btn btn-sm btn-link fw-500 text-danger" @click="setDeleted">Yes</button>
        </div>
    </div>

</div>
</div>
</div>
</div>
</template>

<script>
import Vue from 'vue'
import Histogram from '../charts/Histogram'

export default {
    data() {
        return {
            removeConfirm: false,
            viewDisabled: false,
            renaming: false,
            loading: false,
            name: ''
        }
    },

    components: {
        Histogram
    },

    methods: {
        view() {
            this.viewDisabled = true
            this.$store.dispatch('SELECT_ASSEMBLY_CAREFULLY', this.assembly)
            this.hide()
            this.viewDisabled = false
        },
        setDeleted() {
            $.ajax({
                url: `${ROOTURL}/a/${this.assembly.id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ deleted: true })
            }).then(() => {
                this.hide()
                this.$store.commit('REMOVE_ASSEMBLY', this.assembly)
                this.$store.commit('SET_VIEW_ASSEMBLY', null)
            })
        },
        submitName() {
            this.loading = true
            const name = this.name
            const assembly = this.assembly
            $.ajax({
                url: `${ROOTURL}/a/${this.assembly.id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ name })
            }).then(data => {
                this.loading = false
                this.assembly.name = name
                this.$store.commit('RENAME_ASSEMBLY', { assembly, name })
            })
        },
        hide() {
            $(this.$el).modal('hide')
        }
    },

    computed: {
        assembly() {
            return this.$store.state.viewAssembly
        }
    },
    
    watch: {
        assembly() {
            this.renaming = false
            this.removeConfirm = false
            this.name = this.assembly.name
        },
        renaming() {
            if (this.renaming) Vue.nextTick(() => this.$refs.newname.focus())
            else this.name = this.assembly.name
        }
    }
}
</script>

<style scoped>
#histograms svg {
    margin: 1rem 0;
}

#assembly-name:hover {
    background: #eee;
}
</style>