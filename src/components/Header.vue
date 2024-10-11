<!-- 顶部菜单栏 -->
<template>
  <div class="topAll">
    <ChooseSem />
    <span class="user">
      <el-dropdown placement="bottom" trigger="click">
        <el-badge
          :value="unreadNum"
          type="primary"
          :color="unreadNum > 0 ? '' : 'transparent'"
        >
          <i class="iconfont msgIco">&#xe6d5;</i>
        </el-badge>
        <template #dropdown>
          <div class="msgBox" v-loading="isLoadingMsgs">
            <div class="myTitle">
              <span>通知</span>
              <el-button plain @click="batchMyUpdateIsRead()"
                >全部已读</el-button
              >
            </div>
            <div class="boxLine">&nbsp;</div>
            <div class="msgOne" v-for="msgOne in allMyMsgs" :key="msgOne.id">
              <div
                class="msgTitle"
                :style="{ color: msgOne.isRead === UNREAD_MSG ? '' : 'teal' }"
              >
                <el-badge
                  is-dot
                  :color="msgOne.isRead === UNREAD_MSG ? '' : 'transparent'"
                >
                  <i class="iconfont ico">&#xe616;</i>
                </el-badge>
                <span class="titleTxt"
                  >{{ msgOne.isRead === UNREAD_MSG ? "未" : "已" }}读消息</span
                >
              </div>
              <div class="msg">
                {{ msgOne.msg }}
              </div>
              <div class="msgBottom">
                {{ msgOne.senderName }} .
                {{ dateToDistanceTime(msgOne.createTime) }}
              </div>
            </div>
          </div>
        </template>
      </el-dropdown>
      <el-avatar
        class="avatar"
        :src="userInfo.avatarUrl"
        :size="40"
        fit="cover"
      />
      <span class="name">{{ userInfo.name }}</span>
      <el-dropdown placement="bottom" trigger="click"
      @visible-change="handleMyClose"
      >
        <i
        :class="{ funChoose: true, iconfont: true, openAct: isChoose }"
        >&#xe656;</i
        >
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="myLogOut()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getInfo } from "@/api/user";
import { logOut } from '@/api/login';
import {
  getAllMyMsg,
  updateIsDisplayed,
  updateIsRead,
  batchUpdateIsRead,
} from "@/api/msg";
import { getMyAvatar } from "@/utils/service/userUtil";
import { useMySocket } from "@/utils/webSocketUtil";
import {
  COMMON_MSG_MODE,
  NOT_DISPLAYED_MSG,
  UNREAD_MSG,
} from "@/utils/service/staticData";
import { dateToDistanceTime } from "@/utils/dateUtil";
import { 
  removeToken,
  getMyToken,
} from '@/utils/auth'
import { 
  useSuccessTip,
  useSimpleConfirm,
} from "@/utils/msgTip";
import ChooseSem from "./ChooseSem.vue";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter()

// 存自己所有的消息
const allMyMsgs = ref([]);
// 记录未读消息数目
const unreadNum = ref(0);

// 接收消息的socket
const mySocket = ref({});

// 是否选择了下拉框
const isChoose = ref(false);
// 用户信息
const userInfo = ref({ id: 0, avatarUrl: "" });

// 控制消息页面的加载显示
const isLoadingMsgs = ref(false);

// 退出登录的总方法
function myLogOut(){
  useSimpleConfirm('你确定要退出登录吗？').then(async()=>{
    // 发出请求，让token无效化
    await logOut()
    // TODO 清除浏览器token并跳转至登录页
    removeToken()
    useSuccessTip('成功退出登录~')
    router.push('/login')
  })
}

function handleMyClose(){
  isChoose.value = !isChoose.value
}

const batchMyUpdateIsRead = async () => {
  // 清零记录的未读数目
  unreadNum.value = 0;
  isLoadingMsgs.value = true;
  await batchUpdateIsRead();
  await dealAllMyMsg();
  useSuccessTip("消息已全部已读");
  isLoadingMsgs.value = false;
};

/**
 * 对自己的所有消息进行处理
 */
