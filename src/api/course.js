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
 * 分页获取课程类型信息
 * @param {Number} page 页数
 * @param {Number} size 一页的元素个数
 * @param {Object} queryObj 条件查询的对象
 * @returns 分页信息
 */
export function getPageData(reqData = {page: 0,size: 0,queryObj: {}}){
    return request({
        url: '/course/types',
        method: 'POST',
        data: reqData
    })
}

/**
 * 批量删除课程类型
 * @param {Number} idList 待删除的课程类型的id集合 
 * @returns 
 */
export function batchRemove(idList){
    return request({
        url: '/course/types',
        method: 'DELETE',
        data: idList
    })
}


/**
 * 删除单个课程类型
 * @param {Number} typeId 待删除的课程类型的id 
 * @returns 
 */
export function removeOne(typeId){
    return request({
        url: `/course/type?id=${typeId}`,
        method: 'DELETE'
    })
}

/**
 * 修改一个课程类型的信息
 * @param {Object} type 该课程类型的新信息
 * @returns 
 */
export function updateType(type = {}){
    return request({
        url: '/course/type',
        method: 'PUT',
        data: type
    })
}

/**
 * 新建一个课程类型
 * @param {Object} type 新课程类型信息
 * @returns 
 */
export function addType(type = {}){
    return request({
        url: '/course/type',
        method: 'POST',
        data: type
    })
}