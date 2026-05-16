<template>
  <div class="camera-view" ref="containerRef">
    <!-- Live Camera Feed -->
    <video
      v-if="cameraMode === 'live'"
      ref="videoRef"
      class="camera-feed"
      autoplay
      playsinline
      muted
    ></video>

    <!-- Simulated background when no camera -->
    <div v-else class="sim-bg">
      <!-- Animated campus scene simulation -->
      <div class="campus-scene">
        <!-- Sky gradient -->
        <div class="sim-sky"></div>
        <!-- Ground -->
        <div class="sim-ground">
          <div class="ground-line" v-for="i in 8" :key="i" :style="{ top: `${i * 12}%`, opacity: 1 - i*0.1 }"></div>
        </div>
        <!-- Simulated buildings -->
        <div class="sim-building b1"></div>
        <div class="sim-building b2"></div>
        <div class="sim-building b3"></div>
        <!-- Path/road -->
        <div class="sim-path"></div>
        <!-- Trees -->
        <div class="sim-tree t1">🌳</div>
        <div class="sim-tree t2">🌳</div>
        <div class="sim-tree t3">🌳</div>
        <!-- Mode badge -->
        <div class="sim-mode-badge">
          <span class="sim-icon">📱</span>
          <span>SIMULATION MODE — tap camera icon for live view</span>
        </div>
      </div>
    </div>

    <!-- AR Grid Overlay (perspective grid on the "ground") -->
    <div class="ar-grid-overlay">
      <svg class="ar-grid-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(0,245,212,0)" />
            <stop offset="100%" stop-color="rgba(0,245,212,0.15)" />
          </linearGradient>
        </defs>
        <!-- Perspective grid lines -->
        <g stroke="url(#grid-fade)" stroke-width="0.5" fill="none" class="grid-anim">
          <!-- Horizontal lines -->
          <line x1="0" y1="240" x2="400" y2="240"/>
          <line x1="30" y1="220" x2="370" y2="220"/>
          <line x1="60" y1="200" x2="340" y2="200"/>
          <line x1="90" y1="180" x2="310" y2="180"/>
          <line x1="120" y1="160" x2="280" y2="160"/>
          <line x1="150" y1="140" x2="250" y2="140"/>
          <line x1="170" y1="120" x2="230" y2="120"/>
          <!-- Vertical/perspective lines -->
          <line x1="200" y1="60" x2="0" y2="300"/>
          <line x1="200" y1="60" x2="80" y2="300"/>
          <line x1="200" y1="60" x2="160" y2="300"/>
          <line x1="200" y1="60" x2="240" y2="300"/>
          <line x1="200" y1="60" x2="320" y2="300"/>
          <line x1="200" y1="60" x2="400" y2="300"/>
        </g>
      </svg>
    </div>

    <!-- SVG Path visualization (animated dashed path on ground plane) -->
    <div class="path-viz-overlay" v-if="isNavigating && direction !== 'arrived'">
      <svg class="path-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="path-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="var(--neon)" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="var(--neon)" stop-opacity="0.1"/>
          </linearGradient>
        </defs>
        <!-- Straight path -->
        <g v-if="direction === 'straight'">
          <path d="M 190 300 L 200 200 L 205 120" fill="none" stroke="url(#path-gradient)" stroke-width="8"
            stroke-dasharray="12,8" class="animated-path"/>
          <path d="M 210 300 L 210 200 L 205 120" fill="none" stroke="url(#path-gradient)" stroke-width="8"
            stroke-dasharray="12,8" stroke-dashoffset="10" class="animated-path"/>
          <!-- Arrow heads along path -->
          <polygon points="200,160 194,180 206,180" fill="var(--neon)" opacity="0.7"/>
          <polygon points="200,220 194,240 206,240" fill="var(--neon)" opacity="0.5"/>
        </g>
        <!-- Left turn path -->
        <g v-else-if="direction === 'left'">
          <path d="M 220 300 Q 220 220 160 200 Q 100 180 80 140" fill="none" stroke="url(#path-gradient)"
            stroke-width="8" stroke-dasharray="12,8" class="animated-path"/>
          <polygon points="80,135 75,155 90,150" fill="#3a86ff" opacity="0.7"/>
        </g>
        <!-- Right turn path -->
        <g v-else-if="direction === 'right'">
          <path d="M 180 300 Q 180 220 240 200 Q 300 180 320 140" fill="none" stroke="url(#path-gradient)"
            stroke-width="8" stroke-dasharray="12,8" class="animated-path"/>
          <polygon points="320,135 325,155 310,150" fill="#f72585" opacity="0.7"/>
        </g>
      </svg>
    </div>

    <!-- AR Marker Hotspots -->
    <MarkerSimulator
      ref="markerSimRef"
      :markers="markerData"
      :active-id="selectedLocation?.id"
      @marker-click="handleMarkerClick"
    />

    <!-- Main Navigation Overlay (arrows, direction) -->
    <div class="nav-area" v-if="isNavigating">
      <NavigationOverlay
        :direction="direction"
        :step-key="currentStepIndex"
      />
    </div>

    <!-- HUD Elements -->
    <!-- Top HUD bar -->
    <div class="hud-top">
      <div class="hud-left">
        <button class="hud-btn" @click="handleBack">
          <span>✕</span>
        </button>
        <div class="hud-dest" v-if="selectedLocation">
          <div class="hud-dest-name">{{ selectedLocation.name }}</div>
          <div class="hud-dest-cat">{{ selectedLocation.category }}</div>
        </div>
      </div>
      <div class="hud-right">
        <div class="hud-cam-badge" :class="cameraMode">
          <span>{{ cameraMode === 'live' ? '🔴' : '⚡' }}</span>
          <span class="cam-label">{{ cameraMode === 'live' ? 'LIVE' : 'SIM' }}</span>
        </div>
        <button class="hud-btn" @click="toggleCamera" title="Toggle camera">
          <span>📷</span>
        </button>
      </div>
    </div>

    <!-- Compass -->
    <div class="compass-hud">
      <div class="compass-ring">
        <div class="compass-needle"></div>
        <div class="compass-label">N</div>
      </div>
    </div>

    <!-- Scan lines -->
    <div class="hud-scanline"></div>

    <!-- Crosshair center -->
    <div class="crosshair" v-if="!isNavigating">
      <div class="ch-line ch-h"></div>
      <div class="ch-line ch-v"></div>
      <div class="ch-ring"></div>
      <div class="ch-dot"></div>
    </div>

    <!-- Bottom navigation panel -->
    <div class="nav-bottom hud-panel" v-if="isNavigating">
      <!-- Step info -->
      <div class="step-info">
        <div class="step-num">
          <span class="step-cur">{{ currentStepIndex + 1 }}</span>
          <span class="step-sep">/</span>
          <span class="step-tot">{{ totalSteps }}</span>
        </div>
        <div class="step-detail">
          <div class="step-instr">{{ currentStep?.instruction }}</div>
          <div class="step-landmark">📍 {{ currentStep?.landmark }}</div>
        </div>
        <div class="step-dist">
          <div class="dist-val">{{ currentStep?.distance }}</div>
          <div class="dist-label">DIST</div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        <div class="progress-dot" :style="{ left: progress + '%' }"></div>
      </div>

      <!-- Controls -->
      <div class="nav-controls">
        <button class="ctrl-btn prev-btn" @click="prevStep" :disabled="currentStepIndex === 0">
          ← PREV
        </button>
        <button class="ctrl-btn voice-btn" @click="speakCurrentStep">
          🔊
        </button>
        <button
          class="ctrl-btn next-btn"
          @click="handleNext"
          :class="{ arrived: isLastStep }"
        >
          {{ isLastStep ? '✓ DONE' : 'NEXT →' }}
        </button>
      </div>
    </div>

    <!-- Tap to start overlay (if not navigating) -->
    <div class="tap-to-start" v-if="!isNavigating && !selectedLocation">
      <div class="tap-ring"></div>
      <div class="tap-ring tap-ring--2"></div>
      <div class="tap-text">TAP A MARKER TO EXPLORE</div>
    </div>

    <!-- Arrived panel -->
    <Transition name="arrived-slide">
      <div v-if="arrivedVisible" class="arrived-panel hud-panel">
        <div class="arrived-icon">🎯</div>
        <div class="arrived-title">DESTINATION REACHED</div>
        <div class="arrived-name">{{ selectedLocation?.name }}</div>
        <div class="arrived-desc">{{ selectedLocation?.description }}</div>
        <button class="arrived-btn" @click="goToNewDest">
          NAVIGATE AGAIN
        </button>
        <button class="arrived-exit" @click="handleBack">EXIT</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useNavigation } from '../composables/useNavigation.js'
