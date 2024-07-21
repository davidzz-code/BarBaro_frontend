<template>
	<v-row>
		<div v-if="loading" class="mx-auto my-12">
			<MustacheLoader/>
		</div>
		<template v-else>
			<AppointmentCard
				v-for="appointment in appointments"
				:key="appointment.id"
				:appointment="appointment"
				:openModal="openModal"
				:deleteAppointment="deleteAppointment"
				@selected-appointment-id="emitSelectedAppointmentId"
			/>
			<div v-if="!appointments.length" class="w-100 mt-15 text-center text-h5">
				No appointments found
			</div>
		</template>
	</v-row>
</template>

<script setup>
import AppointmentCard from "./AppointmentCard.vue";
import MustacheLoader from "@/components/MustacheLoader.vue";
const props = defineProps({
	appointments: Array,
	loading: Boolean,
	openModal: Function,
	deleteAppointment: Function,
});
const emit = defineEmits(["selected-appointment-id"]);

const emitSelectedAppointmentId = (id) => {
	emit("selected-appointment-id", id);
};
</script>
