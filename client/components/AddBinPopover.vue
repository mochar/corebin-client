<template>
<popover>
    <button slot="button" :disabled="loading" class="btn btn-link btn-sm btn-header">
        <span v-if="loading" class="fa fa-refresh fa-spin"></span>
        <span class="fa fa-plus" v-else></span>
        Add bin
    </button>

    <div slot="body">
        <div class="d-flex justify-content-center align-items-center">
            <input style="margin: 0 .5rem" placeholder="Bin name" v-model="name">
            <button class="btn btn-primary btn-sm" @click="addBin" :disabled="loading">
                <span v-show="loading" class="fa fa-refresh fa-spin"></span>
                Add
            </button>
        </div>
        <hr style="margin: .5rem 0"/>
        <div class="d-flex justify-content-center">
            <div v-if="showColors" class="d-flex justify-content-center flex-column">
                <compact v-model="colors" @input="onColorChange"></compact>
                <button class="btn btn-link btn-sm" @click="showColors = false">
                    Randomize color
                </button>
            </div>
            <button class="btn btn-link btn-sm" @click="showColors = true" v-else>
                Pick color
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
            name: '',
            color: '',
            colors: {},
            showColors: false
        }
    },

    components: {
        Popover,
        Compact
    },

    methods: {
        onColorChange(value) {
            this.color = value.hex
        },
        addBin() {
            this.loading = true
            const data = { name: this.name }
            if (this.color) data.color = this.color
            this.$store.dispatch('SUBMIT_BIN', data).then(() => {
                this.name = ''
                this.color = ''
                this.loading = false
            })
        }
    }
}
</script>

<style scoped>
.btn-link {
    font-weight: 500;
}
</style>