<template>
  <div
    class="location-card"
    :class="{ active: isActive, selected: isSelected }"
    @click="$emit('select', location)"
    :style="{ '--loc-color': location.color }"
  >
    <div class="card-glow"></div>
    <div class="card-scan" v-if="isSelected"></div>

    <div class="card-top">
      <div class="loc-icon">{{ location.icon }}</div>
      <div class="loc-badge">{{ location.category }}</div>
    </div>

    <div class="card-body">
      <div class="loc-name">{{ location.name }}</div>
      <div class="loc-floor">
        <span class="floor-icon">📍</span>
        {{ location.floor }}
      </div>
      <div class="loc-desc">{{ location.description }}</div>
    </div>

    <div class="card-footer">
      <div class="step-count">
        <span class="step-dot" v-for="(s, i) in location.steps" :key="i"></span>
      </div>
      <div class="nav-hint">{{ location.steps.length }} steps</div>
    </div>

    <!-- Selected indicator -->
    <div class="selected-indicator" v-if="isSelected">
      <span>✓ SELECTED</span>
    </div>

    <!-- Corner marks -->
    <div class="corner tl"></div>
    <div class="corner tr"></div>
  </div>
</template>

<script setup>
defineProps({
  location: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false }
})
defineEmits(['select'])
</script>

<style scoped>
.location-card {
  position: relative;
  background: rgba(0, 12, 28, 0.85);
  border: 1px solid rgba(var(--loc-color-rgb, 0, 245, 212), 0.2);
  border-color: color-mix(in srgb, var(--loc-color) 25%, transparent);
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  flex: 1 1 140px;
  min-width: 140px;
  max-width: 200px;
}

.location-card:hover, .location-card.active {
  border-color: var(--loc-color);
  box-shadow: 0 0 16px rgba(0,0,0,0.3), 0 0 0 1px color-mix(in srgb, var(--loc-color) 40%, transparent);
  transform: translateY(-2px);
}

.location-card.selected {
  border-color: var(--loc-color);
  background: rgba(0, 20, 40, 0.95);
  box-shadow: 0 0 24px color-mix(in srgb, var(--loc-color) 30%, transparent), inset 0 0 20px rgba(0,0,0,0.3);
}

.card-glow {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: radial-gradient(circle at top left, color-mix(in srgb, var(--loc-color) 15%, transparent), transparent 60%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}
.location-card:hover .card-glow,
.location-card.selected .card-glow { opacity: 1; }

.card-scan {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--loc-color), transparent);
  animation: scanline 1.5s linear infinite;
  pointer-events: none;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.loc-icon {
  font-size: 22px;
  filter: drop-shadow(0 0 6px rgba(255,255,255,0.3));
}

.loc-badge {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 1px;
  color: var(--loc-color);
  background: color-mix(in srgb, var(--loc-color) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--loc-color) 30%, transparent);
  border-radius: 4px;
  padding: 2px 6px;
  text-transform: uppercase;
}

.card-body { margin-bottom: 10px; }

.loc-name {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: 4px;
}

.loc-floor {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
}

.loc-desc {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 300;
  color: rgba(200,230,240,0.45);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.step-count {
  display: flex;
  gap: 3px;
  align-items: center;
}
.step-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--loc-color) 50%, transparent);
}
.nav-hint {
  font-family: var(--font-mono);
  font-size: 8px;
  color: var(--text-dim);
}

.selected-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--loc-color);
  color: #000814;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  padding: 4px;
}

/* Corner marks */
.corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: var(--loc-color);
  border-style: solid;
  opacity: 0.6;
}
.corner.tl { top: 5px; left: 5px; border-width: 1px 0 0 1px; }
.corner.tr { top: 5px; right: 5px; border-width: 1px 1px 0 0; }
</style>
