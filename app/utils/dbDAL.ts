import { MatiereClass, type SessionClass, type TaskClass } from '~/types/MatiereClass'
import { db } from './db'

export class dbDAL {
  public async createTask(t: TaskClass): Promise<number> {
    let toReturn: number = 0
    try {
      await db.table('task').add(t).then((id) => {
        toReturn = parseInt(id.toString())
      })
    } catch (e) {
      console.log(e)
    }
    return toReturn
  }

  public async testerMatiere() {
    const m = new MatiereClass('Maths', 'primary', 3)
    await db.table('matiere').add(m)
  }

  public async deleteTask(i: number): Promise<void> {
    try {
      db.table('task').delete(i)
    } catch (e) {
      console.log(e)
    }
  }

  public async countTask(): Promise<number> {
    let nbre: number = 0
    try {
      nbre = await db.table('task').count()
    } catch (e) {
      console.log(e)
    }
    return nbre
  }

  public async listTask(): Promise<Array<TaskClass>> {
    let listeTasks: Array<TaskClass> = new Array<TaskClass>()
    try {
      listeTasks = await db.table('task').toArray()
    } catch (e) {
      console.log(e)
    }
    return listeTasks
  }

  public async getTask(id: number): Promise<TaskClass | null> {
    try {
      let task: TaskClass | null = null
      task = await db.table('task').get(id)
      return task
    } catch (e) {
      console.log(e)
      return null
    }
  }

  public async updateTask(task: TaskClass) {
    try {
      const t = await this.getTask(task.id!)
      if (t) {
        await db.table('task').put(task).then(() => {
          console.log('Enregistrement mis a jour')
          return task.id
        }).catch(error => console.error('Erreur: ', error))
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async getMatiereId(id: number): Promise<number | null> {
    try {
      let idMatiere: number | null = null
      await db.table('task').get(id).then(moduleId => idMatiere = moduleId)
      return idMatiere
    } catch (e) {
      console.log(e)
      return null
    }
  }

  public async createMatiere(t: MatiereClass): Promise<number> {
    let toReturn: number = 0
    try {
      await db.table('matiere').add(t).then((id) => {
        toReturn = parseInt(id.toString())
      })
    } catch (e) {
      console.log(e)
    }
    return toReturn
  }

  public async deleteMatiere(i: number): Promise<void> {
    try {
      db.table('matiere').delete(i)
    } catch (e) {
      console.log(e)
    }
  }

  public async countMatiere(): Promise<number> {
    let nbre: number = 0
    try {
      nbre = await db.table('matiere').count()
    } catch (e) {
      console.log(e)
    }
    return nbre
  }

  public async listMatiere(): Promise<Array<{ id: number, label: string, color: string, credit: number, date_ajout: Date }>> {
    const matieres = await db.table('matiere').toArray()
    return matieres.map(m => ({
      id: m.id,
      label: m.name,
      color: m.color,
      credit: m.credits,
      date_ajout: m.createdAt
    }))
  }

  public async listIdMatiere(): Promise<Array<{ label: string, value: number }>> {
    const matieres = await db.table('matiere').toArray()
    return matieres.map(m => ({
      label: m.name,
      value: m.id!
    }))
  }

  public async getMatiere(id: number): Promise<MatiereClass | null> {
    try {
      return await db.table('matiere').get(id) ?? null
    } catch (e) {
      console.log(e)
      return null
    }
  }

  public async listFromMatiereAllTask(id: number): Promise<Array<MatiereClass>> {
    let listeMatieres: Array<MatiereClass> = new Array<MatiereClass>()
    try {
      listeMatieres = await db.table('matiere').get(id)
    } catch (e) {
      console.log(e)
    }
    return listeMatieres
  }

  public async getNumberTask(id: number): Promise<number> {
    return await db.table('task').where({ moduleId: id }).count()
  }

  public async getTimePassedForThisTask(id: number): Promise<number> {
    try {
      let timesPassed: number = 0

      // Correction : Utiliser .where().equals().toArray() pour récupérer TOUTES les sessions
      const sessions = await db.table('session')
        .where('taskId')
        .equals(id)
        .toArray()

      sessions.forEach((session) => {
        timesPassed += session.durationMinutes
      })

      return timesPassed
    } catch (e) {
      console.error('Erreur lors de la récupération du temps :', e)
      return 0
    }
  }

  public async getAllSessionForATask(id: number): Promise<Array<SessionClass> | null> {
    try {
      return await db.table('session').where({ taskId: id }).toArray()
    } catch (e) {
      console.log(e)
      return null
    }
  }

  public async getAllSessions(): Promise<Array<SessionClass> | null> {
    try {
      return await db.table('session').toArray()
    } catch (e) {
      console.log(e)
      return null
    }
  }

  public async getSession(id: number): Promise<SessionClass | null> {
    try {
      return await db.table('session').get(id)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  public async getAllTaskForAModule(id: number): Promise<number> {
    return await db.table('task').where({ moduleId: id }).count()
  }
}
