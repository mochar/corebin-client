<template>
<div class="p-3">
    <div>
        <span>Bin-set right</span>
        <select class="custom-select btn btn-secondary btn-xs w-100" v-model="binSet"
                style="background-color: rgba(255, 255, 255, 0.67) !important">
            <option v-for="bs in binSets" :key="bs.id" :value="bs">{{ bs.name }}</option>
        </select>
    </div>
    <div style="margin-top: .75rem">
        <span>Bin-set left</span>
        <select class="custom-select btn btn-secondary btn-xs w-100" v-model="otherBinSet"
                style="background-color: rgba(255, 255, 255, 0.67) !important">
            <option v-for="bs in binSets" :key="bs.id" :value="bs">{{ bs.name }}</option>
        </select>
    </div>
    <div style="margin-top: .75rem">
        <span>Similarity by</span>
        <select class="custom-select btn btn-secondary btn-xs col-6" v-model="by"
                style="background-color: rgba(255, 255, 255, 0.67) !important">
            <option value="count">Shared contigs</option>
            <option value="bp">Basepairs</option>
        </select>
    </div>

    <div class="mt-3 d-flex justify-content-between align-items-center">
        <button class="btn btn-primary btn-sm" @click="$emit('plot')" :disabled="loading">
            <span v-show="loading" class="fa fa-refresh fa-spin fa-lg"></span>
            Plot
        </button>
        <slot name="export-btn"></slot>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: [
        'binSet_',
        'otherBinSet_',
        'by_',
        'loading'
    ],
    
    computed: {
        ...mapState([
            'binSets',
        ]),
        binSet: {
            get() { return this.binSet_ },
            set(value) { this.$emit('update:binSet_', value) }
        },
        otherBinSet: {
            get() { return this.otherBinSet_ },
            set(value) { this.$emit('update:otherBinSet_', value) }
        },
        by: {
            get() { return this.by_ },
            set(value) { this.$emit('update:by_', value) }
        },
    }
}
</script>
