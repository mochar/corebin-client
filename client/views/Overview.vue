<template>
<div id="bins" v-if="binSet">
    <div class="card-header" id="bins-header">
        <div class="row">
            <div class="col-6">
                <span class="name" style="margin-left: 0">{{ binSet.name }}</span>
            </div>

            <div class="dropdown col-6">
                <div class="float-right">
                    <button 
                        class="btn btn-link btn-sm btn-header" 
                        @click="showUnbinned = !showUnbinned">
                        <span v-if="showUnbinned">Hide unbinned</span>
                        <span v-else>Show unbinned</span>
                    </button>

                    <popover>
                        <button 
                            slot="button" 
                            :disabled="adding"
                            class="btn btn-primary btn-sm btn-header">
                            <span v-if="adding" class="fa fa-refresh fa-spin"></span>
                            <span class="fa fa-plus" v-else></span>
                            Add bin
                        </button>
                        <div slot="body">
                            <input placeholder="Bin name" v-model="newBinName">
                            <button 
                                class="btn btn-primary btn-sm" 
                                @click="addBin"
                                :disabled="adding">
                                <span v-show="adding" class="fa fa-refresh fa-spin"></span>
                                Add
                            </button>
                        </div>
                    </popover>

                    <button class="btn btn-success btn-sm btn-header" @click="refine()">
                        <span class="fa fa-wrench"></span>
                        Refine bins
                    </button>
                </div>
            </div>
        </div>

        <div v-if="!selected.length" class="row" id="table-head">
            <sort-head
                class="col-2"
                label="Bin"
                name="name"
                :by="sortBy"
                :order="sortOrder"
                @sort="sort('name')">
            </sort-head>
            <sort-head
                class="col-2"
                label="Size (bp)"
                name="size"
                :by="sortBy"
                :order="sortOrder"
                @sort="sort('size')">
            </sort-head>
            <sort-head
                class="col-2"
                label="GC"
                name="gc"
                :by="sortBy"
                :order="sortOrder"
                @sort="sort('gc')">
            </sort-head>
            <sort-head
                class="col-2"
                label="Contamination"
                name="contamination"
                :by="sortBy"
                :order="sortOrder"
                @sort="sort('contamination')">
            </sort-head>
            <sort-head
                class="col-2"
                label="Completeness"
                name="completeness"
                :by="sortBy"
                :order="sortOrder"
                @sort="sort('completeness')">
            </sort-head>
            <div class="col-2">
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
                <bar-column :percentage="(bin.gc * 100).toFixed(2)" :color="bin.color"></bar-column>
                <bar-column :percentage="(bin.contamination * 100).toFixed(2)" :color="bin.color"></bar-column>
                <bar-column :percentage="(bin.completeness * 100).toFixed(2)" :color="bin.color"></bar-column>
                <td class="btn-group justify-content-center" style="width: 100%">
                    <rename-popover 
                        @done="name => { $store.commit('RENAME_BIN', { bin, name }) }"
                        :url="`a/${binSet.assembly}/bs/${binSet.id}/b/${bin.id}`">
                    </rename-popover>
                    <delete-popover 
                        @done="commitDeletion(bin)"
                        :url="`a/${binSet.assembly}/bs/${binSet.id}/b/${bin.id}`">
                    </delete-popover>
                    <button class="btn btn-secondary btn-sm" @click.stop="refine(bin)">
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
import RenamePopover from '../components/RenamePopover'
import DeletePopover from '../components/DeletePopover'

export default {
    data() {
        return {
            sortBy: 'size',
            sortOrder: 'desc',
            showUnbinned: false,
            selected: [],

            newBinName: '',
            adding: false, // true when adding bin

            newBinSetName: '',
            renaming: false // true when renaming bin set
        }
    },

    components: {
        Popover,
        BarColumn,
        SortHead,
        RenamePopover,
        DeletePopover
    },

    methods: {
        sizeToPercentage(size) {
            const percentage = ((size - this.minSize) * 100) / (this.maxSize - this.minSize)
            return +percentage.toFixed(2)
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
                $('#refine-modal').modal('show')
                return
            }
            if (bin) this.$store.dispatch('PUSH_REFINE_BIN', bin)
            this.$store.commit('SET_REFINE_BIN_SET', this.binSet)
            this.$router.push({ path: 'refine' })
        },
        addBin() {
            this.adding = true
            this.$store.dispatch('SUBMIT_BIN', this.newBinName).then(() => {
                this.newBinName = ''
                this.adding = false
            })
        },
        renameBinSet() {
            this.renaming = true
            this.$store.dispatch('RENAME_BIN_SET', this.newBinSetName).then(() => {
                this.newBinSetName = ''
                this.renaming = false
            })
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
    margin-left: 1rem;
}

.name::before {
    color: #777;
    font-size: small;
}

.bin-set-name {
    margin: 0;
}

.bin-set-name::before {
    content: "bin set "
}

.info-card {
    border-left-width: 3px;
}

.name-block {
    padding: 0;
}

.action-buttons {
    opacity: .1;
    transition: opacity .15s ease-in-out;
}

.action-buttons .btn {
    padding: .5rem .75rem;
}

.info-card:hover .action-buttons {
    opacity: 1;
}

#bins {
    padding: 0;
    border-right: 0;
    border-bottom: 1px solid #ccc;
    height: 100vh;
    background-color: white;
}

#bins td {
    width: calc(100% / 6);
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
</style>