import { ref, onUnmounted } from 'vue'

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
      if (videoRef.value) {
        videoRef.value.srcObject = stream
        await videoRef.value.play()
      }
      cameraMode.value = 'live'
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
  }

  onUnmounted(() => stopCamera())

  return { videoRef, cameraActive, cameraError, cameraMode, startCamera, stopCamera }
}