import { useCamera } from '../composables/useCamera.js'
import NavigationOverlay from './NavigationOverlay.vue'
import MarkerSimulator from './MarkerSimulator.vue'

const {
  selectedLocation, currentStep, currentStepIndex, totalSteps, progress,
  isLastStep, isNavigating, nextStep, prevStep, speakStep, announceArrival,
  backToSelect, resetNavigation, VIEW, locations
} = useNavigation()

const { videoRef, cameraMode, startCamera, stopCamera } = useCamera()

const markerSimRef = ref(null)
const arrivedVisible = ref(false)
let cameraStarted = false

// Build marker data for MarkerSimulator
const markerData = computed(() => locations.map((loc, i) => ({
  ...loc,
  dist: `${30 + i * 20}m`
})))

const direction = computed(() => currentStep.value?.direction || 'straight')

onMounted(async () => {
  await startCamera()
  cameraStarted = true
})

async function toggleCamera() {
  if (cameraMode.value === 'live') {
    stopCamera()
  } else {
    await startCamera()
  }
}

function handleMarkerClick(marker) {
  // Show detection banner on the marker simulator
  markerSimRef.value?.showDetection(marker)
}

function handleNext() {
  if (isLastStep.value) {
    arrivedVisible.value = true
    announceArrival()
  } else {
    nextStep()
    speakStep()
  }
}

