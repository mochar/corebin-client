<template>
<div>
    <div id="assemblies">
        <div v-if="showAssemblies && $route.path !== '/refine'">
            <strong class="selection-button" style="position: absolute; right: 0"
                    :class="{ 'selection-button-disabled': assemblyJob }">
                <span class="fa fa-plus fa-lg text-muted" data-toggle="modal"
                      data-target="#assembly-upload-modal">
                </span>
            </strong>
            <strong class="text-center text-muted selection-title">
                ASSEMBLIES
            </strong>

            <div v-if="assemblies.length === 0 && !assemblyJob && !loading">
                <span class="text-muted empty-message">No assemblies.</span>
                <a href="#" id="try-link" class="text-muted" data-toggle="modal"
                    data-target="#demo-modal">
                    Try CoReBIN with demo data
                </a>
            </div>

            <div class="d-flex justify-content-center" style="margin-top: 1rem" v-if="loading">
                <span class="fa fa-refresh fa-spin fa-2x text-muted"></span>
            </div>

            <div class="list-group">
                <assembly
                    v-for="a in assemblies"
                    @selected="showAssemblies = false"
                    :assembly="a">
                </assembly>
            </div>

            <job :job="assemblyJob" v-if="assemblyJob"></job>
        </div>
        
        <div v-if="!showAssemblies && $route.path !== '/refine'">
            <div class="navigation" style="padding-bottom: .5rem">
                <router-link tag="div" class="selection-button" to="/home" @click.native="showAssemblies = true">
                    <span class="fa fa-angle-left fa-lg text-muted" style="font-weight: bold"></span>
                </router-link>
                <div>
                    <strong class="selection-title text-muted text-center" style="padding-bottom: 0">
                        BIN-SETS
                    </strong>
                    <strong class="selection-sub text-muted text-center">
                        {{ assembly.name }}
                    </strong>
                </div>
                <div class="selection-button">
                    <span class="fa fa-plus fa-lg text-muted" data-toggle="modal"
                        data-target="#bin-set-upload-modal">
                    </span>
                </div>
            </div>

            <div v-if="binSets.length === 0 && binSetJobs.length === 0">
                <span class="text-muted empty-message">No bin-sets.</span>
            </div>

            <bin-set
                v-for="bs in binSets"
                :binSet="bs">
            </bin-set>

            <job
                v-for="job in binSetJobs"
                :job="job">
            </job>

            <router-link tag="strong" id="compare-link" class="text-muted" to="/compare"
                    :class="{ 'inactive-button': !binSets.length }">
                <span class="fa fa-balance-scale"></span>
                COMPARE BIN-SETS
            </router-link>
        </div>
        
        <div v-if="$route.path === '/refine'">
            <div class="navigation">
                <div class="selection-button" @click="$router.go(-1)">
                    <span class="fa fa-angle-left fa-lg text-muted" style="font-weight: bold"></span>
                </div>
                <div>
                    <strong class="selection-title text-muted text-center" style="padding-bottom: 0">
                        REFINEMENT
                    </strong>
                    <strong class="selection-sub text-muted text-center">
                        {{ binSet.name }}
                    </strong>
                </div>
                <div></div>
            </div>
            
            <div class="card" style="border-width: 0 0 1px 0">
                <div class="card-header" style="background: #F4F4F4">
                    <ul class="nav nav-tabs card-header-tabs">
                        <li class="nav-item">
                            <a class="nav-link" href="#" 
                                :class="{active: refinementTab === 'PlotTab'}"
                                @click.prevent="refinementTab = 'PlotTab'">
                                <span class="fa fa-line-chart"></span>
                                Plot
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#"
                                :class="{active: refinementTab === 'RefineTab'}"
                                @click.prevent="refinementTab = 'RefineTab'">
                                <span class="fa fa-wrench"></span>
                                Refine
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#"
                                :class="{active: refinementTab === 'BinsTab'}"
                                @click.prevent="refinementTab = 'BinsTab'">
                                <span class="fa fa-list"></span>
                                Bins
                            </a>
                        </li>
                    </ul>
                </div>
                <div id="tab-body">
                    <component :is="refinementTab"></component>
                </div>
            </div>
        </div>
    </div>

    <div class="float-right" id="madeby">
        <div>
            <small><router-link to="/home"><img src="../img/logo.svg" id="logo-home" /> Home</router-link></small> |
            <small><router-link to="/help">Stuck or need more info?</router-link></small> <br>
        </div>
        <small class="text-muted">Developed by Mohammed Charrout</small> <br>
        <small class="text-muted">Project-coordinator Lex Overmars</small>
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Assembly from '../components/Assembly'
import BinSet from '../components/BinSet'
import Job from '../components/Job'
import PlotTab from '../components/PlotTab'
import RefineTab from '../components/RefineTab'
import BinsTab from '../components/BinsTab'

export default {
    data() {
        return {
            cancelling: false,
            showAssemblies: true,
            refinementTab: 'PlotTab',
            loading: true
        }
    },

    components: {
        Assembly,
        BinSet,
        Job,
        PlotTab,
        RefineTab,
        BinsTab
    },

    methods: {
        ...mapActions({
            cancelAssemblyJob: 'CANCEL_ASSEMBLY_JOB'
        }),
        cancelJob() {
            this.cancelling = true
            this.cancelAssemblyJob().done(() => this.cancelling = false)
        }
    },

    computed: {
        ...mapState([
            'assemblies',
            'assembly',
            'binSets',
            'binSet',
            'assemblyJob',
            'binSetJobs'
        ])
    },

    beforeMount() {
        // Fetch data from server
        this.$store.dispatch('GET_ASSEMBLIES').then(() => {
            this.loading = false
        })
    }
}
</script>

<style>
.assembly-button {
    border: 0;
    padding: .5rem;
}

.btn-sm {
    padding: .25rem .5rem;
}

#madeby {
    position: fixed;
    bottom: 1rem;
    padding: 1rem;
}

#assemblies .assembly + .assembly,
#assemblies .bin-set + .bin-set {
    border-top: 0;
}

#add-assembly-button {
    color: #666;
    border: 0;
    background-color: transparent;
}
#add-assembly-button:hover {
    background-color: #ddd;
}

.selection-title {
    display: block;
    font-size: 1.0rem;
    padding: .5rem ;
}

.selection-sub {
    display: block;
    font-size: .9rem;
    font-weight: 500;
    opacity: .9;
    margin: -.15rem;
}

.selection-button {
    cursor: pointer;
    font-size: 1.0rem;
}
.selection-button:hover > span.fa {
    color: #333 !important;
}
.selection-button > span.fa {
    padding: .5rem;
    line-height: initial;
}
.selection-button-disabled {
    cursor: not-allowed;
    opacity: .5;
}

.inactive-button {
    opacity: .5;
    cursor: not-allowed;
}

.empty-message {
    text-align: center;
    display: block;
}

#try-link {
    text-align: center;
    display: block;
    text-decoration: underline;
}

#compare-link {
    cursor: pointer;
    text-decoration: underline;
    text-align: center;
    display: block;
    margin-top: 1rem;
    font-size: .9rem;
}

#compare-link:hover {
    color: #444 !important;
}

#tab-body {
    max-height: 80vh;
    overflow-y: auto;
    display: block;
}

.navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#logo-home {
    height: 1.5rem;
}
</style>

<style scoped>
.info-card {
    border-left-width: 1px;
}

.list-group-item {
    padding: 0;
}

.nav-link:not(.active) {
    color: #636c72 !important;
}
</style>
