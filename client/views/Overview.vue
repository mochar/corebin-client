<template>
<div id="bins" v-if="binSet">
    <div class="card-header" id="bins-header">
        <div class="d-flex justify-content-end">
            <button 
                class="btn btn-link btn-sm btn-header" 
                @click="showUnbinned = !showUnbinned">
                <span v-if="showUnbinned">Hide unbinned</span>
                <span v-else>Show unbinned</span>
            </button>
            <add-bin-popover></add-bin-popover>
            <button class="btn btn-sm btn-header" id="refine-button" @click="refine()">
                <span class="fa fa-wrench"></span>
                Refine bins
            </button>
        </div>

        <div v-if="!selected.length" class="row" id="table-head">
            <sort-head
                class="col"
                label="Bin"
                name="name"
                :by="sortBy"
                :order="sortOrder"
                @sort="sort('name')">
            </sort-head>
            <sort-head
                class="col"
                label="# contigs"
                name="size"
                :by="sortBy"
                :order="sortOrder"
                @sort="sort('size')">
            </sort-head>
            <sort-head
                class="col"
                label="Size (Mbp)"
                name="mbp"
                :by="sortBy"
                :order="sortOrder"
                @sort="sort('mbp')">
            </sort-head>
            <sort-head
                class="col"
                label="GC"
                name="gc"
                :by="sortBy"
                :order="sortOrder"
                @sort="sort('gc')">
            </sort-head>
            <sort-head
                class="col"
                label="Contamination"
                name="contamination"
                :by="sortBy"
                :order="sortOrder"
                @sort="sort('contamination')">
            </sort-head>
            <sort-head
                class="col"
                label="Completeness"
                name="completeness"
                :by="sortBy"
                :order="sortOrder"
                @sort="sort('completeness')">
            </sort-head>
            <div class="col">
            </div>
        </div>

        <div v-else>
            <span style="font-size: .75rem; margin-right: .5re">Selected bin(s)</span>
            <button class="btn btn-secondary btn-table">
                <span class="fa fa-sitemap"></span> Merge
            </button>
            <button class="btn btn-secondary btn-table">
                <span class="fa fa-wrench"></span> Refine
            </button>
            <button class="btn btn-danger btn-table">
                <span class="fa fa-trash-o"></span> Delete
            </button>
        </div>
    </div>

    <table class="table table-hover" style="margin-bottom: 0; background-color: white">
        <tbody style="cursor: pointer">
            <tr v-for="bin in sortedBins" @click="selectBin(bin.id)" :style="binStyle(bin.id)">
                <td class="align-middle">{{bin.name}}</td>
                <bar-column :percentage="sizeToPercentage(bin.size)" :color="bin.color" :label="bin.size"></bar-column>
                <bar-column :percentage="mbpToPercentage(bin.mbp)" :color="bin.color" :label="bin.mbp.toFixed(2)"></bar-column>
                <bar-column :percentage="proportionToPercentage(bin.gc)" :color="bin.color"></bar-column>
                <bar-column :percentage="proportionToPercentage(bin.contamination)" :color="bin.color"></bar-column>
                <bar-column :percentage="proportionToPercentage(bin.completeness)" :color="bin.color"></bar-column>
                <td class="btn-group justify-content-center" style="width: 100%">
                    <edit-bin-popover :bin="bin" @deleted="commitDeletion(bin)"></edit-bin-popover>
                    <button class="btn btn-secondary btn-sm btn-bin" @click.stop="refine(bin)">
                        <span class="fa fa-wrench"></span>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
import Popover from '../components/Popover'
import BarColumn from '../components/BarColumn'
import SortHead from '../components/SortHead'
import EditBinPopover from '../components/EditBinPopover'
import AddBinPopover from '../components/AddBinPopover'

