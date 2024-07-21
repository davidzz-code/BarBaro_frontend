<template>
	<v-col
		cols="12"
		md="4"
	>
		<v-card
			min-height="250px"
			class="bg-white"
			:variant="isExpired ? 'plain' : 'elevated'"
		>
			<v-card-text>
				<v-list class="">
					<v-list-item>
						<v-list-item-content>
							<v-list-item-subtitle
								class="d-flex justify-space-between align-center text-subtitle-1"
							>
								<div>
									{{ formattedDate }}
									{{ appointment.attributes.startTime.slice(0, 5) }}
								</div>
								<v-chip
									:color="isExpired ? grey : statusColor"
									class="font-weight-bold text-capitalize"
								>
									{{ isExpired ? "Expired" : statusText }}
								</v-chip>
							</v-list-item-subtitle>
							<v-list-item-title class="font-weight-bold text-h6 mt-3">
								{{ appointment.serviceDetails[0]?.attributes.name }}
							</v-list-item-title>
							<v-list-item-subtitle class="text-subtitle-1 mt-3">
								{{ appointment.serviceDetails[0]?.attributes.description }}
							</v-list-item-subtitle>
							<v-list-item-subtitle class="mt-5">
								Worker: {{ appointment.worker[0]?.attributes.name }}
							</v-list-item-subtitle>
							<v-list-item-subtitle v-if="authRole === 'admin' || authRole === 'worker'" class="mt-5">
								Client: {{ appointment.userDetails?.attributes.name }}
							</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-list>
				<v-card-actions class="d-inline-flex justify-end">
					<v-btn
						icon="mdi-information-outline"
						variant="outlined"
						class="mx-3"
						@click="openModal(appointment)"
					>
					</v-btn>
					<template v-if="authRole === 'admin' || authRole === 'worker'">
						<DeleteConfirmationDialog 
							is-appointment-card
							:on-delete="() => deleteAppointment(appointment.id)"
						/>
						<!-- <v-overlay
							:model-value="overlay"
							class="align-center justify-center"
							>
							<div class="mx-auto my-12">
								<MustacheLoader />
							</div>
						</v-overlay> -->
					<v-btn
						icon="mdi-pencil"
						variant="outlined"
						color="primary"
						class="mx-3"
						@click="emitSelectedAppointmentId(appointment.id)"
					/>
				</template>
				</v-card-actions>
			</v-card-text>
		</v-card>
	</v-col>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import MustacheLoader from "@/components/MustacheLoader.vue";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog.vue";
import { useAppointmentStore } from "@/stores/appointment.store";
import { useAuthStore } from "@/stores/auth.store";

const { authRole } = useAuthStore();
const overlay = ref(false);
const { isLoading } = useAppointmentStore();
const isExpired = ref(true);

const props = defineProps({
	appointment: Object,
	openModal: Function,
	deleteAppointment: Function,
});

watch(isLoading, (val) => {
	if (!val) {
		overlay.value = false;
	}
});

const emit = defineEmits(["selected-appointment-id"]);
const emitSelectedAppointmentId = (id) => {
	emit("selected-appointment-id", id);
};

const formattedDate = computed(() => {
	return new Date(props.appointment.attributes.date).toLocaleDateString(
		"es-ES",
		{
			day: "numeric",
			month: "short",
			year: "numeric",
		}
	);
});

const statusColor = computed(() => {
	switch (props.appointment.attributes.status) {
		case "reserved":
			return "success";
		case "pending":
			return "warning";
		case "cancelled":
			return "error";
		case "paid":
			return "primary";
		case "not presented":
			return "error";
		default:
			return "error";
	}
});

const statusText = computed(() => {
	return props.appointment.attributes.status === "confirmed"
		? "Completed"
		: props.appointment.attributes.status;
});

onMounted(() => {
	const today = new Date();
	const appointmentDate = new Date(props.appointment.attributes.date);
	isExpired.value = today > appointmentDate;
});
</script>

<style scoped>
.add-button {
	margin-top: 0.5rem;
	padding: 0;
	width: 23px;
	height: 23px;
}
</style>
