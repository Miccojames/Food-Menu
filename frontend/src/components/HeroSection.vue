<template>
  <section class="hero">
    <div class="hero-content">
      <h2>Delicious food,<br>delivered to you.</h2>
      <p>Explore our crafted menu and find your next craving.</p>
      <button class="hero-btn" @click="scrollToMenu">Explore Menu</button>
    </div>
  </section>
</template>

<script setup>
const scrollToMenu = () => {
  const el = document.getElementById('menu-categories');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.hero {
  padding: 80px 40px;
  text-align: left;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  background-image: url('/hero-bg.png');
  background-size: cover;
  background-position: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  background-color: #1a1a1a;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 500px;
  animation: fadeIn 0.8s ease-out;
}

.hero h2 {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin: 0 0 16px 0;
  line-height: 1.1;
  letter-spacing: -1px;
}

.hero p {
  font-size: 18px;
  color: #f1f2f6;
  margin: 0 0 12px 0;
}

.hero-btn {
  font-weight: 700;
  padding: 14px 28px;
  font-size: 16px;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 30px;
  margin-top: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.35);
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(255, 94, 98, 0.45);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
