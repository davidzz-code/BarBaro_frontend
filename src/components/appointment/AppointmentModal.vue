<!-- AppointmentModal.vue -->
<template>
	<v-dialog
		:model-value="modalVisible"
		@update:model-value="updateModalVisible"
		max-width="600"
	>
		<v-card>
			<v-card-title class="headline">Services</v-card-title>
			<v-card-text>
				<v-list>
					<v-list-item
						v-for="service in selectedAppointment.serviceDetails"
						:key="service.id"
					>
						<v-list-item-content>
							<v-list-item-title>
								{{service.attributes.name}}
								<span class="text-caption text-blue-grey-darken-1">
								- {{ service.attributes.price }} €
								</span>
							</v-list-item-title>
							<v-list-item-subtitle>
								{{service.attributes.description}}
							</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-card-text>
			<span class="ml-6 pl-4 text-overline text-medium-emphasis">
				Total: {{ selectedAppointment.serviceDetails.reduce((acc, service) => acc + parseFloat(service.attributes.price), 0).toFixed(2) }} €
			</span>
			<v-card-actions class="d-flex justify-end">
				<v-btn
					variant="tonal"
					text="Close"
					@click="closeModal"
				/>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup>
const props = defineProps({
	modalVisible: Boolean,
	selectedAppointment: Object,
	closeModal: Function,
});
const emit = defineEmits(["update:model-value"]);

const updateModalVisible = (value) => {
	emit("update:model-value", value);
};

const calculateTotal = (price) => {
	const totalPrice =+ parseFloat(price)
	return totalPrice.toFixed(2);
};
</script>
