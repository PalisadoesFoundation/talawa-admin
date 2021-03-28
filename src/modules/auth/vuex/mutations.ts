import { MutationTree } from "vuex";

import { AuthState, User } from "../types";

const mutations: MutationTree<AuthState> = {
  setAuthenticated(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },
  setToken(state, token) {
    state.token = token;
  },
  setUser(state, user: User) {
    state.user = user;
  }
};

export default mutations;
