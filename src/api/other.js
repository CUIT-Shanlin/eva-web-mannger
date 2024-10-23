import request from '@/utils/request.js'

/**
 * 获取所有的专业名称
 * @returns 所有的专业名称
 */
export function getAllDepartments(){
    return request({
        url: '/departments'
    })
}