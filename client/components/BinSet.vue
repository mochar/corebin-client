<template>
<div class="card info-card" id="bin-set-card" :style="{ 'border-left-color': binSet.color }">
    <div class="card-block name-block">
        <span class="name" id="bin-set-name">{{ binSet.name }}</span>
        <div class="action-buttons float-xs-right">
            <button id="rename-bin-set" class="btn btn-link" data-toggle="popover">
                <span class="fa fa-pencil text-primary"></span>
            </button>
            <button type="button" class="btn btn-link">
                <span class="fa fa-download text-primary"></span>
            </button>
            <button type="button" class="btn btn-link">
                <span class="fa fa-trash text-danger"></span>
            </button>
        </div>
    </div>
    <table class="table table-striped" id="bin-table">
        <thead>
            <tr>
                <th width="5%"></th>
                <th width="25%">Bin</th>
                <th width="10%">Size</th>
                <th width="10%">GC</th>
                <th width="15%">N50</th>
                <th width="15%">Cont.</th>
                <th width="15%">Comp.</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="b in bins" @click="selectBin(b)">
                <td width="5%">
                    <span :style="{ color: b.color }" class="fa" :class="bin.id === b.id ? 'fa-circle' : 'fa-circle-o'"></span>
                </td>
                <td width="25%">{{ b.name }}</td>
                <td width="10%">{{ b.size }}</td>
                <td width="10%">{{ b.gc }}</td>
                <td width="15%">{{ b.n50 }}</td>
                <td width="15%">{{ b.contamination }}</td>
                <td width="15%">{{ b.completeness }}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    data() {
        return {
        }
    },
    
    computed: {
        binSet() {
            return this.$store.state.binSet
        },
        bins() {
            return this.$store.state.bins
        },
        bin() {
            return this.$store.state.bin
        }
    },

    methods: {
        ...mapMutations({
            selectBin: 'SELECT_BIN'
        })
    }
}
</script>

<style>
#bin-set-card {
}

#bin-table {
    margin-bottom: 0;
}

#bin-table > tbody > tr {
    cursor: pointer;
}

#bin-table td {
    padding: .5rem;
}

#bin-set-name::before {
    content: "Bin set ";
}

.name-block {
    padding: .25rem 0 .25rem .5rem;
}
</style>
