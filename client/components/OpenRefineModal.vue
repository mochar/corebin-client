<template>
<div class="modal" id="open-refine-modal" tabindex="-1">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-body">

    <h5 class="modal-title">You are already refining {{ refineBinSet && refineBinSet.name }}</h5>

    <div class="float-right" style="margin-top: 1rem">
        <button class="btn btn-link btn-sm" @click="hide">Cancel</button>

        <button class="btn btn-link btn-sm" @click="continue_">Continue to refine page</button>
        
        <button class="btn btn-primary btn-sm submit-button fw-500" @click="switch_" :disabled="loading">
            Switch to {{ binSet && binSet.name }}
        </button> 
    </div>

</div>
</div>
</div>
</div>
</template>

<script>
export default {
    data() {
        return {
            loading: false
        }
    },

    methods: {
        hide() {
            $(this.$el).modal('hide')
        },
        continue_() {
            const refineAssembly = this.$store.state.assemblies.filter(a => a.id === this.refineBinSet.assembly)[0]
            this.$store.commit('SET_POTENTIAL_REFINE_BIN', null)
            this.$store.commit('SET_MESSAGE', 'Fetching data')
            this.$store.dispatch('SELECT_ASSEMBLY', refineAssembly).then(() => {
                this.$store.dispatch('SELECT_BIN_SET', this.refineBinSet).then(() => {
                    this.$store.commit('SET_MESSAGE', '')
                })
            })
            this.$router.push({ path: 'refine' })
            this.hide()
        },
        switch_() {
            this.loading = true
            this.$store.dispatch('SELECT_BIN_SET', this.binSet).then(() => {
                this.loading = false
                this.$store.commit('SET_REFINE_BIN_SET', this.binSet)
                if (this.bin) {
                    this.$store.dispatch('PUSH_REFINE_BIN', this.bin)
                    this.$store.commit('SET_POTENTIAL_REFINE_BIN', null)
                    this.$store.commit('SET_POTENTIAL_REFINE_SET', null)
                }
                this.$router.push({ path: 'refine' })
                this.hide()
            })
        }
    },

    computed: {
        binSet() {
            return this.$store.state.potentialRefineSet
        },
        bin() {
            return this.$store.state.potentialRefineBin
        },
        refineBinSet() {
            return this.$store.state.refineBinSet
        }
    }
}
</script>
