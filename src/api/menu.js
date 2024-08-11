import request from '@/utils/request.js'

/**
 * 获取所有树型菜单数据
 * @returns 所有树型菜单数据
 */
export function getTreeMenus(reqObj = {}){
    return request({
        url: '/menus/tree',
        method: 'POST',
        data: reqObj
    })
}

/**
 * 通过角色id，获取到该角色原本就有的菜单的id(数组形式，非树型)
 * @param {Number} roleId 角色id
 * @returns 
 */
export function getMenuIdListByRoleId(roleId = -1){
    return request({
        url: `/menu/idList/${roleId}`,
        method: 'GET'
    })
}