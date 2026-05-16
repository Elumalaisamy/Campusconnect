import { ref, onUnmounted, nextTick } from 'vue'

export function useCamera() {
  const videoRef = ref(null)
  const streamRef = ref(null)
  const cameraActive = ref(false)
  const cameraError = ref(null)
  const cameraMode = ref('simulated') // 'live' | 'simulated'

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      cameraMode.value = 'simulated'
      cameraActive.value = true
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      })
      streamRef.value = stream
      cameraMode.value = 'live'
      await nextTick()
      if (videoRef.value) {
        videoRef.value.srcObject = stream
        await videoRef.value.play()
      }
      cameraActive.value = true
      cameraError.value = null
    } catch (err) {
      console.warn('Camera unavailable, using simulation:', err.message)
      cameraMode.value = 'simulated'
      cameraActive.value = true
      cameraError.value = err.message
    }
  }

  function stopCamera() {
    if (streamRef.value) {
      streamRef.value.getTracks().forEach(t => t.stop())
      streamRef.value = null
    }
    if (videoRef.value) {
      videoRef.value.srcObject = null
    }
    cameraActive.value = false
    cameraMode.value = 'simulated'
  }

  onUnmounted(() => stopCamera())

  return { videoRef, cameraActive, cameraError, cameraMode, startCamera, stopCamera }
}
