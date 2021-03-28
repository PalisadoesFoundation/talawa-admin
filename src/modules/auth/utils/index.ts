import API from "@/axios";

export function setAuthTokenHeader(token: string) {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
