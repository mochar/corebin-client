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