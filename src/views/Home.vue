<template>
    <Header></Header>
    <LeftMenu></LeftMenu>
    <div class="homeSty">
        <router-view></router-view>
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import LeftMenu from '@/components/LeftMenu.vue';

</script>

<style lang="scss" scoped>
@import '../styles/globalPage.scss';
.homeSty{
    position: fixed;
	top: 0;
	left: 0;
    // padding-left: 15vw;
    // padding-top: 8vh;
	width: 100%;
    height: 100%;
    background: $page-back-color;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>