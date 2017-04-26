<template>
<a href="#" @click.prevent="select" 
    class="assembly list-group-item list-group-item-action flex-column align-items-start">
    <div class="name-block d-flex justify-content-between align-self-center w-100">
        <span class="name">{{ assembly.name }}</span>
        <div>
            <rename-popover 
                btn-classes="btn-bin text-primary-hover"
                text=""
                @done="name => { $store.commit('RENAME_ASSEMBLY', { assembly, name }) }"
                :url="`a/${assembly.id}`">
            </rename-popover>
            <popover :options="{placement: 'bottom'}">
                <button slot="button" class="btn btn-secondary btn-sm btn-bin text-danger-hover">
                    <span class="fa fa-fw fa-trash"></span> 
                </button>
                <div slot="body">
                    <button class="btn btn-danger btn-sm" @click="setDeleted">Delete assembly</button>
                </div>
            </popover>
        </div>
    </div>

    <div class="card-block" style="padding: .15rem 1rem; width: 100%">
        <div class="row">
            <span class="col-9 desc">Bin-sets</span>
            <span class="col-3">{{ assembly.binSets }}</span>

            <span class="col-9 desc">Contigs</span>
            <span class="col-3">{{ assembly.size }}</span>

            <span class="col-9 desc">Coverage samples</span>
            <span class="col-3">{{ assembly.samples.length }}</span>

            <span class="col-9 desc">Tetranucleotide frequencies</span>
            <span class="col-3">{{ assembly.hasFourmerfreqs ? '&#10004' : '&times' }}</span>

            <span class="col-9 desc">Marker genes</span>
            <span class="col-3">{{ assembly.genesSearched ? '&#10004' : '&times' }}</span>
        </div>
    </div>

    <div class="w-100">
        <transition name="fade" mode="out-in">
            <div v-if="assembly.plotData">
                <div class="btn-group float-right" data-toggle="buttons">
                    <label class="btn btn-secondary btn-sm btn-bin" @click.stop="" :class="{ active: !plotLength }">
                        <small>
                            <input type="radio" value="gc" v-model="plotType"> GC%
                        </small>
                    </label>
                    <label class="btn btn-secondary btn-sm btn-bin" @click.stop="" :class="{ active: plotLength }">
                        <small>
                            <input type="radio" value="length" v-model="plotType"> Length
                        </small>
                    </label>
                </div>
                <histogram v-if="assembly.plotData" :plotData="plotData" :format="plotLength"></histogram>
            </div>
            <span class="fa fa-refresh fa-spin fa-fw mx-auto d-block" v-else></span>
        </transition>
    </div>

    <p class="card-text" style="margin: .5rem">
        <small class="text-muted">Added {{ assembly.submitDate }}</small>
    </p>
</a>
</template>

<script>
import Popover from '../components/Popover'
import RenamePopover from '../components/RenamePopover'
import Histogram from '../charts/Histogram'

export default {
    data() {
        return {
            plotType: 'gc'
        }
    },

    props: ['assembly'],

    components: {
        Popover,
        RenamePopover,
        Histogram
    },

    methods: {
        select() {
            const currentAssembly = this.$store.state.assembly
            if (currentAssembly && currentAssembly.id === this.assembly.id) {
                if (this.binSets.length > 0) this.$router.push({ path: 'overview' })
            }
            if (!currentAssembly || currentAssembly.id !== this.assembly.id) {
                this.$store.dispatch('SELECT_ASSEMBLY_AND_FIRST_BIN_SET', this.assembly).then(() => {
                    if (this.binSets.length > 0) this.$router.push({ path: 'overview' })
                })
            }
            this.$emit('selected')
        },
        setDeleted() {
            $.ajax({
                url: `${ROOTURL}/a/${this.assembly.id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ deleted: true })
            }).then(() => {
                this.$store.commit('REMOVE_ASSEMBLY', this.assembly)
            })
        }
    },

    computed: {
        binSets() {
            return this.$store.state.binSets
        },
    	binSetJobs() {
    		return this.$store.state.binSetJobs.filter(job => {
    			return job.meta.assembly === this.assembly.id
    		})
    	},
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
.list-group-item {
    border-left: 0;
    border-right: 0;
    display: block;
}

.desc {
    font-weight: 500;
    line-height: 1.5rem;
}
</style>