<template>
  <div class="auth-page">

    <!-- Left: Branding -->
    <div class="auth-brand">
      <div class="brand-inner">
        <div class="brand-logo">🍽️</div>
        <h1 class="brand-name">BiteBoard</h1>
        <p class="brand-tagline">Good food. Simple choices.</p>
        <div class="brand-features">
          <div class="feature-item"><span>🍔</span> Browse our delicious menu</div>
          <div class="feature-item"><span>📦</span> Track your orders live</div>
          <div class="feature-item"><span>⚡</span> Fast & easy checkout</div>
        </div>
      </div>
    </div>

    <!-- Right: Form -->
    <div class="auth-form-side">
      <div class="form-box">

        <!-- Login Form -->
        <template v-if="mode === 'login'">
          <h2 class="form-title">Welcome back! 👋</h2>
          <p class="form-sub">Sign in to your account to continue.</p>

          <div class="form-group">
            <label class="flabel">Username</label>
            <div class="input-row" :class="{ focused: focusedField === 'loginUser', error: loginError }">
              <span class="iicon">👤</span>
              <input
                id="login-username"
                v-model="loginUsername"
                type="text"
                class="finput"
                placeholder="Enter your username"
                @focus="focusedField = 'loginUser'"
                @blur="focusedField = ''"
                @keyup.enter="submitLogin"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="flabel">Password</label>
            <div class="input-row" :class="{ focused: focusedField === 'loginPass', error: loginError }">
              <span class="iicon">🔒</span>
              <input
                id="login-password"
                v-model="loginPassword"
                :type="showLoginPw ? 'text' : 'password'"
                class="finput"
                placeholder="Enter your password"
                @focus="focusedField = 'loginPass'"
                @blur="focusedField = ''"
                @keyup.enter="submitLogin"
              />
              <button class="eye-btn" @click="showLoginPw = !showLoginPw" type="button">{{ showLoginPw ? '🙈' : '👁️' }}</button>
            </div>
          </div>

          <p v-if="loginError" class="err-msg">{{ loginError }}</p>

          <button id="login-submit-btn" class="submit-btn" :disabled="loginLoading" @click="submitLogin">
            <span v-if="loginLoading" class="btn-spinner"></span>
            <span v-else>Sign In →</span>
          </button>

          <p class="switch-text">
            Don't have an account?
            <button class="switch-btn" @click="switchMode('signup')">Sign Up</button>
          </p>
        </template>

        <!-- Sign Up Form -->
        <template v-else-if="mode === 'signup'">
          <h2 class="form-title">Create account 🎉</h2>
          <p class="form-sub">Join BiteBoard and start ordering today.</p>

          <div class="form-group">
            <label class="flabel">Username</label>
            <div class="input-row" :class="{ focused: focusedField === 'regUser', error: signupError }">
              <span class="iicon">👤</span>
              <input
                id="signup-username"
                v-model="regUsername"
                type="text"
                class="finput"
                placeholder="Choose a username"
                @focus="focusedField = 'regUser'"
                @blur="focusedField = ''"
                @keyup.enter="submitSignup"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="flabel">Password</label>
            <div class="input-row" :class="{ focused: focusedField === 'regPass', error: signupError }">
              <span class="iicon">🔒</span>
              <input
                id="signup-password"
                v-model="regPassword"
                :type="showRegPw ? 'text' : 'password'"
                class="finput"
                placeholder="Create a password"
                @focus="focusedField = 'regPass'"
                @blur="focusedField = ''"
                @keyup.enter="submitSignup"
              />
              <button class="eye-btn" @click="showRegPw = !showRegPw" type="button">{{ showRegPw ? '🙈' : '👁️' }}</button>
            </div>
          </div>

          <div class="form-group">
            <label class="flabel">Confirm Password</label>
            <div class="input-row" :class="{ focused: focusedField === 'regConf', error: signupError }">
              <span class="iicon">🔐</span>
              <input
                id="signup-confirm"
                v-model="regConfirm"
                :type="showRegPw ? 'text' : 'password'"
                class="finput"
                placeholder="Confirm your password"
                @focus="focusedField = 'regConf'"
                @blur="focusedField = ''"
                @keyup.enter="submitSignup"
              />
            </div>
          </div>

          <p v-if="signupError" class="err-msg">{{ signupError }}</p>

          <button id="signup-submit-btn" class="submit-btn signup-btn" :disabled="signupLoading" @click="submitSignup">
            <span v-if="signupLoading" class="btn-spinner"></span>
            <span v-else>Create Account →</span>
          </button>

          <p class="switch-text">
            Already have an account?
            <button class="switch-btn" @click="switchMode('login')">Sign In</button>
          </p>
        </template>

        <!-- Success State -->
        <template v-else-if="mode === 'success'">
          <div class="success-state">
            <div class="success-icon">🎉</div>
            <h2 class="form-title">Account created!</h2>
            <p class="form-sub">Your account is ready. Signing you in...</p>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth.service.js';

const router = useRouter();
const mode = ref('login');

// Login state
const loginUsername = ref('');
const loginPassword = ref('');
const showLoginPw = ref(false);
const loginError = ref('');
const loginLoading = ref(false);

// Signup state
const regUsername = ref('');
const regPassword = ref('');
const regConfirm = ref('');
const showRegPw = ref(false);
const signupError = ref('');
const signupLoading = ref(false);

