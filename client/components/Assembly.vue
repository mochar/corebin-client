<template>
<div class="card assembly">
    <div class="name-block">
        <span class="name">{{ assembly.name }}</span>
    </div>

    <div class="card-block" style="padding: .15rem 1rem;">
        <div class="btn-group">
            <popover :options="{placement: 'bottom'}">
                <button slot="button" class="btn btn-secondary btn-sm btn-header"
                        style="border-right: 0">
                    <span class="fa fa-fw fa-pencil"></span>
                </button>
                <div slot="body">
                    <input placeholder="Assembly name">
                    <button class="btn btn-secondary btn-sm">Rename</button>
                </div>
            </popover>
            <popover :options="{placement: 'bottom'}">
                <button slot="button" class="btn btn-secondary btn-sm btn-header">
                    <span class="fa fa-fw fa-trash"></span> 
                </button>
                <div slot="body">
                    <button class="btn btn-danger btn-sm">Delete assembly</button>
                </div>
            </popover>
            <router-link class="btn btn-primary btn-sm btn-header float-right"
                    to="/overview" tag="button" @click.native="select">
                Analyze
            </router-link>
        </div>

        <p class="card-text" style="margin-top: .5rem">
            <small class="text-muted">Added {{ assembly.submitDate }}</small>
        </p>
    </div>
</li>
</template>

<script>
import Popover from '../components/Popover'

export default {
    data() {
        return {
        }
    },

    props: ['assembly'],

    components: {
        Popover
    },

    methods: {
        select() {
            this.$store.dispatch('SELECT_ASSEMBLY', this.assembly).then(() => {
                if (this.binSets.length > 0) 
                    this.$store.dispatch('SELECT_BIN_SET', this.binSets[0])
            })
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