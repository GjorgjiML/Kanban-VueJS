<script setup>
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'
import { useTaskStore } from '../stores/tasks'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  tasks: {
    type: Array,
    required: true,
  },
})

const store = useTaskStore()
const isDragOver = ref(false)

function onDragOver(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  isDragOver.value = true
}

function onDragLeave(event) {
  if (event.currentTarget.contains(event.relatedTarget)) return
  isDragOver.value = false
}

function onDrop(event) {
  event.preventDefault()
  isDragOver.value = false

  const taskId =
    event.dataTransfer.getData('application/x-task-id') ||
    event.dataTransfer.getData('text/plain')

  if (!taskId) return
  store.moveTask(taskId, props.status)
}
</script>

<template>
  <section
    class="kanban-column"
    :class="{ 'kanban-column--drag-over': isDragOver }"
    :data-status="status"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <header class="kanban-column__header">
      <h2 class="kanban-column__title">{{ title }}</h2>
      <span class="kanban-column__count">{{ tasks.length }}</span>
    </header>

    <TransitionGroup name="task-list" tag="div" class="kanban-column__body">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @update="(id, payload) => store.updateTask(id, payload)"
        @delete="(id) => store.deleteTask(id)"
        @move="(id, target) => store.moveTask(id, target)"
      />
    </TransitionGroup>

    <p v-if="tasks.length === 0" class="kanban-column__empty">
      No tasks in this column
    </p>
  </section>
</template>
