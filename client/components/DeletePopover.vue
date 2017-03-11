<template>
<popover>
    <button slot="button" :class="`btn btn-secondary btn-sm ${this.btnClasses}`"
            style="border-left: 0; border-right: 0">
        <span class="fa fa-trash"></span>
        {{ text }}
    </button>

    <div slot="body">
        <button class="btn btn-danger btn-sm" @click="delete_" :disabled="loading">
            Delete this?!
        </button>
    </div>
</popover>
</template>

<script>
import Popover from '../components/Popover'

export default {
    data() {
        return {
            loading: false
        }
    },

    props: {
        url: String,
        btnClasses: {
            type: String,
            default: ''
        },
        text: {
            type: String,
            default: ''
        }
    },

    components: {
        Popover
    },

    methods: {
        delete_() {
            this.loading = true
            $.ajax({
                url: `${ROOTURL}/${this.url}`,
                method: 'DELETE'
            }).then(data => {
                this.$emit('done')
                this.loading = false
                $(this.$el).find('button').first().webuiPopover('hide')
            }, () => {
                this.loading = false
                $(this.$el).find('button').first().webuiPopover('hide')
            })
        }
    }
}
</script>