const dealAllMyMsg = async () => {
  // 重置记录的未读数目，防止重复计算
  unreadNum.value = 0;
  // 拿到所有普通消息
  let data = await getAllMyMsg(-1, COMMON_MSG_MODE);
  // TODO 将消息进行排序，总体上是按照createTime进行排序，然后未读消息要排在最前面
  data.sort((msg1, msg2) => {
    if (msg1.isRead !== msg2.isRead) {
      return msg1.isRead - msg2.isRead;
    }
    return (
      new Date(msg2.createTime).getTime() - new Date(msg1.createTime).getTime()
    );
  });
  // TODO 将未显示过的消息进行弹窗显示, 一次只弹出一个，关闭后弹出下一个
  let notDisplayedMsgs = data.filter(
    (item) => item.isDisplayed === NOT_DISPLAYED_MSG
  );
  receiveMsgArr(notDisplayedMsgs, 0);
  allMyMsgs.value = data;
  // TODO 记录未读的数目
  data.forEach((msgOne) => {
    if (msgOne.isRead === UNREAD_MSG) {
      unreadNum.value++;
    } else {
      return;
    }
  });
};

/**
 * 递归处理消息数组，实现一次只弹出一个，关闭后弹出下一个
 * @param {Array} msgDatas 消息数组
 * @param {Number} i 当前待弹出的消息的索引
 */
function receiveMsgArr(msgDatas = [], i = 0) {
  if (i > msgDatas.length - 1) {
    return;
  }
  const msgOne = msgDatas[i];
  ElNotification({
    title: `${msgOne.senderName}发来一条消息`,
    message: `${msgOne.msg}<br/><div style="color: teal">${msgOne.createTime}</div>`,
    type: "info",
    dangerouslyUseHTMLString: true,
    onClose: () => {
      updateIsDisplayed(msgOne.id);
      receiveMsgArr(msgDatas, ++i);
    },
  });
}

/**
 * 弹出一条消息的统一处理方法
 * @param {Object} msgData 消息数据
 */
function receiveMsg(msgData = {}) {
  ElNotification({
    title: `${msgData.senderName}发来一条消息`,
    message: `${msgData.msg}<br/><div style="color: teal">${msgData.createTime}</div>`,
    type: "info",
    onClose: () => {
      updateIsDisplayed(msgData.id);
    },
  });
}

/**
 * 初始化用户信息
 */
const initInfo = async () => {
  let { info } = await getInfo();
  userInfo.value = info;
  let res = await getMyAvatar(userInfo.value.id);
  userInfo.value.avatarUrl = res;
};

onMounted(() => {
  initInfo();
  // 初始化消息 + 实时接收消息
  mySocket.value = useMySocket((event) => {
    const msgData = JSON.parse(event.data);
    receiveMsg(msgData);
    unreadNum.value++;
  });
  dealAllMyMsg();
});
</script>

<style lang="scss" scoped>
@import url("/src/assets/font/iconfont.css");
@import "/src/styles/globalPage.scss";
@import "/src/styles/commonFlexStyles.scss";

$box-padding-y: 13px;
$box-padding-x: 12px;
.msgBox {
  width: 400px;
  box-sizing: border-box;
  overflow-x: hidden;
  & > * {
    padding: $box-padding-y $box-padding-x;
  }
  .myTitle {
    font-size: 17px;
    font-weight: 550;
    padding-bottom: $box-padding-y;
    @include flex-between;
    @include flex-center-y;
  }
  .boxLine {
    padding: 0;
    height: 2px;
    background-color: rgb(234, 237, 247);
    margin: 0 (-($box-padding-y));
  }
  .msgOne {
    padding: 8px $box-padding-x;
    &:hover {
      background: $secend-back-color;
    }
    .msgTitle {
      color: rgb(216, 1, 1);
      .ico {
        font-size: 20px;
        margin-right: 5px;
      }
    }
    .msg {
      font-size: 14px;
      padding: 5px 0;
    }
    .msg,
    .msgBottom {
      margin-left: 25px;
    }
    .msgBottom,
    .msgTitle {
      font-size: 13px;
    }
    .msgBottom {
      color: teal;
    }
  }
}
.topAll {
  position: fixed;
  top: 0;
  right: 0;
  width: 82%;
  height: $top-distance;
  box-sizing: border-box;
  padding-left: 2%;
  padding-right: 2%;
  overflow: hidden;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0px 0px 3px #928c8c64;
  @include flex-center-y;
  z-index: 10;
  user-select: none;
  .user {
    margin-left: auto;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 35px;
    align-items: center;
    & > * {
      text-align: center;
    }
    .msgIco {
      font-size: 25px;
      font-size: 30px;
      color: rgb(124, 136, 177);
      cursor: pointer;
    }
    .avatar {
      height: 60%;
      border-radius: 50%;
    }
    .name {
      font-size: 18px;
      font-weight: bold;
      color: $title-font-color;
    }
    .funChoose {
      cursor: pointer;
      font-size: 15px;
      color: rgb(161, 169, 198);
      display: inline-block;
    }
    .openAct {
      transform: rotate(-90deg);
    }
  }
}
</style>