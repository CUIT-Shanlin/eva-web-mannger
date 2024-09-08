<!-- 评教看板页面 -->
<template>
  <PageTitle content="评教看板" />
  <div class="boardAll"> 
    <div class="commonBox">1</div>
    <div class="commonBox">1</div>
    <div class="commonBox">1</div>
    <div class="commonBox">1</div>

    <div class="largeBox">6</div>
    <div class="longBox">6</div>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";

</script>

<style lang="scss" scoped>
@import '../../styles/globalPage.scss';

// 数据展示容器基础样式
@mixin baseBox{
  background: #FFF;
  box-shadow: $small-box-shadow;
  border-radius: 10px;
  &:hover{
    box-shadow: $common-box-shadow;
  }
}
.boardAll{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 35px;
  .commonBox, .largeBox, .longBox{
    @include baseBox;
  }
  .commonBox, .longBox{
    min-width: 300px;
  }
  .commonBox{
    height: 150px;
  }
  .largeBox{
    height: 450px;
 	grid-row: 2/3;
    grid-column: 1/4;
  }
}
</style>