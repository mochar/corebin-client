<template>
<div class="row" id="overview">
    <div class="col-3 app-left">
        <transition name="slide-fade" mode="out-in"><div>
            
        <div class="navigation" style="padding-bottom: .5rem">
            <router-link tag="div" class="sidebar-button" to="/home">
                <span class="fa fa-angle-left fa-lg text-muted" style="font-weight: bold"></span>
            </router-link>
            <div>
                <strong class="sidebar-title text-muted text-center" style="padding-bottom: 0">
                    BIN-SETS
                </strong>
                <strong class="sidebar-sub text-muted text-center">
                    {{ assembly.name }}
                </strong>
            </div>
            <div class="sidebar-button" data-toggle="tooltip" data-placement="bottom" title="Upload bin-set">
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
                    <bin-set v-for="bs in binSets" :binSet="bs" :key="bs.id"></bin-set>
                    <job v-for="job in binSetJobs" :job="job" :key="job.location"></job>
                </div>
            </div>
        </transition>

        <router-link tag="strong" id="compare-link" class="text-muted" to="/compare"
                :class="{ 'inactive-button': !binSets.length }">
            <span class="fa fa-balance-scale"></span>
            COMPARE BIN-SETS
        </router-link>

        </div></transition>
    </div>
    <div class="col-9 app-right">
        <overview-main v-if="binSet"></overview-main>
        <span class="text-muted empty-state-message" v-else>
            <span class="fa fa-plus fa-3x scale-icon"></span>
            <span style="font-size: 90%">CLICK ON THE PLUS BUTTON TO ADD A NEW BIN-SET TO THIS ASSEMBLY</span>
        </span>
    </div>

    <footer-section></footer-section>
</div>
</template>

<script>
import { mapState } from 'vuex'
import OverviewMain from '../components/OverviewMain'
import BinSet from '../components/BinSet'
import Job from '../components/Job'
import FooterSection from 'components/FooterSection'

export default {
    data() {
        return {
        }
    },

    components: {
        OverviewMain,
        BinSet,
        Job,
        FooterSection
    },

    computed: {
        ...mapState([
            'assembly',
            'binSet',
            'binSets',
            'binSetJobs',
            'binSetsLoading'
        ])
    }
}
</script>

<style>
#overview {
    background-color: white;
}

.thicc {
    font-weight: 500;
    letter-spacing: .025rem;
}

#bin-sets > .bin-set:not(:first-child) {
    /*border-top: 0;*/
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

.inactive-button {
    opacity: .5;
    cursor: not-allowed;
}

.empty-message {
    text-align: center;
    display: block;
}
</style>