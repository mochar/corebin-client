<template>
<router-link to="/overview" @click.native="select" tag="a" 
    :class="{ 'selected-bin-set': selectedClass }"
    class="list-group-item list-group-item-action flex-column align-items-start bin-set">
    <span class="name">{{ binSet.name }}</span>

    <div class="card-block" style="padding: .15rem 1rem .5rem;">
        <div class="btn-group">
            <rename-popover 
                btn-classes="btn-header"
                text="Rename"
                @done="name => { $store.commit('RENAME_BIN_SET', { binSet, name }) }"
                :url="`a/${binSet.assembly}/bs/${binSet.id}`">
            </rename-popover>

            <delete-popover 
                btn-classes="btn-header"
                text="Remove"
                @done="commitDeletion"
                style="border-right: 1px solid #adadad;"
                :url="`a/${binSet.assembly}/bs/${binSet.id}`">
            </delete-popover>
        </div>


        <div style="margin-top: .5rem" v-if="refineBinSet && refineBinSet.id == binSet.id">
            <span class="text-muted">
                <span class="fa fa-wrench"></span>
                <span>Refinement in progress...</span>
                <a 
                    href="#" 
                    v-show="$route.path !== '/refine'"
                    class="text-muted" 
                    style="text-decoration: underline; position: absolute; right: 1rem"
                   @click.prevent="viewRefine"
                >View
                </a>
            </span>
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
        }
    },

    computed: {
        refineBinSet() {
            return this.$store.state.refineBinSet
        },
        selectedClass() {
            return this.$store.state.binSet.id == this.binSet.id &&
                   this.$route.path === '/overview'
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

.selected-bin-set {
    -webkit-box-shadow: inset 0px 0px 1px 0px rgba(0,0,0,1);
    -moz-box-shadow: inset 0px 0px 1px 0px rgba(0,0,0,1);
    box-shadow: inset 0px 0px 1px 0px rgba(0,0,0,1);
    background-color: white;
}

.list-group-item-action,
.list-group-item-action:focus, 
.list-group-item-action:hover,
.list-group-item-action:active {
    background-color: white;
}
</style>