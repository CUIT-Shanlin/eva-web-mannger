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
      <div id="bar" ref="bar">1</div>
    </div>
    <div class="commonBox">1</div>

    <div class="largeBox">6</div>
    <div class="longBox">6</div>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { 
  getDayMoreCount,
  getScoreCourseNum,
} from '@/api/evaBoard';
import { getShowNum } from '@/utils/numUtil';
import { onMounted, ref } from 'vue'
import * as echarts from "echarts";

// 存今天和昨日的评教数目数据
const moreCounts = ref([{},{}])

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
      data: barData.map(it => it.count),
      itemStyle:{
        borderRadius: [10, 10, 0, 0],
        color: 'rgb(86,170,255)'
      }
    },
  ]
})
}

onMounted(()=>{
  initCharts()
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
.boardAll{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 35px;
  .commonBox, .largeBox, .longBox{
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
    .commonTitle{
      @include myTitle(22px)
    }
  }
  .commonLineBox{
    @include flex-end;
  }
  .commonBox{
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
  }
  .commonBox, .longBox{
    min-width: 300px;
  }
  .commonBox, .largeBox{
    height: 150px;
    padding: 25px;
  }
  .largeBox{
    height: 450px;
 	  grid-row: 2/3;
    grid-column: 1/4;
  }
}
.flexUpDown{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>