import Vue from 'vue'
import Vuex from 'vuex'
import { ASSEMBLIES, BIN_SETS, BINS } from './mock'

Vue.use(Vuex)

const state = {
    assemblies: ASSEMBLIES,
    assembly: ASSEMBLIES[0],
    binSets: BIN_SETS,
    binSet: BIN_SETS[0],
    bins: BINS,
    bin: BINS[0]
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
    }
}

const actions = {
    ADD_ASSEMBLY(state, { name }) {
        state.assemblies.push({name, cute: true})
    },
    RENAME_BIN(state, name) {
        
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions
})

export default store
