<template>
  <div class="select-view">
    <!-- Header -->
    <div class="select-header">
      <button class="back-btn" @click="goToView(VIEW.HOME)">
        <span>←</span> <span class="back-text">BACK</span>
      </button>
      <div class="header-center">
        <div class="header-title">SELECT DESTINATION</div>
        <div class="header-sub">{{ userName }}, where are you headed?</div>
      </div>
      <div class="header-badge">
        <span class="status-dot"></span>
        <span>GPS</span>
      </div>
    </div>

    <!-- Campus mini-map -->
    <div class="map-section">
      <div class="map-label">CAMPUS MAP</div>
      <div class="map-container hud-panel">
        <svg class="campus-svg" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet">
          <!-- Background grid -->
          <rect width="200" height="120" fill="rgba(0,8,20,0.8)"/>
          <defs>
            <pattern id="mini-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,245,212,0.08)" stroke-width="0.3"/>
            </pattern>
          </defs>
          <rect width="200" height="120" fill="url(#mini-grid)"/>

          <!-- Campus boundary -->
          <rect x="10" y="10" width="180" height="100" rx="4"
            fill="none" stroke="rgba(0,245,212,0.25)" stroke-width="0.8" stroke-dasharray="4,2"/>

          <!-- Roads -->
          <line x1="50" y1="10" x2="50" y2="110" stroke="rgba(0,245,212,0.15)" stroke-width="1.5"/>
          <line x1="10" y1="60" x2="190" y2="60" stroke="rgba(0,245,212,0.15)" stroke-width="1.5"/>
          <line x1="100" y1="10" x2="100" y2="110" stroke="rgba(0,245,212,0.1)" stroke-width="1"/>

          <!-- Location markers on map -->
          <g v-for="loc in locations" :key="loc.id"
            @click="handleMapClick(loc)"
            class="map-marker"
            :class="{ 'marker-selected': selectedLocation?.id === loc.id }">
            <!-- Pulse ring for selected -->
            <circle v-if="selectedLocation?.id === loc.id"
              :cx="loc.coordinates.x * 2" :cy="loc.coordinates.y * 1.2"
              r="8" fill="none" :stroke="loc.color" stroke-width="0.8"
              opacity="0.5" class="pulse-circle"/>
            <!-- Marker dot -->
            <circle
              :cx="loc.coordinates.x * 2" :cy="loc.coordinates.y * 1.2"
              r="3" :fill="loc.color"
              :opacity="selectedLocation?.id === loc.id ? 1 : 0.6"
              class="marker-dot"/>
            <!-- Label -->
            <text
              :x="loc.coordinates.x * 2" :y="loc.coordinates.y * 1.2 - 5"
              text-anchor="middle"
              :fill="selectedLocation?.id === loc.id ? loc.color : 'rgba(200,230,240,0.5)'"
              font-size="4" font-family="Space Mono, monospace">
              {{ loc.shortName }}
            </text>
          </g>

          <!-- Current position -->
          <g>
            <circle cx="100" cy="60" r="4" fill="none" stroke="#00f5d4" stroke-width="1" class="you-pulse"/>
            <circle cx="100" cy="60" r="2.5" fill="#00f5d4"/>
            <text x="100" y="54" text-anchor="middle" fill="#00f5d4" font-size="4" font-family="Space Mono">YOU</text>
          </g>
        </svg>

        <!-- Map corner marks -->
        <div class="map-corner tl"></div>
        <div class="map-corner tr"></div>
        <div class="map-corner bl"></div>
        <div class="map-corner br"></div>

        <!-- Scale indicator -->
        <div class="map-scale">
          <div class="scale-line"></div>
          <span>50m</span>
        </div>
      </div>
    </div>

    <!-- Location cards grid -->
    <div class="locations-section">
      <div class="section-header">
        <span class="section-label">AVAILABLE DESTINATIONS</span>
        <span class="section-count">{{ locations.length }} locations</span>
      </div>
      <div class="locations-grid">
        <LocationCard
          v-for="loc in locations"
          :key="loc.id"
          :location="loc"
          :is-selected="selectedLocation?.id === loc.id"
          @select="handleSelect"
        />
      </div>
    </div>

    <!-- Bottom action panel -->
    <Transition name="slide-up">
      <div v-if="selectedLocation" class="action-panel hud-panel">
        <div class="action-info">
          <div class="action-dest">
            <span>{{ selectedLocation.icon }}</span>
            <div>
              <div class="dest-name">{{ selectedLocation.name }}</div>
              <div class="dest-steps">{{ selectedLocation.steps.length }} step route</div>
            </div>
          </div>
        </div>
        <button class="navigate-btn" @click="beginNavigation">
          <span>START AR NAV</span>
          <span class="nav-icon">🔭</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useNavigation } from '../composables/useNavigation.js'
