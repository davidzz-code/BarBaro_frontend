<template>
  <v-select
    :v-model="value"
    label="Start time"
    :items="hours"
    variant="outlined"
  ></v-select>
</template>
<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
});

onMounted(() => {
  generateHours();
});

const hours = ref([]);
const generateHours = () => {
	const startMorning = 9 * 60;
	const endMorning = 13 * 60;
	const startAfternoon = 15 * 60;
	const endAfternoon = 19 * 60;
	const interval = 30;

	for (let i = startMorning; i < endMorning; i += interval) {
		const hour = Math.floor(i / 60);
		const minute = i % 60 === 0 ? "00" : "30";
		hours.value.push(`${hour}:${minute}`);
	}

	for (let i = startAfternoon; i < endAfternoon; i += interval) {
		const hour = Math.floor(i / 60);
		const minute = i % 60 === 0 ? "00" : "30";
		hours.value.push(`${hour}:${minute}`);
	}
};
</script>