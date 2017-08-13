<template>
<div class="card-body">
    <div>
        <span>Bin-set right</span>
        <select class="custom-select btn btn-secondary btn-xs w-100" v-model="binSetRight"
                style="background-color: rgba(255, 255, 255, 0.67) !important">
            <option v-for="bs in binSets" :value="bs">{{ bs.name }}</option>
        </select>
    </div>
    <div style="margin-top: .75rem">
        <span>Bin-set left</span>
        <select class="custom-select btn btn-secondary btn-xs w-100" v-model="binSetLeft"
                style="background-color: rgba(255, 255, 255, 0.67) !important">
            <option v-for="bs in binSets" :value="bs">{{ bs.name }}</option>
        </select>
    </div>
    <div style="margin-top: .75rem">
        <span>Similarity by</span>
        <select class="custom-select btn btn-secondary btn-xs col-6" v-model="compareBy"
                style="background-color: rgba(255, 255, 255, 0.67) !important">
            <option value="count">Shared contigs</option>
            <option value="bp">Basepairs</option>
        </select>
    </div>
    <button style="margin-top: .75rem" class="btn btn-primary btn-xs">Plot</button>
</div>
</template>

<script>
export default {
    computed: {
        binSets() {
            return this.$store.state.binSets
        },
        binSetLeft: {
            get() { return this.$store.state.binSetLeft },
            set(value) { this.$store.commit('SET_CHORD_VALUE', { key: 'binSetLeft', value }) }
        },
        binSetRight: {
            get() { return this.$store.state.binSetRight },
            set(value) { this.$store.commit('SET_CHORD_VALUE', { key: 'binSetRight', value }) }
        },
        compareBy: {
            get() { return this.$store.state.compareBy },
            set(value) { this.$store.commit('SET_CHORD_VALUE', { key: 'compareBy', value }) }
        }
    }
}
</script>