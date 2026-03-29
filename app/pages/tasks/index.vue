<template>
  <UContainer>
    <div class="inline-flex gap-4">
      <div
        v-for="task in tasks"
        :key="task.id"
      >
        <TaskCard
          :on-log="lister"
          :task="task"
          @open="handleOpenSlideOver"
        />
      </div>
    </div>
    <br>

    <USlideover
      v-model:open="isOpen"
      side="right"
      title="Slideover with close button"
      :close="{
        color: 'info',
        variant: 'outline',
        class: 'rounded-full cursor-pointer'
      }"
      close-icon="i-lucide-x"
      :transition="true"
      :overlay="false"
      :modal="true"
      :dismissible="false"
      :ui="{ footer: 'justify-end' }"
    >
      <UButton
        label="Ajouter une tache"
        color="info"
        variant="ghost"
        size="xl"
        class="cursor-pointer m-2"
        @click="selectedData = undefined"
      />
      <template #header="{ close }">
        <h1 class="text-xl font-bold">
          Ajout d'une nouvelle tache
        </h1>
        <UButton
          label="Cancel"
          icon="i-lucide-x"
          color="warning"
          class="cursor-pointer ml-10"
          variant="outline"
          @click="close"
        />
      </template>
      <template #body>
        <TaskForm
          :on-log="lister"
          :task="selectedData"
        />
      </template>
      <template #footer>
        <p class="text-justify">
          Remplir ce formulaire pour ajouter une tache ou la modifier
        </p>
      </template>
    </USlideover>
  </UContainer>
</template>

<script setup lang="ts">
import TaskCard from '~/components/tasks/taskCard.vue'
import TaskForm from '~/components/tasks/taskForm.vue'
import type { TaskClass } from '~/types/MatiereClass'

const dal = new dbDAL()
const tasks = ref()
const isOpen = ref(false)
const selectedData = ref<TaskClass | undefined>(undefined)

const lister = async () => {
  const response = await dal.listTask()
  tasks.value = response
}

function handleOpenSlideOver(d: TaskClass) {
  console.log('Données reçues :', d)
  selectedData.value = d
  setTimeout(() => {
    isOpen.value = true
  }, 50)
}

onMounted(async () => {
  await lister()
})
</script>
