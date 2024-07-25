<!-- 选择学期的组件 -->
<template>
    <div class="semAll">
        <div class="changeFun">
            切换学期
            <span class="iconfont ico">&#xe6a8;</span>
        </div>
        <div class="show">
            {{checkedSemester.startYear}}
            <span style="margin: 0 10px;">———</span>
            {{checkedSemester.endYear}}
        </div>
    </div>
</template>
 
<script setup>
import { getAllSemester,getNowSemester } from '@/api/semester'
import { onMounted, reactive, ref } from 'vue'

// 存当前显示的学期信息
const checkedSemester = ref({})

const initSemesters = async()=>{
    let res = await getNowSemester()
    checkedSemester.value = res
    let {dataArr} = await getAllSemester()
    console.log('===================>>>>>')
    console.log(res)
    console.log(dataArr)
    console.log('===================>>>>>')
}
onMounted(()=>{
    initSemesters()
})
</script>
 
<style lang="scss" scoped>
@import url('../assets/font/iconfont.css');
@import '../styles/commonFlexStyles.scss';

 .semAll{
    height: 70%;
    box-sizing: border-box;
    border: 1.5px rgb(210,213,225) solid;
    border-radius: 10px;
    padding: 10px 0;
    background: rgb(250,252,254);
    color: rgb(191,199,224);
    font-weight: 550;
    @include flex-center;
    padding: 0 30px;
    .changeFun{
        .ico{
            margin: 0 15px;
            color: #C4C4C4;
        }
    }
    .show{
        border-left: 2px #C4C4C4 solid;
        padding-left: 15px;
    }
 }
</style>