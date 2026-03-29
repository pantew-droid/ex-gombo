<template>
  <UContainer>
    <UForm
      class="flex flex-col gap-4 w-85 mx-auto my-2 p-6 bg-transparent backdrop-blur-sm shadow-xl rounded-xl border border-amber-100 transition-all duration-300 hover:shadow-2xl"
      @submit="createModule"
    >
      <h1 class="text-2xl font-bold text-center text-amber-700 mb-2 animate-fade-in">
        Remplissez le formulaire pour créer un module
      </h1>

      <UInput
        v-model="moduleName"
        class="w-full bg-transparent"
        icon="i-lucide-pen"
        placeholder="Entrez le nom du module"
        required
      />

      <UInput
        v-model="creditsModule"
        class="w-full"
        type="number"
        required
        icon="i-lucide-arrow-down-0-1"
        placeholder="Entrez le credit de ce module"
      />

      <USelect
        v-model="colorModule"
        :color="colorModule.toString()"
        class="w-full"
        label="Couleur du module"
        icon="i-lucide-clipboard-check"
        :items="items"
        placeholder="Choisir le type de la tâche"
        required
      />

      <div class="flex justify-between mt-4">
        <UButton
          type="submit"
          size="xl"
          icon="i-lucide-plus"
          class="cursor-pointer font-bold bg-green-500 hover:bg-green-600 text-white transition-colors"
          @click="viewLoading = true"
        >
          Creer
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
  </UContainer>
</template>

<script setup lang="ts">
import { MatiereClass } from '~/types/MatiereClass'

const props = defineProps({
  onLog: {
    type: Function,
    required: true
  }
})

const items = ref([
  'primary', 'neutral', 'info', 'warning', 'error', 'success', 'secondary'
])
const colorModule = ref('primary')
const moduleName = ref('')
const creditsModule = ref(2)
const viewLoading = ref(false)
const viderForm = () => {
  moduleName.value = ''
  colorModule.value = 'primary'
  creditsModule.value = 2
}
const dal = new dbDAL()
let id: number = 0
const createModule = async () => {
  try {
    if (creditsModule.value <= 0) {
      const toast = useToast()
      toast.add({
        title: 'Erreur',
        color: 'error',
        description: 'Le credit d\'un module ne peut etre inferieur a 1',
        close: true,
        closeIcon: 'i-lucide-minimize-2'
      })
    } else {
      viewLoading.value = true
      const m = new MatiereClass(moduleName.value, colorModule.value, creditsModule.value)
      id = await dal.createMatiere(m)
      if (id != 0) {
        viewLoading.value = false
      }
      props.onLog()
      const toast = useToast()
      toast.add({
        title: 'Succes',
        color: 'info',
        description: 'Creation du module terminee avec success',
        close: true,
        closeIcon: 'i-lucide-minimize-2'
      })
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
