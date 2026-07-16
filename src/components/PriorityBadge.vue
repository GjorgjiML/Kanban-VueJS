<script setup>
import { computed } from 'vue'

const props = defineProps({
  priority: {
    type: String,
    required: true,
    validator: (value) => ['low', 'medium', 'high'].includes(value),
  },
})

const label = computed(() => {
  const labels = { low: 'Low', medium: 'Medium', high: 'High' }
  return labels[props.priority]
})
</script>

<template>
  <span class="priority-badge" :class="`priority-badge--${priority}`">
    {{ label }}
  </span>
</template>
