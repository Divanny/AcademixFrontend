import axios from "axios";
import NProgress from "nprogress";

const api = axios.create({
  baseURL: "https://academix.azurewebsites.net/",
  // baseURL: "https://localhost:44311/",
});

api.interceptors.request.use((config) => {
  NProgress.configure({ parent: ".progressBar" });
  NProgress.configure({ showSpinner: false });
  NProgress.start();

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },

  (error) => {
    console.log(error.response.data)
  }
);

export default api;
