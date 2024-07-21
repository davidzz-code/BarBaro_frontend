<script setup>
import { RouterView } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import { onUnmounted } from "vue";
import { createPinia } from "pinia";

const pinia = createPinia();

onUnmounted(() => {
  pinia.resetStores();
});
</script>

<template>
  <v-app id="app">
    <Navbar />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
#app{
	background-color: #F2F2F2
}
</style>
