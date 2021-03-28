import axios from "axios";

const endpoint = process.env.VUE_APP_ORBA_ONE_ENDPOINT;

export default axios.create({
  baseURL: endpoint,
});
