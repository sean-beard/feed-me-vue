import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    authToken: "",
  },
  mutations: {
    updateAuthStatus(state, { isAuthenticated, authToken }) {
      state.isAuthenticated = isAuthenticated;
      state.authToken = authToken;
    },
  },
  actions: {
    setIsAuthenticated({ commit }, payload) {
      commit("updateAuthStatus", payload);
    },
  },
  modules: {},
});