function speakCurrentStep() {
  speakStep()
}

function handleBack() {
  stopCamera()
  backToSelect()
}

function goToNewDest() {
  arrivedVisible.value = false
  stopCamera()
  backToSelect()
}

watch(isLastStep, (val) => {
  if (val && direction.value === 'arrived') {
    setTimeout(() => {
      arrivedVisible.value = true
      announceArrival()
    }, 500)
  }
})
</script>

<style scoped>
.camera-view {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

/* Live camera */
.camera-feed {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Simulated background */
.sim-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.campus-scene {
  width: 100%;
  height: 100%;
  position: relative;
}

.sim-sky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, #020f1f 0%, #0a1f3a 60%, #0d2d4a 100%);
}

.sim-ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  background: linear-gradient(180deg, #0d1b2a 0%, #071118 100%);
  overflow: hidden;
}

.ground-line {
  position: absolute;
  left: 10%;
  right: 10%;
  height: 1px;
  background: rgba(0,245,212,0.07);
}

/* Simulated buildings */
.sim-building {
  position: absolute;
  background: linear-gradient(180deg, #0c1a2e, #071018);
  border-top: 1px solid rgba(0,180,216,0.3);
}
.b1 {
  bottom: 48%;
  left: 8%;
  width: 22%;
  height: 35%;
  border-radius: 2px 2px 0 0;
}
.b2 {
  bottom: 48%;
  left: 38%;
  width: 28%;
  height: 45%;
  border-radius: 2px 2px 0 0;
}
.b3 {
  bottom: 48%;
  right: 5%;
  width: 18%;
  height: 28%;
  border-radius: 2px 2px 0 0;
}

.sim-path {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 25%;
  height: 52%;
  background: linear-gradient(180deg, rgba(0,245,212,0.03), rgba(0,245,212,0.08));
  clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
}

.sim-tree {
  position: absolute;
  font-size: 28px;
  bottom: 46%;
  opacity: 0.7;
  filter: drop-shadow(0 0 8px rgba(0,150,100,0.3));
}
.t1 { left: 5%; }
.t2 { right: 4%; }
.t3 { left: 33%; bottom: 47%; }

.sim-mode-badge {
  position: absolute;
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,8,20,0.7);
  border: 1px solid rgba(0,245,212,0.2);
  border-radius: 20px;
  padding: 6px 12px;
  font-family: var(--font-mono);
  font-size: 8px;
  color: rgba(0,245,212,0.6);
  letter-spacing: 1px;
  white-space: nowrap;
}

/* AR Grid */
.ar-grid-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  pointer-events: none;
  opacity: 0.6;
}
.ar-grid-svg {
  width: 100%;
  height: 100%;
}
.grid-anim { animation: grid-flicker 3s ease-in-out infinite; }

/* Path visualization */
.path-viz-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  pointer-events: none;
}
.path-svg { width: 100%; height: 100%; }
.animated-path {
  animation: dash-flow 0.6s linear infinite;
}

/* Nav area - center of screen */
.nav-area {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* HUD Top */
.hud-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: linear-gradient(180deg, rgba(0,8,20,0.9) 0%, transparent 100%);
  z-index: 30;
}

.hud-left, .hud-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hud-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0,8,20,0.8);
  border: 1px solid rgba(0,245,212,0.3);
  color: var(--text-primary);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hud-dest {
  background: rgba(0,8,20,0.8);
  border: 1px solid rgba(0,245,212,0.2);
  border-radius: 20px;
  padding: 4px 12px;
}
.hud-dest-name {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}
.hud-dest-cat {
  font-family: var(--font-mono);
  font-size: 8px;
  color: var(--text-dim);
}

.hud-cam-badge {
  font-family: var(--font-mono);
  font-size: 9px;
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(0,8,20,0.7);
  border-radius: 20px;
  padding: 4px 8px;
  border: 1px solid rgba(255,100,100,0.3);
  color: rgba(255,150,150,0.9);
}
.hud-cam-badge.live {
  border-color: rgba(255,100,100,0.5);
  color: #ff6b6b;
}
.hud-cam-badge.simulated {
  border-color: rgba(0,245,212,0.3);
  color: var(--neon);
}

