<template>
  <div class="search-wrapper">
    <div class="search-inner">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        :value="modelValue"
        @input="onInput"
        type="text"
        placeholder="What are you craving today?"
        class="search-input"
      />
      <button class="search-btn" @click="$emit('search')">Search</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: String
});

const emit = defineEmits(['update:modelValue', 'search']);

let timeout;
const onInput = (e) => {
  const value = e.target.value;
  emit('update:modelValue', value);
  
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('search');
  }, 400);
};
</script>

<style scoped>
.search-wrapper {
  background: white;
  padding: 6px;
  border-radius: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.search-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 8px 2px 14px;
}

.search-icon {
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  background: transparent;
  padding: 10px 0;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-btn {
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 22px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
}

.search-btn:hover {
  box-shadow: 0 6px 16px rgba(255, 94, 98, 0.35);
  transform: translateY(-1px);
}
</style>
