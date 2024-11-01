<!-- 左侧菜单栏显示 -->
<template>
    <div class="leftAll">
        <div class="topFill">
            <!-- <el-button @click="show()">点我</el-button> -->
        </div>
        <div v-for="(menu,index) in menus" :key="index">
            <div :class="{libOne: true, actLib: menu.isChoose}"
            v-if="!menu.hidden"
            @click="menu.isChoose = !menu.isChoose">
                <span class="box">
                    <span class="iconfont ico" v-html="menu.meta.icon"></span>
                    <span>{{menu.meta.name}}</span>
                </span>
                <span :class="{tip: true, actTip: menu.isChoose}">&nbsp;</span>
            </div>
            <TreeMenu v-if="menu.isChoose && menu.alwaysShow && !menu.hidden" :menu-list="menu.children"/>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import pinia from '@/utils/pinia';
import { ref } from 'vue';
import TreeMenu from '@/components/TreeMenu.vue'


// 从pinia中拿到菜单数据
const menus = ref(useUserStore(pinia).menus);


function show(){
    console.log('======================>>>>>>')
    console.log(useUserStore(pinia).menus)
    console.log('======================>>>>>>')
}
</script>

<style lang="scss" scoped>
@import url('../assets/font/iconfont.css');
@import '../styles/globalPage.scss';
@import '../styles/commonFlexStyles.scss';
@import '../styles/common.scss';


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
    user-select: none;
    overflow-y: auto;
    @include myScrollbar;
    .topFill{
        height: 65px;
        border-bottom: 2px rgb(239,243,248) solid;
    }
    .libOne{
        @include flex-center-y;
        cursor: pointer;
        justify-content: space-between;
        color: rgb(136,136,136);
        font-size: 16.42px;
        padding: 15px 0;
        padding-left: 24px;
        font-weight: 550;
        .box{
            @include flex-center-y;
            .ico{
                width: 25px;
                font-size: 25px;
                margin-right: 18px;
            }
        }
        
        .tip{
            height: 60%;
            width: 5px;
        }
        .actTip{
            background: rgb(60,118,244);
        }
    }
    .libOne:hover{
        background: $main-back-color;
    }
    .actLib{
        background: $main-back-color;
        color: rgb(60,118,244);
    }
}
</style>