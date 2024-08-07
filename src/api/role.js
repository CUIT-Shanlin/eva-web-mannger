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