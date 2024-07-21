<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="400"
      persistent
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn 
          v-if="isAppointmentCard"
          icon="mdi-delete"
          class="mx-3"
          color="error"
          variant="outlined"
          v-bind="activatorProps"
        >
        </v-btn>
        <v-icon v-else v-bind="activatorProps">
          mdi-delete
        </v-icon>
      </template>

      <v-card
        prepend-icon="mdi-alert"
        text="Are you sure you want to delete this item? This action cannot be undone."
        title="Confirm Delete"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="dialog = false" class="bg-gray">
            Cancel
          </v-btn>

          <v-btn @click="handleDelete" class="bg-red">
            Delete
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  onDelete: {
    type: Function,
    default: () => {}
  },
  isAppointmentCard: {
    type: Boolean,
    default: false
  },
})

const dialog = ref(false)

function handleDelete() {
  dialog.value = false
  props.onDelete()
}
</script>