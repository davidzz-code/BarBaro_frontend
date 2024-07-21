import axios from "axios";
import { useAuthStore } from "./stores/auth.store";

const axiosClient = axios.create({
	baseURL: `http://localhost:8000/`,
	headers: {
		"Accept": "application/vnd.api+json",
		"Content-Type": "application/vnd.api+json",
		"X-Requested-With": "XMLHttpRequest",
	},
	withCredentials: true,
	withXSRFToken: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.authToken) {
      config.headers["Authorization"] = `Bearer ${authStore.authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		let res = error.response;
		if (res.status == 401) {
			window.location.href = "/login";
		}
		console.error("Looks like there was a problem. Status Code: " + res.status);
		return Promise.reject(error);
	}
);

export default axiosClient;
