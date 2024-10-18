import request from '@/utils/request.js'

/**
 * 分页获取日志
 * @param {Number} moduleId 日志模块id，负数是全部
 * @param {Number} page 页数
 * @param {Number} size 一页的元素个数
 * @param {String} keyword 输入框中输入的查询关键字
 * @param {String} startCreateTime 筛选创建时间的结束时间
 * @param {String} endCreateTime 筛选创建时间的结束时间
 * @returns 
 */
export function getPageLogs(moduleId, information = {
    page:1, size:1, queryObj: {
        keyword: "",
        startCreateTime: "",
        endCreateTime: "",
        startUpdateTime: "",
        endUpdateTime: ""
} }){
    return request({
        url: `/logs/${moduleId}`,
        method: 'POST',
        data:information
    })
}

/**
 * 获取全部日志模块
 * @returns 
 */
export function getAllLogs(){
    return request({
        url: `/logs/modules`,
        method: 'POST',
    })
}