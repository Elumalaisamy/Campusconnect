<template>
  <div class="home">
    <!-- Animated grid background -->
    <div class="grid-bg">
      <svg class="grid-svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,245,212,0.12)" stroke-width="0.5"/>
          </pattern>
          <radialGradient id="glow-center" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stop-color="rgba(0,245,212,0.15)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        <rect width="100%" height="100%" fill="url(#glow-center)"/>
        <!-- Perspective lines -->
        <line x1="200" y1="800" x2="0" y2="0" stroke="rgba(0,245,212,0.06)" stroke-width="1"/>
        <line x1="200" y1="800" x2="100" y2="0" stroke="rgba(0,245,212,0.06)" stroke-width="1"/>
        <line x1="200" y1="800" x2="300" y2="0" stroke="rgba(0,245,212,0.06)" stroke-width="1"/>
        <line x1="200" y1="800" x2="400" y2="0" stroke="rgba(0,245,212,0.06)" stroke-width="1"/>
        <line x1="200" y1="800" x2="200" y2="0" stroke="rgba(0,245,212,0.08)" stroke-width="1.5"/>
      </svg>
    </div>

    <!-- Scan line effect -->
    <div class="scanline"></div>

    <!-- Top status bar -->
    <div class="status-bar">
      <span class="status-dot"></span>
      <span class="status-text">AR SYSTEM ONLINE</span>
      <span class="status-right">v2.4.1</span>
    </div>

    <!-- Main content -->
    <div class="home-content">
      <!-- Logo area -->
      <div class="logo-area fade-in-up">
        <div class="logo-hexagon">
          <svg viewBox="0 0 100 100" class="hex-svg">
            <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
              fill="none" stroke="rgba(0,245,212,0.5)" stroke-width="1.5"
              class="hex-outline"/>
            <polygon points="50,15 85,32.5 85,67.5 50,85 15,67.5 15,32.5"
              fill="rgba(0,245,212,0.08)" stroke="rgba(0,245,212,0.8)" stroke-width="0.8"/>
            <text x="50" y="58" text-anchor="middle" fill="#00f5d4"
              font-family="Rajdhani" font-size="24" font-weight="700">AR</text>
          </svg>
          <div class="hex-ping"></div>
          <div class="hex-ping hex-ping--delay"></div>
        </div>

        <div class="brand-text">
          <div class="brand-label">CAMPUS CONNECT</div>
          <div class="brand-sub">Sri Sairam Institute of Technology</div>
          <div class="brand-tag">Augmented Reality Navigation System</div>
        </div>
      </div>

      <!-- Feature chips -->
      <div class="feature-chips">
        <div class="chip" style="animation-delay:0.1s">
          <span class="chip-icon">📡</span> Live AR Overlay
        </div>
        <div class="chip" style="animation-delay:0.2s">
          <span class="chip-icon">🗺️</span> Indoor Maps
        </div>
        <div class="chip" style="animation-delay:0.3s">
          <span class="chip-icon">🔊</span> Voice Guide
        </div>
      </div>

      <!-- Login card -->
      <div class="login-card hud-panel fade-in-up" style="animation-delay:0.2s">
        <div class="card-header">
          <div class="card-header-line"></div>
          <span class="card-header-text">IDENTIFY YOURSELF</span>
          <div class="card-header-line"></div>
        </div>

        <div class="input-group">
          <label class="input-label">VISITOR NAME</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input
              v-model="nameInput"
              class="name-input"
              type="text"
              placeholder="Enter your name..."
              @keyup.enter="proceed"
              maxlength="40"
            />
            <span class="input-cursor" :class="{ active: nameInput.length > 0 }">|</span>
          </div>
        </div>

        <div v-if="error" class="error-msg">
          <span>⚠</span> {{ error }}
        </div>

        <button class="launch-btn" @click="proceed" :class="{ ready: nameInput.trim().length > 0 }">
          <span class="btn-text">INITIALIZE NAVIGATION</span>
          <span class="btn-arrow">→</span>
          <div class="btn-glow"></div>
        </button>

        <div class="card-corner tl"></div>
        <div class="card-corner tr"></div>
        <div class="card-corner bl"></div>
        <div class="card-corner br"></div>
      </div>

      <!-- System stats -->
      <div class="sys-stats">
        <div class="stat-item">
          <div class="stat-val neon-text">8</div>
          <div class="stat-label">LOCATIONS</div>
        </div>
        <div class="stat-sep">|</div>
        <div class="stat-item">
          <div class="stat-val neon-text">100%</div>
          <div class="stat-label">OFFLINE</div>
        </div>
        <div class="stat-sep">|</div>
        <div class="stat-item">
          <div class="stat-val neon-text">AR</div>
          <div class="stat-label">READY</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNavigation } from '../composables/useNavigation.js'

const { setUserName, goToView, VIEW } = useNavigation()
const nameInput = ref('')
const error = ref('')

