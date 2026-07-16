# OtoTrak Task Board

A small Kanban-style task board built for the OtoTrak Senior Vue.js take-home task.

## Features

- Three columns: **To Do**, **In Progress**, **Done**
- Add, edit (in place), and delete tasks
- Priority (Low / Medium / High) with a board-wide filter
- All task and filter state managed in Pinia
- Native HTML5 drag-and-drop between columns (plus Move to… for keyboard/mouse)
- Pinia persist to `localStorage`
- Column list enter/leave/move transitions
- `defineModel()` for form open state (`v-model:open`)

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

GitHub Actions workflows live under `.github/workflows/`:

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | Push / PR to `main` | `npm ci` → tests → production build → upload `dist` artifact |
| `deploy.yml` | Push to `main` | Tests + build with Pages base path → deploy to **GitHub Pages** |

After the first successful deploy, enable Pages in the repo:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

Live site URL (once enabled): https://gjorgjiml.github.io/Kanban-VueJS/

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
