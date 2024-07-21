<template>
	<div class="pt-4 text-center">
		<v-dialog
			v-model="dialog"
			:width="width"
			:height="height"
			class="blur-background"
			scrollable
			>
			<template v-slot:activator="{ props: activatorProps }">
				<v-btn
					class="text-none font-weight-regular bg-yellow"
					:prepend-icon="prependIcon"
					:text="title"
					variant="tonal"
					v-bind="activatorProps"
					@click="props.resetForm()"
				></v-btn>
			</template>

			<v-card
				:prepend-icon="prependIcon"
				:title="title"
			>
				<v-card-text class="pt-4">
					<slot></slot>
				</v-card-text>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn
						text="Close"
						variant="tonal"
						@click="closeDialog()"
					></v-btn>

					<v-btn
						color="yellow-darken-3"
						:text="saveOrUpdateText"
						variant="tonal"
						@click.prevent="handleSave()"
					></v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
	title: {
		type: String,
		default: "Create",
	},
	height: {
		type: String,
		default: "auto",
	},
	width: {
		type: String,
		default: "auto",
	},
	prependIcon: {
		type: String,
		default: "mdi-plus",
	},
	onClick: {
		type: Function,
		default: () => {},
	},
	saveOrUpdateText: {
		type: String,
		default: "Save",
	},
	resetForm: {
		type: Function,
		default: () => {},
	},
});

const dialog = ref(false);

const handleSave = () => {
	props.onClick();
	closeDialog();
};

const openDialog = () => {
	dialog.value = true;
};
const closeDialog = () => {
	dialog.value = false;
};
defineExpose({
	openDialog,
	closeDialog,
});
</script>

<style>
.blur-background {
	backdrop-filter: blur(3px);
}
</style>
