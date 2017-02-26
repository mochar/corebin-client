<template>
<div class="modal" id="refine-modal" tabindex="-1">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-body">

    <h5 class="modal-title">You are already refining {{ refineBinSet && refineBinSet.name }}</h5>

    <div class="float-right" style="margin-top: 1rem">
        <button class="btn btn-link btn-sm" @click="hide">Cancel</button>

        <button class="btn btn-link btn-sm" @click="continue_">Continue to refine page</button>
        
        <button class="btn btn-primary btn-sm submit-button" @click="switch_">
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
    methods: {
        hide() {
            $(this.$el).modal('hide')
        },
        continue_() {
            const refineAssembly = this.$store.state.assemblies.filter(a => a.id === this.refineBinSet.id)[0]
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
            this.$store.commit('SET_REFINE_BIN_SET', this.binSet)
            this.$router.push({ path: 'refine' })
            this.hide()
        }
    },

    computed: {
        binSet() {
            return this.$store.state.binSet
        },
        refineBinSet() {
            return this.$store.state.refineBinSet
        }
    }
}
</script>
