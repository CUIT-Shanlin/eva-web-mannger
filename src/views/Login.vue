<template>
  <div class="loginAll">
    <div class="dialogBox">
        <div class="loginDialog">
            <h1 class="title">欢迎登录智慧评教后台</h1>

            <div class="iptBar">
                1
            </div>
        </div>
    </div>
    <img src="../assets/loginBack2.png" class="imgShow"/>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import '../styles/commonFlexStyles.scss';

.loginAll{
    background-image: url("../assets/loginBack1.png");
    height: 100%;
    width: 100%;
    display: flex;
    top: 0;
    left: 0;
    overflow: hidden;
    position: fixed;
    .dialogBox{
        width: 42%;
        height: 100%;
        @include flex-center;
        .loginDialog{
            // width: 59.64%;
            // height: 55.6%;
            height: 50%;
            width: 47%;
            padding: 7% 7%;
            border-radius: 20px;
            background: #EFF6FF;
            box-shadow: 0px 10px 30px #b7c1f1;
            
            .title{
                text-align: center;
                margin-bottom: 40px;
            }
            .iptBar{
                width: 93%;
                height: 35px;
                padding: 11px 11px;
                border-radius: 8px;
                background: rgb(220,232,255);
                @include flex-center-y;
            }
        }
    }
    .imgShow{
        width: 58.4375%;
        position: fixed;
        right: 0;
    }
}
</style>