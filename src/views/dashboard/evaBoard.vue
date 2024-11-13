<!-- 评教看板页面 -->
<template>
  <PageTitle content="评教看板" />
  <div class="boardAll">
    <div class="commonBox commonLineBox" v-for="(it,i) in moreCounts" :key="i">
      <div class="txtBox flexUpDown">
        <div class="caption">
          <strong>{{i === 0 ? '上' : '本'}}周评教增长</strong>
        </div>
        <div class="largeTitle">{{getShowNum(it.moreNum)}}</div>
        <div class="tipFont">
          <span :class="{downFont: Number(it.morePercent) < 0}">{{getShowNum(it.morePercent,true)}}%</span>
          <i :class="{iconfont: true, upIco: true, downIco: Number(it.morePercent) < 0}">&#xe639;</i>
        </div>
      </div>
      <div :id="`line${2 - i}`" :ref="`line${2 - i}`" class="lineImg"></div>
    </div>
    
    <div class="commonBox flexUpDown">
      <div class="commonTitle">课程各分数占比</div>
      <div id="bar" ref="bar"></div>
    </div>

    <div class="commonBox">
      <div class="titleBox">
        <div class="commonTitle">评教次数</div>
        <div class="percent">{{getShowNum(100 * monthEvaNums[1] / (monthEvaNums[0] + monthEvaNums[1]))}}%</div>
      </div>
      <ProgressBar class="myProcessBar" :radio="`${formatNumberToOneDecimalPlace((100 * monthEvaNums[1] / (monthEvaNums[0] + monthEvaNums[1])))}%`"/>
      <div class="numShow">
        <span class="numOne" v-for="(num, i) in monthEvaNums" :key="i">
          <div class="caption">
            <strong>{{i === 0 ? '上' : '本'}}月数目</strong>
          </div>
          <div class="commonTitle">{{num}}</div>
        </span>
      </div>
    </div>

    <div class="largeBox">
      <div class="flexBetween">
        <div>
          <strong class="commonTitle">评教次数分析表</strong>
          <br/>
          <div class="description">
            和最近时间段评教次数进行对比，掌握总体评教的完成情况
          </div>
        </div>
        <el-color-picker v-model="myColor" @change="initMainLine"/>

        <!-- <div class="myColorBox">
          <el-color-picker v-model="myColor"/>
          <strong class="smallTitle">点击切换</strong>
          <i class="iconfont ico">&#xe600;</i>
        </div> -->
      </div>
      <div class="dataShow">
        <span v-for="(item,index) in myNumData" :key="index">
          <strong class="caption">{{item.title}}</strong>
          <br/>
          <div class="textAll">
            <span class="commonTitle">{{getShowNum(item.num)}}</span>
            <span :class="{percentTxt: true, downFont: item.percent < 0}">
              <span>{{getShowNum(item.percent, 2, true)}}</span>
              <br/>
              <span>%</span>
            </span>
            <i :class="{iconfont: true, upIco: true, downIco: item.percent < 0}">
              &#xe639;
            </i>
          </div>
        </span>
      </div>
      <div id="mainLine" ref="mainLine"></div>
    </div>

    <div class="longBox">
      <div class="flexBetween" style="margin-bottom: 5px;">
        <div class="commonTitle">未达标用户</div>
        <el-radio-group v-model="unqualifiedType" @change="getMyUnqualifiedUsers">
          <el-radio-button label="评教" :value="EVA_UNQUALIFIED_USER" />
          <el-radio-button label="被评" :value="UNQUALIFIED_USER" />
        </el-radio-group>
      </div>
      <div v-loading="isLoadingUsers">
        <div v-if="isEmptyArrOrNull(unqualifiedUsersInfo.dataArr)">
          <el-empty description="暂无未达标用户" />
        </div>
        <div class="userOne" v-for="user in unqualifiedUsersInfo.dataArr" :key="user.id">
            <div class="userInfo">
              <el-avatar :src="user.avatarUrl" class="avatar" @error="() => true">
                <img
                  :src="ERROR_AVATAR_URL"
                />
              </el-avatar>
              <span class="txt">
                <div class="name">{{user.name}}</div>
                <span>{{user.department}}</span>
              </span>
            </div>
          <div class="numShow">{{user.num}}</div>
        </div>
      </div>
      <div class="flexBetween bottomBox" v-if="!isEmptyArrOrNull(unqualifiedUsersInfo.dataArr)">
        <span class="totalFont">共{{unqualifiedUsersInfo.total}}人</span>
        <el-link class="moreShow banStyle" @click="$router.push('/dashboard/evaBoard/unqulifiedUsers')"
        :disabled="!hasBtnPermission('evaluate.board.query')">
          <strong>查看全部</strong>
          <i class="iconfont ico">&#xeb08;</i>
        </el-link>
      </div>
      <div class="boxLine">&nbsp;</div>
      <div class="caption mySet" @click="initDialog()">
        <strong>设置达标要求</strong>
      </div>
    </div>

    <!-- 设置达标要求的弹窗 -->
    <el-dialog
      v-model="settingDialogVisible"
      title="配置评教/被评次数限制"
      append-to-body
      draggable
      width="325"
    >
      <el-form label-width="100px">
        <el-form-item label="最小评教次数">
          <el-input-number v-model="configData.minEvaNum" :min="0"/>
        </el-form-item>
        <el-form-item label="最小被评次数">
          <el-input-number v-model="configData.minBeEvaNum" :min="0" @change="checkMaxBeEvaNum()"/>
        </el-form-item>
        <el-form-item label="最大被评次数">
          <el-input-number v-model="configData.maxBeEvaNum" :min="configData.minBeEvaNum"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="flashUnqualifiedUsers()">保存</el-button>
        <el-button @click="settingDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { 
  getWeekMoreCount,
  getScoreCourseNum,
  getMonthEvaNum,
  getAllMyDetailEvaData,
} from '@/api/evaBoard';
import {
  getUnqualifiedUsers,
  getUserAvatar
} from '@/api/user';
import {
  getEvaConfig,
  updateEvaConfig
} from '@/api/evaConfig';
import { 
  getShowNum,
  formatNumberToOneDecimalPlace,
  getWeekByNum
} from '@/utils/numUtil';
import{
  EVA_UNQUALIFIED_USER,
  UNQUALIFIED_USER,
  ERROR_AVATAR_URL
}from '@/utils/service/staticData';
import { hasBtnPermission } from '@/utils/btnPermission';
import {
  useInfoTip,
} from '@/utils/msgTip';
import {
  hexToRgb,
  colorStrToArr,
} from '@/utils/stringUtil';
import { formatDateNotTime } from '@/utils/dateUtil';
import { isEmptyArrOrNull } from "@/utils/objUtil";
import { onMounted, ref } from 'vue'

