<template>
<div>
    <button 
        class="btn btn-outline-secondary btn-block" 
        id="add-btn" 
        style="color: #666" 
        data-toggle="tooltip"
        data-placement="bottom" 
        title="Click me to begin"
        v-show="!assemblyJob && !add"
        @click="add = true">
        <span class="fa fa-plus"></span> Assembly
    </button>
    
    <div class="card card-outline-secondary card-block" v-show="!assemblyJob && add" id="assembly-form">
        <form name="assembly-form" method="post" enctype="multipart/form-data" @submit.prevent="submitAssembly">
            <div class="form-group">
                <label for="name">Assembly name</label>
                <input type="text" class="form-control form-control-sm" name="name">
            </div>
            
            <div class="form-group">
                <label for="contigs">Contigs (fasta)</label>
                <span class="text-info float-xs-right">Required</span>
                <input type="file" name="contigs" class="form-control-file form-control-sm">
                <small class="form-text text-muted">
                    The contigs used for binning in fasta format.
                </small>
            </div>
            
            <div class="form-check">
                <label class="form-check-label">
                <input type="checkbox" name="fourmers" class="form-check-input">
                    Calculate tetranucleotide frequencies
                </label>
            </div>
            
            <div class="form-group">
                <label for="coverage">Coverage table</label>
                <input type="file" name="coverage" class="form-control-file form-control-sm">
                <small class="form-text text-muted">
                    <router-link to="/help">How should this file look like?</router-link>
                </small>
            </div>
            
            <button class="btn btn-link btn-sm" @click="add = false"><small>Cancel</small></button>
            
            <button type="submit" id="submit-button" class="btn btn-success pull-right btn-sm" :disabled="loading">
                <span class="fa fa-refresh fa-spin" v-show="loading"></span>
                Upload
            </button> 
        </form>
    </div>
    
    <div class="text-xs-center" v-show="assemblyJob">
        <span class="fa fa-refresh fa-spin"></span>
        Processing assembly...
        <button class="btn btn-link btn-sm" v-show="!cancelling" @click="cancelJob">Cancel</button>
        <span v-show="cancelling">Cancel</span>
    </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            add: false,
            loading: false,
            cancelling: false
        }
    },
    
    computed: {
        assemblyJob() {
            return this.$store.state.assemblyJob
        }
    },

    methods: {
        ...mapActions({
            cancelAssemblyJob: 'CANCEL_ASSEMBLY_JOB'
        }),
        submitAssembly(event) {
            this.loading = true
            const formData = new FormData(event.srcElement)
            this.$store.dispatch('SUBMIT_ASSEMBLY', { formData }).done(() => {
                this.loading = false
                this.add = false
                event.srcElement.reset()
            })
        },
        cancelJob() {
            this.cancelling = true
            this.cancelAssemblyJob().done(() => this.cancelling = false)
        }
    }
}
</script>

<style>
#assembly-form {
    margin-bottom: 0;
    border: 0;
    color: #555;
}

#submit-button {
    padding: .25rem 1rem;
}
</style>