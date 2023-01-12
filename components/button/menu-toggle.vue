<template>
    <div class="menutogglebtn flex items-center mx-3 py-2 px-6 border-2 rounded-lg border-dark-light10 hover:border-dark-light20 transition-all">
        <span class="mr-3">Menu</span> 
        <div :class="['menutoggle', { 'closed' : menuopen }]">
            <div class="top"></div>
            <div class="mid"></div>
            <div class="bottom"></div>
        </div>
    </div>
</template>

<script setup>
    defineProps(["menuopen"])
</script>

<style scoped lang="scss">
.menutogglebtn {
    cursor: pointer;
}

.menutoggle {
  display: inline-block;
  cursor: pointer;
}

.top, .mid, .bottom {
  width: 35px;
  height: 5px;
  background-color: $light;
  margin: 5px 0;
  transition: all 0.3s;
  border-radius: 5px;
}

.closed {
    .top {
        transform: translate(0, 10px) rotate(-45deg);
    }

    .mid {
        opacity: 0;
    }

    .bottom {
        transform: translate(0, -10px) rotate(45deg);
    }
} 
    
</style>