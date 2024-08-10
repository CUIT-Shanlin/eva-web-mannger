import request from '@/utils/request.js'

/**
 * 获取所有角色的基础信息
 * @returns 所有角色的基础信息的promise对象
 */
export function getAllRoles(){
    return request({
        url: '/role/all',
        method: 'GET'
    })
}

/**
 * 分页获取角色信息
 * @param {Number} page 页数
 * @param {Number} size 一页的元素个数
 * @param {Object} queryObj 条件查询的对象
 * @returns 分页信息
 */
export function getPageData(reqData = {page: 0,size: 0,queryObj: {}}){
    return request({
        url: '/roles',
        method: 'POST',
        data: reqData
    })
}