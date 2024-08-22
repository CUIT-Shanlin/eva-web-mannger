import request from '@/utils/request.js'

/**
 * 获取所有课程的基础信息（仅有id和名称）
 * @returns 
 */
export function getAllBaseCourse(){
    return request({
        url: '/courses/all'
    })
}

/**
 * 分页获取课程信息
 * @param {{ page: number; size: number; queryObj: {}; }} [reqData={page: 0,size: 0,queryObj: {}}]
 * @param {Number} page 页数
 * @param {Number} size 一页的元素个数
 * @param {Object} queryObj 条件查询的对象
 * @returns 分页信息
 */
export function getPageData(reqData = {page: 0,size: 0,queryObj: {}}){
    return request({
        url: '/courses',
        method: 'POST',
        data: reqData
    })
}