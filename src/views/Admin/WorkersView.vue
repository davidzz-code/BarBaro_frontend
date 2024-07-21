<template>
  <v-card class="ma-7">
    <v-tabs
      v-model="tab"
      bg-color="black"
      color="#f5bc42"
      fixed-tabs
      height="70"
      width="70"
    >
      <v-tab value="table" prepend-icon="mdi-briefcase">Employees</v-tab>
      <v-tab value="register" prepend-icon="mdi-account-plus">Register</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="table">
          <WorkersTable
            ref="workersTable"
          />
        </v-tabs-window-item>

        <v-tabs-window-item value="register">
          <RegisterForm
            @worker-created="onWorkerCreated"
            title="Register an employee"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>
<script setup>
import RegisterForm from "@/components/RegisterForm.vue";
import WorkersTable from "@/components/WorkersTable.vue";
import { ref } from "vue";

const tab = ref(null);
const workersTable = ref(null);

const onWorkerCreated = async () => {
  if (workersTable.value) {
    await workersTable.value.loadData();
  }
};
</script>