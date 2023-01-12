<script setup>

</script>

<template>
    <div class="logo">
        <img  src="/images/AmplibleLogo.svg" class="img w-100" />
        <div class="logo-glow"></div>
    </div>
</template>

<style scoped lang="scss">
    .logo {
        border-radius: 5px;
        padding: 10px;
        position: relative;
        width: 70px;
        height: 70px;
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
        opacity: .9;

        &:hover {
            cursor: pointer;
            opacity: 1;

            .logo-glow {
                box-shadow: 0px 0px 5rem 2rem #f99969;
            }
        }

        img {
            z-index: 2;
            position: absolute;
            left: 0;
            top: 0;
        }

        .logo-glow {
            z-index: 1;
            width: 1px;
            height: 1px;
            position: absolute;
            left: calc(50% - 0.5px);
            top: calc(50% + 2px);
            background-color: $primary;
            box-shadow: 0px 0px 3rem 1rem $primary;
            transition: all 0.3s;
        }
    }
</style>