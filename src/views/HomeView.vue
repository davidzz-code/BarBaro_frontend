<template>
	<div class="bg-black">
		<section class="d-flex h-screen">
			<div class="d-flex flex-column align-center justify-center flex-1">
				<div class="w-75">
					<h1 class="text-h3 font-weight-bold mb-1">
						Where tradition and modern style meet.
					</h1>
					<v-btn class="mt-8 rounded-0 text-black bg-transparent gradient-gold">
						<router-link
							to="/appointments"
							class="text-decoration-none text-black"
						>
							Book an appointment
						</router-link>
					</v-btn>
				</div>
			</div>
			<div class="d-flex justify-center flex-1 position-relative">
				<v-parallax
					src="/assets/img/landing-cover-tools.jpg"
					class="h-screen w-auto"
				>
				</v-parallax>
			</div>
		</section>
		<section class="py-16 bg-custom-gray text-black">
			<div class="mb-16 d-flex flex-column align-center">
				<h2 class="text-h3 font-weight-bold mb-4">Our services</h2>
				<h3 class="text-center font-weight-thin">
					Our Services From classic cuts to modern styles, we offer a wide range
					of services to meet your grooming needs.
				</h3>
			</div>
			<v-container>
				<v-row>
					<template v-for="service in services">
						<v-col
							cols="12"
							md="4"
							sm="6"
						>
							<v-card
								class="rounded-0"
								elevation="3"
								min-height="130px"
								:title="service.attributes.name"
								:text="service.attributes.description"
							/>
						</v-col>
					</template>
				</v-row>
			</v-container>
		</section>
		<section class="d-flex h-screen">
			<div class="d-flex justify-center flex-1 position-relative">
				<v-parallax
					src="/assets/img/landing-cover-street.jpg"
					class="h-screen w-auto"
				>
				</v-parallax>
			</div>
			<div class="d-flex flex-column align-center justify-center flex-1">
				<div class="w-75">
					<h2 class="text-h2 font-weight-bold mb-1 text-gradient-gold">
						Our Philosophy
					</h2>
					<h3 class="font-weight-thin">
						Dedicated to preserving the art of traditional barbering, we offer premium services in a refined atmosphere.
						Our skilled barbers are committed to delivering precision haircuts and impeccable shaves,
						ensuring that each client receives the highest level of care and attention to detail.
						<br /><br />
						At our establishment, it's more than just a haircut; it's a unique and memorable experience from the moment you walk in.
						Join us and discover why we're more than just a barbershop, we're a family.
					</h3>
				</div>
			</div>
		</section>
		<v-footer class="py-8 bg-black">
			<div class="w-100 pt-4 mx-3 border-top-gold d-flex justify-space-between">
				<div>© 2024 Bárbaro All rights reserved.</div>
				<div class="d-flex">
					<div>Privacy Policy</div>
					<div>Terms of Service</div>
				</div>
			</div>
		</v-footer>
	</div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useServiceStore } from "@/stores/service.store";

const { getServices } = useServiceStore();

const services = computed(() => useServiceStore().services);

onMounted(async () => {
	await getServices();
});
</script>

<style>
.flex-1 {
	flex: 1;
}

.border-top-gold {
	border-top: 1px solid rgba(255, 220, 115, 1);
}

.gradient-gold {
	background: linear-gradient(
		135deg,
		rgba(166, 124, 0, 1) 0%,
		rgba(255, 191, 0, 1) 46%,
		rgba(255, 220, 115, 1) 100%
	);
}

.bg-custom-gray {
	background-color: #f2f2f2;
}

.text-gradient-gold {
	background: linear-gradient(
		135deg,
		rgba(255, 220, 115, 1) 0%,
		rgba(255, 191, 0, 1) 46%,
		rgba(166, 124, 0, 1) 100%
	);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
}
</style>
