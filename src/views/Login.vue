<template>
  <div class="loginAll">
    <div class="dialogBox">
      <div class="loginDialog">
        <h1 class="title">欢迎使用智慧评教后台</h1>
        <div class="iptBar">
          <div class="iconfont ico">&#xe65e;</div>
          <div class="iptBox">
            <input
              class="ipt"
              placeholder="请输入账号"
              v-model="userMsg.username"
            />
          </div>
        </div>
        <div class="iptBar">
          <div class="iconfont ico">&#xe635;</div>
          <div class="iptBox">
            <input
              class="ipt"
              placeholder="请输入密码"
              type="password"
              v-model="userMsg.password"
            />
          </div>
        </div>
        <div class="checkboxLine">
          <input
            type="checkbox"
            id="box1"
            v-model="userMsg.fun.rememberUsername"
          />
          <label for="box1">记住账号</label>

          <input type="checkbox" id="box2" v-model="userMsg.fun.autoLogin" />
          <label for="box2">自动登录</label>
        </div>

        <button class="btn" @click="useLogin()" v-loading="isLoadingBtn" :disabled="isLoadingBtn">立即登录</button>
      </div>
    </div>
    <img src="../assets/img/loginBack2.png" class="imgShow" />
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { login } from "@/api/login";
import { useFailedTip, useSuccessTip } from "@/utils/msgTip";
import { isSpace } from "@/utils/stringUtil";
import { setMyToken, getUsername, setUsername } from "@/utils/auth";
import { useRouter } from "vue-router";

const router = useRouter();

// 控制登录按钮的加载显示，防止多次登录
const isLoadingBtn = ref(false)

// 存输入的登录信息
const userMsg = reactive({
  username: getUsername(),
  password: "",
  fun: {
    rememberUsername: true,
    autoLogin: true,
  },
});
// 登录
const useLogin = async () => {
  isLoadingBtn.value = true
  if (isSpace(userMsg.username)) {
    useFailedTip("用户名不能为空");
    isLoadingBtn.value = false
    return;
  }
  if (isSpace(userMsg.password)) {
    useFailedTip("密码不能为空或纯空格");
    isLoadingBtn.value = false
    return;
  }

  let res = await login(userMsg);
  // 登录成功,存token
  setMyToken(res.token, userMsg.fun.autoLogin);

  // 浏览器存用户名
  if (userMsg.fun.rememberUsername) {
    setUsername(userMsg.username);
  }
  useSuccessTip("登录成功");
  router.push("/home");
//   isLoadingBtn.value = false
};
</script>

<style lang="scss" scoped>
@import url("../assets/font/iconfont.css");
@import "../styles/commonFlexStyles.scss";

.loginAll {
  background-image: url("../assets/img/loginBack1.png");
  height: 100%;
  width: 100%;
  display: flex;
  top: 0;
  left: 0;
  overflow: hidden;
  position: fixed;
  .dialogBox {
    width: 42%;
    height: 100%;
    @include flex-center;
    .loginDialog {
      // width: 59.64%;
      // height: 55.6%;
      height: 50%;
      width: 47%;
      padding: 7% 7%;
      border-radius: 20px;
      background: #eff6ff;
      box-shadow: 0px 10px 30px #b7c1f1;
      .title {
        text-align: center;
        margin-bottom: 40px;
      }
      .iptBar {
        $iptFontColor: rgb(50, 78, 199);
        width: 100%;
        height: 35px;
        padding: 11px 0;
        margin-top: 30px;
        margin-bottom: 12px;
        border-radius: 8px;
        background: rgb(220, 232, 255);
        @include flex-center-y;
        color: $iptFontColor;
        .ico {
          font-size: 30px;
          padding: 0 17px;
        }
        .iptBox {
          height: 80%;
          padding: 0 17px;
          border-left: 1.5px $iptFontColor solid;
          .ipt {
            width: 100%;
            height: 100%;
            border: 0;
            background: rgba(255, 255, 255, 0);
            font-size: 20px;
          }
          input:focus {
            outline: none;
            border: none;
          }
          input::placeholder {
            color: $iptFontColor;
          }
        }
      }
      .checkboxLine {
        margin-top: 5px;
        float: right;
        @include flex-center-y;
        $boxBorderColor: rgb(100, 122, 213);
        $boxBorderSize: 1.5px;
        color: $boxBorderColor;
        input[type="checkbox"] {
          width: 14px;
          height: 14px;
          margin-right: 8px;
          margin-left: 15px;
          background-color: #fff;
          border: $boxBorderSize solid rgb(137, 157, 238);
          border-radius: 2px;
          color: #fff;
          text-align: center;
          line-height: 14px;
          -webkit-appearance: none;
          appearance: none;
          outline: none;
        }
        input[type="checkbox"]:hover {
          border: $boxBorderSize solid $boxBorderColor;
        }
        input[type="checkbox"]:checked {
          color: #fff;
          background-color: $boxBorderColor;
          border: $boxBorderSize solid $boxBorderColor;
        }
        input[type="checkbox"]:after {
          content: "\2713";
        }
      }

      .btn {
        margin-top: 55px;
        outline: none;
        border-radius: 5px;
        border: 0px;
        background: rgb(78, 105, 244);
        width: 100%;
        height: 12%;
        font-size: 20px;
        color: #fff;
        transition: border-radius 2s;
        -webkit-transition: border-radius 1s;
        &:hover {
          background: rgb(109, 128, 228);
          border-bottom-right-radius: 50px;
          border-top-left-radius: 50px;
          border-bottom-left-radius: 10px;
          border-top-right-radius: 10px;
        }
      }
    }
  }
  .imgShow {
    width: 58.4375%;
    position: fixed;
    right: 0;
  }
}
</style>