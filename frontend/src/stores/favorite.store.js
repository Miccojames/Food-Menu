import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref(JSON.parse(localStorage.getItem('biteboard_favorites')) || []);

  const saveFavorites = () => {
    localStorage.setItem('biteboard_favorites', JSON.stringify(favorites.value));
  };

  const addFavorite = (foodId) => {
    if (!favorites.value.includes(foodId)) {
      favorites.value.push(foodId);
      saveFavorites();
    }
  };

  const removeFavorite = (foodId) => {
    const index = favorites.value.indexOf(foodId);
    if (index > -1) {
      favorites.value.splice(index, 1);
      saveFavorites();
    }
  };

  const toggleFavorite = (foodId) => {
    if (favorites.value.includes(foodId)) {
      removeFavorite(foodId);
    } else {
      addFavorite(foodId);
    }
  };

  const isFavorite = (foodId) => {
    return favorites.value.includes(foodId);
  };

  const favoriteCount = computed(() => {
    return favorites.value.length;
  });

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    favoriteCount
  };
});
