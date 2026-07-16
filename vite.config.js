import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Relative base so GitHub project Pages resolves assets under /Kanban-VueJS/
  base: process.env.BASE_PATH || './',
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
