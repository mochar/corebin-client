<template>
<div>
    <div id="assemblies">
        <transition name="slide-fade" mode="out-in">
        <div v-if="pageIsHome" key="assemblies">
            <strong class="selection-button" style="position: absolute; right: 0"
                    :class="{ 'selection-button-disabled': assemblyJob }"
                    data-toggle="tooltip" data-placement="bottom"
                    title="Upload assembly">
                <span class="fa fa-plus fa-lg text-muted" data-toggle="modal"
                      data-target="#assembly-upload-modal">
                </span>
            </strong>
            <strong class="text-center text-muted selection-title">
                ASSEMBLIES
            </strong>

            <transition name="fade" mode="out-in">
                <div class="d-flex justify-content-center" style="margin-top: 1rem"
                    v-if="loading" key="loading">
                    <span class="fa fa-refresh fa-spin fa-2x text-muted"></span>
                </div>

                <div v-if="!loading" key="notloading">
                    <div v-if="assemblies.length === 0 && !assemblyJob">
                        <span class="text-muted empty-message">No assemblies.</span>
                        <a href="#" id="try-link" class="text-muted" data-toggle="modal"
                            data-target="#demo-modal">
                            Try CoReBIN with demo data
                        </a>
                    </div>

                    <div id="assembly-list" class="list-group">
                        <assembly v-for="a in assemblies" :assembly="a"></assembly>
                        <job :job="assemblyJob" v-if="assemblyJob"></job>
                    </div>
                </div>
            </transition>
        </div>
        
        <div v-if="pageIsOverview" key="bin-sets">
            <div class="navigation" style="padding-bottom: .5rem">
                <router-link tag="div" class="selection-button" to="/home" @click.native="$store.commit('SHOW_ASSEMBLIES', true)">
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
                <div class="selection-button" data-toggle="tooltip" data-placement="bottom" title="Upload bin-set">
                    <span class="fa fa-plus fa-lg text-muted" data-toggle="modal"
                        data-target="#bin-set-upload-modal">
                    </span>
                </div>
            </div>

            <transition name="fade" mode="out-in">
                <div class="d-flex justify-content-center" style="margin-top: 1rem"
                    v-if="binSetsLoading" key="loading">
                    <span class="fa fa-refresh fa-spin fa-2x text-muted"></span>
                </div>

                <div v-else key="notloading">
                    <div v-if="binSets.length === 0 && binSetJobs.length === 0">
                        <span class="text-muted empty-message">No bin-sets.</span>
                    </div>

                    <div id="bin-sets" v-else>
                        <bin-set
                            v-for="bs in binSets"
                            :binSet="bs">
                        </bin-set>
                        <job
                            v-for="job in binSetJobs"
                            :job="job">
                        </job>
                    </div>
                </div>
            </transition>

            <router-link tag="strong" id="compare-link" class="text-muted" to="/compare"
                    :class="{ 'inactive-button': !binSets.length }">
                <span class="fa fa-balance-scale"></span>
                COMPARE BIN-SETS
            </router-link>
        </div>
        
        <div v-if="pageIsRefine" key="refine">
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
                    <ul class="nav nav-tabs justify-content-center card-header-tabs">
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

        <div v-if="pageIsCompare" key="compare">
            <div class="navigation" style="padding-bottom: .5rem">
                <div class="selection-button" @click="$router.go(-1)">
                    <span class="fa fa-angle-left fa-lg text-muted" style="font-weight: bold"></span>
                </div>
                <div>
                    <strong class="selection-title text-muted text-center" style="padding-bottom: 0">
                        Compare
                    </strong>
                    <strong class="selection-sub text-muted text-center">
                        {{ assembly.name }}
                    </strong>
                </div>
                <div></div>
            </div>
        </div>

        <div v-if="pageIsHelp" key="help">
            <div class="navigation">
                <div class="selection-button" @click="$router.go(-1)">
                    <span class="fa fa-angle-left fa-lg text-muted" style="font-weight: bold"></span>
                </div>
                <div>
                    <strong class="selection-title text-muted text-center" style="padding-bottom: 0">
                        HELP
                    </strong>
                </div>
                <div></div>
            </div>
            <help-links></help-links>
        </div>
        </transition>
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
import HelpLinks from '../components/HelpLinks'

export default {
    data() {
        return {
            cancelling: false,
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
        BinsTab,
        HelpLinks
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
            'binSetJobs',
            'showAssemblies',
            'binSetsLoading'
        ]),
        pageIsHome() {
            return this.$route.path === '/home'
        },
        pageIsRefine() {
            return this.$route.path === '/refine'
        },
        pageIsHelp() {
            return this.$route.path === '/help'
        },
        pageIsOverview() {
            return this.$route.path === '/overview'
        },
        pageIsCompare() {
            return this.$route.path === '/compare'
        }
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

#bin-sets > .bin-set:first-child,
#assembly-list > .assembly:first-child {
    /*box-shadow: inset 0px 1px 1px 0px #eee;*/
}
#bin-sets > .bin-set:last-child,
#assembly-list > .assembly:last-child {
    /*box-shadow: inset 0px -1px 1px 0px #eee;*/
}
#bin-sets > .bin-set:first-child:last-child,
#assembly-list > .assembly:first-child:last-child {
    /*box-shadow: inset 0px 1px 1px 0px #eee, inset 0px -1px 1px 0px #eee;*/
}

#assembly-list {
    overflow-y: auto;
    height: 85vh;
}

#bin-sets > .bin-set:not(:first-child) {
    border-top: 0;
}

/* Animation */
.slide-fade-enter-active {
  transition: all .06s ease;
}
.slide-fade-leave-active {
  transition: all .06s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
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
