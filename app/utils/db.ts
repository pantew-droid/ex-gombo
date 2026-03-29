import Dexie from 'dexie'
import { MatiereClass, SessionClass, TaskClass } from '~/types/MatiereClass'

export const db = new Dexie('StudySyncDB')

if (import.meta.client) {
  db.version(2).stores({
    matiere: '++id,name,color,credits,createdAt',
    task: '++id,moduleId,title,description,typeTask,dueDate,status,priority',
    session: '++id,taskId,durationMinutes,completedAt'
  })

  db.table('matiere').mapToClass(MatiereClass)
  db.table('task').mapToClass(TaskClass)
  db.table('session').mapToClass(SessionClass)
}
