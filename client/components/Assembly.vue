<template>
<router-link to="/overview" tag="a" @click.native="select" 
    class="list-group-item list-group-item-action flex-column align-items-start">
    <div class="name-block">
        <span class="name">{{ assembly.name }}</span>
    </div>

    <div class="card-block" style="padding: .15rem 1rem;">
        <div class="btn-group">
            <rename-popover 
                btn-classes="btn-header btn-action"
                text="Rename"
                @done="name => { $store.commit('RENAME_ASSEMBLY', { assembly, name }) }"
                :url="`a/${assembly.id}`">
            </rename-popover>
            <popover :options="{placement: 'bottom'}">
                <button slot="button" class="btn btn-secondary btn-sm btn-header btn-action" 
                        style="border-left: 0">
                    <span class="fa fa-fw fa-trash"></span> 
                    Remove
                </button>
                <div slot="body">
                    <button class="btn btn-danger btn-sm">Delete assembly</button>
                </div>
            </popover>
        </div>

        <p class="card-text" style="margin-top: .5rem">
            <small class="text-muted">Added {{ assembly.submitDate }}</small>
        </p>
    </div>
</router-link>
</template>

<script>
import Popover from '../components/Popover'
import RenamePopover from '../components/RenamePopover'

export default {
    data() {
        return {
        }
    },

    props: ['assembly'],

    components: {
        Popover,
        RenamePopover
    },

    methods: {
        select() {
            const currentAssembly = this.$store.state.assembly
            if (!currentAssembly || currentAssembly.id !== this.assembly.id) {
                this.$store.dispatch('SELECT_ASSEMBLY', this.assembly).then(() => {
                    if (this.binSets.length === 0) return
                    this.$store.dispatch('SELECT_BIN_SET', this.binSets[0]).then(() => {
                        this.$router.push({ path: 'overview' })
                    })
                })
            }
            this.$emit('selected')
        }
    },

    computed: {
        binSets() {
            return this.$store.state.binSets
        },
    	binSetJobs() {
    		return this.$store.state.binSetJobs.filter(job => {
    			return job.meta.assembly === this.assembly.id
    		})
    	}
    }
}
</script>

<style>
.assembly {
    margin-bottom: 0;
    border-left: 0;
    border-right: 0;
}
</style>

<style scoped>
.list-group-item {
    border-left: 0;
    border-right: 0;
}
</style>