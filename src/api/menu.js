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

/**
 * 删除一个菜单
 * @param {Number} menuId 待删除的菜单的id
 * @returns 
 */
export function removeOne(menuId){
    return request({
        url: `/menu/${menuId}`,
        method: 'DELETE'
    })
}

/**
 * 批量删除菜单
 * @param {Number} idList 待删除的菜单的id集合 
 * @returns 
 */
export function batchRemove(idList){
    return request({
        url: '/menus',
        method: 'DELETE',
        data: idList
    })
}

/**
 * 修改一个菜单的信息
 * @param {Object} menu 该菜单的新信息
 * @returns 
 */
export function updateMenu(menu = {}){
    return request({
        url: '/menu',
        method: 'PUT',
        data: menu
    })
}

/**
 * 新建一个菜单
 * @param {Object} menu 新菜单信息
 * @returns 
 */
export function addMenu(menu = {}){
    return request({
        url: '/menu',
        method: 'POST',
        data: menu
    })
}