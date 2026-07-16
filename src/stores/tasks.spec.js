import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTaskStore } from './tasks'

describe('useTaskStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('seeds sample tasks across columns', () => {
    const store = useTaskStore()

    expect(store.tasks.length).toBeGreaterThan(0)
    expect(store.tasksByStatus('todo').length).toBeGreaterThan(0)
    expect(store.tasksByStatus('in-progress').length).toBeGreaterThan(0)
    expect(store.tasksByStatus('done').length).toBeGreaterThan(0)
  })

  it('adds a task with trimmed fields', () => {
    const store = useTaskStore()
    const before = store.tasks.length

    store.addTask({
      title: '  Review PR  ',
      description: '  Check tests  ',
      priority: 'high',
      status: 'todo',
    })

    expect(store.tasks).toHaveLength(before + 1)
    const created = store.tasks.at(-1)
    expect(created.title).toBe('Review PR')
    expect(created.description).toBe('Check tests')
    expect(created.priority).toBe('high')
    expect(created.status).toBe('todo')
    expect(created.id).toBeTruthy()
  })

  it('updates and deletes a task', () => {
    const store = useTaskStore()
    const id = store.tasks[0].id

    store.updateTask(id, {
      title: 'Updated title',
      description: 'Updated description',
      priority: 'low',
    })

    expect(store.tasks.find((task) => task.id === id)).toMatchObject({
      title: 'Updated title',
      description: 'Updated description',
      priority: 'low',
    })

    store.deleteTask(id)
    expect(store.tasks.find((task) => task.id === id)).toBeUndefined()
  })

  it('moves a task between columns', () => {
    const store = useTaskStore()
    const id = store.tasks.find((task) => task.status === 'todo').id

    store.moveTask(id, 'done')
    expect(store.tasks.find((task) => task.id === id).status).toBe('done')

    store.moveTask(id, 'not-a-status')
    expect(store.tasks.find((task) => task.id === id).status).toBe('done')
  })

  it('filters tasks by priority through getters', () => {
    const store = useTaskStore()

    store.setPriorityFilter('high')
    expect(store.priorityFilter).toBe('high')
    expect(store.filteredTasks.every((task) => task.priority === 'high')).toBe(true)
    expect(
      store.tasksByStatus('todo').every((task) => task.priority === 'high'),
    ).toBe(true)

    store.setPriorityFilter('all')
    expect(store.filteredTasks).toHaveLength(store.tasks.length)
  })
})
