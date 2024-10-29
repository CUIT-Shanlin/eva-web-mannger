import request from '@/utils/request.js'
import { getSemesterId } from '@/utils/service/semesterUtil';

/**
 * 获取所有课程的基础信息（仅有id、名称和教学老师姓名）
 * @returns 
 */
export function getAllBaseCourse(){
    return request({
        url: `/courses/all?semId=${getSemesterId()}`
    })
}

/**
 * 获取所有学科的基础信息（仅有id和名称）
 * @returns 
 */
export function getAllBaseSubject(){
    return request({
        url: '/courses/subject/all'
    })
}

/**
 * 分页获取课程信息
 * @param {{ page: number; size: number; queryObj: {}; }} [reqData={page: 0,size: 0,queryObj: {}}]
 * @param {Number} page 页数
 * @param {Number} size 一页的元素个数
 * @param {Object} queryObj 条件查询的对象
 * @returns 分页信息
 */
export function getPageData(reqData = {page: 0,size: 0,queryObj: {}}){
    return request({
        url: `/courses?semId=${getSemesterId()}`,
        method: 'POST',
        data: reqData
    })
}

/**
 * 获取一门课程的评教统计
 * @param {Number | string} id 一门课程的id
 */
export function getCourseEvaData(id = -1){
    return request({
        url: `/course/eva?semId=${getSemesterId()}&id=${id}`
    })
}

/**
 * 获取一门课程的详细信息
 * @param {Number | string} id 一门课程的id
 * @returns 
 */
export function getOneCourseDetail(id = -1){
    return request({
        url: `/course?semId=${getSemesterId()}&id=${id}`
    })
}

/**
 * 批量修改课程的评教模板
 * @param {number[]} [courseIdList=[]] 待修改评教模板的课程的id数组
 * @param {Number | string} templateId 评教模板的id 
 * @returns 
 */
export function batchUpdateTemplate(courseIdList = [], templateId = -1){
    return request({
        url: `/courses/template`,
        method: 'PUT',
        data:{
            courseIdList,
            templateId
        }
    })
}

/**
 * 修改一个课程的信息
 * @param {Object} course 该课程的新信息
 * @returns 
 */
export function updateCourse(course = {}){
    return request({
        url: '/course',
        method: 'PUT',
        data: course
    })
}

/**
 * 批量修改课程的课程类型
 * @param {number[]} [courseIdList=[]] 待修改类型的课程的id数组
 * @param {number[]} [typeIdList=[]] 待修改成类型的id数组
 * @returns 
 */
 export function batchUpdateType(courseIdList = [], typeIdList = []){
    return request({
        url: `/courses/type`,
        method: 'PUT',
        data:{
            courseIdList,
            typeIdList
        }
    })
}


/**
 * 删除一门课程，并删除课表中所有该课程的排课
 * @param {Number} courseId 待删除的课程的id 
 * @returns 
 */
export function removeOne(courseId = -1){
    return request({
        url: `/course?courseId=${courseId}&semId=${getSemesterId()}`,
        method: 'DELETE'
    })
}