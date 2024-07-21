<template>
	<div>
		<CreateAppointmentComponent
			ref="createAppointmentComponent"
			prepend-icon="mdi-calendar-clock"
			title="Book an appointment"
			width="900"
			:onClick="() => createOrUpdateAppointment(form)"
			:save-or-update-text="saveOrUpdateText"
			:reset-form="resetForm"
		>
			<v-row dense>
				<v-col
					cols="12"
					sm="6"
				>
					<VueDatePicker
						input-class-name="custom-input-calendar"
						v-model="date"
						:min-date="new Date()"
						:disabled-week-days="[6, 0]"
						:enable-time-picker="false"
						:format="format"
						teleport
						six-weeks="fair"
						no-today
						auto-apply
						placeholder="Select an appointment date"
						required
					/>
				</v-col>

				<v-col
					cols="12"
					md="6"
					sm="6"
				>
					<TimePicker v-model="form.data.attributes.startTime" />
				</v-col>

				<v-col
					cols="12"
					md="6"
					sm="6"
				>
					<v-autocomplete
						v-model="selectedWorker"
						:items="workerNames"
						label="Worker"
						required
						variant="outlined"
						:loading="loading"
					></v-autocomplete>
				</v-col>

				<v-col
					cols="12"
					md="6"
					sm="6"
				>
					<v-select
						v-model="selectedServiceNames"
						:item-props="serviceProps"
						:items="serviceNames"
						item-title="name"
						label="Service"
						multiple
						chips
						variant="outlined"
					>
					</v-select>
				</v-col>

				<template v-if="authRole === 'admin' || authRole === 'worker'">
					<v-col
						cols="12"
						md="6"
						sm="6"
					>
						<v-autocomplete
							v-model="selectedClient"
							:items="clientNames"
							label="Client"
							required
							variant="outlined"
						></v-autocomplete>
					</v-col>

					<v-col
						cols="12"
						md="6"
						sm="6"
					>
						<v-select
							v-model="status"
							label="Status"
							:items="[
								'Pending',
								'Reserved',
								'Paid',
								'Cancelled',
								'Not presented',
							]"
							variant="outlined"
						></v-select>
					</v-col>
				</template>
			</v-row>
			<span class="text-overline text-medium-emphasis">
				Total:
				{{
					selectedServicesFormatted
						.reduce(
							(acc, service) => acc + parseFloat(service.attributes.price),
							0
						)
						.toFixed(2)
				}}
				€
			</span>
		</CreateAppointmentComponent>
	</div>
</template>

<script setup>
import { onMounted, computed, watch, ref } from "vue";
import CreateAppointmentComponent from "@/components/CreateComponent.vue";
import { useAppointmentStore } from "@/stores/appointment.store";
import { useServiceStore } from "@/stores/service.store";
import { useUserStore } from "@/stores/user.store";
import { useAuthStore } from "@/stores/auth.store";
import TimePicker from "../TimePicker.vue";
import moment from "moment";

const props = defineProps({
	selectedAppointmentId: Object,
});

const saveOrUpdateText = ref("Create");
const loading = ref(false);
const status = ref("Pending");
const date = ref();
const {
	getAppointments,
	createAppointment,
	updateAppointment,
	getAppointmentWithUserWorkerService,
} = useAppointmentStore();
const { getServices } = useServiceStore();
const { workersRelatedToUser, getUsers, getUsersWithWorker } = useUserStore();
const { authRole, authUser } = useAuthStore();

const format = (date) => {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
};

const selectedServiceNames = ref([]);
const serviceNames = computed(() =>
	useServiceStore().services.map((service) => {
		return {
			name: service.attributes.name,
			price: service.attributes.price + " €",
		};
	})
);

const selectedServicesFormatted = computed(() =>
	useServiceStore().services.filter((service) =>
		selectedServiceNames.value.includes(service.attributes.name)
	)
);

const serviceProps = (service) => {
	return {
		title: service.name,
		subtitle: service.price,
	};
};

const workerNames = ref([]);
const fetchWorkerNames = async () => {
	loading.value = true;
	try {
		await getUsersWithWorker();
		const workerSet = new Set();

		const filteredUsers = useUserStore().users.filter(user => user.relationships.worker.data !== null);

		filteredUsers.forEach((user) => {
			const worker = {
				id: user.relationships.worker.data.id,
				name: user.attributes.name,
			};

			if (!workersRelatedToUser.some(existingWorker => existingWorker.id === worker.id)) {
				workersRelatedToUser.push(worker);
			}
		});

		workersRelatedToUser
			.filter((worker) => worker)
			.forEach((worker) => {
				workerSet.add(worker.name);
			});

		workerNames.value = [...workerSet];
	} catch (error) {
		console.error("Error fetching workers:", error);
		workerNames.value = [];
	} finally {
		loading.value = false;
	}
};


const selectedWorker = ref("");

