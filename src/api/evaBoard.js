/**
 * 评教看板相关接口调用
 */
import request from '@/utils/request.js'
import { getSemesterId } from '@/utils/service/semesterUtil';


/**
 * 获取指定某一天的详细评教统计数据
 * @param {Number|string} day 指定的这一天和今天相差多少天，eg：0 =》 今天，1 =》 昨天
 * @param {Number|string} num 要将这一天的24小时分num段时间进行数据的统计
 * @returns 
 */
export function getDayMoreCount(day = 0, num = 12){
    return request({
        url: `/evaluate/moreCount/${day}/${num}`
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