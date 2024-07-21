<template>
	<v-container class="is-light-mode">
		<h1>Hello, {{ authStore.authUser.name }}</h1>
		<h4>
			Here you will see your calendar with the appointments associated with you
		</h4>

		<Qalendar
			:events="events"
			:config="config"
		/>
	</v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Qalendar } from "qalendar";
import { useAuthStore } from "@/stores/auth.store";
import { useAppointmentStore } from "@/stores/appointment.store";
import { parseISO, format } from "date-fns";

const appointmentStore = useAppointmentStore();
const authStore = useAuthStore();
const events = ref([]);

const fetchAppointments = async () => {
	await appointmentStore.getAppointmentWithWorker(authStore.authUser.worker_id);

	const appointments = appointmentStore.appointments;
	const included = appointmentStore.included;

	events.value = appointments
		.map((appointment) => {
			const userName = included.find(
				(item) =>
					item.id === appointment.relationships.user.data.id &&
					item.type === "users"
			)?.attributes.name;

			let filteredServices = [];

			included.forEach((item) => {
				if (item.type === "services") {
					appointment.relationships.services.data.forEach((service) => {
						if (service.id === item.id) {
							filteredServices.push(item);
						}
					});
				}
			});

			const filteredServicesNames = filteredServices.map(
				(service) => service.attributes.name
			);

			let sum = 0;
			filteredServices.forEach((service) => {
				sum += service.attributes.approximateDurationMin;
			});

			const endTime = sum;
			const startDate = parseISO(appointment.attributes.date);

			const [hours, minutes, seconds] =
				appointment.attributes.startTime.split(":");
			const start = new Date(startDate);
			start.setHours(hours, minutes, seconds);

			if (isNaN(start.getTime())) {
				console.error(
					"Invalid start date/time for appointment ID:",
					appointment.id
				);
				return null;
			}

			const end = new Date(start.getTime() + endTime * 60 * 1000);
			let color = "";

			switch (appointment.attributes.status) {
				case "pending":
					color = "yellow";
					break;
				case "reserved":
					color = "green";
					break;
				case "not presented":
					color = "red";
					break;
				default:
					color = "blue";
					break;
			}

			return {
				title: userName,
				with: authStore.authUser?.name,
				time: {
					start: format(start, "yyyy-MM-dd HH:mm"),
					end: format(end, "yyyy-MM-dd HH:mm"),
				},
				color: color,
				id: appointment.id,
				description: filteredServicesNames.join(", "),
			};
		})
		.filter((event) => event !== null);
};

onMounted(fetchAppointments);

const config = ref({
	week: {
		startsOn: "monday",
		nDays: 5,
		scrollToHour: 5,
	},
	month: {
		showTrailingAndLeadingDates: false,
	},
	locale: "en-EN",
	defaultMode: "week",
	isSilent: true,
	showCurrentTime: true,
	dayBoundaries: {
		start: 9,
		end: 19,
	},
});
</script>

<style>
@import "qalendar/dist/style.css";
</style>
