<script setup>
import { computed } from 'vue'
import { PRIORITIES } from '../stores/tasks'

const props = defineProps({
  priority: {
    type: String,
    required: true,
    validator: (value) => PRIORITIES.some((item) => item.id === value),
  },
})

const label = computed(
  () => PRIORITIES.find((item) => item.id === props.priority)?.label ?? props.priority,
)
</script>

<template>
  <span class="priority-badge" :class="`priority-badge--${priority}`">
    {{ label }}
  </span>
</template>
