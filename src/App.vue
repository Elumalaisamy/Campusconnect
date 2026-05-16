<template>
  <div id="campus-ar-app">
    <!-- App frame with corner decorators -->
    <div class="app-frame">
      <div class="frame-corner fc-tl"></div>
      <div class="frame-corner fc-tr"></div>
      <div class="frame-corner fc-bl"></div>
      <div class="frame-corner fc-br"></div>
    </div>

    <!-- Views with transitions -->
    <Transition :name="transitionName" mode="out-in">
      <HomeView v-if="currentView === VIEW.HOME" :key="VIEW.HOME" />
      <SelectView v-else-if="currentView === VIEW.SELECT" :key="VIEW.SELECT" />
      <CameraView v-else-if="currentView === VIEW.AR" :key="VIEW.AR" />
    </Transition>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useNavigation } from './composables/useNavigation.js'
import HomeView from './components/HomeView.vue'
import SelectView from './components/SelectView.vue'
import CameraView from './components/CameraView.vue'

const { currentView, VIEW } = useNavigation()

const prevView = ref(null)
const transitionName = computed(() => {
  const order = [VIEW.HOME, VIEW.SELECT, VIEW.AR]
  const fromIdx = order.indexOf(prevView.value)
  const toIdx = order.indexOf(currentView.value)
  return toIdx > fromIdx ? 'slide-left' : 'slide-right'
})

watch(currentView, (next, prev) => {
  prevView.value = prev
})
</script>

<style>
#campus-ar-app {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

.app-frame {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

.frame-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: rgba(0,245,212,0.2);
  border-style: solid;
}
.fc-tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
.fc-tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
.fc-bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
.fc-br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

/* Slide transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  inset: 0;
}

.slide-left-enter-from { transform: translateX(100%); opacity: 0; }
.slide-left-leave-to { transform: translateX(-30%); opacity: 0; }

.slide-right-enter-from { transform: translateX(-100%); opacity: 0; }
.slide-right-leave-to { transform: translateX(30%); opacity: 0; }
</style>
