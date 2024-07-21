import { defineStore } from "pinia";
import axiosClient from "@/axios.config";
import { useAuthStore } from "./auth.store";

const { authRole } = useAuthStore();

export const useAppointmentStore = defineStore({
	id: "appointment",
	state: () => ({
		appointments: [],
		appointment: null,
		included: [],
		isLoading: false,
	}),
	actions: {
		async getAppointments() {
			try {
				const response = await axiosClient.get("api/v1/appointments");
				this.appointments = response.data.data;
			} catch (error) {
				console.log(error);
			}
		},
		async getAppointmentWithUserWorkerService(id) {
			try {
				const response = await axiosClient.get(`api/v1/appointments/${id}?include=user,worker,services`)
				this.appointment = response.data.data;
			} catch (error) {
				console.log(error);
			}
		},

		async getAppointmentWithUser(id) {
			try {
				const response = await axiosClient.get(
					`api/v1/appointments?include=user,services,worker`
				);

				const appointmentsWithUser = {
					appointments: [],
					services: [],
					workers: [],
					users: [],
				};

				response.data.data.forEach((appointment) => {
					const appointmentUserId = appointment.relationships.user.data.id;
					if (authRole === null) {	
						if (appointmentUserId == id) {
							appointmentsWithUser.appointments.push(appointment);
						}
					} else {
						appointmentsWithUser.appointments.push(appointment);
					}
				});

				response.data.included.forEach((included) => {
					if (included.type === "services") {
						appointmentsWithUser.services.push(included);
					} else if (included.type === "workers") {
						appointmentsWithUser.workers.push(included);
					} else if (included.type === "users") {
						appointmentsWithUser.users.push(included);
					}
				});

				const workerPromises = {};
				const workers = await Promise.all(
					appointmentsWithUser.appointments.map((appointment) => {
						const workerId = appointment.relationships.worker.data.id;

						if (!workerPromises[workerId]) {
							workerPromises[workerId] = axiosClient.get(
								`api/v1/users?filter[worker_id]=${workerId}`
							);
						}

						return workerPromises[workerId];
					})
				);

				workers.forEach((workerResponse, index) => {
					const workerId =
						appointmentsWithUser.appointments[index].relationships.worker.data
							.id;
					appointmentsWithUser.appointments.forEach((appointment) => {
						if (appointment.relationships.worker.data.id === workerId) {
							appointment.worker = workerResponse.data.data;
						}
					});
				});
				return appointmentsWithUser;
			} catch (error) {
				console.log(error);
			}
		},

		async getAppointmentWithWorker(id) {
			try {
				const response = await axiosClient.get(
					`api/v1/appointments?include=user,services,worker`
				);

				const appointments = response.data.data;
				const included = response.data.included;

				this.included = included;

				this.appointments = appointments.filter(
					(appointment) => appointment.relationships.worker.data.id == id
				);
			} catch (error) {
				console.log(error);
			}
		},

		async createAppointment(form) {
			this.isLoading = true;
			try {
				const response = await axiosClient.post("api/v1/appointments", form);
				this.appointments.push(response.data);
			} catch (error) {
				console.log(error);
			} finally {
				this.isLoading = false;
			}
		},

		async updateAppointment(form) {
			this.isLoading = true;
			try {
        await axiosClient.patch(`api/v1/appointments/${form.data.id}`, form);
      } catch (error) {
        console.log(error);
			} finally {
				this.isLoading = false;
			}
    },

		async destroyAppointment(id) {
			this.isLoading = true;
			try {
				await axiosClient.delete(`api/v1/appointments/${id}`);
			} catch (error) {
				console.log(error);
			} finally {
				this.isLoading = false;
			}
		},
	},
});
