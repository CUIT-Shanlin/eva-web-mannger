<template>
  <div class="loginAll">
    <div class="dialogBox">
        <div class="loginDialog">
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
            width: 59.64%;
            height: 55.6%;
            border-radius: 20px;
            background: #EFF6FF;
            box-shadow: 0px 10px 30px #b7c1f1;
        }
    }
    .imgShow{
        width: 58.4375%;
        position: fixed;
        right: 0;
    }
}
</style>