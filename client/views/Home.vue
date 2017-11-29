<template>
<div class="row" id="home">
    <div class="col-3 app-left">
        <strong class="sidebar-button" style="position: absolute; right: 0"
                :class="{ 'sidebar-button-disabled': assemblyJob }"
                data-toggle="tooltip" data-placement="bottom"
                title="Upload assembly">
            <span class="fa fa-plus fa-lg text-muted" data-toggle="modal"
                    data-target="#assembly-upload-modal">
            </span>
        </strong>
        <strong class="text-center text-muted sidebar-title">
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
                    <assembly v-for="a in assemblies" :assembly="a" :key="a.id"></assembly>
                    <job :job="assemblyJob" v-if="assemblyJob"></job>
                </div>
            </div>
        </transition>
    </div>
    <div class="col-9 app-right">
        <home-main></home-main>
    </div>

    <footer-section></footer-section>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import HomeMain from 'components/HomeMain'
import Assembly from 'components/Assembly'
import Job from 'components/Job'
import FooterSection from 'components/FooterSection'

export default {
    data() {
        return {
            loading: true
        }
    },
    
    components: {
        HomeMain,
        Assembly,
        Job,
        FooterSection
    },

    computed: {
        ...mapState([
            'assemblies',
            'assembly',
            'assemblyJob'
        ])
    },

    beforeMount() {
        this.$store.dispatch('GET_ASSEMBLIES').then(() => {
            this.loading = false
        })
    }
}
</script>

<style>
#home {
}

#lead {
    background-color: #fafafa;
    padding: 1rem;
}

/** SIDEBAR **/
#try-link {
    text-align: center;
    display: block;
    text-decoration: underline;
}

#assembly-list {
    overflow-y: auto;
    height: 85%;
}

.empty-message {
    text-align: center;
    display: block;
}
</style>
