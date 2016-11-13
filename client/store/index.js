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
    hmmerJobs: [],
    
    // Other
    message: ''
}

const mutations = {
    SELECT_ASSEMBLY(state, assembly) {
        state.assembly = assembly
    },
    SELECT_BIN_SET(state, binSet) {
        state.binSet = binSet
    },
    SELECT_BIN(state, bin) {
        state.bin = bin
    },
    SET_ASSEMBLIES(state, assemblies) {
        state.assemblies = assemblies
    },
    SET_BIN_SETS(state, binSets) {
        state.binSets = binSets
        if (binSets.length) state.binSet = binSets[0]
    },
    SET_BINS(state, bins) {
        state.bins = bins
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
    },
    SET_MESSAGE(state, message) {
        state.message = message
    }
}

const actions = {
    SELECT_ASSEMBLY({ commit, dispatch, state }, assembly) {
        commit('SET_MESSAGE', 'Fetching data...')
        commit('SELECT_ASSEMBLY', assembly)
        return dispatch('GET_BIN_SETS')
    },
    SELECT_BIN_SET({ commit, dispatch }, binSet) {
        commit('SET_MESSAGE', 'Fetching data...')
        commit('SELECT_BIN_SET', binSet)
        return dispatch('GET_BINS')
    },
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
    GET_ASSEMBLIES({ commit, dispatch }) {
        commit('SET_MESSAGE', 'Fetching data...')
        return $.when(
            $.getJSON(`${ROOTURL}/jobs`),
            $.getJSON(`${ROOTURL}/a`)
        ).then((respJobs, respAssemblies) => {
            commit('SET_JOBS', respJobs[0].jobs)
            commit('SET_ASSEMBLIES', respAssemblies[0].assemblies)
            if (!respAssemblies[0].assemblies.length) return
            dispatch('SELECT_ASSEMBLY', respAssemblies[0].assemblies[0])
        })
    },
    GET_BIN_SETS({ commit, state }) {
        return $.getJSON(`${ROOTURL}/a/${state.assembly.id}/bs`).then(data => {
            commit('SET_BIN_SETS', data.binSets)
            commit('SET_MESSAGE', '')
        })
    },
    GET_BINS({ commit, state }) {
        return $.getJSON(`${ROOTURL}/a/${state.assembly.id}/bs/${state.binSet.id}/b`).then(data => {
            commit('SET_BINS', data.bins)
            commit('SELECT_BIN', null)
            commit('SET_MESSAGE', '')
        })
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions
})

export default store
