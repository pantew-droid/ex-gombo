<template>
  <UContainer>
    <UCard
      v-if="module"
      class="p-4 shadow-md hover:shadow-lg transition-all w-full m-2"
    >
      <!-- Header -->
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span
              :style="{ backgroundColor: module?.color }"
              class="w-3 h-3 rounded-full"
            />
            <h2 class="font-bold text-xl text-shadow-white">
              {{ module?.name }}
            </h2>
          </div>
          <span class="text-sm text-gray-500 italic">
            {{ module?.credits }}
          </span>
        </div>
      </template>

      <template #default>
        <span
          :color="module?.color"
          :style="{ backgroundColor: module?.color }"
        />
      </template>

      <!-- Footer -->
      <template #footer>
        <div class="flex items-center justify-between mt-4">
          <span class="text-xs text-gray-400">Module #{{ module?.id }}</span>
          <span class="text-xs text-gray-400">{{ new Date(parseInt(module?.createdAt.toString()!)).toLocaleDateString('fr-Fr') }}</span>
        </div>
      </template>
    </UCard>
    <div
      v-else
      class="p-4 shadow-md hover:shadow-lg transition-all w-full m-2"
    >
      <h1 class="text-center text-2xl text-bold">
        Aucun module trouve 😣 ...
      </h1>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id!
const dal = new dbDAL()
const module = await dal.getMatiere(parseInt(id.toString()))
</script>
