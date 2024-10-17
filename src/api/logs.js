import request from '@/utils/request.js'

/**
 * 分页获取日志
 * @param {Number} moduleId 日志模块id，负数或者null则是全部
 * @returns 
 */
export function getPageLogs(moduleId){
    return request({
        url: `/logs/${moduleId}`,
        method: 'POST',
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