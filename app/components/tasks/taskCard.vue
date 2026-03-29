<template>
  <UCard class="p-4 shadow-md hover:shadow-lg transition-all w-xs m-2">
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span
            :class="couleur"
            class="w-3 h-3 rounded-full"
          />
          <h2 class="font-bold text-xl text-shadow-white">
            {{ task.title }}
          </h2>
        </div>
        <span class="text-sm text-gray-500 italic">
          {{ TypePriority[task.typeTask] }}
        </span>
      </div>
    </template>

    <!-- Body -->
    <div class="space-y-2 mt-2">
      <p class="text-gray-700">
        {{ task.description }}
      </p>
      <p>
        <span class="font-semibold">Statut : </span>
        <span class="text-blue-600">{{ TypeStatus[task.status] }}</span>
      </p>
      <p>
        <span class="font-semibold">Date de rendu : </span>
        <span class="text-gray-600">
          {{ task.dueDate }}
        </span>
      </p>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex items-center justify-between mt-4">
        <span class="text-xs text-gray-400">Module #{{ task.moduleId }}</span>
        <div class="flex gap-2">
          <UTooltip
            text="Supprimer cette tache"
          >
            <UButton
              class="cursor-pointer"
              icon="i-lucide-trash-2"
              color="warning"
              variant="ghost"
              @click="deleteTask(task.id!)"
            />
          </UTooltip>
          <UTooltip text="Changer de statut">
            <UButton
              class="cursor-pointer"
              icon="i-lucide-folder-check"
              color="success"
              variant="ghost"
              @click="gradeTask()"
            />
          </UTooltip>
          <UTooltip text="Modifier cette tache">
            <UButton
              class="cursor-pointer"
              icon="i-lucide-pen"
              color="primary"
              variant="ghost"
              @click="editTask()"
            />
          </UTooltip>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { TaskClass } from '~/types/MatiereClass'
import { TypePriority, TypeStatus } from '~/types/models'

const props = defineProps({
  task: {
    type: TaskClass,
    required: true
  },
  onLog: {
    type: Function,
    required: true
  }
})

const couleur = computed(() => {
  const p = props.task.priority.toString().toUpperCase()
  if (p === 'HIGH' || p === '2') return 'bg-red-500' // Rouge pour Urgent
  if (p === 'LOW' || p === '0') return 'bg-green-500' // Vert pour Faible
  return 'bg-orange-500' // Orange pour Medium
})

const dal = new dbDAL()

// const formatedDate = computed(() => {
//   const d = new Date(props.task.dueDate)

//   if (isNaN(d.getTime())) return 'Date non définie'

//   return d.toLocaleDateString('fr-FR', {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   })
// })

const deleteTask = async (id: number) => {
  try {
    await dal.deleteTask(id)
  } catch (error) {
    console.log(error)
  }
  props.onLog()
}

const emit = defineEmits<{
  (e: 'open', data: TaskClass): void
}>()

const editTask = async () => {
  emit('open', props.task)
}

const gradeTask = async () => {
  try {
    const nextStatus = () => {
      if (props.task.status.toString() == TypeStatus.IN_PROGRESS.toString()) {
        return TypeStatus.COMPLETED
      }
      if (props.task.status.toString() == TypeStatus.PENDING.toString()) {
        return TypeStatus.IN_PROGRESS
      }
      return TypeStatus.PENDING
    }
    const nx = nextStatus()

    await dal.updateTask(new TaskClass(props.task.moduleId, props.task.title, props.task.typeTask, props.task.dueDate, nx, props.task.priority, props.task.description, props.task.id))
  } catch (error) {
    console.error(error)
  }
  props.onLog()
}
</script>
