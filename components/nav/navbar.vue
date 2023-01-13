<template>
    <nav class="bg-dark w-full relative z-50">
        <div class="w-full bg-dark z-10">
            <div class="container bg-dark flex justify-between items-center mx-auto p-3 ">
                <div class="z-10">
                    <slot name="logo"></slot>
                </div>
                <div>
                    <div class="hidden lg:block">
                        <slot name="desktop"></slot>
                    </div>
                    <div class="block lg:hidden">
                        <ButtonMenuToggle tabindex="0" @click="toggleMenu" :menuopen="menuopen" />
                    </div>
                </div>
            </div>
        </div>
        <Transition>
            <div v-if="menuopen" :class="['bg absolute -z-10 w-full block lg:hidden backdrop-blur-md shadow-2xl']">
                <div class="absolute -z-10 bg-dark-light10 opacity-80 w-full h-full"></div>
                <div class="container flex flex-col items-end text-right mx-auto px-5 py-8">
                    <slot name="mobile"></slot>
                </div>
            </div>
        </Transition>
    </nav>
</template>

<script setup>
    const menuopen = ref(false)
    const route = useRoute()

    //close nav with route change.
    watch(() => route.name, (name, prevName) => {
        menuopen.value = false;
    })

    function toggleMenu(){
        menuopen.value = !menuopen.value
    }
</script>

<style>
    .v-enter-active,
    .v-leave-active {
        transition: all 0.7s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
        transform: translateY(-100%);
    }
</style>