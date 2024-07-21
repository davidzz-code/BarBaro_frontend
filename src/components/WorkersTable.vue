<template>
	<div class="mx-12">
		<v-data-table-virtual
			v-if="items.length === 0"
			:items-length="0"
			item-key="name"
			loading-text="Loading... Please wait"
			loading
			class="bg-transparent"
		></v-data-table-virtual>

		<v-data-table-virtual
			v-else-if="items.length > 0"
			:headers="headers"
			:items="items"
			hover
			item-value="name"
			class="bg-transparent"
		>
			<template
				v-slot:item.actions="{ item }"
			>
				<div class="d-flex">
					<div
						class="pa-1 border-black hover-icon-delete"
					>
						<DeleteConfirmationDialog :on-delete="() => deleteWorker(item.id, item.email)" />
					</div>
				</div>
			</template>
		</v-data-table-virtual>
	</div>
</template>
<script setup>
import { ref, watch, onMounted, computed, defineExpose } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useWorkerStore } from "@/stores/worker.store";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog.vue";

const items = ref([]);
const { getWorkers, destroyWorker } = useWorkerStore();
const { getUsersWithWorker, destroyUser } = useUserStore();

const headers = ref([
	{ title: "Employee Id", key: "id" },
	{ title: "Name", key: "name" },
	{ title: "Email", key: "email" },
	{ title: "Role", key: "role" },
	{ title: "Actions", key: "actions", sortable: false },
]);

const workers = computed(() => useWorkerStore().workers);

const loadData = async () => {
	try {
		await getUsersWithWorker();
		await getWorkers();
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};

onMounted(async () => {
  await loadData();
});

watch(
  workers,
	(newWorkers) => {
		const results = newWorkers.map((worker) => {
			console.log('Hola desde watcher');
			const user = useUserStore().users.find(
				(user) => {
					if (user.relationships.worker.data) {
						return user.relationships.worker.data.id === worker.id
					} else {
						return false;
					}
				}
      );
      const name = user?.attributes.name;
      const email = user?.attributes.email;
      const role = worker.attributes.role;

      return { id: worker.id, name, email, role };
    });

    items.value = results.filter(result => result.email);
  },
  { immediate: true }
);

const deleteWorker = async (workerId, email) => {
  try {
    const user = useUserStore().users.find(user => user.attributes.email === email);
    await destroyUser(user.id);
		await destroyWorker(workerId);
		await loadData();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

defineExpose({ loadData });
</script>
<style scoped>
.hover-icon-delete:hover {
	background-color: rgb(236, 197, 197);
	border-radius: 5px;
	color: rgb(187, 2, 2);
	cursor: pointer;
}
</style>