import * as echarts from "echarts";

// 存评教相关配置信息
const configData = ref({})

// 实现未达标用户切换时的加载显示
const isLoadingUsers = ref(false)

// 当前主要线状图颜色
const myColor = ref('rgb(54,154,254)')

// 存所有指定过去一段时间内的详细评教统计数据
const allMyDetailEvaData = ref({dataArr: []})
// 相关统计记录数据
const myNumData = ref([])

// 判断设置弹窗的开关
const settingDialogVisible = ref(false);

// 用于确定当前选择的未达标类型
const unqualifiedType = ref(EVA_UNQUALIFIED_USER)
// 存未达标的用户信息
const unqualifiedUsersInfo = ref({dataArr: []})

// 存今天和昨日的评教数目数据
const moreCounts = ref([{},{}])
// 存上个月和这个月的评教数目
const monthEvaNums = ref([])


function checkMaxBeEvaNum(){
  const maxNum = configData.value.maxBeEvaNum
  const minNum = configData.value.minBeEvaNum
  configData.value.maxBeEvaNum = minNum > maxNum ? minNum : maxNum;
}


function initDialog(){
  settingDialogVisible.value = true
}

/**
 * 刷新未达标用户数据
 */
const flashUnqualifiedUsers = async()=>{
  // dkh: 具体改变设置操作
  await updateEvaConfig(configData.value)
  // dkh: 改变设置之后刷新数据
  initMainLine()
  getMyUnqualifiedUsers().then(res => {
    useInfoTip('成功修改评教配置')
  })
}

