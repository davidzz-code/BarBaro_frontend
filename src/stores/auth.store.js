import { defineStore } from "pinia";
import axiosClient from "@/axios.config";
import router from "@/router";
import { useWorkerStore } from "./worker.store";
import VueCookies from "vue-cookies";

export const useAuthStore = defineStore({
	id: "auth",
	persist: {
		storage: sessionStorage,
	},
	state: () => ({
		authUser: null,
		authToken: null,
		authRole: null,
	}),
	actions: {
		async getToken() {
			await axiosClient.get("/sanctum/csrf-cookie");
		},

		async login(form) {
			try {
				await this.getToken();
				const response = await axiosClient.post("/login", form);

				this.authToken = response.data.token;
				this.authUser = response.data.user;

				if (this.authUser.worker_id === null) {
					router.push("/appointments");
				} else {
					await useWorkerStore().getWorker(this.authUser.worker_id);
					const worker = useWorkerStore().worker;
					this.authRole = worker.attributes.role;
					router.push("/worker/schedule");
				}
				return { success: true, data: response };
			} catch (error) {
				if (error.response && error.response.status === 422) {
					return { success: false, errors: error.response.data.errors };
				} else {
					throw error;
				}
			}
		},

		async logout() {
			await this.getToken();
			await axiosClient.post("/logout", this.authToken);
			VueCookies.remove("XSRF-TOKEN");
			this.authUser = null;
			this.authToken = null;
			this.authRole = null;
			router.push("/login");
		},

		async register(data) {
			try {
				await this.getToken();
				const response = await axiosClient.post("/register", {
					name: data.name,
					email: data.email,
					password: data.password,
					password_confirmation: data.password_confirmation,
				});

				return { success: true, data: response };
			} catch (error) {
				if (error.response && error.response.status === 422) {
					return { success: false, errors: error.response.data.errors };
				} else {
					throw error;
				}
			}
		},
	},
});