function proceed() {
  if (!nameInput.value.trim()) {
    error.value = 'Please enter your name to continue'
    return
  }
  error.value = ''
  setUserName(nameInput.value.trim())
  goToView(VIEW.SELECT)
}
</script>

<style scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 50% 70%, #001a2e 0%, #000814 60%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.grid-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.grid-svg { width: 100%; height: 100%; }

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0,245,212,0.4), transparent);
  animation: scanline 4s linear infinite;
  pointer-events: none;
  z-index: 2;
}

/* Status bar */
.status-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0,245,212,0.05);
  border-bottom: 1px solid rgba(0,245,212,0.15);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--neon);
  position: relative;
  z-index: 5;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--neon);
  box-shadow: 0 0 8px var(--neon);
  animation: blink 1.5s infinite;
}
.status-text { flex: 1; letter-spacing: 2px; }
.status-right { opacity: 0.5; }

/* Home content */
.home-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 20px 30px;
  gap: 20px;
  position: relative;
  z-index: 5;
  overflow-y: auto;
}

/* Logo area */
.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.logo-hexagon {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hex-svg {
  width: 100px;
  height: 100px;
  filter: drop-shadow(0 0 12px rgba(0,245,212,0.5));
}

.hex-ping {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid rgba(0,245,212,0.5);
  animation: pulse-ring 2.5s ease-out infinite;
}
.hex-ping--delay { animation-delay: 1.25s; }

.brand-text { text-align: center; }
.brand-label {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 6px;
  color: var(--neon);
  text-shadow: 0 0 20px rgba(0,245,212,0.6);
}
.brand-sub {
  font-family: var(--font-body);
  font-size: 12px;
  color: rgba(200,230,240,0.7);
  letter-spacing: 1px;
  margin-top: 4px;
}
.brand-tag {
  font-family: var(--font-mono);
  font-size: 9px;
  color: rgba(0,245,212,0.5);
  letter-spacing: 2px;
  margin-top: 4px;
  text-transform: uppercase;
}

/* Feature chips */
.feature-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
.chip {
  background: rgba(0,245,212,0.08);
  border: 1px solid rgba(0,245,212,0.25);
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--neon);
  letter-spacing: 0.5px;
  animation: fade-in-up 0.5s ease forwards;
  opacity: 0;
}

/* Login card */
.login-card {
  width: 100%;
  max-width: 380px;
  border-radius: 16px;
  padding: 24px;
  position: relative;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.card-header-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,245,212,0.4));
}
.card-header-line:last-child {
  background: linear-gradient(90deg, rgba(0,245,212,0.4), transparent);
}
.card-header-text {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--neon);
  letter-spacing: 3px;
  white-space: nowrap;
}

.input-group { margin-bottom: 16px; }
.input-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 3px;
  color: var(--text-dim);
  margin-bottom: 8px;
}
.input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(0,245,212,0.04);
  border: 1px solid rgba(0,245,212,0.2);
  border-radius: 8px;
  padding: 10px 12px;
  gap: 8px;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.input-wrapper:focus-within {
  border-color: rgba(0,245,212,0.6);
  box-shadow: 0 0 16px rgba(0,245,212,0.15);
}
.input-icon { font-size: 14px; }
.name-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 300;
  width: 100%;
}
.name-input::placeholder { color: rgba(200,230,240,0.25); }
.input-cursor {
  color: var(--neon);
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.3s;
}
.input-cursor.active {
  opacity: 1;
  animation: blink 0.8s infinite;
}

.error-msg {
  color: #ff6b6b;
  font-family: var(--font-mono);
  font-size: 11px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Launch button */
.launch-btn {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  background: rgba(0,245,212,0.08);
  border: 1px solid rgba(0,245,212,0.3);
  color: var(--text-dim);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}
.launch-btn.ready {
  background: rgba(0,245,212,0.12);
  border-color: rgba(0,245,212,0.6);
  color: var(--neon);
  box-shadow: 0 0 20px rgba(0,245,212,0.2);
}
.launch-btn:active {
  transform: scale(0.98);
}
.btn-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0,245,212,0.15), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}
.launch-btn.ready .btn-glow { opacity: 1; }
.btn-arrow { font-size: 18px; }

/* Corner decorators */
.card-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: rgba(0,245,212,0.4);
  border-style: solid;
}
.card-corner.tl { top: 8px; left: 8px; border-width: 1px 0 0 1px; }
.card-corner.tr { top: 8px; right: 8px; border-width: 1px 1px 0 0; }
.card-corner.bl { bottom: 8px; left: 8px; border-width: 0 0 1px 1px; }
.card-corner.br { bottom: 8px; right: 8px; border-width: 0 1px 1px 0; }

/* Stats */
.sys-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: var(--font-mono);
}
.stat-item { text-align: center; }
.stat-val { font-size: 18px; font-weight: 700; }
.stat-label { font-size: 8px; color: var(--text-dim); letter-spacing: 2px; }
.stat-sep { color: rgba(0,245,212,0.2); font-size: 20px; }
</style>