/**
 * 获取未达标用户信息
 */
const getMyUnqualifiedUsers = async()=>{
  isLoadingUsers.value = true
  let res = await getUnqualifiedUsers(unqualifiedType.value, 5)
  unqualifiedUsersInfo.value = res
  // 加载头像信息
  unqualifiedUsersInfo.value.dataArr.forEach((user) => {
    getUserAvatar(user.id).then(url=>{
      user.avatarUrl = url
    })
  })
  isLoadingUsers.value = false
}

/**
 * 初始化图表数据
 */
const initCharts = async()=>{
  // dkh: 生成主要线状图
  initMainLine()

  // dkh 生成两个一样大小的线型图
  const getLineOption = (res = {},mode = 0) => {
    let lineColors = mode === 0 ? ['rgb(54,154,254)','rgb(224,239,255)'] : ['rgb(255,200,0)','rgb(255,243,199)']
    let xDataArr = []
    let prefix = mode === 0 ? '本周' : '上周'
    if(isEmptyArrOrNull(res.evaNumArr)){
      res.evaNumArr = []
      if(mode !== 0){
        for(let i = 0;i < 7;i++){
          res.evaNumArr.push(0)
        }
      }else{
        for(let i = 0;i < new Date().getDay() + 1;i++){
          res.evaNumArr.push(0)
        }
      }
    }
    for(let i = 0;i < res.evaNumArr.length;i++){
      xDataArr.push(`${prefix}星期${getWeekByNum(i + 1)}单日内的评教次数`)
    }
    return {
      grid: {
        top: '30%',
        bottom: '0'
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        // data: res.evaNumArr.map(item => `上个时间点到${item.time}期间的次数`),
        data: xDataArr,
        boundaryGap: false,
        splitLine: { show: false },
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        splitLine: { show: false },
        axisLabel: { show: false },
      },
      series: [
        {
          data: res.evaNumArr,
          type: 'line',
          // 隐藏坐标点
          symbol: 'none',
          itemStyle: {
            color: lineColors[0],
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: lineColors[1],
              },
              {
                offset: 1,
                // color: lineColors[1]
                color: '#FFF'
              }
            ])
          }
        }
      ]
    }
  }
  for(let i = 0;i < 2;i++){
    getWeekMoreCount(i).then(res=>{
      moreCounts.value[1 - i] = res
      const line = echarts.init(document.getElementById(`line${i + 1}`))
      line.setOption(getLineOption(res, i))
    })
  }

  // dkh: 生成柱形图
  getScoreCourseNum(5, 5).then(barData=>{
    const bar = echarts.init(document.getElementById('bar'))
    bar.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          return `${params[0].name}分<br/>${params[0].value}门课程`
        }
      },
      grid: {
        top: '0',
        left: '0',
        right: '0',
        bottom: '14.5px'
      },
      xAxis: {
        data: barData.sort((a, b) => a.endScore - b.endScore).map(it => `${it.startScore}-${it.endScore}`),
        axisLabel: {
          fontSize: 8
        }
      },
      yAxis: {
        type: 'value',
        splitLine: { show: false },
        axisLabel: { show: false },
      },
      series: [
        {
          type: 'bar',
          barWidth: '40%',
          data: barData.map(it => it.count),
          itemStyle:{
            borderRadius: [7, 7, 0, 0],
            color: 'rgb(86,170,255)'
          }
        },
      ]
    })
  })
}

