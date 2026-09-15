<template>
  <div class="empty-state">
    <div class="empty-icon">🍽️</div>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <button v-if="showClear" class="clear-btn" @click="$emit('clear')">Clear Filters</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'No matching food found'
  },
  message: {
    type: String,
    default: 'Try searching for something else or clear filters.'
  },
  showClear: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: fadeIn 0.5s ease-out;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.empty-state p {
  font-size: 16px;
  color: #777;
  margin: 0 0 24px 0;
}

.clear-btn {
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 30px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.35);
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
