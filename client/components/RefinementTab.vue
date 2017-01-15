<template>
<div>
    <div class="text-center">
        <select class="custom-select" v-model="action">
            <option value="move">Move</option>
            <option value="delete">Delete</option>
        </select>
        <span v-if="action === 'delete'">contigs</span>
        <div v-else>
            <span>contigs to bin</span>
            <select class="custom-select" v-model="toBin">
                <option :value="bin" v-for="bin in bins">{{ bin.name }}</option>
            </select>
        </div>
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

    created() {
        this.toBin = this.bins[0]
    },

    computed: {
        bins() { 
            return this.$store.getters.withoutUnbinned
        }
    }
}
</script>