const initMainLine = async()=>{
  const mainLine = echarts.init(document.getElementById('mainLine'))
  // dkh: 初始化数据
  const DATA_DAYS = 30
  let res = await getAllMyDetailEvaData(DATA_DAYS)
  allMyDetailEvaData.value = res
  const fieldData = [
    {
      title: '评教总次数',
      field: 'totalEvaInfo'
    },
    {
      title: '评教达标人数',
      field: 'evaQualifiedInfo'
    },
    {
      title: '被评教达标人数',
      field: 'qualifiedInfo'
    }
  ]
  // dkh: 初始化info数据
  for(let i = 0; i < fieldData.length;i++){
    const item = fieldData[i]
    const myInfo = res[item.field] | {}
    const data = {
      title: item.title,
      num: myInfo.num,
      percent: myInfo.morePercent
    }
    myNumData.value[i] = data
  }

  if(isEmptyArrOrNull(res.dataArr)){
    res.dataArr = []
    const nowTime = new Date().getTime()
    for(let i = DATA_DAYS;i >= 0;i--){
      res.dataArr.push({
        date: formatDateNotTime(new Date(nowTime - (i * 24 * 3600 * 1000))),
        moreEvaNum: 0
      })
    }
  }

  let option = {
      grid: {
        top: '8px',
        bottom: '5px',
        right: '0',
        left: '30px'
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: res.dataArr.map(it => `${it.date}单日内的评教数目`),
        boundaryGap: false,
        splitLine: { show: false },
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: res.dataArr.map(it => it.moreEvaNum),
          type: 'line',
          // 隐藏坐标点
          symbol: 'none',
          itemStyle: {
            color: myColor.value,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: getLighterColor(myColor.value),
              },
              {
                offset: 1,
                color: '#FFF'
              }
            ])
          }
        }
      ]
    };
  mainLine.setOption(option)
}

/**
 * 获取更淡颜色的rgb颜色
 * @param {String} baseColor 基础颜色
 * @returns 更淡颜色的rgb颜色
 */
function getLighterColor(baseColor){
  let rgbNums = colorStrToArr(hexToRgb(baseColor))
  return `rgb(${rgbNums[0] + 170}, ${rgbNums[1] + 85}, ${rgbNums[2]})`
}

onMounted(()=>{
  getEvaConfig().then(res=>{
    configData.value = res
    initCharts()
  })
  getMonthEvaNum().then(res => {
    monthEvaNums.value = res
  })
  getMyUnqualifiedUsers()
})
</script>

<style lang="scss" scoped>
@import url('../../assets/font/iconfont.css');
@import '../../styles/globalPage.scss';
@import '../../styles/commonFlexStyles.scss';


// 数据展示容器基础样式
@mixin baseBox{
  background: #FFF;
  box-shadow: $small-box-shadow;
  border-radius: 10px;
  box-sizing: border-box;
  &:hover{
    box-shadow: $common-box-shadow;
  }
}
// 动态生成title样式
@mixin myTitle($font-size: 30px){
  font-weight: 550;
  font-size: $font-size;
  color: $title-font-color;
}

@mixin upIco{
  margin-left: 6px;
  font-size: 10px;
}

$caption-color: rgb(151,160,195);
$line-color: rgb(234,237,247);
$line-height: 2px;
$chart-color: rgb(147,144,243);
// 所以功能盒的padding大小
$box-padding: 25px;

.commonTitle{
  @include myTitle(20px);
  letter-spacing: 1px;
}

