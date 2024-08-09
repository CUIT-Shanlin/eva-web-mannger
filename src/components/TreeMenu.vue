<!-- 顶级菜单以外的菜单组件 -->
<template>
    <div v-for="(menu,index) in menuList" :key="index">
        <div :class="{menuOne: true, actMenu: isActSty(menu)}"
        @click="chooseMenu(menu)">
            <span class="box">
                <span class="iconfont ico" v-html="menu.meta.icon"></span>
                <span>{{menu.meta.name}}</span>
            </span>
            <span :class="{iconfont: true, myIco: true, actMyIco: isActSty(menu)}" v-if="menu.alwaysShow">&#xe600;</span>
        </div>
        <TreeMenu v-if="menu.alwaysShow && menu.isChoose" :menu-list="menu.children" :floor="floor + 1"/>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TreeMenu from '@/components/TreeMenu.vue';

const router = useRouter()
const route = useRoute()

let props = defineProps({
    menuList: {
		type: Array,
		default(){
			return []
		}
	},
    floor: {
        type: Number,
        default(){
            return 1
        }
    }
})

// 菜单文字和图标对左偏的距离
const paddingLeft = ref(`${ 30 + props.floor * 10}px`)

// 判断是否改为选中的样式
function isActSty(menu){
    return (menu.alwaysShow && menu.isChoose) || (route.path === menu.path)
}
// 选中一个菜单之后进行的处理
function chooseMenu(menu){
    // 目录级别菜单处理
    if(menu.alwaysShow){
        menu.isChoose = !menu.isChoose
        return
    }
    // 菜单级别直接跳转路由
    router.push(menu.path)
}

const chooseIndex = ref(-1)
</script>

<style lang="scss" scoped>
@import url('../assets/font/iconfont.css');
@import '../styles/commonFlexStyles.scss';
@import '../styles/globalPage.scss';


.menuOne{
    @include flex-center-y;
    cursor: pointer;
    justify-content: space-between;
    padding: 13px 0;
    padding-left: 40px;
    padding-left: v-bind(paddingLeft);
    font-size: 16.42px;
    font-weight: 550;
    color: rgb(136,136,136);
    .box{
        @include flex-center-y;
        .ico{
            width: 23px;
            font-size: 23px;
            margin-right: 15px;
        }
    }
    .myIco{
        font-size: 20px;
        display: inline-block;
        transform: rotate(90deg);
    }
    .actMyIco{
        transform: rotate(-90deg);
    }
}
.actMenu{
    color: rgb(60,118,244);
}
</style>