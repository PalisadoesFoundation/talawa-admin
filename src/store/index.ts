import Vue from "vue";
import Vuex from "vuex";
import { RootState } from "./types";
import createPersistedState from "vuex-persistedstate";

import auth from "@/modules/auth/vuex/index";

//Encrypt Localstorage
import SecureLS from "secure-ls";
const ls = new SecureLS({});
Vue.use(Vuex);

//Store initial store, for resets
const initialState: RootState = {
  auth: auth.state,
};

//Persist User data state in localstorage
const authState = createPersistedState({
  paths: ["auth"],
  storage: {
    getItem: (key) => ls.get(key),
    setItem: (key, value) => ls.set(key, value),
    removeItem: (key) => ls.remove(key),
  },
});

export default new Vuex.Store({
  state: initialState,
  mutations: {
    //Loop through modules and reset each
    reset(state: RootState) {
      Object.assign(state, initialState);
    },
  },
  actions: {},
  modules: {
    auth,
  },
  plugins: [authState],
});
