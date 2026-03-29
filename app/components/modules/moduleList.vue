<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <UContainer>
    <UTable
      v-model:sorting="sorting"
      loading-color="secondary"
      loading-animation="swing"
      :data="modules"
      :columns="colums"
      class="flex-1 shadow-md hover:translate-1 transition-all duration-700 m-1"
      :loading="modules == undefined ? true : false"
      :ui="{ tr: 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' }"
      @row-click="goToModule"
    >
      <template #empty>
        <p class="text-2xl font-bold text-center text-amber-700">
          Aucune donnee pour l'instant
        </p>
      </template>
    </UTable>

    <USlideover
      side="left"
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
        label="Ajouter un module"
        color="info"
        variant="ghost"
        size="xl"
        class="cursor-pointer m-2"
      />
      <template #header="{ close }">
        <h1 class="text-xl font-bold">
          Ajout d'un nouveau module
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
        <ModuleAdd :on-log="recupList" />
      </template>
      <template #footer>
        <p>Remplir ce formulaire pour ajouter un nouveau module</p>
      </template>
    </USlideover>
  </UContainer>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import ModuleAdd from './ModuleAdd.vue'

const dal = new dbDAL()
const modules = ref()
const UButton = resolveComponent('UButton')

const colums: TableColumn<{ 'id': number, 'label': string, 'color': string, 'credit': number, 'date_ajout': Date, 'Nombre de taches': number }>[] = [
  {
    accessorKey: 'id'
  },
  {
    accessorKey: 'label',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Label',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'color'
  },
  {
    accessorKey: 'credit',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Credit',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'Date d\'ajout'
  },
  {
    accessorKey: 'Nombre de taches',
    header: 'Tâches'
  }
]

const sorting = ref([
  {
    id: 'label',
    desc: false
  }
])

const recupList = async () => {
  try {
    const results = await dal.listMatiere()

    // On utilise Promise.all pour récupérer les comptes de tâches en parallèle
    modules.value = await Promise.all(results.map(async (m) => {
      // On appelle la méthode getNumberTask de ton DAL pour chaque module
      const count = await dal.getNumberTask(m.id)

      return {
        'id': m.id,
        'label': m.label,
        'color': m.color,
        'credit': m.credit,
        'Date d\'ajout': new Date(m.date_ajout).toLocaleDateString('fr-Fr'),
        'Nombre de taches': count // On assigne le résultat à la colonne correspondante
      }
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des modules:', error)
  }
}

const router = useRouter()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const goToModule = (row: any) => {
  console.log('Clic sur la ligne, id = ', row.id)
  router.push(`/modules/${row.id}`)
}

onMounted(async () => {
  await recupList()
})

defineExpose({ recupList })
</script>

<style lang="css">
:deep(.u-table-row:hover){
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
