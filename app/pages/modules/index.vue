<script setup lang="ts">
import ModuleList from '~/components/modules/moduleList.vue'

const modules = ref()
const dal = new dbDAL()
const isOpen = ref(false)

onMounted(async () => {
  const results = dal.listMatiere()
  modules.value = results
})
</script>

<template>
  <UContainer>
    <br>
    <h1 class="text-3xl text-center text-green-600">
      Mes Modules
    </h1>
    <br>

    <p v-if="modules == null">
      Aucune matiere pour le moment. Commence par ajouter ton premier cours !
      <br>
      <UButton
        color="secondary"
        size="xl"
        class="cursor-pointer"
        variant="ghost"
        @click="isOpen = true"
      >
        Creer un module
      </UButton>
    </p>

    <UContainer v-else>
      <ModuleList />
    </UContainer>
  </UContainer>
</template>