import LocationCard from './LocationCard.vue'

const {
  locations, selectedLocation, userName,
  selectLocation, startNavigation, goToView, VIEW
} = useNavigation()

function handleSelect(loc) {
  selectLocation(loc)
}

function handleMapClick(loc) {
  selectLocation(loc)
}

function beginNavigation() {
  if (!selectedLocation.value) return
  startNavigation()
}
</script>

<style scoped>
.select-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at 30% 20%, #001524 0%, #000814 70%);
  overflow: hidden;
}

/* Header */
.select-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: rgba(0,8,20,0.9);
  border-bottom: 1px solid rgba(0,245,212,0.15);
  gap: 10px;
  flex-shrink: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0,245,212,0.08);
  border: 1px solid rgba(0,245,212,0.2);
  border-radius: 8px;
  padding: 6px 10px;
  color: var(--neon);
  font-family: var(--font-mono);
  font-size: 11px;
  flex-shrink: 0;
}

.header-center { flex: 1; text-align: center; }
.header-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--neon);
}
.header-sub {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  margin-top: 2px;
}

.header-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--neon);
  flex-shrink: 0;
}
.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--neon);
  box-shadow: 0 0 6px var(--neon);
  animation: blink 1.5s infinite;
}

/* Map */
.map-section {
  padding: 10px 14px 6px;
  flex-shrink: 0;
}
.map-label {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 3px;
  color: var(--text-dim);
  margin-bottom: 6px;
}
.map-container {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}
.campus-svg {
  width: 100%;
  height: 120px;
  display: block;
}

.map-marker { cursor: pointer; }
.marker-dot { transition: r 0.2s; }
.map-marker:hover .marker-dot { r: 4; }
.pulse-circle { animation: pulse-ring 1.5s ease-out infinite; }
.you-pulse { animation: pulse-ring 2s ease-out infinite; }

.map-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: rgba(0,245,212,0.4);
  border-style: solid;
}
.map-corner.tl { top: 6px; left: 6px; border-width: 1px 0 0 1px; }
.map-corner.tr { top: 6px; right: 6px; border-width: 1px 1px 0 0; }
.map-corner.bl { bottom: 6px; left: 6px; border-width: 0 0 1px 1px; }
.map-corner.br { bottom: 6px; right: 6px; border-width: 0 1px 1px 0; }

.map-scale {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 7px;
  color: rgba(0,245,212,0.4);
}
.scale-line {
  width: 30px;
  height: 1px;
  background: rgba(0,245,212,0.4);
}

/* Locations */
.locations-section {
  flex: 1;
  overflow-y: auto;
  padding: 8px 14px 10px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.section-label {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 3px;
  color: var(--text-dim);
}
.section-count {
  font-family: var(--font-mono);
  font-size: 8px;
  color: var(--neon);
  opacity: 0.6;
}

.locations-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Action panel */
.action-panel {
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.action-info { flex: 1; }
.action-dest {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
}
.dest-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}
.dest-steps {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  margin-top: 2px;
}

.navigate-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #00f5d4, #00b4d8);
  color: #000814;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: 0 0 20px rgba(0,245,212,0.4);
  flex-shrink: 0;
  transition: transform 0.2s, box-shadow 0.2s;
}
.navigate-btn:active { transform: scale(0.96); }
.nav-icon { font-size: 16px; }

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
