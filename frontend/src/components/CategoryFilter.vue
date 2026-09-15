<template>
  <div class="q-mb-xl" id="menu-categories">
    <h3 class="section-heading">Menu Categories</h3>
    <div class="categories">
      <button
        class="category-btn"
        :class="{ active: modelValue === 'All' }"
        @click="$emit('update:modelValue', 'All')"
      >All</button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="category-btn"
        :class="{ active: modelValue === cat.name }"
        @click="$emit('update:modelValue', cat.name)"
      >{{ cat.name }}</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
.section-heading {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  letter-spacing: -0.5px;
}

.categories {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  animation: fadeIn 0.8s ease-out 0.3s backwards;
  margin-bottom: 40px;
}

.category-btn {
  border-radius: 30px;
  padding: 12px 28px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: 14px;
  letter-spacing: 0.2px;
  border: 1px solid #eee;
  background: white;
  color: #555;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.06);
  border-color: #ff9966;
  color: #ff5e62;
}

.category-btn.active {
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
