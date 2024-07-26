<!-- 选择学期的组件 -->
<template>
    <div class="semAll">
        <div class="changeFun">
            切换学期
            <el-popover
            placement="bottom"
            trigger="click"
            :visible=isChoose
            popper-class="myPopper"
            :width="300"
            >
                <template #reference>
                    <span :class="{iconfont: true, ico: true, act: isChoose}"
                    @click="isChoose = !isChoose">&#xe6a8;</span>
                </template>
                <div class="myPopper">
                    <div class="showAll">
                        <span class="oneSem" v-for="semester in semesters" :key="semester.id">
                            2023-2024
                        </span>
                    </div>
                    <div class="semPeriod">
                        <div class="periodOne">上学期</div>
                        <div class="periodOne">下学期</div>
                    </div>
                </div>
            </el-popover>
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
import { onMounted, ref } from 'vue'

// 存当前显示的学期信息
const checkedSemester = ref({})
const isChoose = ref(false)

// 存所有的学期信息
const semesters = ref([])
const initSemesters = async()=>{
    let res = await getNowSemester()
    checkedSemester.value = res
    let {dataArr} = await getAllSemester()
    semesters.value = dataArr
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


$sem-back-color: rgb(250,252,254);
$sem-border-color: rgb(210,213,225);
$sem-font-color: rgb(191,199,224);

$sem-line-color: #C4C4C4;

.semAll{
    height: 70%;
    box-sizing: border-box;
    border: 1.5px $sem-border-color solid;
    border-radius: 10px;
    padding: 10px 0;
    background: $sem-back-color;
    color: $sem-font-color;
    font-weight: 550;
    @include flex-center;
    padding: 0 30px;
    .changeFun{
        .ico{
            margin: 0 15px;
            color: $sem-line-color;
        }
        .act{
            display: inline-block;
            transform: rotate(-90deg);
        }
    }
    .show{
        border-left: 2px $sem-line-color solid;
        padding-left: 15px;
    }
    
 }
.myPopper{
    user-select: none;
    @include flex-center-x;
    .showAll{
        width: 200px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        padding-right: 10px;
    
    }
    .semPeriod{
        width: 100px;
        border-left: 1.5px $sem-line-color solid;
        text-align: center;
        
    }
}

.oneSem{
    padding: 5px 0;
}
.periodOne{
    margin: 1px 0;
    margin-left: 2px;
}
.oneSem,.periodOne{
    text-align: center;
    border: 1px solid transparent;
    font-weight: 550;
    border-radius: 5px;
    color: $sem-font-color;
}

.periodOne:hover,.oneSem:hover{
    border-color: $sem-border-color;
    background-color: $sem-back-color;
}
</style>