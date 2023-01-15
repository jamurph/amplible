<template>
    <button class="bg-dark-light20 rounded-xl px-8 py-3 h-fit hover:scale-105 transition-all duration-300 default-btn"><slot>Click Here</slot></button>
</template>

<style scoped lang="scss">
.default-btn {
    background: linear-gradient(45deg, $dark-light20, $dark-light30, $dark-light20);
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