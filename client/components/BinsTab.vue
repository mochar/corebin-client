<template>
<div style="padding: 1rem .5rem">
    <div v-for="(bin, index) in $store.state.bins" 
         @click="!loading && select(bin, index)"
         :class="{ 'bin-selected': binsSelected[index] }" 
         class="bin d-flex justify-content-between align-items-center"
         :style="{ cursor: loading ? 'not-allowed' : 'pointer' }">
        <div>
            <span 
                class="fa" 
                :class="binsSelected[index] ? 'fa-square' : 'fa-square-o'"
                :style="{ color: bin.color, opacity: loading ? .5 : 1 }">
            </span>
            <span>{{ bin.name }}</span>
        </div>

        <div>
            <span class="text-muted">{{ bin.size }}</span>
            <bin-info :bin="bin"></bin-info>
        </div>
    </div>
</div>
</template>

<script>
import BinInfo from 'components/BinInfo'

export default {
    data() {
        return {
            loading: false
        }
    },

    components: {
        BinInfo
    },

    methods: {
        select(bin, index) {
            this.loading = true
            if (this.binsSelected[index]) {
                this.$store.commit('REMOVE_REFINE_BIN', bin)
                this.loading = false
            } else {
                this.$store.dispatch('PUSH_REFINE_BINS', [bin]).then(() => {
                    this.loading = false
                })
            }
        }
    },

    computed: {
        selectedIds() {
            return this.$store.state.refineBins.map(bin => bin.id)
        },
        binsSelected() {
            return this.$store.state.bins.map(b => this.selectedIds.includes(b.id))
        }
    }
}
</script>

<style>
.bin {
    padding: .3rem .3rem;
}
.bin:hover {
    background-color: #eee;
}

.bin-selected {
    background-color: #ddd;
}
</style>