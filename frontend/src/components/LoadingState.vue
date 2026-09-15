<template>
  <div class="loading-state flex flex-center column q-pa-xl">
    <q-spinner color="primary" size="3em" />
    <p class="q-mt-md text-grey-7">{{ message }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: 'Loading delicious food...'
  }
});
</script>

<style scoped>
.loading-state {
  min-height: 300px;
}
</style>
