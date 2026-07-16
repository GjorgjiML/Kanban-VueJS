<script setup>
import { reactive, useId, watch } from 'vue'
import { PRIORITIES, STATUSES } from '../stores/tasks'

const props = defineProps({
  task: {
    type: Object,
    default: null,
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const open = defineModel('open', {
  type: Boolean,
  default: true,
})

const titleId = useId()
const descriptionId = useId()
const priorityId = useId()
const statusId = useId()

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
})

function resetForm() {
  form.title = props.task?.title ?? ''
  form.description = props.task?.description ?? ''
  form.priority = props.task?.priority ?? 'medium'
  form.status = props.task?.status ?? 'todo'
}

watch(
  () => props.task,
  () => {
    resetForm()
  },
  { immediate: true },
)

function onSubmit() {
  const title = form.title.trim()
  if (!title) return

  emit('submit', {
    title,
    description: form.description.trim(),
    priority: form.priority,
    status: form.status,
  })

  open.value = false
}

function onCancel() {
  resetForm()
  open.value = false
  emit('cancel')
}
</script>

<template>
  <form class="task-form" @submit.prevent="onSubmit">
    <div class="task-form__field">
      <label :for="titleId">Title</label>
      <input
        :id="titleId"
        v-model="form.title"
        type="text"
        required
        maxlength="120"
        placeholder="What needs to be done?"
        autocomplete="off"
      />
    </div>

    <div class="task-form__field">
      <label :for="descriptionId">
        Description <span class="optional">(optional)</span>
      </label>
      <textarea
        :id="descriptionId"
        v-model="form.description"
        rows="3"
        maxlength="500"
        placeholder="Add a bit more context"
      />
    </div>

    <div class="task-form__row">
      <div class="task-form__field">
        <label :for="priorityId">Priority</label>
        <select :id="priorityId" v-model="form.priority">
          <option v-for="item in PRIORITIES" :key="item.id" :value="item.id">
            {{ item.label }}
          </option>
        </select>
      </div>

      <div v-if="showStatus" class="task-form__field">
        <label :for="statusId">Column</label>
        <select :id="statusId" v-model="form.status">
          <option v-for="item in STATUSES" :key="item.id" :value="item.id">
            {{ item.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="task-form__actions">
      <button type="submit" class="btn btn--primary">
        {{ task ? 'Save changes' : 'Add task' }}
      </button>
      <button v-if="task || open" type="button" class="btn btn--ghost" @click="onCancel">
        Cancel
      </button>
    </div>
  </form>
</template>
