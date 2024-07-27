<!-- 左侧菜单栏显示 -->
<template>
    <div class="leftAll">
        <div class="topFill">
            <el-button @click="show()">点我</el-button>
        </div>
        <div ref="menusDiv">
            <div :class="{libOne: true, actLib: index === chooseIndex}"
            v-for="(menu,index) in menus" :key="index" @click="chooseIndex = index">
                <span class="box">
                    <span class="iconfont ico" v-html="menu.meta.icon"></span>
                    <span>{{menu.meta.name}}</span>
                </span>
                <span :class="{tip: true, actTip: chooseIndex === index}">&nbsp;</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import pinia from '@/utils/pinia';
import { ref, onMounted, onUnmounted } from 'vue';

// 从pinia中拿到菜单数据
const menus = ref(useUserStore(pinia).menus);

// 记录顶级菜单中选中的索引
const chooseIndex = ref(-1)
function show(){
    console.log('======================>>>>>>')
    console.log(menus.value)
    console.log('======================>>>>>>')
}


// 引用目标 div
const menusDiv = ref(null);


// TODO 点击菜单以外的地方 就将选中样式取消
// 监听全局点击事件
function handleClickOutside(event) {
  // 检查点击事件是否发生在目标 div 上或其子元素上
  if (!menusDiv.value || !menusDiv.value.contains(event.target)) {
    // 如果没有，则是点击了菜单以外的地方，将选中索引 赋值-1
    chooseIndex.value = -1
  }
}
// 组件挂载时添加事件监听
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});
  
// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<style lang="scss" scoped>
@import url('../assets/font/iconfont.css');
@import '../styles/globalPage.scss';
@import '../styles/commonFlexStyles.scss';

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
    .topFill{
        height: 65px;
        border-bottom: 2px rgb(239,243,248) solid;
    }
    .libOne{
        @include flex-center-y;
        justify-content: space-between;
        color: rgb(136,136,136);
        font-size: 16.42px;
        padding: 10px 0;
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
.special-div{}
</style>