import request from '@/utils/request.js'
import { getSemesterId } from '@/utils/service/semesterUtil';


/**
 * 获取评教任务完成情况
 * @returns 
 */
export function getEvaSituation(){
    return request({
        url: `/evaluate/task/situation?semId=${getSemesterId()}`
    })
}

/**
 * 获取评教分数统计基础信息
 * @returns 
 */
export function getEvaScoreSituation(){
    return request({
        url: `/evaluate/score/situation?semId=${getSemesterId()}`
    })
}


/**
 * 分页获取评教记录信息
 * @param {Number} page 页数
 * @param {Number} size 一页的元素个数
 * @param {Object} queryObj 条件查询的对象
 * @returns 分页信息
 */
export function getPageData(reqData = {page: 0,size: 0,queryObj: {}}){
    return request({
        url: `/evaluate/records?semId=${getSemesterId()}`,
        method: 'POST',
        data: reqData
    })
}