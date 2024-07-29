<!-- 页面显示的title -->
<template>
    <div class="myTitle">{{content}}</div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
    content: {
        type: String,
        default: ''
    }
})
</script>

<style lang="scss" scoped>
@import '../styles/common.scss';

.myTitle{
    @include funTitle;
}
</style>