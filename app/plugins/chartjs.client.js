// Use .js extension instead of .ts to avoid TypeScript errors with Tailwind
import { Chart, registerables } from 'chart.js'
import { Line, Bar, Pie } from 'vue-chartjs'

export default defineNuxtPlugin((nuxtApp) => {
  // Register Chart.js components
  Chart.register(...registerables)
  
  // Register global components
  nuxtApp.vueApp.component('LineChart', Line)
  nuxtApp.vueApp.component('BarChart', Bar)
  nuxtApp.vueApp.component('PieChart', Pie)
})