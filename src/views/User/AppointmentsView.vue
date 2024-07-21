<template>
	<v-container>
		<div class="my-5 d-flex justify-space-between">
			<div>
				<h1>Hello, {{ authUser.name }}</h1>
				<h4>Here are your appointments</h4>
			</div>
			<AppointmentCreate 
				:selected-appointment-id="selectedAppointmentId"
				@createSuccess="handleCreateSuccess" @updateSuccess="handleUpdateSuccess"
			/>
		</div>
		<AppointmentList
			:appointments="appointmentsWithWorkerAndServices"
			:loading="loading"
			:openModal="openModal"
			:deleteAppointment="deleteAppointment"
			@selected-appointment-id="redirectSelectedAppointmentId"
		/>
		<AppointmentModal
			:modalVisible="modalVisible"
			:selectedAppointment="selectedAppointment"
			:closeModal="closeModal"
		/>
		<v-snackbar
			v-model="snackbar"
			:color="snackbarColor"
			:timeout="timeout"
			elevation-24
			variant="elevated"
			location="top"
		>
			{{ snackbarMessage }}
			<v-btn
				text
				variant="text"
				size="small"
				@click="snackbar = false"
			>
				Close
			</v-btn>
		</v-snackbar>
	</v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useAppointmentStore } from "@/stores/appointment.store";
import { useAuthStore } from "@/stores/auth.store";
import generateAppointmentsWitDetails from "@/utils/generateAppointmentsWithDetails";
import AppointmentList from "@/components/appointment/AppointmentList.vue";
import AppointmentModal from "@/components/appointment/AppointmentModal.vue";
import AppointmentCreate from "@/components/appointment/AppointmentCreate.vue";

const appointmentsWithWorkerAndServices = ref([]);
const loading = ref(true);
const modalVisible = ref(false);
const selectedAppointment = ref({ services: [] });
let selectedAppointmentId = ref(null);

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");
const timeout = 3000;

const { authUser } = useAuthStore();
const { getAppointmentWithUser, destroyAppointment } = useAppointmentStore();
const appointments = computed(() => useAppointmentStore().appointments);

watch(appointments, async () => {
  await getAppointments();
});

const getAppointments = async () => {
	try {
		const response = await getAppointmentWithUser(authUser.id);

		const appointments = generateAppointmentsWitDetails(
			response.appointments,
			response.services,
			response.workers,
			response.users ?? []
		);

		appointmentsWithWorkerAndServices.value = appointments.sort(
			(a, b) => new Date(b.attributes.date) - new Date(a.attributes.date)
		);
	} catch (error) {
		console.error("Error al obtener los appointments:", error);
	} finally {
		loading.value = false;
	}
};

const deleteAppointment = async (id) => {
	try {
		await destroyAppointment(id);
		snackbarMessage.value = "Appointment deleted successfully";
		snackbarColor.value = "success";
		snackbar.value = true;
	} catch (error) {
		snackbarMessage.value = "Error deleting appointment";
		snackbarColor.value = "error";
		snackbar.value = true;
	} finally {
		await getAppointments();
	}
};

const redirectSelectedAppointmentId = (id) => {
	selectedAppointmentId.value = id;
};

const openModal = (appointment) => {
	selectedAppointment.value = appointment;
	modalVisible.value = true;
};

const closeModal = () => {
	modalVisible.value = false;
};

const handleCreateSuccess = (message) => {
  snackbarMessage.value = message;
  snackbarColor.value = 'success';
  snackbar.value = true;
};

const handleUpdateSuccess = (message) => {
  snackbarMessage.value = message;
  snackbarColor.value = 'success';
  snackbar.value = true;
};
</script>
<style></style>
