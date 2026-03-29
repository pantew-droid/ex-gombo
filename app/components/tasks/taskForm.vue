<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'
import { ref } from 'vue'
import { TaskClass } from '~/types/MatiereClass'
import { TypePriority, TypeStatus, TypeTasks } from '~/types/models'

const titleTask = ref('')
const descriptionTask = ref<string | undefined>('')
const props = defineProps({
  task: {
    type: TaskClass,
    required: false
  },
  onLog: {
    type: Function,
    required: true
  }
})

// const route = useRoute()
// const taskId = computed(() => route.params.id)

// On initialise avec une liste vide pour éviter les erreurs au rendu serveur
const matieres = ref<SelectItem[]>([])
const items = ref<SelectItem[]>([
  TypeTasks[0]!.toString(),
  TypeTasks[1]!.toString(),
  TypeTasks[2]!.toString()
])
const itemsStatus = ref<SelectItem[]>([
  TypeStatus[0]!.toString(),
  TypeStatus[1]!.toString(),
  TypeStatus[2]!.toString()
])
const itemsPriority = ref<SelectItem[]>([
  TypePriority[0]!.toString(),
  TypePriority[1]!.toString(),
  TypePriority[2]!.toString()
])
const typeTask = ref(TypeTasks[0]?.toString())
const matiere = ref('')
const statut = ref(TypeStatus[0]?.toString())
const priority = ref(TypePriority[0]?.toString())
const dateDue = ref(new Date().toISOString())

const dal = new dbDAL()
const textSubmit = computed(() => {
  return props.task ? 'Mettre a jour' : 'Creer'
})
const viewLoading = ref(false)

const viderForm = () => {
  titleTask.value = ''
  descriptionTask.value = ''
  dateDue.value = ''
}

const CreateOrUpdate = async () => {
  try {
    viewLoading.value = true
    const selectedType = TypeTasks[typeTask.value as keyof typeof TypeTasks]
    const selectedStatut = TypeStatus[statut.value as keyof typeof TypeStatus]
    const selectedPriority = TypePriority[priority.value as keyof typeof TypePriority]

    // On passe l'ID si on est en mode édition (8ème paramètre de ton constructeur apparemment)
    const taskId = props.task ? props.task.id : undefined

    const newTask = new TaskClass(
      parseInt(matiere.value),
      titleTask.value,
      selectedType,
      new Date(dateDue.value),
      selectedStatut,
      selectedPriority,
      descriptionTask.value,
      taskId
    )

    const dal = new dbDAL()

    // Logique de séparation Création / Mise à jour
    if (props.task && props.task.id) {
      await dal.updateTask(newTask)
    } else {
      await dal.createTask(newTask)
    }

    viewLoading.value = false
    const toast = useToast()
    toast.add({
      title: props.task ? 'Mise à jour de la tâche' : 'Création de la tâche',
      color: 'primary',
      closeIcon: 'i-lucide-x',
      description: props.task ? 'Tâche mise à jour avec succès' : 'Création réussie',
      close: true
    })

    viderForm()

    props.onLog() // Cela rafraîchira la liste dans le parent
  } catch (error) {
    console.log(error)
    // ... (gestion de l'erreur du toast) ...
  }
}

// On écoute les changements de la prop task pour repeupler le formulaire
// à chaque fois que tu cliques sur une nouvelle carte
watch(() => props.task, (newTask) => {
  if (newTask) {
    titleTask.value = newTask.title
    descriptionTask.value = newTask.description
    statut.value = TypeStatus[newTask.status]
    typeTask.value = TypeTasks[newTask.typeTask]
    priority.value = TypePriority[newTask.priority]
    dateDue.value = newTask.dueDate.getTime().toString()
    matiere.value = newTask.moduleId.toString()
  } else {
    viderForm()
  }
}, { immediate: true }) // immediate: true exécute le watch dès le rendu du composant

// Tu peux garder onMounted juste pour charger les matières
onMounted(async () => {
  try {
    const result = await dal.listIdMatiere()
    matieres.value = result.map(m => ({
      label: m.label,
      value: m.value.toString()
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des matières:', error)
  }
})
</script>

<template>
  <UForm
    class="flex flex-col gap-4 w-xs mx-auto my-8 p-6 bg-transparent backdrop-blur-sm shadow-xl rounded-xl border border-amber-100 transition-all duration-300 hover:shadow-2xl"
    @submit="CreateOrUpdate"
  >
    <h1 class="text-2xl font-bold text-center text-amber-700 mb-2 animate-fade-in">
      Validez les informations pour créer ou modifier cette tâche
    </h1>

    <UInput
      v-model="titleTask"
      class="w-full bg-transparent"
      icon="i-lucide-pen"
      placeholder="Entrez le titre de la tâche"
      required
    />

    <UInput
      v-model="descriptionTask"
      class="w-full"
      icon="i-lucide-pen"
      placeholder="Entrez la description de la tâche (facultatif)"
    />

    <USelect
      v-model="typeTask"
      class="w-full"
      icon="i-lucide-clipboard-check"
      :items="items"
      placeholder="Choisir le type de la tâche"
      required
    />

    <USelect
      v-if="matieres.length > 0"
      v-model="matiere"
      :items="matieres"
      icon="i-lucide-package"
      placeholder="Choisir une matière"
      class="w-full"
      required
    />
    <p
      v-else
      class="text-sm text-gray-500 text-center py-2"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="animate-spin inline-block mr-1"
      />
      Chargement des matières...
    </p>

    <USelect
      v-model="statut"
      class="w-full"
      :items="itemsStatus"
      icon="i-lucide-circle-dashed"
      placeholder="Sélectionner le statut de la tâche"
      required
    />

    <USelect
      v-model="priority"
      class="w-full"
      :items="itemsPriority"
      icon="i-lucide-flag"
      placeholder="Sélectionner la priorité de la tâche"
      required
    />

    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700 ml-1">Date de rendu</label>
      <UInputDate
        required
        icon="i-lucide-calendar"
        class="w-full"
      />
    </div>

    <div class="flex justify-between mt-4">
      <UButton
        type="submit"
        size="xl"
        icon="i-lucide-plus"
        class="cursor-pointer font-bold bg-green-500 hover:bg-green-600 text-white transition-colors"
        @click="viewLoading = true"
      >
        {{ textSubmit }}
      </UButton>
      <UButton
        type="button"
        color="warning"
        size="xl"
        icon="i-lucide-eraser"
        class="cursor-pointer font-bold hover:bg-amber-500 hover:text-white transition-colors"
        @click="viderForm"
      >
        Vider
      </UButton>
    </div>

    <UOverlayProvider v-if="viewLoading">
      <UProgress
        animation="elastic"
        class="mt-4"
      />
    </UOverlayProvider>
  </UForm>
</template>

<style>
/* Animation légère pour le titre */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-100px); }
  to { opacity: 1; transform: translateY(100px); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style>
