export default defineNuxtRouteMiddleware((to, _from) => {
    const user = useSupabaseUser()
    if (!user.value) {
        return navigateTo('/auth/signin')
    } else if (!user.value.confirmed_at){
        return navigateTo('/auth/confirm')
    }
  })