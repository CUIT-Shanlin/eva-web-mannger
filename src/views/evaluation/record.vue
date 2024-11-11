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
        @change="getMyPageData"
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
        @change="getMyPageData"
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
        @change="getMyPageData"
      >
        <el-option
          v-for="course in allCourseMsg"
          :key="course.id"
          :value="course.id"
          :label="getMyCourseLabel(course)"
       />
      </el-select>
      <el-select
        clearable
        v-model="pageReqData.queryObj.departmentName"
        placeholder="请选择授课老师的专业"
        @change="getMyPageData"
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
          <el-link type="primary" @click="$router.push('/evaluation/task')" :disabled="!hasBtnPermission('evaluate.task.query')">详情</el-link>
        </div>
        <div class="chartBox">
          <div class="circleBox">
            <div class="textMsg">
              <div>
                <div class="topText">待评教(个)</div>
                <div style="font-size: 20px">
                  {{getShowNum(evaTaskCompleteMsg.totalNum)}}
                </div>
              </div>
              <div class="bottomText">
                今日 {{getShowNum(evaTaskCompleteMsg.moreEvaNum,true)}}
                <i :class="{iconfont: true, ico: true,
                downIco: (evaTaskCompleteMsg.moreEvaNum) < 0}">&#xe6e9;</i>
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
          <!-- <el-link type="primary">详情</el-link> -->
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

    <div class="dataShow">
      <div class="funBar">
        <el-button
          :disabled="!hasBtnPermission('evaluate.record.export')"
          type="primary"
          @click="exportMyRecordFile()"
          >导出记录</el-button
        >
        <div class="iptFuns">
          <el-input
          v-model="pageReqData.queryObj.keyword"
          style="width: 260px;height: 30px;"
          placeholder="请输入评教内容进行查询"
          clearable
          @change="getMyPageData"
          >
            <template #append>
              <el-button :icon="Search" @click="getMyPageData()"/>
            </template>
          </el-input>
          <el-date-picker
          v-model="evaTimeArr"
          type="daterange"
          range-separator="—"
          start-placeholder="开始评教时间"
          end-placeholder="结束评教时间"
          :shortcuts="shortcuts"
          @change="getMyPageData()"
          style="width: 240px;"
          />
          <el-cascader
            :options="options"
            :props="props"
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            placeholder="请选择上课时间段"
            clearable
            @change="deelChooseCourseTimes"
            style="width: 300px;"
          />
        </div>
      </div>
      <el-table
      :data="pageData.records"
      v-loading="isLoadingTable"
      class="tableBox"
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="createTime" label="评教日期" width="200" sortable/>
        <el-table-column prop="evaTeacherName" label="评教老师"/>
        <el-table-column prop="courseName" label="评教课程"/>
        <el-table-column label="上课时间" width="300">
          <template #default="scope">
            {{getCourseTime(scope.row.courseTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="teacherName" label="教学老师"/>
        <el-table-column label="综合评分">
          <template #default="scope">
            {{formatNumberToOneDecimalPlace(scope.row.averScore)}}
          </template>

        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-link class="iconfont operation" type="primary" @click="initDialog(scope.row)"
            :disabled="!hasBtnPermission('evaluate.record.query')"
            >
              详情
            </el-link>
            <el-link class="iconfont operation" type="primary" @click="removeOneRecord(scope.row)"
            :disabled="!hasBtnPermission('evaluate.record.delete')"
            >
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <!-- 评教表单详情弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        width="400"
        append-to-body
        title="评教表单"
      >
        <div class="propOne" v-for="(prop, i) in JSON.parse(checkedRecord.formPropsValues)" :key="i">
          <span>{{prop.prop}}</span>
          <el-input :model-value="prop.score" class="myIpt"></el-input>
        </div>
        <p>评价：</p>
        <el-input type="textarea" :rows="5" :model-value="checkedRecord.textValue"></el-input>
        <div class="propOne">
          <span>综合评分</span>
          <el-input :model-value="formatNumberToOneDecimalPlace(checkedRecord.averScore)" class="myIpt"></el-input>
        </div>
    </el-dialog>
    
      <el-button @click="batchRemoveMyRecords()">批量删除</el-button>
      <el-pagination
      v-model:current-page="pageData.current"
      v-model:page-size="pageData.size"
      :page-sizes="[5, 10, 20, 40]"
      :size="pageData.size"
      layout="sizes, prev, pager, next, jumper"
      :total="pageData.total"
      @size-change="getMyPageData"
      @current-change="getMyPageData"
      background
      class="myPage"
      />
    </div>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { getAllBaseUser } from "@/api/user";
import { getAllBaseSubject } from "@/api/courseList";
import { getAllDepartments } from "@/api/other";
import {
  getEvaSituation,
  getEvaScoreSituation,
  getPageData,
  removeOne,
  batchRemove,
  exportRecordFile
} from '@/api/evaluation';
import { getOneSemster } from '@/api/semester';
import {
  choreDateStr,
  formatDateNotTime
} from "@/utils/dateUtil";
import { removeSpace, replaceStr } from "@/utils/stringUtil";
import { isEmptyArr, isEmptyObj } from "@/utils/objUtil";
import { useSimpleConfirm, useSuccessTip, useFailedTip } from "@/utils/msgTip";
import {
  getShowNum,
  formatNumberToOneDecimalPlace
} from '@/utils/numUtil';
import { hasBtnPermission } from '@/utils/btnPermission';
import { allCourseNature } from "@/utils/service/staticData";
import { formatDate } from '@/utils/dateUtil';
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import * as echarts from "echarts";

const route = useRoute()
// 存所有老师的基础信息
const allUserMsg = ref([]);

// 存所有课程的基础信息
const allCourseMsg = ref([]);

// 存所有专业名
const allDepartments = ref([]);

// 存评教任务完成情况信息
const evaTaskCompleteMsg = ref({})

// 存评教分数统计基础信息
const evaScoreMsg = ref({})

// 存当前正在操作的评教记录
const checkedRecord = ref({})
// 控制弹窗的开启
const dialogVisible = ref(false)
// 用于确定表格是否是loading状态
const isLoadingTable = ref(false)
// 存分页请求数据
const pageReqData = ref({
  size: 10,
  page: 1,
  queryObj: {
    keyword: "",
    teacherIds: [],
    evaTeacherIds: [],
    courseIds: [],
    departmentName: "",
    startEvaluateTime: null,
    endEvaluateTime: null,
    courseTimes: []
  },
});
// 存分页获取的数据
const pageData = ref({
  total: 0,
  size: 10,
  current: 1,
  records: [],
});

// 存创建日期对应数组
const evaTimeArr = ref([])

// 存勾选了的评教记录
const handleRecords = ref([])

// 级联选择器的选项
const options = ref([])
// 级联选择器的配置
const props = { multiple: true }


// 数字与周的映射（num-1）
const weeks = ['一','二','三','四','五','六','日']

const lenArr = [20,7,11,11]
const strArr = ['第|周','星期|','第|节课开始','第|节课结束']



/**
 * 导出并下载评教记录文件
 */
const exportMyRecordFile = async()=>{
    let myBlob = await exportRecordFile()
    // 创建一个链接元素来下载文件
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(myBlob); // 创建一个表示这个文件的URL
    let semester = await getOneSemster()
    // dkh: 设置下载文件的名称
    link.download = `${semester.startYear}-${semester.endYear}-${semester.period + 1}学期评教记录（${formatDateNotTime(new Date())}）.xlsx`;

    // 触发下载操作
    document.body.appendChild(link);
    link.click();

    // 清理操作，移除创建的链接元素并释放URL对象
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
}



function getMyCourseLabel(course = {}){
  return `${course.name} - ${allCourseNature.find(natureObj => natureObj.value === course.nature).name}`
}

/**
 * 生成级联选择器的选项
 * @param {Number} level 当前递归层数
 * @param {number} [maxLevel=4] 最大递归层数
 * @param {any[]} dataArr 当前层的数组
 */
function createOptions(level = 1, maxLevel = 4, dataArr = [], parentValue = 0){
  for (let i = 1;i <= lenArr[level - 1];i++) {
    const nodeOne = {
      value: i,
      label: replaceStr(i, strArr[level - 1]),
      children: []
    }
    if(level === 2){
      nodeOne.label = replaceStr(weeks[i - 1], strArr[level - 1])
    }
    // 非最后一层才进行递归
    if(level < maxLevel){
      dataArr.push(nodeOne)
      createOptions(level + 1,maxLevel,nodeOne.children,nodeOne.value)
    }else{
      // 最后一层按需加入
      if(parentValue <= nodeOne.value){
        dataArr.push(nodeOne)
      }
    }
  }
  if(level >= maxLevel){
    return
  }
}

/**
 * 处理教学时间的数据
 * @param {Array} data 
 */
function deelChooseCourseTimes(data = []){
  pageReqData.value.queryObj.courseTimes = []
  data.forEach(timeArr => {
    const courseTime = {
      week: timeArr[0],
      day: timeArr[1],
      startTime: timeArr[2],
      endTime: timeArr[3]
    }
    pageReqData.value.queryObj.courseTimes.push(courseTime)
  })
  getMyPageData()
}

function getCourseTime(obj = {}){
  return `第${obj.week}周 星期${weeks[obj.day - 1]}，第${obj.startTime}节课到第${obj.endTime}节课`
}

/**
 * 批量删除评教记录
 */
 function batchRemoveMyRecords(){
  if(isEmptyArr(handleRecords.value)){
    useFailedTip('未选中评教记录')
    return
  }
  useSimpleConfirm('你确定要删除所有选中的评教记录吗？').then(async()=>{
    const idList = handleRecords.value.map(record => record.id)
    let res = await batchRemove(idList)
    useSuccessTip('成功删除选中的评教记录')
    getMyPageData()
  })
}


function handleSelectionChange(records){
  handleRecords.value = records
}

/**
 * 删除一条评教记录
 * @param record 待删除的记录信息
 */
function removeOneRecord(record = {}){
  useSimpleConfirm('你确定要删除这条评教记录吗？').then(async()=>{
    let res = removeOne(record.id)
    useSuccessTip('成功删除一条评教记录')
    getMyPageData()
  })
}

/**
 * 初始化弹窗
 */
function initDialog(record = {}){
  checkedRecord.value = record
  dialogVisible.value = true
}


/**
 * 获取分页评教记录信息
 */
const getMyPageData = async()=>{
  isLoadingTable.value = true
  const queryObj = pageReqData.value.queryObj
  queryObj.keyword = removeSpace(queryObj.keyword)
  queryObj.startEvaluateTime = formatDate(evaTimeArr.value[0])
  queryObj.endEvaluateTime = formatDate(evaTimeArr.value[1])

  pageReqData.value.size = pageData.value.size;
  pageReqData.value.page = pageData.value.current;

  let res = await getPageData(pageReqData.value)
  pageData.value = res
  isLoadingTable.value = false
}

/**
 * 生成快速选择的value
 * @param {Number} days 天数 
 */
const evaCutValue = (days = 1)=>{
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
  return [start, end]
}

// 实现日期选择器的快速选择
const shortcuts = [
  {
    text: '上周',
    value: evaCutValue(7),
  },
  {
    text: '上个月',
    value: evaCutValue(30),
  },
  {
    text: '3个月前',
    value: evaCutValue(90),
  },
]

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
  // dkh: 初始化第一个图形区
  getEvaTaskMsg().then(()=>{
    circle1.setOption(getCircleOption("评教任务完成情况", [
      {
        name: '待完成任务',
        value: evaTaskCompleteMsg.value.totalNum
      },
      {
        name: '已完成任务',
        value: evaTaskCompleteMsg.value.evaNum
      }
    ]));
    line1.setOption(getLineOption(evaTaskCompleteMsg.value.evaNumArr));
  })
  // dkh: 初始化第二个图形区
  getEvaScoreMsg(95).then(()=>{
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
    line2.setOption(getLineOption(evaScoreMsg.value.percentArr, '95分及以上的记录占比'));
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
], suffix = '完成的评教数目'){
  // 找到data中的最值
  let min = myData[0].value
  let max = myData[0].value
  myData.sort((item1, item2) => new Date(item1.date).getTime() - new Date(item2.date).getTime()),
  myData.map(item => item.value).forEach(it => {
    max = it > max ? it : max
    min = it < min ? it : min
  })


  return {
      xAxis: {
        data: myData.map(item => `截止${choreDateStr(item.date)}日${suffix}`),
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
        label: {
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
// 初始化参数
  const query = route.query
  if(!isEmptyObj(query)){
    const queryObj = pageReqData.value.queryObj
    queryObj.courseIds.push(Number(query.courseId))
    queryObj.teacherIds.push(Number(query.teacherId))
    queryObj.departmentName = query.department
  }


  getAllBaseUser().then((res) => {
    allUserMsg.value = res;
  });
  getAllBaseSubject().then((res) => {
    allCourseMsg.value = res;
  });
  getAllDepartments().then((res) => {
    allDepartments.value = res;
  });
  initCharts();
  getMyPageData();
  createOptions(1, 4,options.value)
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
    margin-bottom: 25px;
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
  .dataShow{
    display: flex;
    flex-wrap: wrap;
    .funBar{
      width: 100%;
      @include flex-between;
      .iptFuns{
        display: grid;
        grid-template-columns: repeat(2, 1fr) 1.25fr;
        gap: 30px;
      }
    }
    .tableBox{
      width: 100%;
      margin-top: 50px;
      margin-bottom: 35px;
      overflow: auto;
    }
    .myPage {
      @include flex-center-y;
      margin-left: auto;
    }
  }
}
.propOne{
  @include flex-center-y;
  margin: 10px 0;
  .myIpt{
    width: 60px;
    margin-left: auto;
  }
}
:deep() {
  th.el-table__cell {
    font-size: 15px;
    font-weight: 500;
    color: black;
    background-color: rgb(250,250,250);
  }
  .el-table__body-wrapper{
    td{
       color: rgb(89,89,89); 
    }
  }
}

.operation{
  font-size: 14px;
  margin-right: 15px;
  // color: rgb(64,158,255);
  .ico{
    font-size: 18px;
  }
}
</style>