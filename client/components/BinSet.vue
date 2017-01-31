<template>
<div class="card bin-set">
    <span class="name">{{ binSet.name }}</span>

    <div class="card-block" style="padding: .15rem 1rem .5rem;">
        <div class="btn-group">
            <popover :options="{placement: 'bottom'}">
                <button slot="button" class="btn btn-secondary btn-sm btn-header"
                        style="border-right: 0">
                    <span class="fa fa-fw fa-pencil"></span>
                </button>
                <div slot="body">
                    <input placeholder="Bin-set name">
                    <button class="btn btn-secondary btn-sm">Rename</button>
                </div>
            </popover>
            <popover :options="{placement: 'bottom'}">
                <button slot="button" class="btn btn-secondary btn-sm btn-header"
                        style="border-right: 0">
                    <span class="fa fa-fw fa-trash"></span> 
                </button>
                <div slot="body">
                    <button class="btn btn-danger btn-sm">Delete bin-set</button>
                </div>
            </popover>
            <router-link class="btn btn-secondary btn-sm btn-header float-right"
                    to="/overview" tag="button" @click.native="select">
                <span class="fa fa-eye"></span>
                Overview
            </router-link>
        </div>


        <div style="margin-top: .5rem" v-if="refineBinSet && refineBinSet.id == binSet.id">
            <span class="text-muted">
                <span class="fa fa-wrench"></span>
                Refinement in progress...
                <a 
                    href="#" 
                    v-show="$route.path !== '/refine'"
                    class="float-right text-muted" 
                    style="text-decoration: underline"
                   @click.prevent="viewRefine"
                >View
                </a>
            </span>
            <div style="opacity: .8">
                <span v-for="bin in refineBins" style="font-size: .8rem; margin: 0 .5rem">
                    <span class="fa fa-circle-o" :style="{ color: bin.color }"></span>
                    {{ bin.name }}
                </span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Popover from '../components/Popover'

export default {
    props: ['binSet'],

    components: {
        Popover
    },

    methods: {
        select() {
            this.$store.dispatch('SELECT_BIN_SET', this.binSet).then(() => {
            })
        },
        viewRefine() {
            this.$store.commit('SET_MESSAGE', 'Fetching data')
            this.$store.dispatch('SELECT_BIN_SET', this.binSet).then(() => {
                this.$store.commit('SET_MESSAGE', '')
                this.$router.push({ path: 'refine' })
            })
        }
    },

    computed: {
        refineBinSet() {
            return this.$store.state.refineBinSet
        },
        refineBins() {
            return this.$store.state.refineBins
        }
    }
}
</script>

<style>
.bin-set {
    margin-bottom: 0;
    border-left: 0;
    border-right: 0;
}
</style>