<template>
<popover>
    <button slot="button" :class="`btn btn-secondary btn-sm ${this.btnClasses}`">
        <span class="fa fa-pencil"></span>
    </button>

    <div slot="body">
        <input placeholder="Name" v-model="name">
        <button class="btn btn-secondary btn-sm" @click="rename" :disabled="loading">
            Rename
        </button>
    </div>
</popover>
</template>

<script>
import Popover from '../components/Popover'

export default {
    data() {
        return {
            name: '',
            loading: false
        }
    },

    props: {
        url: String,
        btnClasses: {
            type: String,
            default: ''
        }
    },

    components: {
        Popover
    },

    methods: {
        rename() {
            this.loading = true
            const name = this.name
            return $.ajax({
                url: `${ROOTURL}/${this.url}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ name })
            }).then(data => {
                this.$emit('done', name)
                this.name = ''
                this.loading = false
                $(this.$el).find('button').first().webuiPopover('hide')
            })
        }
    }
}
</script>