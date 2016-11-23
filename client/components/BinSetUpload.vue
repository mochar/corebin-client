<template>
<div>
    <button 
        class="btn btn-outline-primary btn-sm btn-block"
        v-show="!add"
        @click="add = true">
        Add bin set
    </button>
    
    <div class="card card-outline-primary card-block" v-show="add">
        <form name="bin-set-form" method="post" enctype="multipart/form-data" @submit.prevent="submitBinSet">
            <div class="form-group">
                <label for="name">Bin-set name</label>
                <input type="text" class="form-control form-control-sm" name="name">
            </div>
            
            <div class="form-group">
                <label for="bins">Bin-set file</label>
                <input type="file" name="bins" class="form-control-file form-control-sm">
                <small class="form-text text-muted">
                    <router-link to="/help">How should this file look like?</router-link>
                </small>
            </div>
            
            <button class="btn btn-link btn-sm" @click="add = false">Cancel</button>
            
            <button type="submit" class="btn btn-primary pull-right btn-sm" :disabled="loading">
                <span class="fa fa-refresh fa-spin" v-show="loading"></span>
                Upload
            </button> 
        </form>
    </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            add: false,
            loading: false
        }
    },

    props: ['assembly'],

    methods: {
        ...mapActions({
            submitBinSetAction: 'SUBMIT_BIN_SET'
        }),
        submitBinSet(event) {
            this.loading = true
            const formData = new FormData(event.srcElement)
            const assembly = this.assembly
            this.submitBinSetAction({ assembly, formData }).done(() => {
                this.loading = false
                this.add = false
                event.srcElement.reset()
            })
        }
    }
}
</script>