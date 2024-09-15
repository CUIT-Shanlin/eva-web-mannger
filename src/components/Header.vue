<!-- 顶部菜单栏 -->
<template>
    <div class="topAll">
        <ChooseSem />
        <span class="user">
            <el-dropdown placement="bottom" trigger="click">
                <el-badge :value="1" type="primary">
                <i class="iconfont msgIco">&#xe6d5;</i>
                </el-badge>
                <template #dropdown>
                    <el-dropdown-menu>
                        <div style="width: 400px;">1</div>
                    <!-- <el-dropdown-item>The Action 1st</el-dropdown-item> -->
                    <el-dropdown-item>The Action 2st</el-dropdown-item>
                    <el-dropdown-item>The Action 3st</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-avatar class="avatar" 
            :src="userInfo.avatarUrl"
            :size="40"
            fit="cover"
            />
            <span class="name">{{userInfo.name}}</span>
            <i :class="{funChoose: true,iconfont:true, openAct: isChoose }"
             @click="isChoose = !isChoose">&#xe656;</i>
        </span>
    </div>

</template>

<script setup>
import { onMounted, ref } from "vue"
import { getInfo } from '@/api/user'
import { 
    getAllMyMsg,
    updateIsDisplayed,
    updateIsRead,
} from '@/api/msg'
import { getMyAvatar } from '@/utils/service/userUtil';
import { initSocket } from "@/utils/webSocketUtil";
import { 
    COMMON_MSG_MODE,
    NOT_DISPLAYED_MSG,
} from '@/utils/service/staticData';
import ChooseSem from "./ChooseSem.vue";
import { ElNotification } from 'element-plus'

// 存自己所有的消息
const allMyMsgs = ref([])

// 接收消息的socket
const mySocket = ref({})

// 是否选择了下拉框
const isChoose = ref(false)
// 用户信息
const userInfo = ref({id: 0,avatarUrl:''})


/**
 * 对自己的所有消息进行处理
 */
const dealAllMyMsg = async()=>{
    // 拿到所有普通消息
    let data = await getAllMyMsg(-1, COMMON_MSG_MODE)
    // TODO 将消息进行排序，总体上是按照createTime进行排序，然后未读消息要排在最前面
    data.sort((msg1, msg2)=>{
        if(msg1.isRead !== msg2.isRead){
            return msg1.isRead - msg2.isRead
        }
        return new Date(msg2.createTime).getTime() - new Date(msg1.createTime).getTime()
    })
    // TODO 将未显示过的消息进行弹窗显示, 一次只弹出一个，关闭后弹出下一个
    let notDisplayedMsgs = data.filter(item => item.isDisplayed === NOT_DISPLAYED_MSG)
    receiveMsgArr(notDisplayedMsgs, 0)
    allMyMsgs.value = data
}

/**
 * 递归处理消息数组，实现一次只弹出一个，关闭后弹出下一个
 * @param {Array} msgDatas 消息数组
 * @param {Number} i 当前待弹出的消息的索引
 */
function receiveMsgArr (msgDatas = [], i = 0){
    if(i > msgDatas.length - 1){
        return
    }
    const msgOne = msgDatas[i]
    ElNotification({
        title: `${msgOne.senderName}发来一条消息`,
        message: `${msgOne.msg}<br/><div style="color: teal">${msgOne.createTime}</div>`,
        type: 'info',
        dangerouslyUseHTMLString: true,
        onClose: ()=>{
            updateIsDisplayed(msgOne.id)
            receiveMsgArr(msgDatas, ++i)
        }
    })
}

/**
 * 弹出消息的统一处理方法
 * @param {Object} msgData 消息数据
 */
 function receiveMsg (msgData = {}){
    ElNotification({
        title: `${msgData.senderName}发来一条消息`,
        message: msgData.msg,
        type: 'info',
        onClose: ()=>{
            updateIsDisplayed(msgData.id)
        }
    })
}

/**
 * 初始化用户信息
 */
const initInfo = async()=>{
    let {info} = await getInfo()
    userInfo.value = info
    let res = await getMyAvatar(userInfo.value.id)
    userInfo.value.avatarUrl = res
}

onMounted(()=>{
    initInfo()
    mySocket.value = initSocket()
    // 实时接收消息
    mySocket.value.onmessage = (event)=>{
        const msgData = JSON.parse(event.data)
        receiveMsg(msgData)
    }
    dealAllMyMsg()
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
            font-size: 30px;
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