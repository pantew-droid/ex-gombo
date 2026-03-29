<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup>
import { TaskClass } from './types/MatiereClass'
import { TypePriority, TypeStatus, TypeTasks } from './types/models'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'TaskMaster Pro'
const description = 'Application de gestion de tâches personnelles avec suivi du temps avec un stockage local, une interface intuitive, un système multilingue, et un fonctionnement hors ligne'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})

const randomTask = new TaskClass(12, 'Random', TypeTasks.REVISION, Date.now(), TypeStatus.PENDING, TypePriority.HIGH, 12, 'juste pour tester')
// onMounted(() => {
//   app.use(pinia)
// })

// app.use(pinia)
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="#">
          <h1 class="text-4xl text-green-600">TaskMaster Pro</h1>
        </NuxtLink>
      </template>

      <template #title>
        <h1>TaskMaster Pro</h1>
      </template>

      <p>Hey <span class="text-2xl text-blue-700 font-bold">Brallam</span></p>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
      <!-- <TaskCard :task="randomTask" /> -->
      <ClientOnly>
        <!-- <TimerWidget /> -->
      </ClientOnly>
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left />

      <template #right />
    </UFooter>
  </UApp>
</template>
