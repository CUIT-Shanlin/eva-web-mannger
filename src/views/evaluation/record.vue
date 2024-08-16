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
                <div style="font-size: 20px">
                  {{getShowNum(evaTaskCompleteMsg.totalNum - evaTaskCompleteMsg.evaNum)}}
                </div>
              </div>
              <div class="bottomText">
                今日 {{getShowNum(evaTaskCompleteMsg.moreEvaNum,true)}}
                <i :class="{iconfont: true, ico: true,
                downIco: (evaTaskCompleteMsg.totalNum - evaTaskCompleteMsg.evaNum) < 0}">&#xe6e9;</i>
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
                <div class="topText">新增评教任务(个)</div>
                <div style="font-size: 20px">
                  {{getShowNum(evaTaskCompleteMsg.moreEvaNum)}}
                </div>
              </div>
              <div class="bottomText">
                较昨日 {{getShowNum(evaTaskCompleteMsg.moreNum,true)}}
                <i :class="{iconfont: true, ico: true, downIco: evaTaskCompleteMsg.moreNum < 0}">&#xe6e9;</i>
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
                <div style="font-size: 20px">{{getShowNum(evaScoreMsg.lowerNum)}}</div>
              </div>
              <div class="bottomText">
                今日 {{getShowNum(evaScoreMsg.moreNum, true)}}
                <i :class="{iconfont: true, ico: true, downIco: evaScoreMsg.moreNum < 0}">&#xe6e9;</i>
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
                <div class="topText">95分以上占比(%)</div>
                <div style="font-size: 20px">{{getShowNum(evaScoreMsg.percent)}}</div>
              </div>
              <div class="bottomText">
                较昨日 {{getShowNum(evaScoreMsg.morePercent, true)}}%
                <i :class="{iconfont: true, ico: true, downIco: evaScoreMsg.morePercent < 0}">&#xe6e9;</i>
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
import { getEvaSituation, getEvaScoreSituation } from '@/api/evaluation';
import { choreDateStr } from "@/utils/dateUtil";
import { onMounted, ref } from "vue";
import * as echarts from "echarts";

// 存所有老师的基础信息
const allUserMsg = ref([]);

// 存所有课程的基础信息
const allCourseMsg = ref([]);

// 存所有学院名
const allDepartments = ref([]);

// 存评教任务完成情况信息
const evaTaskCompleteMsg = ref({})

// 存评教分数统计基础信息
const evaScoreMsg = ref({})

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
 * 处理显示的数字，让数字在加载过来之前有加载显示
 * @param {*} num 
 * @param {Boolean} isShowSymbol
 */
function getShowNum(num, isShowSymbol = false){
  const DEFAULT_SHOW = '--'
  num = (!num && num !== 0) ? DEFAULT_SHOW : num
  if(isShowSymbol){
    return num >= 0 ? `+${num}` : num
  }
  return num
}

/**
 * 获取评教任务完成情况信息
 */
const getEvaTaskMsg = async()=>{
  let res = await getEvaSituation()
  evaTaskCompleteMsg.value = res
}

/**
 * 获取评教分数统计基础信息
 */
const getEvaScoreMsg = async()=>{
  let res = await getEvaScoreSituation()
  evaScoreMsg.value = res
}

/**
 * 初始化所有的chart
 */
function initCharts() {
  let circle1 = echarts.init(document.getElementById("circle1"));
  let circle2 = echarts.init(document.getElementById("circle2"));
  let line1 = echarts.init(document.getElementById("line1"));
  let line2 = echarts.init(document.getElementById("line2"));
  // TODO 初始化第一个图形区
  getEvaTaskMsg().then(()=>{
    circle1.setOption(getCircleOption("评教任务完成情况", [
      {
        name: '待完成任务',
        value: evaTaskCompleteMsg.value.totalNum - evaTaskCompleteMsg.value.evaNum
      },
      {
        name: '已完成任务',
        value: evaTaskCompleteMsg.value.evaNum
      }
    ]));
    line1.setOption(getLineOption(evaTaskCompleteMsg.value.evaNumArr));
  })
  // TODO 初始化第二个图形区
  getEvaScoreMsg().then(()=>{
    circle2.setOption(getCircleOption("分数统计情况", [
      {
        name: '低于95分的评教数目',
        value: evaScoreMsg.value.lowerNum
      },
      {
        name: '95分及以上的评教数目',
        value: evaScoreMsg.value.totalNum - evaScoreMsg.value.lowerNum
      }
    ]));
    line2.setOption(getLineOption(evaScoreMsg.value.percentArr));
  })

  
}

/**
 * 加载线形图配置及其数据
 * @param {Array} data 数据
 */
function getLineOption(myData = [
  {
    date: '2005-08-17',
    value: 100
  }
]){
  // 找到data中的最值
  let min = myData[0].value
  let max = myData[0].value
  myData.map(item => item.value).forEach(it => {
    max = it > max ? it : max
    min = it < min ? it : min
  })

  return {
      xAxis: {
        data: myData.map(item => `截止${choreDateStr(item.date)}日完成的评教数目`),
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
      tooltip: {
        trigger: 'axis',
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
          min,
          max,
        },
      ],
      series: [
        {
          data: myData.map(it => it.value),
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
function getCircleOption( title = '统计情况', 
  myData = [
    {
      name: '待完成情况',
      value: 1000
    },
    {
      name: '已完成情况',
      value: 800
    }
  ]){
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
            value: myData[1].value,
            name: myData[1].name,
            itemStyle: { color: "rgb(24,144,255)", borderRadius: "100px" },
          },
          {
            value: myData[0].value,
            name: myData[0].name,
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
              .downIco {
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
              height: 130%;
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