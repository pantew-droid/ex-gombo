<script setup lang="ts">
import { TaskClass } from '~/types/MatiereClass'

const { startTimer, pauseTimer, resetTimer } = useTimer()

const props = defineProps({
  task: {
    type: TaskClass,
    required: true
  }
})

const idTask = props.task.id
</script>

<template>
  <UContainer class="flex space-x-2">
    <UButton
      icon="i-lucide-play"
      class="cursor-pointer"
      size="xl"
      type="button"
      color="neutral"
      @click="startTimer(idTask!, 0)"
    />
    <UButton
      icon="i-lucide-pause"
      class="cursor-pointer"
      size="xl"
      type="button"
      color="secondary"
      @click="pauseTimer()"
    />
    <UButton
      color="warning"
      icon="i-lucide-circle-stop"
      class="cursor-pointer"
      size="xl"
      type="button"
      @click="resetTimer()"
    />
  </UContainer>
</template>
