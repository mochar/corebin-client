<template>
<popover>
    <button slot="button" class="btn btn-secondary btn-sm btn-bin">
        <span class="fa fa-pencil"></span>
    </button>

    <div slot="body">
        <div class="d-flex justify-content-center align-items-center">
            <button slot="button" :style="{ background: color }" @click="showColors = !showColors"
                    class="btn btn-secondary btn-sm color-box">
            </button>
            <input style="margin: 0 .5rem" placeholder="Name" v-model="name">
            <button class="btn btn-secondary btn-sm" @click="edit" :disabled="loading">
                OK
            </button>
        </div>
        <hr style="margin: .5rem 0"/>
        <div class="colorpick-div d-flex justify-content-center">
            <compact v-if="showColors" v-model="colors" @change-color="onColorChange"></compact>
            <button v-else class="btn btn-outline-danger border-0 btn-sm" :disabled="loading"
                    @click="delete_" style="font-weight: 500">
                Remove bin
            </button>
        </div>
    </div>
</popover>
</template>

<script>
import { Compact } from 'vue-color'
import Popover from '../components/Popover'

export default {
    data() {
        return {
            loading: false,
            showColors: false,
            name: '',
            color: ''
        }
    },

    props: ['bin'],

    components: {
        Popover,
        Compact
    },

    methods: {
        onColorChange(value) {
            this.color = value.hex
        },
        edit() {
            this.loading = true
            const name = this.name
            const color = this.color
            const binSet = this.$store.state.binSet
            return $.ajax({
                url: `${ROOTURL}/a/${binSet.assembly}/bs/${binSet.id}/b/${this.bin.id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ name, color })
            }).then(data => {
                this.loading = false
                this.showColors = false
                this.$store.commit('EDIT_BIN', { bin: this.bin, name, color })
                $(this.$el).find('button').first().webuiPopover('hide')
            })
        },
        delete_() {
            this.loading = true
            const binSet = this.$store.state.binSet
            $.ajax({
                url: `${ROOTURL}/a/${binSet.assembly}/bs/${binSet.id}/b/${this.bin.id}`,
                method: 'DELETE'
            }).then(data => {
                this.$emit('deleted')
                this.loading = false
                $(this.$el).find('button').first().webuiPopover('hide')
            }, () => {
                this.loading = false
                $(this.$el).find('button').first().webuiPopover('hide')
            })
        }
    },

    computed: {
        colors() {
            return this.color ? { hex: this.color } : {}
        }
    },

    watch: {
        bin() {
            this.color = this.bin.color
            this.name = this.bin.name
        }
    },
    
    created() {
        this.color = this.bin.color
        this.name = this.bin.name
    }
}
</script>

<style>
.color-box {
    width: 1.25rem;
    height: 1.25rem;
}

.colorpick-div {
    margin-top: .5rem;
}
</style>