<template>
  <div class="login-container">
    <div class="login-card">
      <div class="illustration-side">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
          <!-- Ilustração isométrica simplificada -->
          <path d="M200 50 L300 100 L300 200 L200 250 L100 200 L100 100 Z" fill="#e6f3ff" stroke="#4a90e2" stroke-width="2"/>
          <path d="M150 120 L250 120 L250 180 L150 180 Z" fill="#4a90e2" stroke="#2171cd" stroke-width="2"/>
          <path d="M180 140 L220 140 L220 160 L180 160 Z" fill="#ffffff"/>
        </svg>
      </div>
      <div class="form-side">
        <div class="form-header">
          <h2>Login</h2>
          <p v-if="!hasAccount" class="sign-up-text">
            Don't have an account? <a href="#" @click.prevent="toggleSignUp">Sign up</a>
          </p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="your@email.com"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="Enter your password"
              required
            >
            <a href="#" class="forgot-password">Forgot password?</a>
          </div>
          
          <div class="form-group remember-me">
            <label class="checkbox-container">
              <input type="checkbox" v-model="rememberMe">
              <span class="checkmark"></span>
              Remember me
            </label>
          </div>
          
          <button type="submit" class="login-button">
            Log in
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const hasAccount = ref(true)

const handleSubmit = () => {
  // Implementar lógica de login aqui
  console.log('Login attempt:', { email: email.value, password: password.value })
}

const toggleSignUp = () => {
  hasAccount.value = !hasAccount.value
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0396FF 0%, #ABDCFF 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  width: 900px;
  max-width: 95%;
  overflow: hidden;
}

.illustration-side {
  flex: 1;
  background: #f8faff;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-side svg {
  width: 100%;
  max-width: 400px;
}

.form-side {
  flex: 1;
  padding: 40px;
}

.form-header {
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 32px;
  color: #1a1f36;
  margin-bottom: 10px;
}

.sign-up-text {
  color: #6b7280;
  font-size: 14px;
}

.sign-up-text a {
  color: #0396FF;
  text-decoration: none;
  font-weight: 500;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1a1f36;
  font-size: 14px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #0396FF;
}

.forgot-password {
  display: block;
  text-align: right;
  color: #0396FF;
  font-size: 14px;
  text-decoration: none;
  margin-top: 8px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
}

.login-button {
  width: 100%;
  padding: 12px;
  background: #0396FF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background: #0377cc;
}

@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
  }
  
  .illustration-side {
    padding: 20px;
  }
  
  .form-side {
    padding: 20px;
  }
}
</style>
