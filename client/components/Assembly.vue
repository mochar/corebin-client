<template>
<a href="#" @click.prevent="select" 
    class="assembly list-group-item list-group-item-action flex-column align-items-start">
    <div class="name-block d-flex justify-content-between align-self-center w-100">
        <span class="name">{{ assembly.name }}</span>
        <button class="btn btn-secondary btn-sm btn-bin" @click.prevent.stop="showModal">
            <span class="fa fa-cog"></span>
        </button>
    </div>

    <div class="w-100">
        <transition name="fade" mode="out-in">
            <div v-if="assembly.plotData">
                <histogram v-if="assembly.plotData" :plotData="plotData" :format="plotLength" :size="5">
                </histogram>
            </div>
            <span class="fa fa-refresh fa-spin fa-fw mx-auto d-block" v-else></span>
        </transition>
    </div>

    <div class="d-flex justify-content-between align-items-center assembly-footer">
        <small class="text-muted">Added {{ assembly.submitDate }}</small>

        <div class="btn-group float-right" data-toggle="buttons">
            <label class="btn btn-secondary btn-sm btn-bin" @click.stop="" :class="{ active: !plotLength }"
                v-show="plotType === 'length'">
                <small>
                    <input type="radio" value="gc" v-model="plotType"> GC%
                </small>
            </label>
            <label class="btn btn-secondary btn-sm btn-bin" @click.stop="" :class="{ active: plotLength }"
                v-show="plotType === 'gc'">
                <small>
                    <input type="radio" value="length" v-model="plotType"> Length
                </small>
            </label>
        </div>
    </div>
</a>
</template>

<script>
import Histogram from '../charts/Histogram'

export default {
    data() {
        return {
            plotType: 'gc'
        }
    },

    props: ['assembly'],

    components: {
        Histogram
    },

    methods: {
        select() {
            this.$store.dispatch('SELECT_ASSEMBLY_CAREFULLY', this.assembly)
        },
        showModal() {
            this.$store.commit('SET_VIEW_ASSEMBLY', this.assembly)
            $('#assembly-modal').modal('show')
        }
    },

    computed: {
        plotLength() {
            return this.plotType === 'length'
        },
        plotData() {
            if (!this.assembly.plotData) return
            return this.plotLength ? this.assembly.plotData.length : 
                                     this.assembly.plotData.gc;
        }
    }
}
</script>

<style scoped>
.assembly {
    border-left: 0;
    border-right: 0;
    border-color: #ddd;
    padding: 0;
}

.list-group-item {
    border-left: 0;
    border-right: 0;
    display: block;
}

.assembly-footer {
    margin: .25rem .5rem;
}

label {
    margin-bottom: 0;
}
</style>