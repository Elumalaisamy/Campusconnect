<template>
  <div class="marker-simulator">
    <!-- AR Marker hotspots positioned on camera view -->
    <div
      v-for="(marker, i) in markers"
      :key="marker.id"
      class="ar-marker"
      :class="{ 'marker-active': activeId === marker.id }"
      :style="markerStyle(marker, i)"
      @click="$emit('marker-click', marker)"
    >
      <!-- Scanning box -->
      <div class="scan-box">
        <div class="scan-corner scan-tl"></div>
        <div class="scan-corner scan-tr"></div>
        <div class="scan-corner scan-bl"></div>
        <div class="scan-corner scan-br"></div>
        <div class="scan-line"></div>
      </div>

      <!-- Label tag -->
      <div class="marker-label" :style="{ '--mcolor': marker.color }">
        <span class="marker-icon">{{ marker.icon }}</span>
        <div class="marker-info">
          <div class="marker-name">{{ marker.shortName }}</div>
          <div class="marker-dist">{{ marker.dist }}</div>
        </div>
        <div class="marker-signal">
          <div class="signal-bar" :style="{ height: '4px' }"></div>
          <div class="signal-bar" :style="{ height: '7px' }"></div>
          <div class="signal-bar" :style="{ height: '10px' }"></div>
        </div>
      </div>

      <!-- Pulse rings -->
      <div class="pulse-ring r1" :style="{ borderColor: marker.color }"></div>
      <div class="pulse-ring r2" :style="{ borderColor: marker.color }"></div>
    </div>

    <!-- Detection banner when tapped -->
    <Transition name="detect">
      <div v-if="detectedMarker" class="detection-banner">
        <div class="detect-label">MARKER DETECTED</div>
        <div class="detect-name">{{ detectedMarker.icon }} {{ detectedMarker.name }}</div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  markers: { type: Array, default: () => [] },
  activeId: { type: String, default: null }
})

const emit = defineEmits(['marker-click'])
const detectedMarker = ref(null)
let detectTimer = null

// Watch for active marker changes to show detection banner
function showDetection(marker) {
  detectedMarker.value = marker
  clearTimeout(detectTimer)
  detectTimer = setTimeout(() => { detectedMarker.value = null }, 2500)
}

// Distribute markers visually around the camera view
function markerStyle(marker, i) {
  // Position markers in a scattered but visible layout
  const positions = [
    { top: '12%', left: '8%' },
    { top: '10%', right: '8%' },
    { top: '35%', left: '5%' },
    { top: '30%', right: '6%' },
    { top: '58%', left: '10%' },
    { top: '52%', right: '7%' },
    { top: '72%', left: '15%' },
    { top: '68%', right: '12%' },
  ]
  return positions[i % positions.length] || { top: `${10 + i * 12}%`, left: '10%' }
}

defineExpose({ showDetection })
onUnmounted(() => clearTimeout(detectTimer))
</script>

<style scoped>
.marker-simulator {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* AR Marker */
.ar-marker {
  position: absolute;
  pointer-events: all;
  cursor: pointer;
  z-index: 10;
}

/* Scan box (the AR bracket corners) */
.scan-box {
  width: 44px;
  height: 44px;
  position: relative;
}

.scan-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: rgba(0,245,212,0.8);
  border-style: solid;
}
.scan-tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
.scan-tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
.scan-bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
.scan-br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

.ar-marker.marker-active .scan-corner {
  border-color: #06d6a0;
  box-shadow: 0 0 6px rgba(6,214,160,0.8);
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,245,212,0.6), transparent);
  animation: scanline 2s linear infinite;
}

/* Marker label */
.marker-label {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(0,8,20,0.85);
  border: 1px solid color-mix(in srgb, var(--mcolor, #00f5d4) 40%, transparent);
  border-radius: 6px;
  padding: 4px 7px;
  margin-top: 4px;
  backdrop-filter: blur(8px);
  min-width: 80px;
  transition: all 0.2s;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.ar-marker:active .marker-label,
.ar-marker.marker-active .marker-label {
  border-color: var(--mcolor, #00f5d4);
  box-shadow: 0 0 12px color-mix(in srgb, var(--mcolor, #00f5d4) 30%, transparent);
  background: rgba(0,15,35,0.95);
}

.marker-icon { font-size: 12px; }
.marker-info { flex: 1; }
.marker-name {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}
.marker-dist {
  font-family: var(--font-mono);
  font-size: 7px;
  color: var(--text-dim);
}

/* Signal bars */
.marker-signal {
  display: flex;
  align-items: flex-end;
  gap: 1.5px;
}
.signal-bar {
  width: 3px;
  background: var(--mcolor, var(--neon));
  border-radius: 1px;
  opacity: 0.7;
  animation: blink 1.5s infinite;
}
.signal-bar:nth-child(2) { animation-delay: 0.2s; }
.signal-bar:nth-child(3) { animation-delay: 0.4s; }

/* Pulse rings */
.pulse-ring {
  position: absolute;
  top: 22px;
  left: 22px;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border-width: 1px;
  border-style: solid;
  animation: pulse-ring 2.5s ease-out infinite;
  pointer-events: none;
}
.r2 { animation-delay: 1.25s; }

/* Detection banner */
.detection-banner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,8,20,0.92);
  border: 1px solid var(--neon);
  border-radius: 12px;
  padding: 12px 24px;
  text-align: center;
  box-shadow: 0 0 30px rgba(0,245,212,0.4);
  pointer-events: none;
  z-index: 20;
}
.detect-label {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 3px;
  color: var(--neon);
  margin-bottom: 4px;
}
.detect-name {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: white;
}

/* Transition */
.detect-enter-active, .detect-leave-active {
  transition: all 0.3s ease;
}
.detect-enter-from, .detect-leave-to {
  opacity: 0;
  transform: translate(-50%, -40%) scale(0.9);
}
</style>
