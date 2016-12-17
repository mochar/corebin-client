<template>
<div class="card" style="margin-bottom: 0; border-left: 0; border-right: 0">
    <div class="name-block">
        <span class="name assembly-name">{{ assembly.name }}</span>

        <div class="float-xs-right" v-show="selected">
            <popover :options="{placement: 'bottom'}">
                <button slot="button" class="btn btn-secondary assembly-button">
                    <span class="fa fa-fw fa-pencil"></span>
                </button>
                <div slot="body">
                    <input placeholder="Assembly name">
                    <button class="btn btn-secondary btn-sm">Rename</button>
                </div>
            </popover>

            <popover :options="{placement: 'bottom'}">
                <button slot="button" class="btn btn-secondary assembly-button">
    	            <span class="fa fa-fw fa-trash text-danger"></span> 
                </button>
                <div slot="body">
                    <button class="btn btn-danger btn-sm">Delete assembly</button>
                </div>
            </popover>
        </div>
    </div>
    <div class="card-block" style="padding: .5rem 1rem;" v-if="selected">
        <div class="bin-set-list">
            <div v-for="bs in binSets" class="list-item">
                {{ bs.name }}
                <router-link to="/overview" class="float-xs-right" @click.native="selectBinSet(bs)">
                    Overview
                </router-link>
            </div>
            <div v-for="job in binSetJobs" class="list-item">
                {{ job.meta.name }}
                <span class="fa fa-refresh fa-spin float-xs-right"></span>
            </div>
            <bin-set-upload :assembly="assembly.id"></bin-set-upload>
        </div>
        <router-link to="/compare" class="btn btn-sm btn-primary btn-block" id="add-bs-btn" :disabled="!binSets.length" tag="button">
            <span class="fa fa-balance-scale"></span> Compare bin sets
        </router-link>
        <p class="card-text" style="margin-top: .5rem">
            <small class="text-muted">Added {{ assembly.submitDate }}</small>
        </p>
    </div>
</li>
</template>

<script>
import BinSetUpload from '../components/BinSetUpload'
import Popover from '../components/Popover'

export default {
    data() {
        return {
        }
    },

    props: ['assembly', 'binSets', 'selected'],

    components: {
        BinSetUpload,
        Popover
    },

    methods: {
        selectBinSet(binSet) {
            this.$store.dispatch('SELECT_BIN_SET', binSet).then(() => {
            })
        }
    },

    computed: {
    	binSetJobs() {
    		return this.$store.state.binSetJobs.filter(job => {
    			return job.meta.assembly === this.assembly.id
    		})
    	}
    }
}
</script>