const selectedWorkerFormatted = computed(() => {
	const users = useUserStore().users;
	const selectedUser = users.find(
		(user) => user.attributes.name === selectedWorker.value
	);

	if (selectedUser) {
		console.log("workersRelatedToUser:", workersRelatedToUser);
		const worker = workersRelatedToUser.find(
			(worker) => worker.name === selectedWorker.value
		);
		return worker ? { id: worker.id, type: "workers" } : null;
	}
	return null;
});

const clientNames = computed(() =>
	useUserStore().users.map((user) => user.attributes.name)
);

const selectedClient = ref("");
const selectedClientFormatted = computed(() => {
	const users = useUserStore().users;
	const user = users.find(
		(user) => user.attributes.name === selectedClient.value
	);
	return user ? { id: user.id, type: "users" } : null;
});

onMounted(async () => {
	try {
		await Promise.all([getUsers(), getServices(), getAppointments(), fetchWorkerNames()]);
	} catch (error) {
		console.error("An error occurred while fetching data:", error);
	}
});

const emit = defineEmits(["createSuccess", "updateSuccess"]);

const handleSuccess = (isUpdate) => {
	if (isUpdate) {
		emit("updateSuccess", "Appointment updated successfully");
	} else {
		emit("createSuccess", "Appointment created successfully");
	}
};

const handleCreateAppointment = async (form) => {
	try {
		form.data.attributes.status = status.value.toLowerCase();
		form.data.attributes.date = date.value;
		form.data.relationships.services.data = selectedServicesFormatted.value.map(
			(service) => {
				return {
					id: service.id,
					type: "services",
				};
			}
		);
		authUser && authRole === null
			? (form.data.relationships.user.data = {
					id: authUser.id.toString(),
					type: "users",
			})
			: (form.data.relationships.user.data = selectedClientFormatted.value);

		form.data.relationships.worker.data = selectedWorkerFormatted.value;
		await createAppointment(form);
		await getAppointments();
		handleSuccess(false);
	} catch (error) {
		console.error(error);
	}
};

const handleUpdateAppointment = async (form) => {
	try {
		form.data.attributes.status = status.value.toLowerCase();
		form.data.attributes.date = date.value;
		form.data.relationships.services.data = selectedServicesFormatted.value.map(
			(service) => {
				return {
					id: service.id,
					type: "services",
				};
			}
		);
		form.data.relationships.user.data = selectedClientFormatted.value;
		form.data.relationships.worker.data = selectedWorkerFormatted.value;
		await updateAppointment(form);
		await getAppointments();
		handleSuccess(true);
	} catch (error) {
		console.error(error);
	}
};

const createOrUpdateAppointment = async (form) => {
	if (form.data.id) {
		await handleUpdateAppointment(form);
	} else {
		await handleCreateAppointment(form);
	}
};
const createAppointmentComponent = ref(null);

const form = ref({
	data: {
		type: "appointments",
		attributes: {
			date: null,
			startTime: null,
			status: status,
		},
		relationships: {
			services: {
				data: [],
			},
			worker: {
				data: {},
			},
			user: {
				data: selectedClient.value,
			},
		},
	},
});

watch(
	() => props.selectedAppointmentId,
	async (newId) => {
		if (newId) {
			try {
				await getAppointmentWithUserWorkerService(newId);
				const appointment = useAppointmentStore().appointment;

				form.value.data.id = appointment.id;

				const originalDate = appointment.attributes.date;
				const formattedDate = moment(originalDate).format("YYYY-MM-DD");
				date.value = formattedDate;

				status.value = appointment.attributes.status;

				const editClient = useUserStore().users.find(
					(user) => user.id === appointment.relationships.user.data.id
				);
				if (editClient) {
					selectedClient.value = editClient.attributes.name;
				} else {
					console.warn("Client not found for appointment:", appointment);
					selectedClient.value = "";
				}

				const editWorker = workersRelatedToUser.find(
					(worker) => worker.id === appointment.relationships.worker.data.id
				);
				if (editWorker) {
					selectedWorker.value = editWorker.name;
				} else {
					console.warn("Worker not found for appointment:", appointment);
					selectedWorker.value = "";
				}

				selectedServiceNames.value =
					appointment.relationships.services.data.map((service) => {
						const foundService = useServiceStore().services.find(
							(s) => s.id === service.id
						);
						return foundService ? foundService.attributes.name : "";
					});

				form.value.data.attributes.startTime = appointment.attributes.startTime;
				saveOrUpdateText.value = "Update";
				createAppointmentComponent.value.openDialog();
			} catch (error) {
				console.error("Error fetching appointment details:", error);
			}
		}
	},
	{ immediate: true, deep: true }
);

const resetForm = () => {
	delete form.value.data.id;
	saveOrUpdateText.value = "Create";
	selectedClient.value = "";
	selectedWorker.value = "";
	selectedServiceNames.value = [];
	date.value = null;
	status.value = "Pending";
	form.value.data.attributes.startTime = null;
};
</script>

<style>
.custom-input-calendar {
	padding-top: 1em;
	padding-bottom: 1em;
	border: 1px solid #bdbdbd;
}
</style>
