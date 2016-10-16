import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    assemblies: []
}

const mutations = {
    ADD_ASSEMBLY(state, { name }) {
        state.assemblies.push({name, cute: true})
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
