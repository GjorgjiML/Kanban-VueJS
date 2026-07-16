<script setup>
import { ref } from 'vue'
import KanbanColumn from './components/KanbanColumn.vue'
import TaskForm from './components/TaskForm.vue'
import { useStoreSync } from './composables/useStoreSync'
import { useTaskFilter } from './composables/useTaskFilter'
import { PRIORITIES, useTaskStore } from './stores/tasks'

const store = useTaskStore()
useStoreSync()

const {
  priorityFilter,
  columns,
  hasFilteredResults,
  isFiltering,
  setPriorityFilter,
} = useTaskFilter()

const showAddForm = ref(false)

function onAddTask(payload) {
  store.addTask(payload)
}

function onFilterChange(event) {
  setPriorityFilter(event.target.value)
}
</script>

<template>
  <div class="app">
    <header class="app__header">
      <div class="app__brand">
        <p class="app__eyebrow">OtoTrak</p>
        <h1 class="app__title">Task Board</h1>
        <p class="app__subtitle">
          Track work across To Do, In Progress, and Done. Drag cards between columns or use Move to…
        </p>
      </div>

      <div class="app__toolbar">
        <label class="filter-control">
          <span>Priority</span>
          <select :value="priorityFilter" @change="onFilterChange">
            <option value="all">All priorities</option>
            <option
              v-for="item in PRIORITIES"
              :key="item.id"
              :value="item.id"
            >
              {{ item.label }}
            </option>
          </select>
        </label>

        <button
          type="button"
          class="btn btn--primary"
          @click="showAddForm = !showAddForm"
        >
          {{ showAddForm ? 'Close form' : 'Add task' }}
        </button>
      </div>
    </header>

    <section v-if="showAddForm" class="app__add-panel" aria-label="Add a new task">
      <h2 class="app__panel-title">New task</h2>
      <TaskForm v-model:open="showAddForm" show-status @submit="onAddTask" />
    </section>

    <p v-if="isFiltering && !hasFilteredResults" class="app__filter-empty">
      No tasks match the selected priority. Try another filter or clear it.
    </p>

    <main class="board">
      <KanbanColumn
        v-for="column in columns"
        :key="column.id"
        :title="column.label"
        :status="column.id"
        :tasks="column.tasks"
      />
    </main>
  </div>
</template>
