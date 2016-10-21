import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const ASSEMBLIES = [
    {
        name: 'Synthetic',
        id: 1
    },
    {
        name: 'Bioreactor',
        id: 2
    }
]

const BIN_SETS = [
    {
        assembly: 1,
        color: '#a00342',
        id: 1,
        name: 'Metabat'
    },
    {
        assembly: 1,
        color: '#2d0682',
        id: 2,
        name: 'CONCOCT'
    }
]

const state = {
    assemblies: ASSEMBLIES,
    assembly: ASSEMBLIES[0],
    binSets: BIN_SETS,
    binSet: BIN_SETS[0]
}

const mutations = {
    ADD_ASSEMBLY(state, { name }) { // TODO: async, move to actions
        state.assemblies.push({name, cute: true})
    },
    SELECT_ASSEMBLY(state, { assembly }) {
        console.log(state);
        console.log(assembly);
        state.assembly = assembly;
    },
    SELECT_BIN_SET(state, { binSet }) {
        console.log(state);
        console.log(binSet);
        state.binSet = binSet;
    }
}

const actions = {
}

const store = new Vuex.Store({
    state,
    mutations,
    actions
})

export default store
