import { onMounted, onUnmounted } from 'vue'
import { STORE_PERSIST_KEY, useTaskStore } from '../stores/tasks'

const CHANNEL_NAME = 'ototrak-tasks-live'

function snapshotsEqual(a, b) {
  return (
    a?.priorityFilter === b?.priorityFilter &&
    JSON.stringify(a?.tasks) === JSON.stringify(b?.tasks)
  )
}

export function useStoreSync() {
  const store = useTaskStore()
  let channel = null
  let applyingRemote = false
  let unsubscribe = null

  function currentSnapshot() {
    return {
      tasks: JSON.parse(JSON.stringify(store.tasks)),
      priorityFilter: store.priorityFilter,
    }
  }

  function applySnapshot(snapshot) {
    if (!snapshot || !Array.isArray(snapshot.tasks)) return
    if (snapshotsEqual(currentSnapshot(), snapshot)) return

    applyingRemote = true
    store.hydrate(snapshot)
    queueMicrotask(() => {
      applyingRemote = false
    })
  }

  function publish() {
    if (applyingRemote || !channel) return
    channel.postMessage(currentSnapshot())
  }

  function onStorage(event) {
    if (event.key !== STORE_PERSIST_KEY || event.newValue == null) return

    try {
      applySnapshot(JSON.parse(event.newValue))
    } catch {
      // ignore malformed payloads
    }
  }

  function onChannelMessage(event) {
    applySnapshot(event.data)
  }

  onMounted(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(CHANNEL_NAME)
      channel.addEventListener('message', onChannelMessage)
    }

    window.addEventListener('storage', onStorage)

    unsubscribe = store.$subscribe(
      () => {
        publish()
      },
      { detached: true },
    )
  })

  onUnmounted(() => {
    unsubscribe?.()
    window.removeEventListener('storage', onStorage)
    channel?.removeEventListener('message', onChannelMessage)
    channel?.close()
    channel = null
  })
}
