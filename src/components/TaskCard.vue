<script setup>
import { computed, ref } from 'vue'
import PriorityBadge from './PriorityBadge.vue'
import TaskForm from './TaskForm.vue'
import { STATUSES, useTaskStore } from '../stores/tasks'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const store = useTaskStore()
const isEditing = ref(false)

const otherStatuses = computed(() =>
  STATUSES.filter((status) => status.id !== props.task.status),
)

function startEdit() {
  isEditing.value = true
}

function saveEdit(payload) {
  store.updateTask(props.task.id, payload)
  isEditing.value = false
}

function removeTask() {
  store.deleteTask(props.task.id)
}

function moveTask(event) {
  const status = event.target.value
  if (!status) return
  store.moveTask(props.task.id, status)
  event.target.value = ''
}

function onDragStart(event) {
  if (isEditing.value) {
    event.preventDefault()
    return
  }

  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', props.task.id)
  event.dataTransfer.setData('application/x-task-id', props.task.id)
  event.target.classList.add('task-card--dragging')
}

function onDragEnd(event) {
  event.target.classList.remove('task-card--dragging')
}
</script>

<template>
  <article
    class="task-card"
    :draggable="!isEditing"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <TaskForm
      v-if="isEditing"
      v-model:open="isEditing"
      :task="task"
      @submit="saveEdit"
    />

    <template v-else>
      <header class="task-card__header">
        <h3 class="task-card__title">{{ task.title }}</h3>
        <PriorityBadge :priority="task.priority" />
      </header>

      <p v-if="task.description" class="task-card__description">
        {{ task.description }}
      </p>
      <p v-else class="task-card__description task-card__description--empty">
        No description
      </p>

      <footer class="task-card__footer">
        <label class="task-card__move">
          <span class="visually-hidden">Move to</span>
          <select aria-label="Move task to another column" @change="moveTask">
            <option value="">Move to…</option>
            <option
              v-for="status in otherStatuses"
              :key="status.id"
              :value="status.id"
            >
              {{ status.label }}
            </option>
          </select>
        </label>

        <div class="task-card__actions">
          <button type="button" class="btn btn--ghost btn--small" @click="startEdit">
            Edit
          </button>
          <button type="button" class="btn btn--danger btn--small" @click="removeTask">
            Delete
          </button>
        </div>
      </footer>
    </template>
  </article>
</template>
