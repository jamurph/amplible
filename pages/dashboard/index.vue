<script setup>
    definePageMeta({
        middleware: 'confirmed'
    })


    const user = useSupabaseUser()
   
    
</script>

<template>
    <h1>Welcome, {{ user.email }}</h1>
</template>

<style>

</style>