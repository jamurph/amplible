
/**
 * Use this middleware when you don't want an authenticated user to view a page. e.g. a sign-in page
 */
export default defineNuxtRouteMiddleware((to, _from) => {
    const user = useSupabaseUser()
    if (user.value) {
      return navigateTo('/dashboard')
    }
  })