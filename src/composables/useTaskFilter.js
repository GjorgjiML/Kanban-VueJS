import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { STATUSES, useTaskStore } from '../stores/tasks'

export function useTaskFilter() {
  const store = useTaskStore()
  const { priorityFilter, filteredTasks } = storeToRefs(store)

  const columns = computed(() =>
    STATUSES.map((status) => ({
      ...status,
      tasks: filteredTasks.value.filter((task) => task.status === status.id),
    })),
  )

  const hasFilteredResults = computed(() => filteredTasks.value.length > 0)
  const isFiltering = computed(() => priorityFilter.value !== 'all')

  function setPriorityFilter(priority) {
    store.setPriorityFilter(priority)
  }

  return {
    priorityFilter,
    filteredTasks,
    columns,
    hasFilteredResults,
    isFiltering,
    setPriorityFilter,
  }
}
