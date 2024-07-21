import { defineStore } from "pinia";
import axiosClient from "@/axios.config";

export const useWorkerStore = defineStore({
	id: "worker",
	state: () => ({
		workers: [],
		worker: null,
	}),
	actions: {
		async getWorkers() {
			try {
				const response = await axiosClient.get("api/v1/workers");
				this.workers = response.data.data;
			} catch (error) {
				console.log(error);
			}
		},
		async getWorker(id) {
			try {
				const response = await axiosClient.get(`api/v1/workers/${id}`);
				this.worker = response.data.data;
			} catch (error) {
				console.log(error);
			}
		},
		async createWorker(form) {
			try {
				const response = await axiosClient.post("api/v1/workers", form);
				this.workers.push(response.data.data);
				return response.data.data;
			} catch (error) {
				console.log(error);
			}
		},
		async updateWorker(form) {
			try {
				await axiosClient.patch(`api/v1/workers/${form.data.id}`, form);
				await this.getWorkers();
			} catch (error) {
				console.log(error);
			}
		},
		async destroyWorker(id) {
			try {
				await axiosClient.delete(`api/v1/workers/${id}`);
			} catch (error) {
				console.log(error);
			}
		},
	},
});
