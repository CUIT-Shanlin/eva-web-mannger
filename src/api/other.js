import request from '@/utils/request.js'

/**
 * 获取所有的学院名称
 * @returns 所有的学院名称
 */
export function getAllDepartments(){
    return request({
        url: '/departments'
    })
}