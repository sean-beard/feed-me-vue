import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

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
  getters: {
    authToken: ({ authToken }) => authToken,
  },
  modules: {},
  plugins: [vuexLocal.plugin],
});
