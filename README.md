# OtoTrak Task Board

A small Kanban-style task board built for the OtoTrak Senior Vue.js take-home task.

## Features

- Three columns: **To Do**, **In Progress**, **Done**
- Add, edit (in place), and delete tasks
- Priority (Low / Medium / High) with a board-wide filter
- All task and filter state managed in Pinia
- Native HTML5 drag-and-drop between columns (plus Move to… for keyboard/mouse)
- Pinia persist to `localStorage`
- Live sync across open tabs/windows (Pinia + `localStorage` `storage` events + `BroadcastChannel`)
- Column list enter/leave/move transitions
- `defineModel()` for form open state (`v-model:open`)
- Vitest unit tests for the store (`npm test`)

## Tech stack

- Vue 3.4+ (Composition API only)
- Pinia 2 + `pinia-plugin-persistedstate`
- JavaScript (ES modules)
- Vite + Vitest
- Custom CSS (no UI framework)

## Setup

### Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Tests

```bash
npm test
```

### Production build

```bash
npm run build
npm run preview
```

### Docker Compose

```bash
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080).

Stop with `Ctrl+C`, or `docker compose down`.

## CI / CD

GitHub Actions workflows live under `.github/workflows/`.

They use **shell-only steps** (no `actions/*` marketplace actions) so they work when the repo policy allows only actions from the owning account.

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | Push / PR to `main` | Checkout → `npm ci` → tests → production build |
| `deploy.yml` | Push to `main` | Tests + build with Pages base path → force-push `dist` to `gh-pages` |

After the first successful deploy, enable Pages:

**Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `gh-pages` / `/ (root)`**

Live site URL (once enabled): https://gjorgjiml.github.io/Kanban-VueJS/

Optional: if you prefer official actions later, allow `actions/*` under **Settings → Actions → General → Actions permissions**.

## Project structure

```
src/
  components/
    TaskCard.vue
    KanbanColumn.vue
    TaskForm.vue
    PriorityBadge.vue
  stores/
    tasks.js
    tasks.spec.js
  composables/
    useTaskFilter.js
  assets/
    main.css
  App.vue
  main.js
```

## Key decisions

- **Single Pinia store** for tasks and the priority filter. The domain is small; one store with clear getters/actions stays readable without artificial splitting.
- **Filter via getter.** `filteredTasks` and `tasksByStatus` apply the priority filter in the store so the UI never reimplements that logic.
- **`useTaskFilter` composable** derives column lists and filter helpers for the board shell, keeping `App.vue` thin.
- **DnD + select control.** Cards are draggable onto columns; the Move to… select remains for accessibility and precision.
- **`defineModel('open')` on `TaskForm`.** Parents bind `v-model:open` so cancel/submit can close add and edit UIs without custom close plumbing.
- **Persist tasks and filter** under the `ototrak-tasks` localStorage key so a refresh keeps board state.
- **In-place edit on the card.** Editing swaps the card body for `TaskForm` so changes happen on the board without a separate page.
- **No UI kit.** Custom CSS keeps the component API and styling under our control, matching the brief.

## What I would add with more time

- Stronger keyboard and screen-reader polish on drag/edit flows
- Drag handle so interactive controls are never accidental drag sources
- Reordering within a column
