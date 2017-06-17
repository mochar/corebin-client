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
            <popover :options="{ placement: 'right', trigger: 'hover', delay: {hide:0} }">
                <button slot="button" class="btn-link">
                    <span class="fa fa-info"></span>
                </button>
                <div slot="body" class="d-flex">
                    <div class="d-flex flex-column p-1">
                        <span class="desc"># contigs</span>
                        <span class="desc">Size (Mbp)</span>
                        <span class="desc">GC</span>
                        <span class="desc">Contamination</span>
                        <span class="desc">Completeness</span>
                    </div>

                    <div class="d-flex flex-column p-1">
                        <span>{{ bin.size }}</span>
                        <span>{{ bin.mbp }}</span>
                        <span>{{ bin.gc*100 }}%</span>
                        <span>{{ bin.contamination*100 }}%</span>
                        <span>{{ bin.completeness*100 }}%</span>
                    </div>
                </div>
            </popover>
        </div>
    </div>
</div>
</template>

<script>
import Popover from '../components/Popover'

export default {
    data() {
        return {
            loading: false
        }
    },

    components: {
        Popover
    },

    methods: {
        select(bin, index) {
            this.loading = true
            if (this.binsSelected[index]) {
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
        },
        binsSelected() {
            return this.$store.state.bins.map(b => this.selectedIds.includes(b.id))
        }
    }
}
</script>

<style scoped>
.bin {
    padding: .3rem .3rem;
}
.bin:hover {
    background-color: #eee;
}

.bin-selected {
    background-color: #ddd;
}

.desc {
    font-weight: 500;
    text-align: right;
}
</style>