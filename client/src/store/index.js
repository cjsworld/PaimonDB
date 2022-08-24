import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import getters from "./getters"

Vue.use(Vuex)

const getDefaultState = () => {
    return {};
};

const state = getDefaultState();

const mutations = {}

const actions = {}

const store = new Vuex.Store({
    modules: {
        user
    },
    getters,
    state,
    mutations,
    actions
})

export default store
