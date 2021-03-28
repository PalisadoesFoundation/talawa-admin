import { AuthState } from "../types";

const state: AuthState = {
  token: "",
  verifyEmail: "",
  refreshToken: "",
  isAuthenticated: false,
  user: {
    firstName: "",
    lastName: ""
  }
};

export default state;
