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
        method: 'DELETE',
        data: idList
    })
}

/**
 * 删除单个角色
 * @param {Number} roleId 待删除的角色的id 
 * @returns 
 */
export function removeOne(roleId){
    return request({
        url: `/role?roleId=${roleId}`,
        method: 'DELETE'
    })
}

/**
 * 为一个角色分配权限
 * @param {Object} assignVo 
 * @returns 响应信息
 */
export function doAssignForRole(assignVo = {}){
    return request({
        url: '/role/auth',
        method: 'PUT',
        data: assignVo
    })
}

/**
 * 修改一个角色的信息
 * @param {Object} role 该角色的新信息
 * @returns 
 */
export function updateRole(role = {}){
    return request({
        url: '/role',
        method: 'PUT',
        data: role
    })
}

/**
 * 新建一个角色
 * @param {Object} role 新角色信息
 * @returns 
 */
export function addRole(role = {}){
    return request({
        url: '/role',
        method: 'POST',
        data: role
    })
}