<script setup>
    import { required, email, minLength, helpers } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';

    const router = useRouter()

    const supabase = useSupabaseAuthClient()
    const signinError = ref('')
    const isLoading = ref(false)

    definePageMeta({
        middleware: 'unauthenticated'
    })


    const formData = reactive({
        email: '',
        password: ''
    })

    const rules = computed(() => {
        return {
            email : {
                required : helpers.withMessage('An email is required.', required), 
                email : helpers.withMessage('Invalid email format.', email)
            },
            password: {
                required : helpers.withMessage('A password is required.', required), 
                minLength: helpers.withMessage('Passwords must be 8 or more characters.',minLength(8))
            }
        }
    })

    const v$ = useVuelidate(rules, formData)

    async function signIn(){
        isLoading.value = true;

        v$.value.$validate();
        if(!v$.value.$error){
            try {
                const {error} = await supabase.auth.signInWithPassword({email: formData.email, password: formData.password})
                if(error){
                    signinError.value = error;
                } else {
                    //logged in!

                    //TODO: listen to auth state change and redirect that way? in app.vue
                    router.push('/dashboard')
                }
            } catch (er) {
                signinError.value = "Something went wrong connecting to the server. Please refresh and try again.";
            }
        }

        isLoading.value = false;
    }
</script>

<template>
    
    <div class="bg-dark p-8 py-16 md:max-w-lg md:mx-auto mx-3 rounded-3xl border border-light-dark20 mt-20 shadow-2xl mb-32" >
      <h2 class="text-3xl text-center mb-2">Welcome Back!</h2>
      <form @submit.prevent="signIn">
        <label class="block mb-8 mt-8" for="email">
          Email:
          <input
            class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
            type="email"
            id="email"
            placeholder="Enter your email"
            v-model="formData.email"
            :class="{
                'border-red-400 border-2': v$.email.$error,
            }"
          />
          <small v-if="v$.email.$error" class="text-sm mt-2 text-red-400">{{ v$.email.$errors[0].$message }}</small>
        </label>
        <label class="block mb-8" for="password">
          Password:
          <input
            placeholder="Enter your password"
            class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
            type="password"
            id="password"
            v-model="formData.password"
            :class="{
                'border-red-400 border-2': v$.password.$error,
            }"
          />
          <small v-if="v$.password.$error" class="text-sm mt-2 text-red-400">{{ v$.password.$errors[0].$message }}</small>
        </label>
        <ButtonPrimary class="mx-auto block mt-16" :disabled="isLoading"
          type="submit"
        >
          {{ isLoading ? 'Loading...' : 'Submit'}}
        </ButtonPrimary>
        <small v-if="signinError" class="text-sm mt-2 text-center text-red-400 block">{{ signinError }}</small>
        <p class="text-center mt-8">
            Need an account?
            <NuxtLink to="/auth/signin" class="inline-block text-primary-dark20 hover:text-primary transition-all duration-300"> Create an Account <Icon name="fa6-solid:arrow-right"></Icon></NuxtLink>
        </p>
      </form>
    </div>
  </template>