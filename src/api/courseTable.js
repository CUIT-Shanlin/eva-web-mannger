import CourseInfo from '@/components/CourseInfo.vue';
import request from '@/utils/request.js'
import { getSemesterId } from '@/utils/service/semesterUtil';
/**
 * 获取周课表的课程信息
 * @param {Number} week 周数
 * @returns 课程节数
 */

export function getWeekData(week){
    return request({
        url: `/courses/table?semId=${getSemesterId()}&week=${week}`,
        method: 'GET'
    })
}

/**
 * 获取一个课程时间段的课程信息
 * @param {Number} week 周数
 * @param {Number} day 天数
 * @param {Number} num 节数
 * @returns 课程信息
 */

export function getClassTable(classdata={week:0,day:0,num:0}){
    return request({
        url: `/course/table?semId=${getSemesterId()}`,
        method: 'POST',
        data:classdata
    })
}

/**
 * 获取一节课的详细信息
 * @param {Number} id 课程详情的ID 编号
 * @returns 详细信息
 */

export function getClassData(id){
    return request({
        url: `/course/table/one?id=${id}&semId=${getSemesterId()}`,
        method: 'GET'
    })
}

/**
 * 获取一天的具体日期
 * @param {Number} week 周数
 * @param {Number} day 天数
 * @returns 具体日期
 */

export function getClassDay(week,day){
    return request({
        url: `/course/date?semId=${getSemesterId()}&week=${week}&day=${day}`,
        method: 'GET'
    })
}

/**
 * 获取某个指定时间段的课程
 * @param {String} departmentName 专业名称
 * @param {String} keyword 查询关键字
 * @param {Number} sort 0: 选过次数升序；1：时间升序；2：时间降序
 * @param {String} startDay 开始日期
 * @param {String} endDay 结束日期
 * @param {Number} teacherId 教学教师的id
 * @param {Number} typeId 课程类型id
 * @returns 课程信息
 */

export function getTimeClass(classquery={departmentName:"",keyword:"",sort:0,startDay:"",endDay:"",teacherId:0,typeId:0}){
    return request({
        url: `/courses/query?semId=${getSemesterId()}`,
        method: 'POST',
        data:classquery
    })
}

/**
 * 判断某学期是否已经导入过课表文件
 * @param {Number} period 上下学期，0为上，1为下
 * @param {String} startYear 开始年份
 * @param {String} endYear 结束年份
 * @param {Number} type 课程性质
 * @returns 课程信息
 */

export function getSemesterisImported(type,imported={period:0,startYear:"",endYear:""}){
    return request({
        url: `/course/table/isImported/type=${type}`,
        method: 'POST',
        data:imported
    }) 
}
/**
 * 修改一节课
 * @param {Number} id ID 编号
 * @param {String} location 教室
 * @param {Number} week 周数
 * @param {Number} day 天数
 * @param {Number} startTime 开始时间
 * @param {Number} endTime 结束时间
 * @returns 课程信息
 */

export function changeClass(classdata={id:0,location:"",week:0,day:0,startTime:0,endTime:0}){
    return request({
        url: `/course/one?semId=${getSemesterId()}`,
        method: 'PUT',
        data:classdata
    }) 
}

/**
 * 批量删除某节课
 * @param {Number} id 课程详情的ID 编号
 * @param {Number} startWeek 周数
 * @param {Number} endWeek 周数
 * @param {Number} day 天数
 * @param {Number} startTime 开始时间
 * @param {Number} endTime 结束时间
 * @returns 详细信息
 */

export function delClassData(id,classdata={startWeek:0,endWeek:0,day:0,startTime:0,endTime:0}){
    return request({
        url: `/course/table?id=${id}&semId=${getSemesterId()}`,
        method: 'DELETE',
        data:classdata
    })
}

/**
 * 导入课表文件
 * @param {Number} id 学期ID 编号
 * @param {Number} period 上下学期，0为上，1为下
 * @param {String} startYear 开始年份
 * @param {String} endYear 结束年份
 * @param {String} startDate 这学期开学第一天的日期
 * @param {Number} type 课程性质
 * @returns 详细信息
 */

export function importFile(type, semester = { id: 0, period: 0, startYear: "", endYear: "", startDate: "" }, file = {}) {
    let formData = new FormData()
    formData.append('file', file)
    formData.append('semester', JSON.stringify(semester))
    return request({
        headers: {
            'Content-Type': 'multipart/form-data;'
         },
        url: `/course/import/${type}`,
        method: 'PUT',
        data:formData
    })
}

/**
 * 批量新建多节课(已有课程)
 * @returns 详细信息
 */

export function createClass(courseId,dateArr = []){
    return request({
        url: `/course/batch/exist/${courseId}`,
        method: 'POST',
        data: dateArr
    })
}

/**
 * 批量新建多节课(新课程)
 * @returns 详细信息
 */
 
export function createNewClass(techerId,courseInfo = {
    "subjectMsg": {
    "name": "",
    "nature": 1
},
"templateId": null,
"typeIdList": []}, dateArr=[]){
    return request({
        url: `/course/batch/notExist?semId=${getSemesterId()}&techerId=${techerId}`,
        method: 'POST',
        data: {
            courseInfo: courseInfo,
            dateArr: dateArr,
        }
    })
}

/**
 * 分配听课/评教老师
 *  @param {Number} id 课程详情id
 *  @param {Array|Number} evaTeacherIdList 评教老师的id集合
 * @returns 详细信息
 */

export function assignedTeacher(teacher={id:1,evaTeacherIdList:[]}){
    return request({
        url: `/course/table/one/eva?semId=${getSemesterId()}`,
        method: 'PUT',
        data:teacher
    })
}