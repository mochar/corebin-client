import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    // Data
    assemblies: [],
    assembly: null,
    binSets: [],
    binSet: null,
    bins: [],
    bin: null,

    // Jobs
    assemblyJob: null,
    binSetJob: null,
    hmmerJobs: []
}

const mutations = {
    SELECT_ASSEMBLY(state, assembly) {
        state.assembly = assembly;
    },
    SELECT_BIN_SET(state, binSet) {
        state.binSet = binSet;
    },
    SELECT_BIN(state, bin) {
        state.bin = bin;
    },
    SET_ASSEMBLIES(state, assemblies) {
        state.assemblies = assemblies
        if (assemblies.length) state.assembly = assemblies[0]
    },
    SET_BIN_SETS(state, binSets) {
        state.binSets = binSets
        if (binSets.length) state.binSet = binSets[0]
    },
    SET_BINS(state, bins) {
        state.bins = bins
        if (bins.length) state.bin = bins[0]
    },
    SET_JOBS(state, jobs) {
        jobs.forEach(job => {
            if (job.meta.type == 'A') { // assembly job
                state.assemblyJob = job
            } else if (job.meta.type == 'B') { // bin set job
                state.binSetJob = job
            }
        })
        state.hmmerJobs = [...state.hmmerJobs, ...jobs.filter(job => job.meta.type == 'C')]
    }
}

const actions = {
    SUBMIT_ASSEMBLY({ commit }, { formData }) {
        $.post({
            url: `${ROOTURL}/a`,
            data: formData,
            async: true,
            cache: false,
            contentType: false,
            processData: false
        }).done((data, status, jqXHR) => {
            const job = { location: jqXHR.getResponseHeader('Location'), meta: data }
            commit('SET_JOBS', [job])
        })
    },
    GET_ASSEMBLIES({ commit }) {
        return $.when(
            $.getJSON(`${ROOTURL}/jobs`),
            $.getJSON(`${ROOTURL}/a`)
        ).then((respJobs, respAssemblies) => {
            commit('SET_JOBS', respJobs[0].jobs)
            commit('SET_ASSEMBLIES', respAssemblies[0].assemblies)
        })
    },
    GET_BIN_SETS({ commit, state }) {
        return $.getJSON(`${ROOTURL}/a/${state.assembly.id}/bs`).then(data => {
            commit('SET_BIN_SETS', data.binSets)
        })
    },
    GET_BINS({ commit, state }) {
        return $.getJSON(`${ROOTURL}/a/${state.assembly.id}/bs/${state.binSet.id}/b`).then(data => {
            commit('SET_BINS', data.bins)
        })
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions
})

export default store
