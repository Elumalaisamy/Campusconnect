<template>
  <div class="nav-overlay" :key="stepKey">

    <!-- Direction-specific AR arrow -->
    <div class="arrow-container" :class="`dir-${direction}`">
      <!-- Straight arrow -->
      <svg v-if="direction === 'straight'" class="ar-arrow straight-arrow" viewBox="0 0 80 120">
        <!-- Glow arrow shaft -->
        <defs>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Animated path dots -->
        <g class="path-dots">
          <circle cx="40" cy="100" r="3" fill="var(--neon)" opacity="0.8" class="dot d1"/>
          <circle cx="40" cy="80" r="3" fill="var(--neon)" opacity="0.7" class="dot d2"/>
          <circle cx="40" cy="60" r="3" fill="var(--neon)" opacity="0.6" class="dot d3"/>
          <circle cx="40" cy="40" r="3" fill="var(--neon)" opacity="0.5" class="dot d4"/>
        </g>
        <!-- Main arrow -->
        <g filter="url(#glow-filter)">
          <line x1="40" y1="110" x2="40" y2="20" stroke="var(--neon)" stroke-width="3" stroke-linecap="round"/>
          <polyline points="20,40 40,15 60,40" fill="none" stroke="var(--neon)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <!-- Pulse base -->
        <circle cx="40" cy="110" r="8" fill="none" stroke="var(--neon)" stroke-width="1" opacity="0.3" class="base-pulse"/>
      </svg>

      <!-- Left arrow -->
      <svg v-else-if="direction === 'left'" class="ar-arrow turn-arrow" viewBox="0 0 120 120">
        <defs>
          <filter id="glow-filter-l">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <g class="path-dots-left">
          <circle cx="100" cy="80" r="3" fill="#3a86ff" opacity="0.8" class="dot d1"/>
          <circle cx="80" cy="60" r="3" fill="#3a86ff" opacity="0.7" class="dot d2"/>
          <circle cx="60" cy="50" r="3" fill="#3a86ff" opacity="0.6" class="dot d3"/>
          <circle cx="40" cy="42" r="3" fill="#3a86ff" opacity="0.5" class="dot d4"/>
        </g>
        <g filter="url(#glow-filter-l)">
          <path d="M 100 80 Q 80 80 70 60 Q 60 40 40 38" fill="none" stroke="#3a86ff" stroke-width="3" stroke-linecap="round"/>
          <polyline points="55,20 35,38 55,55" fill="none" stroke="#3a86ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <circle cx="100" cy="80" r="8" fill="none" stroke="#3a86ff" stroke-width="1" opacity="0.3" class="base-pulse"/>
      </svg>

      <!-- Right arrow -->
      <svg v-else-if="direction === 'right'" class="ar-arrow turn-arrow" viewBox="0 0 120 120">
        <defs>
          <filter id="glow-filter-r">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <g class="path-dots-right">
          <circle cx="20" cy="80" r="3" fill="#f72585" opacity="0.8" class="dot d1"/>
          <circle cx="40" cy="60" r="3" fill="#f72585" opacity="0.7" class="dot d2"/>
          <circle cx="60" cy="50" r="3" fill="#f72585" opacity="0.6" class="dot d3"/>
          <circle cx="80" cy="42" r="3" fill="#f72585" opacity="0.5" class="dot d4"/>
        </g>
        <g filter="url(#glow-filter-r)">
          <path d="M 20 80 Q 40 80 50 60 Q 60 40 80 38" fill="none" stroke="#f72585" stroke-width="3" stroke-linecap="round"/>
          <polyline points="65,20 85,38 65,55" fill="none" stroke="#f72585" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <circle cx="20" cy="80" r="8" fill="none" stroke="#f72585" stroke-width="1" opacity="0.3" class="base-pulse"/>
      </svg>

      <!-- Arrived checkmark -->
      <svg v-else-if="direction === 'arrived'" class="ar-arrow arrived-arrow" viewBox="0 0 120 120">
        <defs>
          <filter id="glow-filter-a">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <g filter="url(#glow-filter-a)">
          <circle cx="60" cy="60" r="40" fill="none" stroke="#06d6a0" stroke-width="2" opacity="0.5"/>
          <circle cx="60" cy="60" r="30" fill="rgba(6,214,160,0.1)" stroke="#06d6a0" stroke-width="1.5"/>
          <polyline points="35,60 52,77 85,43" fill="none" stroke="#06d6a0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="checkmark"/>
        </g>
        <circle cx="60" cy="60" r="50" fill="none" stroke="#06d6a0" stroke-width="0.8" opacity="0.2" class="arrived-pulse"/>
        <circle cx="60" cy="60" r="55" fill="none" stroke="#06d6a0" stroke-width="0.5" opacity="0.1" class="arrived-pulse-2"/>
      </svg>
    </div>

    <!-- Direction label -->
    <div class="direction-label" :class="`label-${direction}`">
      <div class="dir-icon">{{ dirIcon }}</div>
      <div class="dir-text">{{ dirText }}</div>
    </div>

    <!-- Floating particles -->
    <div class="particles">
      <div v-for="i in 6" :key="i" class="particle" :style="particleStyle(i)"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  direction: { type: String, default: 'straight' }, // straight | left | right | arrived
  stepKey: { type: Number, default: 0 }
})

