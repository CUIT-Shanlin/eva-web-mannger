<!-- 左侧菜单栏显示 -->
<template>
    <div class="leftAll">
        1
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import '../styles/globalPage.scss';

.leftAll{
    position: fixed;
    z-index: 10;
	top: 0;
	left: 0;
    width: $left-distance;
    height: 100%;
    background-color: #FFF;
    border-radius: 2px;
    box-shadow: 0px 0px 3px #928c8c64;
}
</style>