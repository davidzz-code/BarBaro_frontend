<template>
	<div>
		<v-app-bar
			color="black"
			prominent
			class="border-bottom-gold"
		>
			<v-app-bar-nav-icon
				v-if="authUser"
				variant="text"
				@click.stop="drawer = !drawer"
			></v-app-bar-nav-icon>
			<v-toolbar-title>
				<router-link
					to="/"
					class="my-auto mx-auto"
				>
					<img
						src="/src/assets/img/logo-mustache-left.svg"
						alt="logo"
						height="50"
					/>
				</router-link>
			</v-toolbar-title>
			<v-btn
				v-if="!authUser"
				to="/login"
				text="Login"
			></v-btn>
			<v-btn
				v-if="authUser"
				@click="logout"
				text="Logout"
			></v-btn>
		</v-app-bar>

		<v-navigation-drawer
			v-if="authUser"
			v-model="drawer"
			:location="$vuetify.display.mobile ? 'bottom' : undefined"
			temporary
			class="bg-custom-gray text-decoration-none"
		>
			<v-list
				color="transparent"
				class="d-flex flex-column align-start text-decoration-none text-black text-h6"
			>
				<v-list-item>
					<div class="pa-1 d-flex align-center border-bottom-hover">
						<v-icon
							icon="mdi-home"
							class="mr-2"
							size="x-small"
						/>
						<router-link
							to="/"
							class="text-decoration-none text-black"
							>Home</router-link
						>
					</div>
				</v-list-item>
				<template v-if="authRole === 'worker' || authRole === 'admin'">
					<v-list-item>
						<div class="pa-1 d-flex align-center border-bottom-hover">
							<v-icon
								icon="mdi-account"
								class="mr-2"
								size="x-small"
							/>
							<router-link
								to="/worker/schedule"
								class="text-decoration-none text-black"
								>My schedule</router-link
							>
						</div>
					</v-list-item>
					<v-list-item>
						<div class="pa-1 d-flex align-center border-bottom-hover">
							<v-icon
								icon="mdi-content-cut"
								class="mr-2"
								size="x-small"
							/>
							<router-link
								to="/worker/services"
								class="text-decoration-none text-black"
								>Services</router-link
							>
						</div>
					</v-list-item>
				</template>
				<v-list-item>
					<div class="pa-1 d-flex align-center border-bottom-hover">
						<v-icon
							icon="mdi-calendar"
							class="mr-2"
							size="x-small"
						/>
						<router-link
							to="/appointments"
							class="text-decoration-none text-black"
							>Appointments</router-link
						>
					</div>
				</v-list-item>
				<template v-if="authRole === 'admin'">
					<v-list-item>
						<div class="pa-1 d-flex align-center border-bottom-hover">
							<v-icon
								icon="mdi-briefcase"
								class="mr-2"
								size="x-small"
							/>
							<router-link
								to="/admin/workers"
								class="text-decoration-none text-black"
								>Employees</router-link
							>
						</div>
					</v-list-item>
				</template>
			</v-list>
		</v-navigation-drawer>
	</div>
</template>
<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { ref, watch, computed } from "vue";

const drawer = ref(false);
const group = ref(null);
const { logout } = useAuthStore();

const authUser = computed(() => useAuthStore().authUser);
const authRole = computed(() => useAuthStore().authRole);

watch(group, () => {
	drawer.value = false;
});
</script>
<style>
.border-bottom-hover {
	position: relative;
	display: inline-block;
}

.border-bottom-hover::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 0;
	width: 0;
	height: 2px;
	background-color: rgb(238, 190, 48);
	transition: width 0.3s ease;
	z-index: 1;
}

.border-bottom-hover:hover::after {
	width: 100%;
}

.bg-custom-gray {
	background-color: #f2f2f2;
}
</style>
