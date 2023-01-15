<template>
    <button class="rounded-xl px-8 py-3 h-fit transition-all hover:scale-105 duration-300 primary-btn"><slot>Click Here</slot></button>
</template>
<style scoped lang="scss">
.primary-btn {
    background: linear-gradient(45deg, $primary, $primary-dark20, $primary);
    background-repeat: repeat;
    background-size: 200%;

    &:hover {
        animation: backgroundcycle 1s linear infinite;
    }
}



@keyframes backgroundcycle {
    0% {
        background-position: 0% 0%;
    }

    100% {
        background-position: 200% 0%;
    }
}
</style>