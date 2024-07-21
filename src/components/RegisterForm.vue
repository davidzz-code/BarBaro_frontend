<template>
	<v-container class="fill-height">
		<v-card
			class="mx-auto"
			max-width="600"
			:title="props.title"
		>
			<v-container>
				<v-row dense>
					<v-col
						cols="12"
						md="6"
					>
						<v-text-field
							v-model="form.name"
							color="yellow-darken-3"
							label="Name"
							:rules="[rules.required]"
							variant="outlined"
						></v-text-field>
					</v-col>

					<v-col
						cols="12"
						md="6"
					>
						<v-text-field
							v-model="form.email"
							color="yellow-darken-3"
							label="Email"
							:rules="[rules.required, rules.email]"
							variant="outlined"
						></v-text-field>
					</v-col>

					<v-col
						cols="12"
						md="6"
					>
						<v-text-field
							v-model="form.password"
							:append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'"
							:type="visiblePassword ? 'text' : 'password'"
							color="yellow-darken-3"
							label="Password"
							placeholder="Enter your password"
							:rules="[rules.required, rules.password]"
							variant="outlined"
							@click:append-inner="visiblePassword = !visiblePassword"
						></v-text-field>
					</v-col>

					<v-col
						cols="12"
						md="6"
					>
						<v-text-field
							v-model="form.password_confirmation"
							:append-inner-icon="visibleConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
							:type="visibleConfirmPassword ? 'text' : 'password'"
							color="yellow-darken-3"
							label="Confirm password"
							placeholder="Confirm your password"
							:rules="[rules.required, rules.confirmPassword]"
							variant="outlined"
							@click:append-inner="visibleConfirmPassword = !visibleConfirmPassword"
						></v-text-field>
					</v-col>

					<template v-if="route.path.includes('admin')">
						<v-col
							cols="12"
							md="6"
						>
							<v-select
								v-model="workerForm.data.attributes.role"
								label="Employee role"
								:items="['Admin', 'Worker']"
								variant="outlined"
								required
							></v-select>
						</v-col>

						<v-col
							cols="12"
							md="6"
						>
							<v-text-field
								v-model.number="workerForm.data.attributes.hours"
								type="number"
								label="Working hours"
								hint="Working hours per week"
								variant="outlined"
								required
							></v-text-field>
						</v-col>
					</template>

					<v-col
						cols="12"
					>
						<v-checkbox
							v-model="terms"
							color="yellow-darken-2"
							label="I agree to site terms and conditions"
						></v-checkbox>
					</v-col>
				</v-row>
			</v-container>

			<v-divider></v-divider>

			<v-card-actions>
				<v-spacer></v-spacer>

				<v-btn
					color="yellow-darken-2"
					variant="flat"
					@click.prevent="handleRegistration"
				>
					Register

					<v-icon
						icon="mdi-chevron-right"
						end
					></v-icon>
				</v-btn>
			</v-card-actions>
		</v-card>

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
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useRoute } from "vue-router";
import { useWorkerStore } from "@/stores/worker.store";
import { useUserStore } from "@/stores/user.store";

const emit = defineEmits(['worker-created']);

const visiblePassword = ref(false);
const visibleConfirmPassword = ref(false);
const route = useRoute();
const props = defineProps({
	title: String,
});

const workerForm = ref({
	data: {
		type: "workers",
		attributes: {
			role: "",
			hours: "",
		},
	},
});

const form = ref({
	name: "",
	email: "",
	worker_id: null,
	password: "",
	password_confirmation: "",
});
const { register } = useAuthStore();
const { createWorker } = useWorkerStore();
const { createUser } = useUserStore();

const terms = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");
const timeout = 3000;

const rules = {
	required: (value) => !!value || "Required.",
	password: (value) =>
		value.length >= 8 || "Password must be at least 8 characters long.",
	confirmPassword: (value) =>
		value === form.value.password || "Passwords do not match.",
	email: (value) => {
		const pattern =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return pattern.test(value) || "Invalid email.";
	},
};

const handleRegistration = async () => {
	if (
		form.value.name &&
		rules.email(form.value.email) === true &&
		form.value.password &&
		form.value.password_confirmation === form.value.password &&
		terms.value
	) {
		if (route.path.includes("admin")) {
			try {
				workerForm.value.data.attributes.role =
					workerForm.value.data.attributes.role.toLowerCase();
				const workerResponse = await createWorker(workerForm.value);
				if (workerResponse && workerResponse.id) {
					form.value.worker_id = workerResponse.id;
				} else {
					throw new Error("Failed to create worker");
				}
			} catch (error) {
				console.error("Worker registration Error:", error);
				snackbarMessage.value =
					"An error occurred during registration: " + error.message;
				snackbarColor.value = "error";
			}

			try {
				await createUser(form.value);
				emit('worker-created');
				snackbarMessage.value = "Registration successful.";
				snackbarColor.value = "success";
			} catch (error) {
				console.error("User registration Error:", error);
			}
		} else {
			try {
				await register(form.value);
				snackbarMessage.value = "Registration successful.";
				snackbarColor.value = "success";
			} catch (error) {
				console.error("User registration Error:", error);
			}
		}
	} else {
		snackbarMessage.value = "Please review the fields and accept the terms.";
		snackbarColor.value = "error";
	}
	snackbar.value = true;
};
</script>
