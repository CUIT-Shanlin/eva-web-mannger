/**
 * 评教看板相关接口调用
 */
import request from '@/utils/request.js'
import { getSemesterId } from '@/utils/service/semesterUtil';

/**
 * 获取指定某一周的详细评教统计数据
 * @param {Number|String} week 距离本周差多少周，eg: 0: 本周；1：上周
 * @returns 
 */
export function getWeekMoreCount(week = 0){
    return request({
        url: `/evaluate/moreCount?semId=${getSemesterId()}&week=${week}`
    })
}


/**
 * 获取各个分数段中课程的数目情况
 * @param {Number|string} num 获取多少个分数段的数据
 * @param {Number|string} interval 间隔，分数段之间的默认间隔
 * @returns 
 */
export function getScoreCourseNum(num = 5, interval = 5){
    return request({
        url: `/evaluate/score/count/${num}/${interval}`
    })
}

/**
 * 获取上个月和本月的评教数目
 * @returns 
 */
export function getMonthEvaNum(){
    return request({
        url: `/evaluate/month/count?semId=${getSemesterId()}`
    })
}

/**
 * 获取指定过去一段时间内的详细评教统计数据
 * @param {Number|string} num 获取从今天开始往过去看 num 天（含今天）中，每天的新增评教数目
 * @param {Number|string} target 被评教的目标次数，大于等于该数目则达标，小于则未达标
 * @param {Number|string} evaTarget 评教的目标次数，大于等于该数目则达标，小于则未达标
 * @returns 
 */
export function getAllMyDetailEvaData(num = 30, target = 2, evaTarget = 2){
    return request({
        url: `/evaluate/moreCounts/${num}/${target}/${evaTarget}`
    })
}