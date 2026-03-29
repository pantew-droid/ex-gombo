export const useTimer = () => {
  const timeLeft = ref(0)
  const isRunning = ref(false)
  const currentTaskId = ref<number | null>(null)
  const originalDuration = ref(0)

  let timerInterval: ReturnType<typeof setInterval> | null = null

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
    const seconds = timeLeft.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const startTimer = (taskId: number, duratedMinutes: number) => {
    if (isRunning.value) return
    if (timeLeft.value === 0 || currentTaskId.value !== taskId) {
      timeLeft.value = duratedMinutes * 60
      originalDuration.value = duratedMinutes
      currentTaskId.value = taskId
    }
  }
  isRunning.value = true

  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      completeSession()
    }
  }, 1000)

  const pauseTimer = () => {
    isRunning.value = false
    if (timerInterval) clearInterval(timerInterval)
  }

  const resetTimer = () => {
    pauseTimer()
    timeLeft.value = 0
    currentTaskId.value = null
  }

  const completeSession = async () => {
    pauseTimer()

    if (currentTaskId.value) {
      try {
        await db.table('session').add({ taskId: currentTaskId.value, duratedMinutes: originalDuration.value, completedAt: Date.now() })
        console.log('Sessions saubegardée qvec succès en local')
      } catch (e) {
        console.error('erreur lors de la sauvegarde de la session: ' + e)
      }
    }
    resetTimer()
  }

  onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
  })

  return {
    timeLeft, isRunning, formattedTime, startTimer, pauseTimer, resetTimer
  }
}
