<!-- 进度条组件(无互动，仅展示) -->
<template>
  <div class="myBar">
    <div class="myValue" :style="{ width: radio }"></div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { ref } from "vue";
let props = defineProps({
  radio: {
    type: String,
    default: "0%",
  },
  height: {
    type: String,
    default: "12px",
  },
});
let height = ref(props.height);
</script>

<style lang="scss" scoped>
.myBar,
.myValue {
  height: v-bind(height);
  border-radius: 20px;
}
.myBar {
  position: relative;
  background-color: rgb(234, 237, 247);
  .myValue {
    position: absolute;
    top: 0;
    background-color: rgb(147, 144, 243);
  }
}
</style>