<template>
<router-link to="/overview" @click.native="select" tag="a" 
    :class="{ 'selected-bin-set': selectedClass }"
    :style="style"
    class="list-group-item list-group-item-action flex-column align-items-start bin-set">

    <div class="name-div w-100 d-flex justify-content-between align-items-baseline">
        <span class="name">{{ binSet.name }}</span>
        <span class="fa fa-eye fa-lg fa-fw" v-if="isSelected"></span>
    </div>

    <div class="card-body" style="padding: .15rem 1rem .5rem;">
        <div style="margin-top: .5rem" class="text-muted d-flex justify-content-between" 
            v-if="refineBinSet && refineBinSet.id == binSet.id">
            <div>
                <span class="fa fa-wrench"></span>
                <span>Refinement in progress...</span>
            </div>
            <a 
                href="#" 
                v-show="$route.path !== '/refine'"
                class="text-muted bin-set-action" 
                style="text-decoration: underline; position: absolute; right: 1rem"
                @click.prevent="viewRefine"
            >View
            </a>
        </div>
    </div>

    <div class="bin-set-bar text-muted d-flex justify-content-between">
        <div>
            <span class="fa fa-list fa-fw"></span>
            {{ binSet.bins.length }}
        </div>

        <div>
            <popover>
                <button 
                    slot="button" 
                    class="btn btn-secondary btn-sm action-btn text-primary-hover"
                    style="border-left: 0; border-right: 0">
                    <span class="fa fa-download"></span>
                </button>
                <div slot="body">
                    <button class="btn btn-secondary btn-sm" @click="download">
                        Download bins
                    </button>
                </div>
            </popover>
            <rename-popover 
                btn-classes="action-btn text-primary-hover"
                text=""
                @done="name => { $store.commit('RENAME_BIN_SET', { binSet, name }) }"
                :url="`a/${binSet.assembly}/bs/${binSet.id}`">
            </rename-popover>
            <delete-popover 
                btn-classes="action-btn text-danger-hover"
                text=""
                @done="commitDeletion"
                :url="`a/${binSet.assembly}/bs/${binSet.id}`">
            </delete-popover>
        </div>
    </div>
</router-link>
</template>

<script>
import Popover from '../components/Popover'
import RenamePopover from '../components/RenamePopover'
import DeletePopover from '../components/DeletePopover'

export default {
    props: ['binSet'],

    components: {
        Popover,
        RenamePopover,
        DeletePopover
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
        },
        commitDeletion() {
            if (this.$store.state.binSet.id === this.binSet.id) {
                const binSets = this.$store.state.binSets
                if (binSets.length === 1) {
                    this.$router.push({ path: 'home' })
                    this.$store.commit('SELECT_BIN_SET', null)
                } else {
                    const index = binSets.findIndex(bs => bs.id === this.binSet.id)
                    const newBinSet = binSets[index === 0 ? 1 : 0]
                    this.$store.dispatch('SELECT_BIN_SET', newBinSet)
                }
            }
            this.$store.commit('REMOVE_BIN_SET', this.binSet)
        },
        download() {
            const url = `${ROOTURL}/a/${this.binSet.assembly}/bs/${this.binSet.id}/export`
            window.open(url)
        }
    },

    computed: {
        refineBinSet() {
            return this.$store.state.refineBinSet
        },
        isSelected() {
            return this.$store.state.binSet.id == this.binSet.id
        },
        selectedClass() {
            return this.isSelected && this.$route.path === '/overview'
        },
        style() {
            return { 
                // 'border-left': `4px solid ${this.binSet.color}`,
                'border-left': `3px solid ${this.isSelected ? '#d9534f' : '#555'}`,
                'margin-left': this.isSelected ? '.5rem' : '.3rem'
            }
        }
    }
}
</script>

<style>
.bin-set {
    border-color: #ccc;
    padding-top: .5rem !important;
    padding: 0; 
    margin: .1rem .3rem;
    width: initial;
    box-shadow: 1px 2px 2px 1px #eee;
}

.list-group-item-action,
.list-group-item-action:focus, 
.list-group-item-action:hover,
.list-group-item-action:active {
    background-color: white;
}

.bin-set-bar {
    /*background: #eee;*/
    width: 100%;
    padding: .15rem .5rem;
    /*border-top: 1px solid #ddd;*/
}

.name-div {
    padding-right: 1rem;
}

.bin-set-action:hover {
    color: #333;
}

.action-btn {
    border: 0;
    color: #444;
}
</style>