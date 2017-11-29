<template>
<div class="modal" id="assembly-upload-modal" tabindex="-1">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-body">

    <h5 class="modal-title">Assembly upload</h5>

    <div class="alert alert-danger" id="alert" v-if="errorMessage">
        <span class="fa fa-exclamation-triangle" style="margin-right: .25rem"></span>
        {{ errorMessage }}
    </div>

    <form name="assembly-form" method="post" enctype="multipart/form-data" @submit.prevent="submitAssembly">
        <div class="card-body">
            <div class="form-group">
                <input type="text" class="form-control form-control-sm" name="name" placeholder="Name">
            </div>

            <div class="form-group">
                <label for="contigs">Contigs</label>
                <input type="file" name="contigs" class="form-control-file form-control-sm">
                <small class="form-text text-muted">
                    The contigs used for binning in fasta format.
                </small>
            </div>

            <div class="form-check">
                <label class="custom-control custom-checkbox align-items-center">
                    <input type="checkbox" name="fourmers" class="custom-control-input">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Calculate tetranucleotide frequencies</span>
                </label>
            </div>

            <div class="form-group">
                <label for="coverage">Coverage</label>
                <input type="file" name="coverage" class="form-control-file form-control-sm">
                <small class="form-text text-muted">
                    <router-link to="/help">What should this file look like?</router-link>
                </small>
            </div>

            <div class="form-group">
                <label>Identify marker genes</label>
                <div class="form-check" style="margin-bottom: 0">
                    <label class="custom-control custom-checkbox align-items-center">
                        <input type="checkbox" name="hmmer" class="custom-control-input">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">
                            Search contigs for single-copy marker genes
                        </span>
                    </label>
                </div>
                <small class="form-text text-muted">
                    Assess the completeness and contamination of each bin.
                </small>
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="text" class="form-control form-control-sm" name="email" placeholder="Email">
                <small class="form-text text-muted">
                    Send an email notification on completion.
                </small>
            </div>
        </div>

        <button
            class="btn btn-link btn-sm"
            @click.prevent="hide">Cancel
        </button>

        <button type="submit" class="btn btn-primary pull-right submit-button btn-sm" :disabled="loading">
            <span class="fa fa-refresh fa-spin" v-show="loading"></span>
            Upload
        </button>
    </form>

</div>
</div>
</div>
</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            loading: false,
            errorMessage: null
        }
    },

    methods: {
        ...mapActions({
            submitAssemblyAction: 'SUBMIT_ASSEMBLY'
        }),
        submitAssembly(event) {
            this.loading = true
            const formData = new FormData(event.target)
            this.submitAssemblyAction({ formData }).then(() => {
                this.loading = false
                event.target.reset()
                this.hide()
            }, xhr => {
                this.loading = false
                this.errorMessage = xhr.responseJSON.message
            })
        },
        hide() {
            this.errorMessage = null
            $(this.$el).modal('hide')
        }
    }
}
</script>

<style scoped>
#alert {
    padding: .25rem 1rem;
    margin-top: 1rem;
}
</style>