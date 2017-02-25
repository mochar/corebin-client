<template>
<table class="table table-hover">
    <thead>
        <th></th>
        <th>Bin</th>
        <th>Cont.</th>
        <th>Comp.</th>
    </thead>
    <tbody>
        <tr v-for="bin in $store.state.bins" @click="!loading && select(bin)"
            :style="{ cursor: loading ? 'not-allowed' : 'pointer' }">
            <td>
                <span 
                    class="fa" 
                    :class="selectedIds.indexOf(bin.id) > -1 ? 'fa-square' : 'fa-square-o'"
                    :style="{ color: bin.color, opacity: loading ? .5 : 1 }">
                </span>
            </td>
            <td>{{ bin.name }}</td>
            <td>{{ bin.contamination }}</td>
            <td>{{ bin.completeness }}</td>
        </tr>
    </tbody>
</table>
</template>

<script>
export default {
    data() {
        return {
            loading: false
        }
    },

    methods: {
        select(bin) {
            this.loading = true
            if (this.selectedIds.indexOf(bin.id) > -1) {
                this.$store.commit('REMOVE_REFINE_BIN', bin)
                this.loading = false
            } else {
                this.$store.dispatch('PUSH_REFINE_BIN', bin).then(() => {
                    this.loading = false
                })
            }
        }
    },

    computed: {
        selectedIds() {
            return this.$store.state.refineBins.map(bin => bin.id)
        }
    }
}
</script>

<style scoped>
table {
    margin: 0;
    padding: 0;
    width: 100%;
}

th {
    border-top: 0;
}

td {
    padding: .5rem;
}
</style>