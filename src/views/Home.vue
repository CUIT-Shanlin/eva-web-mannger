<template>
    <div>
        首页
        <button @click="show()">点我</button>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter()
function show(){
    console.log('========================================>>>>>')
    console.log(router.options.routes);
    console.log('========================================>>>>>')
}

</script>

<style lang="scss" scoped>

</style>