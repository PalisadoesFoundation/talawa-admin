import { ActionTree } from "vuex";
import { AuthState, LoginPayload } from "../types";
import API from "@/axios";
import localforage from "localforage";
import { setAuthTokenHeader } from "../utils";

const actions: ActionTree<AuthState, any> = {
  login({ dispatch }, payload: LoginPayload) {
    const { email, password } = payload;
    return API.post("/auth/login", {
      email,
      password
    }).then(async response => {
      const {
        data: {
          data: { token, user }
        }
      } = response;
      if (token && user) {
        // Important that we await the token and user being set
        // Before Nav middleware runs
        await dispatch("setToken", token);
        await dispatch("setUser", user);
      }
    });
  },
  setVerifyEmail({ commit }, email) {
    commit("setVerifyEmail", email);
  },
  setUser({ commit }, user) {
    if (user) {
      commit("setUser", user);
    }
  },
  resendEmail(context, email: string) {
    return API.post("/registration/resend_confirmation", { email });
  },
  async setToken({ commit }, token) {
    // Store in LocalForage
    await localforage.setItem("token", token);
    // Set token in Axios
    setAuthTokenHeader(token);
    // Then commit in veux
    commit("setToken", token);
    commit("setAuthenticated", true);
  },
  checkIfTokenExists({ commit }) {
    return localforage.getItem("token").then(token => {
      if (token) {
        commit("setToken", token);
        setAuthTokenHeader(token as string);
        commit("setAuthenticated", true);
      } else {
        commit("setAuthenticated", false);
        throw "Auth Token not found";
      }
    });
  },
  async logout({ commit }) {
    commit("setAuthenticated", false);
    await localforage.removeItem("token");
    await localforage.clear();

    //Reset the entire root state
    commit("reset", null, { root: true });
  }
};

export default actions;
