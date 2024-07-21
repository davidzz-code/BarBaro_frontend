<template>
	<div class="ma-4 d-flex justify-space-between">
		<h1>Services</h1>
		<CreateServiceComponent
			ref="createServiceComponent"
			prepend-icon="mdi-content-cut"
			title="Create service"
			:onClick="() => createOrUpdateService(form)"
			:save-or-update-text="saveOrUpdateText"
			:reset-form="resetForm"
		>
			<v-row dense>
				<v-col
					cols="12"
					md="4"
					sm="6"
				>
					<v-text-field
						v-model="form.data.attributes.name"
						clearable
						label="Service name*"
						variant="outlined"
						required
					></v-text-field>
				</v-col>

				<v-col
					cols="12"
					md="4"
					sm="6"
				>
					<v-text-field
						placeholder="10.00"
						type="number"
						v-model.number="form.data.attributes.price"
						label="Price*"
						prefix="€"
						variant="outlined"
						required
					></v-text-field>
				</v-col>

				<v-col
					cols="12"
					md="4"
					sm="6"
				>
					<v-text-field
						v-model.number="form.data.attributes.approximateDurationMin"
						type="number"
						label="Duration*"
						hint="Duration of the service in minutes."
						variant="outlined"
						required
					></v-text-field>
				</v-col>

				<v-col cols="12">
					<v-textarea
						v-model="form.data.attributes.description"
						clearable
						label="Description"
						variant="outlined"
					></v-textarea>
				</v-col>
			</v-row>

			<small class="text-caption text-medium-emphasis"
				>*indicates required field</small
			>
		</CreateServiceComponent>
	</div>
	<div class="mx-12">
		<v-data-table-virtual
			v-if="isLoading"
			:items-length="0"
			item-key="name"
			loading-text="Loading... Please wait"
			loading
			class="bg-transparent"
		></v-data-table-virtual>

		<div v-else-if="!isLoading && items.length === 0"  class="mt-16 text-center">
			<h2 class="text-h5">No services found</h2>
		</div>

		<v-data-table-virtual
			v-else-if="items.length > 0"
			:headers="headers"
			:items="items"
			:items-length="items.length"
			hover
			item-value="name"
			class="bg-transparent"
		>
			<template
				v-slot:item.actions="{ item }"
				v-if="authRole === 'admin'"
			>
				<div class="d-flex justify-space-around">
					<div
						class="pa-1 border-black hover-icon-delete"
					>
						<DeleteConfirmationDialog :on-delete="() => deleteService(item.id)" />
					</div>
					<div
						class="pa-1 border-black hover-icon-edit"
						@click="editService(item.id)"
					>
						<v-icon>mdi-pencil</v-icon>
					</div>
				</div>
			</template>
		</v-data-table-virtual>
	</div>
</template>
<script setup>
import { ref, watch, onMounted, computed } from "vue";
import CreateServiceComponent from "@/components/CreateComponent.vue";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog.vue";
import { useServiceStore } from "@/stores/service.store";
import { useAuthStore } from "@/stores/auth.store";

const authRole = useAuthStore().authRole;

const saveOrUpdateText = ref("Create");
const items = ref([]);
const { isLoading, getServices, createService, destroyService, updateService } =
	useServiceStore();

const headers = ref([
	{ title: "Service Id", key: "id" },
	{ title: "Name", key: "name" },
	{ title: "Price", key: "price" },
	{ title: "Duration", key: "approximateDurationMin" },
	{ title: "Description", key: "description" },
	{ title: "Actions", key: "actions", sortable: false },
]);
const form = ref({
	data: {
		type: "services",
		attributes: {
			name: "",
			description: "",
			price: null,
			approximateDurationMin: null,
		},
	},
});

const services = computed(() => useServiceStore().services);

onMounted(async () => {
	try {
		await getServices();
	} catch (error) {
		console.error(error);
	}
});

watch(
	services,
	(newServices) => {
		items.value = newServices.map((service) => {
			const formattedService = { ...service.attributes, id: service.id };

			if (formattedService.approximateDurationMin) {
				if (
					!formattedService.approximateDurationMin
						.toString()
						.includes("minutes")
				) {
					formattedService.approximateDurationMin += " minutes";
				}
			}
			if (formattedService.price) {
				if (!formattedService.price.toString().includes("€")) {
					formattedService.price += " €";
				}
			}
			return formattedService;
		});
	},
	{ immediate: true }
);

const handleCreateService = async (form) => {
	try {
		form.data.attributes.price = parseFloat(form.data.attributes.price);
		form.data.attributes.approximateDurationMin = parseInt(
			form.data.attributes.approximateDurationMin
		);
		await createService(form);
		await getServices();
	} catch (error) {
		console.error(error);
	}
};

const handleUpdateService = async (form) => {
	try {
		form.data.attributes.price = parseFloat(form.data.attributes.price);
		form.data.attributes.approximateDurationMin = parseInt(
			form.data.attributes.approximateDurationMin
		);
		form.data.relationships.appointments.data = [];
		await updateService(form);
		await getServices();
	} catch (error) {
		console.error(error);
	}
};

const createOrUpdateService = async (form) => {
	if (form.data.id) {
		await handleUpdateService(form);
	} else {
		await handleCreateService(form);
	}
	resetForm();
};
const createServiceComponent = ref(null);

const editService = async (id) => {
	const service = services.value.find((service) => service.id === id);
	form.value.data = service;
	saveOrUpdateText.value = "Update";
	createServiceComponent.value.openDialog();
};

const deleteService = async (id) => {
	console.log("Deleting service with id: ", id);
	await destroyService(id);
	await getServices();
}

const resetForm = () => {
	saveOrUpdateText.value = "Create";
	const formData = form.value.data;

	formData.attributes.name = "";
	formData.attributes.description = "";
	formData.attributes.price = null;
	formData.attributes.approximateDurationMin = null;
	delete formData.id;
};
</script>
<style scoped>

.hover-icon-delete:hover {
	background-color: rgb(236, 197, 197);
	border-radius: 5px;
	color: rgb(187, 2, 2);
	cursor: pointer;
}

.hover-icon-edit:hover {
	background-color: rgb(173, 216, 230);
	border-radius: 5px;
	color: blue;
	cursor: pointer;
}
</style>
