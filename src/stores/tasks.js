import { defineStore } from 'pinia'

export const STATUSES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

export const PRIORITIES = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]

const seedTasks = [
  {
    id: '1',
    title: 'Set up project board',
    description: 'Define columns and seed a few sample tasks.',
    priority: 'high',
    status: 'todo',
  },
  {
    id: '2',
    title: 'Draft API contract',
    description: 'Sketch request/response shapes for task endpoints.',
    priority: 'medium',
    status: 'todo',
  },
  {
    id: '3',
    title: 'Implement Pinia store',
    description: 'Centralize tasks, filter state, and derived getters.',
    priority: 'high',
    status: 'in-progress',
  },
  {
    id: '4',
    title: 'Style empty states',
    description: 'Make empty columns and filtered results clear.',
    priority: 'low',
    status: 'in-progress',
  },
  {
    id: '5',
    title: 'Write README',
    description: 'Document setup, decisions, and follow-ups.',
    priority: 'medium',
    status: 'done',
  },
  {
    id: '6',
    title: 'Smoke-test on mobile',
    description: '',
    priority: 'low',
    status: 'done',
  },
]

function createId() {
  return crypto.randomUUID()
}

export const STORE_PERSIST_KEY = 'ototrak-tasks'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: seedTasks.map((task) => ({ ...task })),
    priorityFilter: 'all',
  }),

  getters: {
    filteredTasks(state) {
      if (state.priorityFilter === 'all') {
        return state.tasks
      }

      return state.tasks.filter((task) => task.priority === state.priorityFilter)
    },

    tasksByStatus() {
      return (status) => this.filteredTasks.filter((task) => task.status === status)
    },
  },

  actions: {
    addTask({ title, description = '', priority = 'medium', status = 'todo' }) {
      this.tasks.push({
        id: createId(),
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
      })
    },

    updateTask(id, { title, description = '', priority }) {
      const task = this.tasks.find((item) => item.id === id)
      if (!task) return

      task.title = title.trim()
      task.description = description.trim()
      task.priority = priority
    },

    deleteTask(id) {
      this.tasks = this.tasks.filter((task) => task.id !== id)
    },

    moveTask(id, status) {
      const task = this.tasks.find((item) => item.id === id)
      if (!task) return
      if (!STATUSES.some((item) => item.id === status)) return

      task.status = status
    },

    setPriorityFilter(priority) {
      this.priorityFilter = priority
    },

    hydrate({ tasks, priorityFilter }) {
      if (Array.isArray(tasks)) {
        this.tasks = tasks
      }
      if (typeof priorityFilter === 'string') {
        this.priorityFilter = priorityFilter
      }
    },
  },

  persist: {
    key: STORE_PERSIST_KEY,
    paths: ['tasks', 'priorityFilter'],
  },
})
