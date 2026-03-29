<template>
  <UContainer>
    <h2>Bonjour, pret pour une nouvelle session ?</h2>
    {{ new Date(Date.now()).toLocaleDateString('fr-Fr') }}
    <br><br>
    <USeparator label="KPI" />
    <br>
    <UCard
      class="m-5 bg-gray-800"
      icon="i-lucide-pen"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center p-3 mr-2 gap-2 bg-gray-900 text-blue-400">
          <UIcon name="i-lucide-layout-list" />
        </div>
        <div class="flex items-center gap-2">
          <div>
            <p class="text-gray-600">
              Taches totales du jour
            </p><br>
            <p class="font-bold text-4xl text-white">
              {{ nbTaches }}
            </p>
          </div>
        </div>
      </div>
    </UCard>

    <UCard
      class="m-5 bg-gray-800"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center p-3 mr-2 gap-2 bg-gray-900 text-purple-800">
          <UIcon name="i-lucide-clock" />
        </div>
        <div class="flex items-center gap-2">
          <div>
            <p class="text-gray-600">
              Temps total des sessions du jour
            </p><br>
            <p class="font-bold text-4xl text-white">
              {{ timePassed }}
            </p>
          </div>
        </div>
      </div>
    </UCard>
    <UCard
      class="m-5 bg-gray-800"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center p-3 mr-2 gap-2 bg-gray-900 text-green-800">
          <UIcon name="i-lucide-badge-check" />
        </div>
        <div class="flex items-center gap-2">
          <div>
            <p class="text-gray-600">
              Terminees
            </p><br>
            <p class="font-bold text-4xl text-white">
              {{ pourcent }}%
            </p>
          </div>
        </div>
      </div>
    </UCard>
    <br><br>

    <USeparator label="Focus du jour" />
    <br>
    <UTable :data="tachesUrgentes">
      <template #empty>
        <h1 class="text-center text-cyan-300">
          No task with high priority
        </h1>
      </template>
    </UTable>
  </UContainer>
</template>

<script setup lang="ts">
import { TypePriority, TypeStatus } from '~/types/models'

const dal = new dbDAL()
const nbTaches = ref(0)
const timePassed = ref(0) // Crucial : initialisé à 0
const pourcent = ref(0)
const tachesUrgentes = ref<any[]>([]) // Typage pour éviter l'erreur 'never'

const useCurrent = useCurrentWeek()

onMounted(async () => {
  // Récupération des données
  const results = await dal.listTask()
  const matieres = await dal.listMatiere()

  // 1. Filtrage des tâches du jour (Date actuelle sans l'heure)
  const aujourdhui = new Date()
  aujourdhui.setHours(0, 0, 0, 0)

  const tachesDuJour = results.filter((t) => {
    const dateTache = new Date(t.dueDate)
    dateTache.setHours(0, 0, 0, 0)
    return dateTache.getTime() === aujourdhui.getTime()
  })

  nbTaches.value = tachesDuJour.length

  // 2. Calcul du temps passé (Correction de la boucle async)
  let totalMinutes = 0
  // On utilise for...of pour attendre chaque résultat de la base de données
  for (const t of tachesDuJour) {
    if (t.id) {
      const minutes = await dal.getTimePassedForThisTask(t.id)
      totalMinutes += minutes
    }
  }
  timePassed.value = totalMinutes

  // 3. Calcul du pourcentage (Correction du calcul .length)
  const tachesSemaine = results.filter(t => useCurrent.isDateInCurrentWeek(t.dueDate))
  const termineesSemaine = tachesSemaine.filter(t =>
    t.status.toString() === TypeStatus.COMPLETED.toString()
  )

  if (tachesSemaine.length > 0) {
    pourcent.value = Math.round((termineesSemaine.length / tachesSemaine.length) * 100)
  } else {
    pourcent.value = 0
  }

  // 4. Focus du jour (Tâches à priorité HAUTE)
  const urgentTasks = results.filter(t => t.priority.toString() === TypePriority.HIGH.toString())

  tachesUrgentes.value = urgentTasks.map((t) => {
    const matiere = matieres.find(m => m.id === t.moduleId)
    return {
      Nom: t.title,
      Tag: matiere ? matiere.label : 'Général',
      Priorite: t.priority
    }
  })
})
</script>