/* Compass */
.compass-hud {
  position: absolute;
  top: 60px;
  right: 12px;
  z-index: 30;
}
.compass-ring {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(0,8,20,0.8);
  border: 1px solid rgba(0,245,212,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.compass-needle {
  width: 2px;
  height: 14px;
  background: linear-gradient(#ff6b6b 50%, var(--neon) 50%);
  border-radius: 2px;
  transform: rotate(25deg);
}
.compass-label {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 7px;
  color: var(--neon);
}

/* Scan line */
.hud-scanline {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,245,212,0.3), transparent);
  animation: scanline 5s linear infinite;
  pointer-events: none;
  z-index: 5;
}

/* Crosshair */
.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 20;
}
.ch-line {
  position: absolute;
  background: rgba(0,245,212,0.4);
}
.ch-h { width: 40px; height: 1px; top: 0; left: -20px; }
.ch-v { width: 1px; height: 40px; top: -20px; left: 0; }
.ch-ring {
  position: absolute;
  width: 20px; height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(0,245,212,0.4);
  top: -10px; left: -10px;
}
.ch-dot {
  position: absolute;
  width: 4px; height: 4px;
  background: var(--neon);
  border-radius: 50%;
  top: -2px; left: -2px;
  box-shadow: 0 0 6px var(--neon);
}

/* Bottom nav panel */
.nav-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 16px 16px 0 0;
  padding: 14px;
  z-index: 30;
}

.step-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.step-num {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--neon);
  flex-shrink: 0;
  background: rgba(0,245,212,0.08);
  border: 1px solid rgba(0,245,212,0.2);
  border-radius: 8px;
  padding: 4px 10px;
  line-height: 1;
}
.step-cur { font-size: 22px; }
.step-sep { color: var(--text-dim); margin: 0 2px; }
.step-tot { font-size: 13px; color: var(--text-dim); }

.step-detail { flex: 1; }
.step-instr {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}
.step-landmark {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  margin-top: 3px;
}

.step-dist {
  text-align: center;
  flex-shrink: 0;
  background: rgba(247,37,133,0.1);
  border: 1px solid rgba(247,37,133,0.2);
  border-radius: 8px;
  padding: 4px 8px;
}
.dist-val {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: #f72585;
}
.dist-label {
  font-family: var(--font-mono);
  font-size: 7px;
  color: var(--text-dim);
}

/* Progress */
.progress-track {
  height: 3px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  margin-bottom: 12px;
  position: relative;
}
.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--neon2), var(--neon));
  border-radius: 2px;
  transition: width 0.5s ease;
  box-shadow: 0 0 6px rgba(0,245,212,0.5);
}
.progress-dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: var(--neon);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--neon);
  transition: left 0.5s ease;
}

/* Controls */
.nav-controls {
  display: flex;
  gap: 8px;
}
.ctrl-btn {
  flex: 1;
  padding: 10px 6px;
  border-radius: 10px;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  transition: all 0.2s;
}
.ctrl-btn:active { transform: scale(0.96); }
.ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.prev-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text-dim);
  flex: 0.8;
}

.voice-btn {
  background: rgba(0,245,212,0.08);
  border: 1px solid rgba(0,245,212,0.2);
  color: var(--neon);
  flex: 0.5;
  font-size: 18px;
}

.next-btn {
  background: linear-gradient(135deg, rgba(0,245,212,0.2), rgba(0,180,216,0.2));
  border: 1px solid rgba(0,245,212,0.4);
  color: var(--neon);
}
.next-btn.arrived {
  background: linear-gradient(135deg, rgba(6,214,160,0.2), rgba(6,214,160,0.1));
  border-color: rgba(6,214,160,0.5);
  color: #06d6a0;
}

/* Tap to start */
.tap-to-start {
  position: absolute;
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  pointer-events: none;
}
.tap-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid rgba(0,245,212,0.4);
  margin: 0 auto 12px;
  animation: pulse-ring 2s ease-out infinite;
}
.tap-ring--2 {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1s;
}
.tap-text {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 2px;
  color: rgba(0,245,212,0.6);
  white-space: nowrap;
}

/* Arrived panel */
.arrived-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  max-width: 320px;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  z-index: 50;
  border-color: rgba(6,214,160,0.4) !important;
}
.arrived-icon { font-size: 48px; margin-bottom: 10px; }
.arrived-title {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 3px;
  color: #06d6a0;
  margin-bottom: 6px;
}
.arrived-name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.arrived-desc {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 300;
  color: var(--text-dim);
  line-height: 1.5;
  margin-bottom: 20px;
}
.arrived-btn {
  display: block;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, #06d6a0, #00b4d8);
  color: #000814;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 8px;
}
.arrived-exit {
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 11px;
}

/* Arrived transition */
.arrived-slide-enter-active, .arrived-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.arrived-slide-enter-from, .arrived-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -40%) scale(0.85);
}
</style>
