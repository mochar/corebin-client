<template>
<div class="card card-block" id="assembly-form">
    <h6 class="card-title">Upload assembly</h6>
    <form name="assembly-form" method="post" enctype="multipart/form-data" @submit.prevent="submitAssembly">
        <div class="form-group">
            <input type="text" class="form-control form-control-sm" name="name" placeholder="Name">
        </div>
        
        <div class="form-group">
            <label for="contigs">Contigs</label>
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
            <label for="coverage">Coverage</label>
            <input type="file" name="coverage" class="form-control-file form-control-sm">
            <small class="form-text text-muted">
                <router-link to="/help">How should this file look like?</router-link>
            </small>
        </div>
        
        <div class="form-group">
            <label>Find essential genes</label>
            <div class="form-check" style="margin-bottom: 0">
                <label class="form-check-label">
                    <input type="checkbox" name="hmmer" class="form-check-input">
                        Search contigs for essential genes
                </label>
            </div>
            <small class="form-text text-muted">
                Allows for calculations of completeness and contamination per bin.
            </small>
        </div>
        
        <button 
            class="btn btn-link btn-sm" 
            v-show="showCancel"
            @click.prevent="$emit('done')">Cancel
        </button>
        
        <button type="submit" id="submit-button" class="btn btn-primary pull-right btn-sm" :disabled="loading">
            <span class="fa fa-refresh fa-spin" v-show="loading"></span>
            Upload
        </button> 
    </form>
</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            loading: false
        }
    },
    
    methods: {
        ...mapActions({
            submitAssemblyAction: 'SUBMIT_ASSEMBLY'
        }),
        submitAssembly(event) {
            this.loading = true
            const formData = new FormData(event.srcElement)
            this.submitAssemblyAction({ formData }).done(() => {
                this.loading = false
                event.srcElement.reset()
                this.$emit('done')
            })
        }
    },

    computed: {
        showCancel() {
            return this.$store.state.assemblies.length > 0
        }
    }
}
</script>

<style>
#submit-button {
    padding: .25rem 1rem;
}

#assembly-form {
    border-left: 0;
    border-right: 0;
}
</style>