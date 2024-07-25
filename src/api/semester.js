import request from '@/utils/request.js'

const SEMESTER_URL = '/semester/'

/**
 * 获取所有已有的学期
 * @returns 所有已有的学期
 */
export function getAllSemester(){
    return request({
        url: SEMESTER_URL + 'all',
        method: 'GET',
    })
}

/**
 * 获取当前学期的信息
 * @returns 当前学期的信息
 */
export function getNowSemester(){
    return request({
        url: SEMESTER_URL + 'now',
        method: 'GET'
    })
}