<template>
<popover>
    <button slot="button" class="btn btn-secondary">
        <span class="fa fa-list"></span>
        Bins
    </button>

    <div slot="body">
        <h5>Plot bins</h5>

        <ul class="list-group" id="bins-popover-list">
            <li v-for="bin in $store.state.bins" @click="select(bin)" class="list-group-item">
                <span 
                    class="fa" 
                    style="margin-right: .5rem" 
                    :class="selectedIds.indexOf(bin.id) > -1 ? 'fa-square' : 'fa-square-o'"
                    :style="{ color: bin.color, opacity: loading ? .5 : 1 }">
                </span>
                <span class="text-center">{{ bin.name }}</span>
            </li>
        </ul>
    </div>
</popover>
</template>

<script>
import Popover from '../components/Popover'

export default {
    components: {
        Popover
    },

    props: ['selected', 'loading'],

    methods: {
        select(bin) {
            if (this.selectedIds.indexOf(bin.id) > -1) {
                this.$emit('remove', bin)
            } else {
                this.$emit('get', bin)
            }
        }
    },

    computed: {
        selectedIds() {
            return this.selected.map(bin => bin.id)
        }
    }
}
</script>

<style>
#bins-popover-list > li {
    border-left: 0;
    border-right: 0;
    padding: .5rem 1rem;
    cursor: pointer;
}

#bins-popover-list > li:hover {
    background-color: #eee;
}

#bins-popover-list > li:first-child {
    border-top: 0;
}

#bins-popover-list > li:last-child {
    border-bottom: 0;
}
</style>