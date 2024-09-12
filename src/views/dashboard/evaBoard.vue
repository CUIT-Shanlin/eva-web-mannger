<!-- 评教看板页面 -->
<template>
  <PageTitle content="评教看板" />
  <div class="boardAll">
    <div class="commonBox commonLineBox" v-for="(it,i) in moreCounts" :key="i">
      <div class="txtBox flexUpDown">
        <div class="caption">
          <strong>{{i === 0 ? '昨' : '今'}}日评教增长</strong>
        </div>
        <div class="largeTitle">{{getShowNum(it.moreNum)}}</div>
        <div class="tipFont">
          <span :class="{downFont: Number(it.morePercent) < 0}">{{getShowNum(it.morePercent,true)}}%</span>
          <i :class="{iconfont: true, ico: true, downIco: Number(it.morePercent) < 0}">&#xe639;</i>
        </div>
      </div>
      <div :id="`line${i + 1}`" :ref="`line${i + 1}`" class="lineImg"></div>
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

    <div class="largeBox">6</div>
    <div class="longBox">
      <div class="flexBetween">
        <div class="commonTitle">未达标用户</div>
        <el-radio-group v-model="unqualifiedType" @change="getMyUnqualifiedUsers">
          <el-radio-button label="评教" :value="EVA_UNQUALIFIED_USER" />
          <el-radio-button label="被评" :value="UNQUALIFIED_USER" />
        </el-radio-group>
      </div>
      <div class="userOne" v-for="user in unqualifiedUsersInfo.dataArr" :key="user.id">
        <div class="userInfo">
          <el-avatar class="avatar"/>
          <span class="txt">
            <div class="name">{{user.name}}</div>
            <span>{{user.department}}</span>
          </span>
        </div>
        <div class="numShow">{{user.num}}</div>
      </div>
      <div class="flexBetween bottomBox">
        <span class="totalFont">共{{unqualifiedUsersInfo.total}}人</span>
        <el-link class="moreShow">
          <strong>查看全部</strong>
          <i class="iconfont ico">&#xeb08;</i>
        </el-link>
      </div>
      <div class="boxLine">&nbsp;</div>

    </div>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { 
  getDayMoreCount,
  getScoreCourseNum,
  getMonthEvaNum,
} from '@/api/evaBoard';
import { 
  getUnqualifiedUsers,
  getUserAvatar,
} from '@/api/user';
import{
  EVA_UNQUALIFIED_USER,
  UNQUALIFIED_USER,
}from '@/utils/service/staticData';
import { getShowNum, formatNumberToOneDecimalPlace } from '@/utils/numUtil';
import { onMounted, ref } from 'vue'
import * as echarts from "echarts";

// 用于确定当前选择的未达标类型
const unqualifiedType = ref(EVA_UNQUALIFIED_USER)
// 存未达标的用户信息
const unqualifiedUsersInfo = ref({dataArr: []})

// 存今天和昨日的评教数目数据
const moreCounts = ref([{},{}])
// 存上个月和这个月的评教数目
const monthEvaNums = ref([])

/**
 * 获取未达标用户信息
 */
const getMyUnqualifiedUsers = async()=>{
  let res = await getUnqualifiedUsers(unqualifiedType.value, 5, 2)
  unqualifiedUsersInfo.value = res
}

const initCharts = async()=>{
  // TODO 生成两个一般大小的线型图
  const getLineOption = (res = {},mode = 0) => {
    let lineColors = mode === 0 ? ['rgb(54,154,254)','rgb(224,239,255)'] : ['rgb(255,200,0)','rgb(255,243,199)']
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
        data: res.evaNumArr.map(item => `上个时间点到${item.time}期间的次数`),
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
          data: res.evaNumArr.map(item => item.moreEvaNum),
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
    let res = await getDayMoreCount(i, 10)
    moreCounts.value[i] = res
    const line = echarts.init(document.getElementById(`line${i + 1}`))
    line.setOption(getLineOption(res, i))
  }
  // TODO 生成柱形图
  const bar = echarts.init(document.getElementById('bar'))
  let barData = await getScoreCourseNum(5, 5)
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
    data: barData.map(it => `${it.stratScore}-${it.endScore}`),
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
}

onMounted(()=>{
  initCharts()
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
$caption-color: rgb(151,160,195);
$line-color: rgb(234,237,247);
$line-height: 3px;
$chart-color: rgb(147,144,243);
// 所以功能盒的padding大小
$box-padding: 25px;

.commonTitle{
  @include myTitle(20px);
  letter-spacing: 1px;
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
      .ico{
        margin-left: 6px;
        font-size: 10px;
      }
      .downFont, .downIco{
        color: rgb(221, 83, 83);
      }
      .downIco{
        display: inline-block;
        transform: rotate(180deg);
      }
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
</style>