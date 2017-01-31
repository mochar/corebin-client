<template>
<popover :options="{ closeable: true }">
    <button slot="button" class="btn btn-secondary" style="border-left: 0; border-right: 0">
        <span class="fa fa-wrench"></span>
        Refine
    </button>

    <div slot="body">
        <h5>Refine bins</h5>

        <div class="align-items-center">
            <span>Move {{ selectedCount }} contigs to bin </span>
            <select class="btn btn-secondary btn-xs" v-model="toBin">
                <option v-for="bin in bins" :value="bin">{{ bin.name }}</option>
            </select>
            <button class="btn btn-primary btn-xs" @click="go" :disabled="loading || !toBin">
                <span v-show="loading" class="fa fa-refresh fa-spin"></span>
                Go
            </button>
        </div>
        <small>Move to unbinned if you wish to delete the contigs.</small>
    </div>
</popover>
</template>

<script>
import Popover from '../components/Popover'

export default {
    data() {
        return {
            toBin: null,
        }
    },

    components: {
        Popover
    },

    props: ['loading', 'selectedCount'],

    methods: {
        go() {
            this.$emit('move', this.toBin)
        }
    },

    created() {
        this.toBin = this.bins[0]
    },

    computed: {
        bins() { 
            return this.$store.state.bins
        }
    }
}
</script>