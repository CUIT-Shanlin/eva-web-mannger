<template>
    <el-result title="404" sub-title="您似乎走丢了">
      <template #icon>
        <el-image
          src="src\assets\img\R-C.png"
        />
      </template>
      <template #extra>
        <el-button type="primary" @click="goToHome">点我回家</el-button>
      </template>
    </el-result>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goToHome = () => {
    router.push('/dashboard/evaBoard');
  };
  </script>
  
  <style lang="scss" scoped>
  /* 样式可以根据需要进行调整 */
  </style>
  