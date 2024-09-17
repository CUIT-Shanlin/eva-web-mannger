/**
 * 评教任务相关接口对接
 */
import request from '@/utils/request.js'
import { getSemesterId } from '@/utils/service/semesterUtil';

/**
 * 分页获取评教任务信息
 * @param {Number} page 页数
 * @param {Number} size 一页的元素个数
 * @param {Object} queryObj 条件查询的对象
 * @returns 分页信息
 */
export function getPageData(reqData = {page: 0,size: 0,queryObj: {}}){
    return request({
        url: `/evaluate/tasks?semId=${getSemesterId()}`,
        method: 'POST',
        data: reqData
    })
}

/**
 * 任意取消一个评教任务
 * @param {Number|String} id 任务id
 * @returns 
 */
export function cancelOneTask(id = -1){
    return request({
        url: `/evaluate/task/cancel/${id}`,
        method: 'PUT'
    })
}

/**
 * 获取一个评教任务的详细信息
 * @param {Number|String} id 任务id
 * @returns 
 */
export function getOneTask(id = -1){
    return request({
        url: `/evaluate/task/${id}`
    })
}