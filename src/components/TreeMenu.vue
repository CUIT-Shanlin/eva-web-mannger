<!-- 顶级菜单以外的菜单组件 -->
<template>
    <div :class="{menuOne: true, actMenu: menu.path === $route.path}"
    @click="routerPash(menu)"
    v-for="(menu,index) in menuList" :key="index">
        <span class="iconfont ico" v-html="menu.meta.icon"></span>
        <span>{{menu.meta.name}}</span>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
let props = defineProps({
    menuList: {
		type: Array,
		default(){
			return []
		}
	},
})

// 加载指定路由
function routerPash(menu){
    if(!menu.alwaysShow){
        router.push(menu.path)
    }
}

const chooseIndex = ref(-1)
</script>

<style lang="scss" scoped>
@import url('../assets/font/iconfont.css');
@import '../styles/commonFlexStyles.scss';
@import '../styles/globalPage.scss';


.menuOne{
    @include flex-center-y;
    padding: 13px 0;
    padding-left: 40px;
    font-size: 16.42px;
    font-weight: 550;
    color: rgb(136,136,136);
    .ico{
        width: 23px;
        font-size: 23px;
        margin-right: 15px;
    }
}
// .menuOne:hover{
//     background: $main-back-color;
// }
.actMenu{
    color: rgb(60,118,244);
}
</style>