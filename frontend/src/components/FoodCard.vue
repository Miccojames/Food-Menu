<template>
  <div class="food-card">
    <div class="card-image-wrapper">
      <img :src="food.image" :alt="food.name" class="food-img" />
      <button
        class="fav-btn"
        :class="{ favorited: isFavorite }"
        @click="$emit('toggle-favorite', food)"
      >
        <svg v-if="isFavorite" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ff5e62"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ccc"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>
      </button>
    </div>

    <div class="card-body">
      <span class="badge">{{ food.category }}</span>
      <h4>{{ food.name }}</h4>
      <p>{{ food.description }}</p>

      <div class="footer">
        <span class="price">₱{{ food.price }}</span>
        <div v-if="food.spicy" class="status spicy">🌶 Spicy</div>
        <div v-else-if="food.vegetarian" class="status veg">🌱 Veg</div>
        <div v-else class="status pop">🔥 Popular</div>
      </div>

      <button class="add-btn" @click="$emit('add-to-cart', food)">Add to Order</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  food: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['add-to-cart', 'toggle-favorite']);
</script>

<style scoped>
.food-card {
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  background: white;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.6s ease-out backwards;
  border: 1px solid rgba(0,0,0,0.02);
}

.food-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(255, 94, 98, 0.12);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  aspect-ratio: 1.3;
}

.food-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.food-card:hover .food-img {
  transform: scale(1.08);
}

.fav-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.fav-btn:hover {
  transform: scale(1.15);
}

.card-body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.badge {
  display: inline-block;
  background: #fff3f0;
  color: #ff5e62;
  font-weight: 800;
  font-size: 10px;
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-body h4 {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.card-body p {
  font-size: 14px;
  color: #777;
  margin: 0 0 24px 0;
  line-height: 1.6;
  flex: 1;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
}

.price {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;
}

.status {
  font-size: 11px;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 20px;
  text-transform: uppercase;
}
.status.spicy { background: #fff0f0; color: #ff5e62; }
.status.veg { background: #f0fdf4; color: #16a34a; }
.status.pop { background: #fff7ed; color: #ea580c; }

.add-btn {
  width: 100%;
  border-radius: 14px;
  font-weight: 700;
  padding: 12px;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
}

.add-btn:hover {
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.35);
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
