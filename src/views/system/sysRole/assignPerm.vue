<template>
  <PageTitle content="分配权限" />
  <el-input v-model="msg" placeholder="随便输点东西吧"></el-input>    
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { ref } from "vue";
const msg = ref('')
</script>

<style lang="scss" scoped>

</style>