const focusedField = ref('');

const switchMode = (m) => {
  mode.value = m;
  loginError.value = '';
  signupError.value = '';
};

const submitLogin = async () => {
  loginError.value = '';
  if (!loginUsername.value.trim() || !loginPassword.value) {
    loginError.value = 'Please fill in all fields.';
    return;
  }
  loginLoading.value = true;
  try {
    const res = await authService.login(loginUsername.value.trim(), loginPassword.value);
    authService.saveUser(res.data);
    if (res.data.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/menu');
    }
  } catch (err) {
    loginError.value = err.message || 'Invalid username or password.';
  } finally {
    loginLoading.value = false;
  }
};

const submitSignup = async () => {
  signupError.value = '';
  if (!regUsername.value.trim() || !regPassword.value) {
    signupError.value = 'Please fill in all fields.';
    return;
  }
  if (regPassword.value !== regConfirm.value) {
    signupError.value = 'Passwords do not match.';
    return;
  }
  if (regPassword.value.length < 4) {
    signupError.value = 'Password must be at least 4 characters.';
    return;
  }
  signupLoading.value = true;
  try {
    await authService.register(regUsername.value.trim(), regPassword.value);
    mode.value = 'success';
    // Auto-login
    setTimeout(async () => {
      const res = await authService.login(regUsername.value.trim(), regPassword.value);
      authService.saveUser(res.data);
      router.push('/menu');
    }, 1200);
  } catch (err) {
    signupError.value = err.message || 'Could not create account.';
  } finally {
    signupLoading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* { font-family: 'Inter', sans-serif; box-sizing: border-box; }

.auth-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

/* Brand side */
.auth-brand {
  background: linear-gradient(145deg, #ff5e62 0%, #ff9966 55%, #ffb347 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}

.auth-brand::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 340px; height: 340px;
  background: rgba(255,255,255,0.08);
  border-radius: 50%;
}

.auth-brand::after {
  content: '';
  position: absolute;
  bottom: -100px; left: -50px;
  width: 280px; height: 280px;
  background: rgba(255,255,255,0.06);
  border-radius: 50%;
}

.brand-inner {
  position: relative;
  z-index: 1;
  color: white;
}

.brand-logo { font-size: 64px; margin-bottom: 12px; }

.brand-name {
  font-size: 52px;
  font-weight: 900;
  letter-spacing: -2px;
  margin: 0 0 8px;
  line-height: 1;
}

.brand-tagline {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.85;
  margin: 0 0 40px;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 500;
  opacity: 0.9;
  background: rgba(255,255,255,0.12);
  padding: 14px 18px;
  border-radius: 12px;
}

/* Form side */
.auth-form-side {
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
}

.form-box {
  width: 100%;
  max-width: 420px;
}

.form-title {
  font-size: 28px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin: 0 0 8px;
}

.form-sub {
  font-size: 14px;
  color: #888;
  margin: 0 0 32px;
  line-height: 1.5;
}

.form-group { margin-bottom: 20px; }

.flabel {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 7px;
  letter-spacing: 0.1px;
}

.input-row {
  display: flex;
  align-items: center;
  background: white;
  border: 1.5px solid #e5e5e5;
  border-radius: 12px;
  padding: 0 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-row.focused {
  border-color: #ff5e62;
  box-shadow: 0 0 0 3px rgba(255,94,98,0.1);
}

.input-row.error {
  border-color: #e53e3e;
  box-shadow: 0 0 0 3px rgba(229,62,62,0.08);
}

.iicon {
  font-size: 16px;
  margin-right: 10px;
  opacity: 0.5;
  flex-shrink: 0;
}

.finput {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  padding: 14px 0;
  font-family: 'Inter', sans-serif;
}

.finput::placeholder { color: #bbb; font-weight: 400; }

.eye-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  margin-left: 4px;
  flex-shrink: 0;
  opacity: 0.6;
}

.eye-btn:hover { opacity: 1; }

.err-msg {
  color: #e53e3e;
  font-size: 13px;
  font-weight: 500;
  margin: -8px 0 16px;
  padding: 10px 14px;
  background: #fff5f5;
  border-radius: 8px;
  border: 1px solid #fed7d7;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  transition: all 0.25s ease;
  box-shadow: 0 8px 20px rgba(255,94,98,0.3);
  font-family: 'Inter', sans-serif;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(255,94,98,0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.signup-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 8px 20px rgba(102,126,234,0.3);
}

.signup-btn:hover:not(:disabled) {
  box-shadow: 0 12px 28px rgba(102,126,234,0.4);
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255,255,255,0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.switch-text {
  text-align: center;
  font-size: 14px;
  color: #888;
  margin-top: 20px;
}

.switch-btn {
  background: none;
  border: none;
  color: #ff5e62;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.switch-btn:hover { color: #ff4040; }

/* Success state */
.success-state {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0% { transform: scale(0.5); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 768px) {
  .auth-page {
    grid-template-columns: 1fr;
  }
  .auth-brand {
    padding: 40px 32px;
    min-height: 200px;
  }
  .brand-name { font-size: 36px; }
  .brand-features { display: none; }
  .auth-form-side { padding: 40px 24px; }
}
</style>
