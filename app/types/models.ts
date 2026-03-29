export enum TypeTasks {
  REVISION, PROJECT, HOMEWORK
}

export enum TypeStatus {
  PENDING, IN_PROGRESS, COMPLETED
}

export enum TypePriority {
  LOW, MEDIUM, HIGH
}

// maths, histoire, info, etc...
export interface Matiere {
  id: number // primaty key
  name: string // nom de la Matiere
  color: string // code HEX pour l'UI
  credits: number // nombre de credits
  createdAt: Date // date de crétion
}

// peut être une tâche, des projets, des révisions, ...
export interface tasks {
  id: number // clé primaire
  moduleId: number // clé étrangère vers module
  title: string // titre de la tâche
  description?: string // description de la tâche
  typeTask: TypeTasks
  dueDate: Date // timespace de la date limite
  status: TypeStatus
  priority: TypePriority
}

// sessions de travail chnonométrées-style Pomodoro
export interface sessions {
  id: number // primary key
  taskId: number // clé étrangère vers la tâche
  durationMinutes: number // durée de la session
  completedAt: number // timestamp de fin
}