.downFont, .downIco{
  color: rgb(221, 83, 83);
}
.downIco{
  display: inline-block;
  transform-origin: top center;
  transform: rotate(180deg);
}
.boardAll{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 35px;
  .commonBox, .largeBox, .longBox{
    padding: $box-padding;
    @include baseBox;
    .caption{
      color: $caption-color;
      font-size: 15px;
      letter-spacing: 2px;
    }
    .tipFont{
      @include flex-end;
      color: rgb(4,183,138);
      font-size: 14px;
      .upIco{
        @include upIco;
      }
      //
    }
    .largeTitle{
      @include myTitle(30px)
    }
    .titleBox{
      @include flex-between;
      align-items: center;
      .percent{
        color: $chart-color;
        font-weight: 550;
        font-size: 18px;
      }
    }
  }
  .commonLineBox{
    @include flex-end;
  }
  .commonBox{
    height: 150px;
    justify-content: space-between;
    .txtBox{
      height: 100%;
      width: 45%;
      .largeTitle{
        @include flex-center-y;
        width: 100%;
      }
    }
    .lineImg{
      width: 65%;
      height: 100%;
    }
    #bar{
      width: 100%;
      height: 65%;
    }
    .myProcessBar{
      margin: 12px 0;
    }
    .numShow{
      padding-top: 6px;
      border-top: $line-height $line-color solid;      
      @include flex-between;
      .numOne{
        width: 50%;
        text-align: center;
      }
    }
  }
  .commonBox, .longBox{
    min-width: 300px;
  }
  .largeBox{
    min-height: 450px;
 	  grid-row: 2/3;
    grid-column: 1/4;
    #mainLine{
      width: 100%;
      height: 60%;
    }
    .description{
      font-size: 14px;
      font-weight: 550;
      color: rgb(99,110,149);
      margin-top: 10px;
      letter-spacing: 2px;
    }
    .myColorBox{
      user-select: none;
      width: 180px;
      height: 48px;
      @include flex-center-y;
      justify-content: space-between;
      border: 1.5px rgb(210,213,225) solid;
      background-color: rgb(250,252,254);
      border-radius: 10px;
      padding: 0px 15px;
      .ico{
        color: rgb(124,136,177);
        display: inline-block;
        transform: rotate(90deg);
        font-size: 25px;
      }
    }
    .dataShow{
      display: flex;
      margin: 30px 0;
      .textAll{
        max-width: 150px;
        display: grid;
        grid-template-columns: repeat(3,1fr);
        gap: 10px;
        margin-top: 5px;
        padding-top: 5px;
        margin-right: 60px;
        color: rgb(4,183,138);
        .percentTxt{
          font-size: 14px;
          text-align: center;
        }
        .upIco{
          @include upIco;
          margin-top: 8px;
        }
      }
    }
  }

  .userOne, .userInfo, .bottomBox{
    @include flex-between;
    align-items: center;
  }
  .longBox{
    .userOne{
      padding: 10px 0;
      .userInfo{
        .avatar{
          margin-right: 10px;
        }
        .txt{
          color: rgb(163,174,208);
          font-size: 14px;
          .name{
            color: rgb(27,37,89);
            font-size: 16px;
            padding-bottom: 5px;
          }
        }
      }
      .numShow{
        border-radius: 10px;
        padding: 6px 18px;
        background-color: rgb(253,238,237);
        color: rgb(238,93,80);
      }
    }
    .bottomBox{
      margin: 5px 0;
      .totalFont, .moreShow{
        letter-spacing: 1px;
        font-size: 14px;
      }
      .totalFont{
        color: rgb(250,80,135);
      }
      .moreShow{
        color: rgb(67,24,255);
        .ico{
          margin-left: 2px;
          font-size: 20px;
        }
      }
    }
    .boxLine{
      height: $line-height;
      background-color: $line-color;
      margin: 0 (-($box-padding));

    }
    .mySet{
      user-select: none;
      cursor: pointer;
      margin-top: 20px;
      text-align: center;
    }
  }

}
.flexUpDown{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
}
.flexBetween{
  @include flex-between;
}
.flexCenter{
  @include flex-center;
}
</style>