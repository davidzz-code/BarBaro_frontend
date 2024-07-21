<template>
	<div class="w-100 h-100 d-flex justify-center align-center">
		<div class="custom-width pa-12 rounded bg-black">
			<v-img
				class="mx-auto mb-8"
				max-width="250"
				src="/assets/img/logo-mustache-up.svg"
			></v-img>

			<form @submit.prevent="handleLogin(form)">
				<v-card
					class="mx-auto pa-12 pb-8"
					rounded="lg"
				>
					<div class="text-subtitle-1 text-medium-emphasis">Account</div>

					<v-text-field
						v-model="form.email"
						type="email"
						density="compact"
						placeholder="Email address"
						prepend-inner-icon="mdi-email-outline"
						variant="outlined"
					></v-text-field>

					<div
						class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
					>
						Password
					</div>

					<v-text-field
						v-model="form.password"
						:append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
						:type="visible ? 'text' : 'password'"
						density="compact"
						placeholder="Enter your password"
						prepend-inner-icon="mdi-lock-outline"
						variant="outlined"
						@click:append-inner="visible = !visible"
					></v-text-field>

					<v-btn
						class="mb-8"
						color="black"
						size="large"
						variant="flat"
						block
						type="submit"
					>
						Log In
					</v-btn>

					<v-card-text class="text-center">
						<v-btn
							variant="text"
							density="compact"
							color="yellow-darken-3"
							size="small"
							to="/register"
						>
							Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
						</v-btn>
					</v-card-text>
				</v-card>
			</form>
		</div>
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
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";

const visible = ref(false);
const form = ref({ email: "", password: "" });
const { login } = useAuthStore();

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");
const timeout = 3000;

const handleLogin = async (form) => {
	try {
		const loginResponse = await login(form);

		if (loginResponse.success) {
			snackbarMessage.value = "Login successful!";
			snackbarColor.value = "success";
		} else {
			throw new Error(
				loginResponse.errors.map((error) => error.detail).join(" ")
			);
		}
	} catch (error) {
		snackbarMessage.value = error.message;
		snackbarColor.value = "error";
	}

	snackbar.value = true;
};
</script>

<style>
.custom-width {
	min-width: 500px;
}
</style>
