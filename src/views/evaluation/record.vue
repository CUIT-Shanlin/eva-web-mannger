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
      <div class="dataShowOne" style="margin-right: 15px">
        <div class="dataTitle">
          <span>评教任务完成度</span>
          <el-link type="primary">详情</el-link>
        </div>
        <div class="chartBox">
          <div class="circleBox">
            <div class="textMsg">
              <div>
                <div class="topText">待评教(个)</div>
                <div style="font-size: 20px">10</div>
              </div>
              <div class="bottomText">
                今日 +1
                <i class="iconfont ico">&#xe6e9;</i>
              </div>
            </div>
            <div class="imgShow">
              <div id="circle1" ref="circle1"></div>
            </div>
          </div>
          <div class="myBorder">&nbsp;</div>
          <div class="lineBox">
            <div class="textMsg">
              <div>
                <div class="topText">评教情况(个)</div>
                <div style="font-size: 20px">170</div>
              </div>
              <div class="bottomText">
                较昨日 +1
                <i class="iconfont ico">&#xe6e9;</i>
              </div>
            </div>
            <div class="imgShow">
              <div id="line1" ref="line1" autoresize></div>
            </div>
          </div>
        </div>
      </div>

      <div class="dataShowOne" style="margin-right: 15px">
        <div class="dataTitle">
          <span>分数情况统计</span>
          <el-link type="primary">详情</el-link>
        </div>
        <div class="chartBox">
          <div class="circleBox">
            <div class="textMsg">
              <div>
                <div class="topText">95分以下(个)</div>
                <div style="font-size: 20px">10</div>
              </div>
              <div class="bottomText">
                今日 +1
                <i class="iconfont ico">&#xe6e9;</i>
              </div>
            </div>
            <div class="imgShow">
              <div id="circle2" ref="circle2"></div>
            </div>
          </div>
          <div class="myBorder">&nbsp;</div>
          <div class="lineBox">
            <div class="textMsg">
              <div>
                <div class="topText">95分以上占比(个)</div>
                <div style="font-size: 20px">90.24</div>
              </div>
              <div class="bottomText">
                较昨日 +1
                <i class="iconfont ico">&#xe6e9;</i>
              </div>
            </div>
            <div class="imgShow">
              <div id="line2" ref="line2" autoresize></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { getAllBaseUser } from "@/api/user";
import { getAllBaseCourse } from "@/api/course";
import { getAllDepartments } from "@/api/other";
import { onMounted, ref } from "vue";
import * as echarts from "echarts";

// 存所有老师的基础信息
const allUserMsg = ref([]);

// 存所有课程的基础信息
const allCourseMsg = ref([]);

// 存所有学院名
const allDepartments = ref([]);

// 存分页请求数据
const pageReqData = ref({
  size: 0,
  page: 1,
  queryObj: {
    keyword: "",
    teacherIds: [],
    evaTeacherIds: [],
    courseIds: [],
    departmentName: "",
    startEvaluateTime: null,
    endEvaluateTime: null,
  },
});

/**
 * 初始化所有的chart
 */
function initCharts() {
  // TODO 初始化环形图
  let circle1 = echarts.init(document.getElementById("circle1"));
  let circle2 = echarts.init(document.getElementById("circle2"));
  circle1.setOption(getCircleOption("评教任务完成情况"));
  circle2.setOption(getCircleOption("分数统计情况"));

  // TODO 初始化线形图
  let line1 = echarts.init(document.getElementById("line1"));
  let line2 = echarts.init(document.getElementById("line2"));
  line1.setOption(getLineOption());
  line2.setOption(getLineOption());
}

/**
 * 加载线形图配置及其数据
 * @param {Array} data 数据
 */
function getLineOption(data = []){
  return {
      xAxis: {
        type: "category",
        splitLine: { show: false },
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        splitLine: { show: false },
        axisLabel: { show: false },
      },
      toolbox: {
        show: true,
        feature: {
          magicType: {
            type: ["line", "bar"],
            title: { line: "切换为折线图", bar: "切换为柱形图" },
          },
          saveAsImage: { title: "下载图表" },
        },
        top: "10%",
        itemSize: 12,
      },
      visualMap: [
        {
          show: false,
          type: "continuous",
          seriesIndex: 0,
          min: 400,
          max: 2000,
        },
      ],
      series: [
        {
          data: [40, 932, 600, 934, 1290, 1330, 2000],
          type: "line",
          smooth: true,
        },
      ],
    };
}

/**
 * 加载环形图配置及其数据
 * @param {Array} data 数据
 */
function getCircleOption( title = '统计情况', data = []){
  return {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: title,
        type: "pie",
        radius: ["55%", "70%"],
        avoidLabelOverlap: false,
        // padAngle: -10,
        labelLine: {
          show: false,
        },
        data: [
          {
            value: 1000,
            name: "已完成任务",
            itemStyle: { color: "rgb(24,144,255)", borderRadius: "100px" },
          },
          {
            value: 500,
            name: "待完成任务",
            itemStyle: { color: "rgb(242,243,245)" },
          },
        ],
      },
    ],
  }
}

onMounted(() => {
  getAllBaseUser().then((res) => {
    allUserMsg.value = res.dataArr;
  });
  getAllBaseCourse().then((res) => {
    allCourseMsg.value = res.dataArr;
  });
  getAllDepartments().then((res) => {
    allDepartments.value = res.dataArr;
  });
  initCharts();
});
</script>

<style lang="scss" scoped>
@import url("../../assets/font/iconfont.css");
@import "../../styles/commonFlexStyles.scss";
@import "../../styles/globalPage.scss";

$gap-size: 15px;
.pageAll {
  overflow: auto;
  & > * {
    padding: $gap-size;
    background: #fff;
  }
  .topFunBar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    margin-bottom: $gap-size;
  }
  .chartsShow {
    overflow: hidden;
    @include flex-center-y;
    .dataShowOne {
      width: 50%;
      .dataTitle,
      .chartBox,
      .circleBox,
      .lineBox {
        @include flex-center-y;
        justify-content: space-between;
      }
      .dataTitle {
        font-size: 15px;
        margin-bottom: $gap-size;
      }
      .chartBox {
        padding: $gap-size;
        box-shadow: act-box-shadow(2px);
        $box-height: 110px;
        $chart-size: 120px;
        .circleBox,
        .lineBox {
          width: 50%;
          height: $box-height;
          .textMsg {
            height: 80%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: rgb(38, 38, 38);
            .topText {
              margin-bottom: 10px;
              font-size: 15px;
            }
            .bottomText {
              font-size: 12px;
              .ico {
                margin-left: 20px;
                color: rgb(255, 182, 118);
              }
              .upIco {
                display: inline-block;
                transform: rotate(180deg);
                color: rgb(221, 83, 83);
              }
            }
          }
          #circle1,#circle2 {
            width: $chart-size;
            height: $chart-size;
          }
        }
        .myBorder {
          width: 0px;
          height: $box-height * 0.8;
          border-left: 2px dashed rgb(204, 204, 204);
          $gap-border: 30px;
          margin-right: $gap-border;
          margin-left: $gap-border - 20px;
        }
        .lineBox {
          .imgShow {
            width: $chart-size;
            height: $chart-size;
            #line1,#line2 {
              height: 142%;
            }
          }
        }
      }
      .chartBox:hover {
        box-shadow: act-box-shadow(5px);
      }
    }
  }
}
</style>