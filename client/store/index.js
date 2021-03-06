import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import distanceInWords from 'date-fns/distance_in_words'

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
    selectedContigs: [],
    potentialRefineBins: null,
    potentialRefineSet: null,

    // Jobs
    assemblyJob: null,
    binSetJobs: [],
    hmmerJobs: [],
    
    // Other
    message: '',
    binSetsLoading: false,
    viewAssembly: null
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
        assemblies.forEach(a => {
            a.submitDate = distanceInWords(a.submitDate, new Date())
            a.plotData = null
        })
        state.assemblies = assemblies
    },
    APPEND_ASSEMBLIES(state, assembly) {
        assembly.submitDate = distanceInWords(assembly.submitDate, new Date())
        assembly.plotData = null
        state.assemblies.push(assembly)
    },
    SET_BIN_SETS(state, binSets) {
        binSets.forEach(bs => {
            bs.submitDate = distanceInWords(bs.submitDate, new Date())
        })
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
        binSet.submitDate = distanceInWords(binSet.submitDate, new Date())
        state.binSets.push(binSet)
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
    EDIT_BIN(state, { bin, name, color }) {
        bin.name = name
        bin.color = color
        const contigs = state.contigs.map(contig => {
            if (contig.bin == bin.id) contig[`color_${bin.binSetId}`] = color
            return contig
        })
        state.contigs = contigs
    },
    PUSH_REFINE_BINS(state, { bins, contigs }) {
        state.refineBins = [...state.refineBins, ...bins]
        state.contigs.push(...contigs)
    },
    REMOVE_REFINE_BIN(state, bin) {
        state.refineBins = state.refineBins.filter(b => b.id !== bin.id)
        state.contigs = state.contigs.filter(c => c.bin !== bin.id)
    },
    REMOVE_REFINE_BINS(state, bins) {
        state.refineBins = state.refineBins.filter(b => !bins.includes(b.id))
        state.contigs = state.contigs.filter(c => !bins.includes(c.bin))
    },
    SET_CONTIGS(state, contigs) {
        state.contigs = contigs
    },
    SET_POTENTIAL_REFINE_BINS(state, bins) {
        state.potentialRefineBins = bins
    },
    SET_POTENTIAL_REFINE_SET(state, binSet) {
        state.potentialRefineSet = binSet
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
    },
    REMOVE_BINS(state, bins) {
        state.bins = state.bins.filter(b => !bins.includes(b.id))
    },
    REMOVE_BIN_SET(state, binSet) {
        const index = state.binSets.findIndex(bs => bs.id === binSet.id)
        state.binSets.splice(index, 1)
    },
    REMOVE_ASSEMBLY(state, assembly) {
        const index = state.assemblies.findIndex(a => a.id === assembly.id)
        state.assemblies.splice(index, 1)
    },
    SET_SELECTED_CONTIGS(state, contigs) {
        state.selectedContigs = contigs
    },
    SET_ASSEMBLY_PLOT(state, { assembly, data }) {
        const index = state.assemblies.findIndex(a => a.id === assembly.id)
        state.assemblies[index].plotData = data
    },
    SET_VIEW_ASSEMBLY(state, assembly) {
        state.viewAssembly = assembly
    },
    BIN_SETS_LOADING(state, loading) {
        state.binSetsLoading = loading
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
    SELECT_ASSEMBLY_AND_FIRST_BIN_SET({ dispatch, state }, assembly) {
        return dispatch('SELECT_ASSEMBLY', assembly).then(() => {
            if (state.binSets.length === 0) return
            return dispatch('SELECT_BIN_SET', state.binSets[0])
        })
    },
    SELECT_ASSEMBLY_CAREFULLY({ commit, dispatch, state}, assembly) {
        router.push({ path: 'overview' })
        const currentAssembly = state.assembly
        if (!currentAssembly || currentAssembly.id !== assembly.id) {
            commit('BIN_SETS_LOADING', true)
            dispatch('SELECT_ASSEMBLY_AND_FIRST_BIN_SET', assembly).then(() => {
                router.push({ path: 'overview' })
            }).then(() => commit('BIN_SETS_LOADING', false))
        }
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
            for (let assembly of respAssemblies[0].assemblies) {
                dispatch('GET_ASSEMBLY_PLOT', { assembly })
            }
            commit('SET_MESSAGE', '')
        })
    },
    GET_ASSEMBLY_PLOT({ commit }, { assembly }) {
        $.getJSON(`${ROOTURL}/a/${assembly.id}/c/plot`).then(data => {
            commit('SET_ASSEMBLY_PLOT', { assembly, data })
        })
    },
    GET_BIN_SETS({ commit, state }) {
        return $.getJSON(`${ROOTURL}/a/${state.assembly.id}/bs`).then(data => {
            commit('SELECT_BIN_SET', null)
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
    CHECK_ASSEMBLY_JOB({ commit, state, dispatch }) {
        const job = state.assemblyJob
        $.getJSON(job.location, (data, textStatus, jqXHR) => {
            if (jqXHR.status == 201) {
                commit('SET_ASSEMBLY_JOB', null)
                const location = jqXHR.getResponseHeader('Location')
                $.getJSON(location, assembly => {
                    commit('APPEND_ASSEMBLIES', assembly)
                    dispatch('GET_ASSEMBLY_PLOT', { assembly })
                    if (state.assemblies.length === 1) 
                        dispatch('SELECT_ASSEMBLY_AND_FIRST_BIN_SET', assembly)
                })
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
    CHECK_BIN_SET_JOBS({ commit, state, dispatch }) {
        const jobs = state.binSetJobs
        jobs.forEach(job => {
            $.getJSON(job.location, (data, textStatus, jqXHR) => {
                if (jqXHR.status != 201) return
                commit('REMOVE_BIN_SET_JOB', job)
                const location = jqXHR.getResponseHeader('Location')
                $.getJSON(location, binSet => {
                    commit('APPEND_BIN_SETS', binSet)
                    if (state.binSets.length === 1)
                        dispatch('SELECT_BIN_SET', binSet)
                })
            })
        })
    },
    SUBMIT_BIN({ commit, state }, data) {
        const url = `${ROOTURL}/a/${state.assembly.id}/bs/${state.binSet.id}/b`
        return $.post(url, data).then(data => {
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
    PUSH_REFINE_BINS({ commit, state }, bins) {
        commit('SET_MESSAGE', 'Fetching data...')
        const payload = {
            fields: 'id,length,gc,name',
            bins: bins.map(b => b.id).join(','),
            coverages: true,
            pca: state.assembly.hasFourmerfreqs,
            colors: true,
            items: state.assembly.size
        }
        return $.getJSON(`${ROOTURL}/a/${state.assembly.id}/c`, payload).then(data => {
            commit('SET_MESSAGE', '')
            commit('PUSH_REFINE_BINS', { bins, contigs: data.contigs })
        })
    },
    REFINE({ commit, state, dispatch }, { bins, binSet }) {
        // Confirmation pop-up when other binSet is being refined
        if (state.refineBinSet && state.refineBinSet.id !== binSet.id) {
            commit('SET_POTENTIAL_REFINE_BINS', bins)
            commit('SET_POTENTIAL_REFINE_SET', binSet)
            $('#open-refine-modal').modal('show')
            return
        }

        // Set bin-set to the chosen refine bin-set if this is not the case
        const p = state.binSet.id === binSet.id ? 
            Promise.resolve() : dispatch('SELECT_BIN_SET', binSet)

        // Filter out bins which are already being refined
        p.then(() => {
            const refining = state.refineBins.map(b => b.id)
            bins = bins.filter(b => !refining.includes(b.id))
            if (bins.length > 0)
                dispatch('PUSH_REFINE_BINS', bins)

            commit('SET_REFINE_BIN_SET', binSet)
            router.push({ path: 'refine' })
        })
    }
}

const getters = {
    withoutUnbinned(state) {
        return state.bins.filter(bin => !bin.unbinned)
    },
    unbinned(state) {
        return state.bins.filter(bin => bin.unbinned)[0]
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})

export default store