const dirIcon = computed(() => {
  const m = { straight: '⬆', left: '↩', right: '↪', arrived: '✅' }
  return m[props.direction] || '⬆'
})

const dirText = computed(() => {
  const m = { straight: 'GO STRAIGHT', left: 'TURN LEFT', right: 'TURN RIGHT', arrived: 'ARRIVED' }
  return m[props.direction] || 'GO STRAIGHT'
})

function particleStyle(i) {
  const colors = ['var(--neon)', '#3a86ff', '#f72585', '#fb8500', '#7209b7', '#06d6a0']
  return {
    left: `${10 + (i * 15)}%`,
    animationDelay: `${i * 0.4}s`,
    animationDuration: `${2 + i * 0.3}s`,
    background: colors[i - 1],
    width: `${3 + (i % 3)}px`,
    height: `${3 + (i % 3)}px`
  }
}
</script>

<style scoped>
.nav-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Arrow container */
.arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fade-in-up 0.4s ease forwards;
}

.ar-arrow {
  filter: drop-shadow(0 0 12px rgba(0,245,212,0.6));
}

.straight-arrow {
  width: 100px;
  height: 150px;
  animation: bounce-up 1.5s ease-in-out infinite;
}

.turn-arrow {
  width: 140px;
  height: 140px;
  animation: turn-bob 1.5s ease-in-out infinite;
}

.arrived-arrow {
  width: 150px;
  height: 150px;
  animation: arrived-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Animated dots */
.dot {
  animation: float-dot 1.5s ease-in-out infinite;
}
.d1 { animation-delay: 0s; }
.d2 { animation-delay: 0.25s; }
.d3 { animation-delay: 0.5s; }
.d4 { animation-delay: 0.75s; }

@keyframes float-dot {
  0%, 100% { transform: translateY(0); opacity: 0.8; }
  50% { transform: translateY(-4px); opacity: 0.3; }
}

@keyframes bounce-up {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes turn-bob {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes arrived-pop {
  from { transform: scale(0) rotate(-20deg); opacity: 0; }
  to { transform: scale(1) rotate(0deg); opacity: 1; }
}

.base-pulse {
  animation: pulse-ring 2s ease-out infinite;
}

.checkmark {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw-check 0.8s ease forwards 0.3s;
}
@keyframes draw-check {
  to { stroke-dashoffset: 0; }
}

.arrived-pulse { animation: pulse-ring 2s ease-out infinite; }
.arrived-pulse-2 { animation: pulse-ring 2s ease-out infinite 0.5s; }

/* Direction label */
.direction-label {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,8,20,0.7);
  border-radius: 8px;
  padding: 6px 14px;
  margin-top: 12px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0,245,212,0.2);
  animation: fade-in-up 0.5s ease 0.2s both;
}
.label-left { border-color: rgba(58,134,255,0.3); }
.label-right { border-color: rgba(247,37,133,0.3); }
.label-arrived { border-color: rgba(6,214,160,0.4); }

.dir-icon { font-size: 18px; }
.dir-text {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--neon);
}
.label-left .dir-text { color: #3a86ff; }
.label-right .dir-text { color: #f72585; }
.label-arrived .dir-text { color: #06d6a0; }

/* Particles */
.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.particle {
  position: absolute;
  bottom: 20%;
  border-radius: 50%;
  animation: float-particle linear infinite;
  opacity: 0.6;
}
@keyframes float-particle {
  0% { transform: translateY(0) scale(1); opacity: 0.6; }
  100% { transform: translateY(-200px) scale(0); opacity: 0; }
}
</style>
