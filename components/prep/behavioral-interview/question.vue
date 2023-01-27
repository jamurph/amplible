<script setup>

    const props = defineProps(['question'])

    console.log(props.question)

</script>

<template>
    <div>
        {{ props.question.text }}
    </div>
</template>