<!-- 评教记录页面 -->
<template>
  <PageTitle content="评教记录列表" />
  <div class="pageAll">
    <div class="topFunBar">
        <el-select
        v-model="pageReqData.queryObj.teacherIds"
        multiple
        filterable
        clearable
        placeholder="请输入教学老师姓名"
        >
            <el-option
            v-for="user in allUserMsg"
            :key="user.id"
            :label="user.name"
            :value="user.id"
            />
        </el-select>
        <el-select
        v-model="pageReqData.queryObj.evaTeacherIds"
        multiple
        filterable
        clearable
        placeholder="请输入评教老师姓名"
        >
            <el-option
            v-for="user in allUserMsg"
            :key="user.id"
            :label="user.name"
            :value="user.id"
            />
        </el-select>
        <el-select
        v-model="pageReqData.queryObj.courseIds"
        multiple
        filterable
        clearable
        placeholder="请输入评教课程名称"
        >
            <el-option
            v-for="course in allCourseMsg"
            :key="course.id"
            :label="course.name"
            :value="course.id"
            />
        </el-select>
        <el-select
        clearable
        v-model="pageReqData.queryObj.departmentName"
        placeholder="请选择课程所在的学院名"
        >
            <el-option
            v-for="department in allDepartments"
            :key="department"
            :label="department"
            :value="department"
            />
        </el-select>
    </div>
    <div class="chartsShow">
      <div class="dataShowOne" style="margin-right: 15px;">
        <div class="dataTitle">
            <span>评教任务完成度</span>
            <el-link type="primary">详情</el-link>
        </div>
        <div class="chartBox">
            6
        </div>
      </div>


      <div class="dataShowOne">
        <div class="dataTitle">
            <span>分数情况统计</span>
            <el-link type="primary">详情</el-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { getAllBaseUser } from '@/api/user';
import { getAllBaseCourse } from '@/api/course';
import { getAllDepartments } from "@/api/other";
import { onMounted, ref } from 'vue';

// 存所有老师的基础信息
const allUserMsg = ref([])

// 存所有课程的基础信息
const allCourseMsg = ref([])

// 存所有学院名
const allDepartments = ref([])

// 存分页请求数据
const pageReqData = ref({
  size: 0,
  page: 1,
  queryObj: {
    keyword: "",
    teacherIds: [],
    evaTeacherIds: [],
    courseIds: [],
    departmentName: '',
    startEvaluateTime: null,
    endEvaluateTime: null,
  },
});






onMounted(()=>{
    getAllBaseUser().then(res => {
        allUserMsg.value = res.dataArr
    })
    getAllBaseCourse().then(res => {
        allCourseMsg.value = res.dataArr
    })
    getAllDepartments().then(res => {
        allDepartments.value = res.dataArr
    })
})

</script>

<style lang="scss" scoped>
@import "../../styles/commonFlexStyles.scss";
@import "../../styles/globalPage.scss";

.pageAll{
    overflow: auto;
    & > * {
        padding: 15px;
        background: #FFF;
    }
    .topFunBar{
        display: grid;
        grid-template-columns:repeat(4,1fr);
        gap: 30px;
        margin-bottom: 15px;
    }
    .chartsShow{
        @include flex-center-y;
        .dataShowOne{
            width: 50%;
            .dataTitle{
                @include flex-center-y;
                justify-content: space-between;
                font-size: 15px;
                margin-bottom: 15px;
            }
            .chartBox{
                box-shadow: $common-box-shadow;
                box-shadow: 0px 5px 5px $box-shadow-color;
            }
        }
        
    }
}



</style>