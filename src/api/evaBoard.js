/**
 * 评教看板相关接口调用
 */
import request from '@/utils/request.js'

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
