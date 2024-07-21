import { defineStore } from "pinia";
import router from "@/router";
import axiosClient from "@/axios.config";
import bcrypt from "bcryptjs";

export const useUserStore = defineStore({
	id: "user",
	state: () => ({
		users: [],
		workersRelatedToUser: [],
	}),
	actions: {
		async getUsers() {
			try {
				const response = await axiosClient.get("api/v1/users");
				this.users = response.data.data;
			} catch (error) {
				console.log(error);
			}
		},

		// async getWorkerRelatedToUser(id) {
		// 	try {
		// 		const response = await axiosClient.get(`api/v1/users/${id}/worker`);
		// 		return response.data.data;
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// },

		async getUsersWithWorker() {
			try {
				const response = await axiosClient.get("api/v1/users?include=worker");
				this.users = response.data.data;
			} catch (error) {
				console.log(error);
			}
		},
		async createUser(form) {
			try {
				const response = await axiosClient.post("api/v1/users", {
					data: {
						type: "users",
						attributes: {
							name: form.name,
							email: form.email,
							password: this.encryptPassword(form.password),
						},
						relationships: {
							worker: {
								data: {
									type: "workers",
									id: form.worker_id,
								},
							},
						},
					},
				});
				this.users.push(response.data);
			} catch (error) {
				console.log(error);
			}
		},

		encryptPassword(password) {
			const salt = bcrypt.genSaltSync(10);
			return bcrypt.hashSync(password, salt);
		},

		// async updateUser(form) {
		// 	try {
		// 		await axiosClient.patch(`api/v1/users/${form.data.id}`, form);
		// 		await this.getUsers();
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// },
		async destroyUser(id) {
			try {
				await axiosClient.delete(`api/v1/users/${id}`);
			} catch (error) {
				console.log(error);
			}
		},
		// async getUserNameRelatedToWorker(id) {
		// 	try {
		// 		const response = await axiosClient.get(
		// 			`api/v1/users?filter[worker_id]=${id}`
		// 		);
		// 		return response.data.data;
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// },
	},
});
