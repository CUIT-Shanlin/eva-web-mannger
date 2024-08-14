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