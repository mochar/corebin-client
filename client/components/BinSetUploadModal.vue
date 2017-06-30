<template>
<div class="modal" id="bin-set-upload-modal" tabindex="-1">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-body">

    <h5 class="modal-title">Bin-set upload</h5>

    <form name="bin-set-form" method="post" enctype="multipart/form-data" @submit.prevent="submitBinSet">
        <div class="card-block">
            <div class="form-group">
                <input type="text" class="form-control form-control-sm" name="name"
                        placeholder="Name" v-model="name">
            </div>
            
            <div class="form-group">
                <label for="bins">Bins</label>
                <input type="file" name="bins" @change="fileChanged" 
                        class="form-control-file form-control-sm">
                <small class="form-text text-muted">
                    <router-link to="/help">How should this file look like?</router-link>
                </small>
            </div>
        </div>
        
        <button class="btn btn-link btn-sm" @click.prevent="hide">Cancel</button>
        
        <button type="submit" class="btn btn-primary pull-right btn-sm submit-button" :disabled="loading">
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
            name: ''
        }
    },

    methods: {
        ...mapActions({
            submitBinSetAction: 'SUBMIT_BIN_SET'
        }),
        submitBinSet(event) {
            this.loading = true
            const formData = new FormData(event.srcElement)
            const assembly = this.$store.state.assembly.id
            this.submitBinSetAction({ assembly, formData }).done(() => {
                this.loading = false
                this.name = ''
                event.srcElement.reset()
                this.hide()
            })
        },
        hide() {
            $(this.$el).modal('hide')
        },
        fileChanged(event) {
            const file = event.srcElement.files[0]
            if (file) { 
                let name = file.name.split('.')[0]
                this.name = name.charAt(0).toUpperCase() + name.slice(1)
            } else {
                this.name = ''
            }
        }
    }
}
</script>
