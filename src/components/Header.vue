<!-- 顶部菜单栏 -->
<template>
    <div class="topAll">
        <ChooseSem />
        <span class="user">
            <img class="avatar" :src="userMsg.avatar"/>
            <span class="name">{{userMsg.name}}</span>
            <span :class="{open,iconfont:true, openNotAct:!isChoose }"
             @click="isChoose = !isChoose">&#xe656;</span>
        </span>
    </div>

</template>

<script setup>
import { onMounted,ref,reactive } from "vue"
// import UserUse from "./UserUse.vue"
import {useUserStore} from '@/stores/userStore'
import { isSpace } from "@/utils/stringUtil";
import { getInfo } from '@/api/user'
import { getMyAvatar } from '@/utils/service/userUtil';
import ChooseSem from "./ChooseSem.vue";

let isChoose = ref(false)
let userMsg = ref({id: 0,avatar:''})
// 初始化用户信息
const initMsg = async()=>{
    let {info} = await getInfo()
    userMsg.value = info
    console.log(userMsg.value)
    userMsg.value.avatar = getMyAvatar(userMsg.value.avatar)
}
onMounted(()=>{
    initMsg()
})
</script>

<style lang="scss" scoped>
@import url('/src/assets/font/iconfont.css');
@import '/src/styles/globalPage.scss';

.topAll{
    position: fixed;
	top: 0;
	right: 0;
	width: 82%;
    height: $top-distance;
    box-sizing: border-box;
    padding-left: 2%;
    padding-right: 2%;
	overflow: hidden;
    background: #FFF;
    border-radius: 2px;
    box-shadow: 0px 0px 3px #928c8c64;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    user-select: none;
    .user{
        height: 100%;
        display: flex;
        align-items: center;
        .avatar{
            height: 60%;
            border-radius: 50%;
        }
        .name{
            padding: 0 1.8rem;
            font-size: 18px;
            font-weight: bold;
            color: rgb(52,62,99);
        }
        .open{
            font-size: 1.5vh;
            margin-right: 0.6rem;
            color: rgb(161,169,198);
        }
        .openNotAct{
            -moz-transform: rotate(-90deg);
            -webkit-transform: rotate(-90deg);
        }
    }
}
</style>