<template>
  <section class="hero">
    <div class="hero-content">
      <span class="hero-pill">✨ Fresh & Handcrafted</span>
      <h2>Delicious food,<br>delivered to you.</h2>
      <p>Explore our crafted menu and find your next craving.</p>
      <button class="hero-btn" @click="scrollToMenu">
        <span>Explore Menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
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
  padding: 60px 48px;
  text-align: left;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background-image: url('/hero-bg.png');
  background-size: cover;
  background-position: center;
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  background-color: #1a1a1a;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(90deg, rgba(15, 15, 20, 0.82) 0%, rgba(15, 15, 20, 0.25) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 480px;
}

.hero-pill {
  display: inline-block;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
  letter-spacing: 0.3px;
}

.hero h2 {
  font-size: 42px;
  font-weight: 800;
  color: white;
  margin: 0 0 12px 0;
  line-height: 1.15;
  letter-spacing: -1px;
}

.hero p {
  font-size: 16px;
  color: #e2e8f0;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  padding: 13px 26px;
  font-size: 15px;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.35);
  font-family: 'Inter', sans-serif;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(255, 94, 98, 0.45);
}

@media (max-width: 640px) {
  .hero { padding: 40px 24px; }
  .hero h2 { font-size: 32px; }
  .hero p { font-size: 14px; }
}
</style>
