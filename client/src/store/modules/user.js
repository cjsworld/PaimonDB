const getDefaultState = () => {
    return {
        user: null,
        permissions: null
    };
};

const state = getDefaultState();

const mutations = {
    SET_USER(state, data) {
        state.user = data
    },
    SET_PERMISSION(state, data) {
        state.permissions = data
    }
}

const actions = {
    setUser({commit}, data) {
        commit('SET_USER', data)
    },
    setPermissions({commit}, data) {
        commit('SET_PERMISSION', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
