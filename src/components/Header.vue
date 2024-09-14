<!-- 顶部菜单栏 -->
<template>
    <div class="topAll">
        <ChooseSem />
        <span class="user">
            <i class="iconfont msgIco">&#xe6d5;</i>
            <el-avatar class="avatar" 
            :src="userMsg.avatarUrl"
            :size="40"
            fit="cover"
            />
            <span class="name">{{userMsg.name}}</span>
            <i :class="{funChoose: true,iconfont:true, openAct: isChoose }"
             @click="isChoose = !isChoose">&#xe656;</i>
        </span>
    </div>

</template>

<script setup>
import { onMounted, ref } from "vue"
// import UserUse from "./UserUse.vue"
import { getInfo } from '@/api/user'
import { getMyAvatar } from '@/utils/service/userUtil';
import ChooseSem from "./ChooseSem.vue";

let isChoose = ref(false)
let userMsg = ref({id: 0,avatarUrl:''})
// 初始化用户信息
const initMsg = async()=>{
    let {info} = await getInfo()
    userMsg.value = info
    let res = await getMyAvatar(userMsg.value.id)
    userMsg.value.avatarUrl = res
}
onMounted(()=>{
    initMsg()
})
</script>

<style lang="scss" scoped>
@import url('/src/assets/font/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/commonFlexStyles.scss';

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
    @include flex-center-y;
    z-index: 10;
    user-select: none;
    .user{
        margin-left: auto;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(4,1fr);
        gap: 35px;
        align-items: center;
        & > * {
            text-align: center;
        }
        .msgIco{
            font-size: 25px;
            color: rgb(124,136,177);
            cursor: pointer;
        }
        .avatar{
            height: 60%;
            border-radius: 50%;
        }
        .name{
            font-size: 18px;
            font-weight: bold;
            color: rgb(52,62,99);
        }
        .funChoose{
            cursor: pointer;
            font-size: 15px;
            color: rgb(161,169,198);
            display: inline-block;
        }
        .openAct{
            transform: rotate(-90deg)
        }
    }
}
</style>