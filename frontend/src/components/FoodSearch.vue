<template>
  <div class="search-wrapper">
    <div class="search-inner">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#aaa">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
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
  
  // Debounce search
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('search');
  }, 500);
};
</script>

<style scoped>
.search-wrapper {
  background: white;
  padding: 8px;
  border-radius: 40px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  margin-bottom: 40px;
}

.search-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
}

.search-icon {
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  background: transparent;
  padding: 10px 4px;
}

.search-input::placeholder {
  color: #aaa;
}

.search-btn {
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.search-btn:hover {
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.35);
  transform: translateY(-1px);
}
</style>
