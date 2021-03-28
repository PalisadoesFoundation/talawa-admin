import { GetterTree } from "vuex";

import { AuthState } from "../types";

const getters: GetterTree<AuthState, any> = {
  getUser: state => state.user,
  isAuthenticated: state => state.isAuthenticated
};

export default getters;