export default {
    data() {
        return {
            sortBy: 'size',
            sortOrder: 'desc',
            showUnbinned: false,
            selected: []
        }
    },

    components: {
        Popover,
        BarColumn,
        SortHead,
        EditBinPopover,
        AddBinPopover
    },

    methods: {
        sizeToPercentage(size) {
            return ((size - this.minSize) * 100) / (this.maxSize - this.minSize)
        },
        mbpToPercentage(mbp) {
            return ((mbp - this.minMbp) * 100) / (this.maxMbp - this.minMbp)
        },
        proportionToPercentage(size) {
            return size !== null ? size * 100 : null
        },
        selectBin(binId) {
            const index = this.selected.indexOf(binId)
            if (index > -1)
                this.selected.splice(index, 1)
            else
                this.selected.push(binId)
        },
        binStyle(binId) {
            const color = this.selected.indexOf(binId) > -1 ? 'rgba(0,0,0,.075)' : 'white'
            return { 'background-color': color }
        },
        sort(by) {
            if (this.sortBy === by) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
            } else {
                this.sortBy = by
                this.sortOrder ='desc'
            }
        },
        refine(bin) {
            if (this.refineBinSet && this.refineBinSet.id !== this.binSet.id) {
                this.$store.commit('SET_POTENTIAL_REFINE_BIN', bin)
                this.$store.commit('SET_POTENTIAL_REFINE_SET', this.binSet)
                $('#open-refine-modal').modal('show')
                return
            }
            if (bin && !this.binIsInRefine(bin.id)) {
                this.$store.dispatch('PUSH_REFINE_BIN', bin)
            } 
            this.$store.commit('SET_REFINE_BIN_SET', this.binSet)
            this.$router.push({ path: 'refine' })
        },
        binIsInRefine(binId) {
            return this.$store.state.refineBins.map(b => b.id).includes(binId)
        },
        commitDeletion(bin) {
            this.$store.commit('REMOVE_BIN', bin)
            this.$store.commit('REMOVE_REFINE_BIN', bin)
        }
    },
    
    computed: {
        refineBinSet() {
            return this.$store.state.refineBinSet
        },
        binSet() {
            return this.$store.state.binSet
        },
        bins() {
            const bins = this.$store.state.bins
            return this.showUnbinned ? bins : bins.filter(bin => bin.name !== 'unbinned')
        },
        maxSize() {
            return Math.max(...this.bins.map(bin => bin.size))
        },
        minSize() {
            return Math.min(...this.bins.map(bin => bin.size))
        },
        maxMbp() {
            return Math.max(...this.bins.map(bin => bin.mbp))
        },
        minMbp() {
            return Math.min(...this.bins.map(bin => bin.mbp))
        },
        sortedBins() {
            return this.bins.sort((a, b) => {
                if (this.sortOrder === 'asc')
                    return a[this.sortBy] - b[this.sortBy]
                else
                    return b[this.sortBy] - a[this.sortBy]
            })
        }
    },

    watch: {
        binSet() {
            this.sortBy = 'size'
            this.sortOrder = 'desc'
            this.selected = []
        }
    }
}
</script>

<style>
.name {
    font-size: 1.3rem;
    margin-left: .5rem;
}

.name::before {
    color: #777;
    font-size: small;
}

.name-block {
    padding: .25rem 0;
}

#bins {
    padding: 0;
    border-right: 0;
    border-bottom: 1px solid #ccc;
    height: 100vh;
    background-color: white;
}

#bins td {
    width: calc(100% / 7);
}

#bins-header {
    background-color: white;
    padding: .25rem 1rem;
}

#bins-header > label {
    margin-left: 1em;
}

.btn-header {
    font-size: .8rem;
    padding-right: 1rem;
    padding-left: 1rem;
}

.btn-table {
    font-size: .7rem;
    padding: .25rem 1rem;
}

#table-head {
    margin-top: .5rem;
}

#table-head span, #table-head strong {
    cursor: pointer;
}

.thicc {
    font-weight: 500;
    letter-spacing: .025rem;
}

.btn-bin {
    border: 0;
    color: #333;
    background: transparent;
}
.btn-bin:hover {
    background-color: #eee;
    color: black;
}

#refine-button {
    background: white;
    font-weight: 500;
    color: #478e47;
    border: 1px solid #52a552;
    letter-spacing: .03rem;
}
</style>