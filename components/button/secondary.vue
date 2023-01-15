<template>
    <button class="bg-secondary rounded-xl px-8 py-3 h-fit hover:scale-105 transition-all duration-300 secondary-btn"><slot>Click Here</slot></button>
</template>

<style scoped lang="scss">
.secondary-btn {
    background: linear-gradient(45deg, $secondary, $secondary-dark20, $secondary);
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