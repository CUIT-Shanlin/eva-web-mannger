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

/**
 * 修改角色的状态
 * @param {Number} roleId 角色id 
 * @param {Number} status 状态，1为禁止，0为正常
 * @returns 
 */
export function updateRoleStatus(roleId = -1, status = 0){
    return request({
        url: `/role/status/${roleId}/${status}`,
        method: 'PUT'
    })
}

/**
 * 批量删除角色
 * @param {Number} idList 待删除的角色的id集合 
 * @returns 
 */
export function batchRemove(idList){
    return request({
        url: '/roles',
        method: 'dELETE',
        data: idList
    })
}