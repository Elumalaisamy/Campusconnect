import { ref, computed } from 'vue'
import locationsData from '../data/locations.json'

export const VIEW = {
  HOME: 'home',
  SELECT: 'select',
  AR: 'ar',
  ARRIVED: 'arrived'
}

const currentView = ref(VIEW.HOME)
const selectedLocation = ref(null)
const currentStepIndex = ref(0)
const isNavigating = ref(false)
const userName = ref('')
const activeMarkerId = ref(null)

export function useNavigation() {
  const locations = locationsData.locations

  const currentStep = computed(() => {
    if (!selectedLocation.value) return null
    return selectedLocation.value.steps[currentStepIndex.value] || null
  })

  const totalSteps = computed(() => {
    return selectedLocation.value?.steps?.length ?? 0
  })

  const progress = computed(() => {
    if (totalSteps.value === 0) return 0
    return ((currentStepIndex.value) / (totalSteps.value - 1)) * 100
  })

  const isLastStep = computed(() => {
    return currentStepIndex.value >= totalSteps.value - 1
  })

  function setUserName(name) {
    userName.value = name
  }

  function selectLocation(location) {
    selectedLocation.value = location
    currentStepIndex.value = 0
    activeMarkerId.value = location.id
  }

  function startNavigation() {
    isNavigating.value = true
    currentView.value = VIEW.AR
  }

  function nextStep() {
    if (currentStepIndex.value < totalSteps.value - 1) {
      currentStepIndex.value++
      speakStep()
    }
  }

  function prevStep() {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value--
    }
  }

  function speakStep() {
    if (!selectedLocation.value) return
    const step = currentStep.value
    if (!step || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(step.instruction + '. ' + step.landmark)
    utt.rate = 0.95
    utt.pitch = 1.05
    window.speechSynthesis.speak(utt)
  }

  function announceArrival() {
    if (!window.speechSynthesis || !selectedLocation.value) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(
      `You have arrived at ${selectedLocation.value.name}. ${selectedLocation.value.description}`
    )
    utt.rate = 0.9
    utt.pitch = 1.1
    window.speechSynthesis.speak(utt)
  }

  function goToView(view) {
    currentView.value = view
  }

  function resetNavigation() {
    selectedLocation.value = null
    currentStepIndex.value = 0
    isNavigating.value = false
    activeMarkerId.value = null
    currentView.value = VIEW.HOME
    window.speechSynthesis?.cancel()
  }

  function backToSelect() {
    currentStepIndex.value = 0
    isNavigating.value = false
    currentView.value = VIEW.SELECT
    window.speechSynthesis?.cancel()
  }

  return {
    currentView,
    selectedLocation,
    currentStepIndex,
    isNavigating,
    userName,
    activeMarkerId,
    locations,
    currentStep,
    totalSteps,
    progress,
    isLastStep,
    setUserName,
    selectLocation,
    startNavigation,
    nextStep,
    prevStep,
    speakStep,
    announceArrival,
    goToView,
    resetNavigation,
    backToSelect,
    VIEW
  }
}
