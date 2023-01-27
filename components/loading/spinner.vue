<script setup>

const props = defineProps(['message'])

</script>

<template>
    <div class="mx-auto text-center">
        <div v-if="props.message" class="text-lg mt-3">{{ props.message }}</div>
        <div style="height: 45px"><div class="loader mx-auto"></div></div>
    </div>
</template>

<style lang="scss">
.loader, .loader:before, .loader:after {
    border-radius: 50%;
    width: 15px;
    height: 15px;
    animation-fill-mode: both;
    animation: bblFadInOut 1.8s infinite ease-in-out;
}
.loader {
    color: $light;
    font-size: 7px;
    position: relative;
    transform: translateZ(0);
    animation-delay: -0.16s;
}
.loader:before,
.loader:after {
    content: '';
    position: absolute;
    top: 0;
}
.loader:before {
    left: -3.5em;
    animation-delay: -0.32s;
}
.loader:after {
    left: 3.5em;
}

@keyframes bblFadInOut {
    0%, 80%, 100% { box-shadow: 0 15px 0 -3px }
    40% { box-shadow: 0 15px 0 0 }
}

    
</style>