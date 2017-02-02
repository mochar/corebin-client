import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

const state = {
    // Data
    assemblies: [],
    assembly: null,
    binSets: [],
    binSet: null,
    bins: [],
    bin: null,

    // Refinement
    refineBinSet: null,
    refineBins: [],
    contigs: [],

    // Jobs
    assemblyJob: null,
    binSetJobs: [],
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
        assemblies.forEach(a => a.submitDate = moment(a.submitDate).fromNow())
        state.assemblies = assemblies
    },
    APPEND_ASSEMBLIES(state, assembly) {
        assembly.submitDate = moment(assembly.submitDate).fromNow()
        state.assemblies.push(assembly)
        if (state.assemblies.length === 1) state.assembly = assembly
    },
    SET_BIN_SETS(state, binSets) {
        state.binSets = binSets
        if (binSets.length) state.binSet = binSets[0]
    },
    SET_BINS(state, bins) {
        state.bins = bins
    },
    SET_ASSEMBLY_JOB(state, job) {
        state.assemblyJob = job
    },
    SET_JOBS(state, jobs) {
        jobs.forEach(job => {
            if (job.meta.type == 'A') { // assembly job
                state.assemblyJob = job
            } else if (job.meta.type == 'B') { // bin set job
                state.binSetJobs.push(job)
            }
        })
        state.hmmerJobs = [...state.hmmerJobs, ...jobs.filter(job => job.meta.type == 'C')]
    },
    SET_MESSAGE(state, message) {
        state.message = message
    },
    REMOVE_BIN_SET_JOB(state, job) {
        state.binSetJobs = state.binSetJobs.filter(j => j !== job)
    },
    APPEND_BIN_SETS(state, binSet) {
        state.binSets.push(binSet)
        if (state.binSets.length === 1) state.binSet = binSet
    },
    APPEND_BIN(state, bin) {
        state.bins.push(bin)
    },
    RENAME_BIN(state, { bin, name }) {
        const index = state.bins.findIndex(b => b.id === bin.id)
        let b = Object.assign({}, bin)
        b.name = name
        Vue.set(state.bins, index, b)
    },
    RENAME_BIN_SET(state, { binSet, name }) {
        const index = state.binSets.findIndex(bs => bs.id === binSet.id)
        let bs = Object.assign({}, binSet)
        bs.name = name
        Vue.set(state.binSets, index, bs)
    },
    RENAME_ASSEMBLY(state, { assembly, name }) {
        const index = state.assemblies.findIndex(a => a.id === assembly.id)
        let a = Object.assign({}, assembly)
        a.name = name
        Vue.set(state.assemblies, index, a)
    },
    PUSH_REFINE_BIN(state, { bin, contigs }) {
        state.refineBins.push(bin)
        state.contigs.push(...contigs)
    },
    REMOVE_REFINE_BIN(state, bin) {
        state.refineBins = state.refineBins.filter(b => b.id !== bin.id)
        state.contigs = state.contigs.filter(c => c.bin !== bin.id)
    },
    SET_CONTIGS(state, contigs) {
        state.contigs = contigs
    },
    SET_REFINE_BIN_SET(state, binSet) {
        if (!state.refineBinSet || state.refineBinSet.id !== binSet.id) {
            state.refineBinSet = binSet
            state.refineBins = []
            state.contigs = []
        }
    },
    REMOVE_BIN(state, bin) {
        state.bins = state.bins.filter(b => b.id !== bin.id)
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
        return $.post({
            url: `${ROOTURL}/a`,
            data: formData,
            async: true,
            cache: false,
            contentType: false,
            processData: false
        }).then((data, status, xhr) => {
            const job = { location: xhr.getResponseHeader('Location'), meta: data }
            commit('SET_JOBS', [job])
        }, (xhr, textStatus, errorThrown) => {
            console.log('assembly failed')
        })
    },
    SUBMIT_BIN_SET({ commit }, { assembly, formData }) {
        return $.post({
            url: `${ROOTURL}/a/${assembly}/bs`,
            data: formData,
            async: true,
            cache: false,
            contentType: false,
            processData: false
        }).then((data, status, xhr) => {
            const job = { location: xhr.getResponseHeader('Location'), meta: data }
            commit('SET_JOBS', [job])
        }, (xhr, textStatus, errorThrown) => {
            console.log('bin set failed')
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
            commit('SET_MESSAGE', '')
            // if (respAssemblies[0].assemblies.length) {
            //     dispatch('SELECT_ASSEMBLY', respAssemblies[0].assemblies[0])
            // } else {
            //     commit('SET_MESSAGE', '')
            // }
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
    },
    CHECK_ASSEMBLY_JOB({ commit, state }) {
        const job = state.assemblyJob
        $.getJSON(job.location, (data, textStatus, jqXHR) => {
            if (jqXHR.status == 201) {
                commit('SET_ASSEMBLY_JOB', null)
                const location = jqXHR.getResponseHeader('Location')
                $.getJSON(location, assembly => commit('APPEND_ASSEMBLIES', assembly))
            } else {
                let updatedJob = Object.assign({}, job)
                updatedJob.meta = data
                commit('SET_ASSEMBLY_JOB', updatedJob)
            }
        })
    },
    CANCEL_ASSEMBLY_JOB({ commit, state }) {
        return $.ajax({
            type: 'DELETE',
            url: state.assemblyJob.location
        }).done(() => commit('SET_ASSEMBLY_JOB', null))
    },
    CHECK_BIN_SET_JOBS({ commit, state }) {
        const jobs = state.binSetJobs
        jobs.forEach(job => {
            $.getJSON(job.location, (data, textStatus, jqXHR) => {
                if (jqXHR.status == 201) {
                    commit('REMOVE_BIN_SET_JOB', job)
                    const location = jqXHR.getResponseHeader('Location')
                    $.getJSON(location, binSet => commit('APPEND_BIN_SETS', binSet))
                } 
            })
        })
    },
    SUBMIT_BIN({ commit, state }, name) {
        const url = `${ROOTURL}/a/${state.assembly.id}/bs/${state.binSet.id}/b`
        return $.post(url, { name }).then(data => {
            if (data.binSetId === state.binSet.id) commit('APPEND_BIN', data)
        })
    },
    RENAME_BIN_SET({ commit, state }, name) {
        return $.ajax({
            url: `${ROOTURL}/a/${state.assembly.id}/bs/${state.binSet.id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ name })
        }).then(data => {
            commit('RENAME_BIN_SET', name)
        })
    },
    PUSH_REFINE_BIN({ commit, state }, bin) {
        const payload = {
            fields: 'id,length,gc,name',
            bins: bin.id,
            coverages: true,
            pca: state.assembly.hasFourmerfreqs,
            colors: true,
            items: state.assembly.size
        }
        return $.getJSON(`${ROOTURL}/a/${state.assembly.id}/c`, payload).then(data => {
            data.contigs.forEach(c => c.bin = bin.id)
            const contigs = data.contigs
            commit('PUSH_REFINE_BIN', { bin, contigs })
        })
    }
}

const getters = {
    withoutUnbinned(state) {
        return state.bins.filter(bin => bin.name !== 'unbinned')
    },
    unbinned(state) {
        return state.bins.filter(bin => bin.name === 'unbinned')[0]
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})

export default store
