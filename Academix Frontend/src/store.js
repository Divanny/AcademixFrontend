import Vuex from 'vuex';
import api from './utilities/api';

export default new Vuex.Store({
  state: {
    userViews: [],
    userData: {},
    loading: false,
    progress: 0
  },
  mutations: {
    setUserViews(state, views) {
      state.userViews = views;
    },
    setUserData(state, data) {
      state.userData = data;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setProgress(state, progress) {
      state.progress = progress;
    }
  },
  actions: {
    fetchUser({ commit }) {
      api.get("/api/Account/GetUserData")
        .then(response => {
          commit('setUserViews', response.data.vistas);
          commit('setUserData', response.data.usuario);
        })
        .catch(error => {
          console.error('Error al obtener la información del usuario:', error);
        });
    }
  },
  getters: {
    getUserViews(state) {
      return state.userViews;
    },
    getUserData(state) {
      return state.userData;
    }
  }
});