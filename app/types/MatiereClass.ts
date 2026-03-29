import { TypePriority, TypeStatus, TypeTasks } from './models'

export class MatiereClass {
  public id?: number
  public name: string = ''
  public color: string = 'green'
  public credits: number = 0
  public readonly createdAt

  constructor(name: string, color: string, credits: number, id?: number) {
    this.id = id
    this.name = name
    this.color = color
    this.credits = credits
    this.createdAt = Date.now()
  }
}

export class TaskClass {
  public id?: number
  public moduleId: number = 1
  public title: string = ''
  public description?: string
  public typeTask: TypeTasks = TypeTasks.HOMEWORK
  public dueDate: Date = new Date()
  public status: TypeStatus = TypeStatus.PENDING
  public priority: TypePriority = TypePriority.LOW

  constructor(moduleId: number, title: string, typeTask: TypeTasks, dueDate: Date, status: TypeStatus, priority: TypePriority, description?: string, id?: number) {
    this.moduleId = moduleId
    this.title = title
    this.typeTask = typeTask
    this.dueDate = dueDate
    this.status = status
    this.priority = priority
    this.id = id
    this.description = description
  }
}

export class SessionClass {
  public id?: number
  public taskId: number = 1
  public durationMinutes: number = 0
  public completedAt: number = 0

  constructor(taskId: number, duration: number, completedAt: number, id?: number) {
    this.id = id
    this.durationMinutes = duration
    this.taskId = taskId
    this.completedAt = completedAt
  }
}
