<template>
<div>
    <div class="text-center">
        <select class="custom-select" v-model="action">
            <option value="move">Move</option>
            <option value="delete">Delete</option>
        </select>
        <span v-if="action === 'delete'">contigs from bin.</span>
        <span v-if="action === 'move'">contigs to bin</span>
        <select v-if="action === 'move'" class="custom-select" v-model="toBin">
            <option :value="bin" v-for="bin in bins">{{ bin.name }}</option>
        </select>
        <button class="btn btn-primary" @click="go" :disabled="loading || !toBin">
            <span v-show="loading" class="fa fa-refresh fa-spin"></span>
            Go
        </button>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            action: 'move',
            toBin: null,
        }
    },

    props: ['loading'],

    methods: {
        go() {
            const toBin = this.action === 'move' ? this.toBin : this.unbinned
            this.$emit('move', toBin)
        }
    },

    created() {
        this.toBin = this.bins[0]
    },

    computed: {
        bins() { 
            return this.$store.getters.withoutUnbinned
        },
        unbinned() {
            return this.$store.getters.unbinned
        }
    }
}
</script>