// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()
  
    // Redirect unauthenticated users to login (except when already on login page)
    if (!user.value && to.path !== '/login') {
      return navigateTo('/login')
    }
  })
  
  