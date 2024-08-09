import request from '@/utils/request.js'
import { getSemesterId } from '@/utils/service/semesterUtil';


/**
 * 获取用户自己的信息
 * @returns 用户自己的信息
 */
export function getInfo(){
    return request(
        {
            url: '/user/info?semId=' + getSemesterId(),
            method: 'GET',
        }
    )
}

/**
 * 分页获取用户信息
 * @param {Number} page 页数
 * @param {Number} size 一页的元素个数
 * @param {Object} queryObj 条件查询的对象
 * @returns 分页信息
 */
export function getPageData(reqData = {page: 0,size: 0,queryObj: {}}){
    return request({
        url: '/users',
        method: 'POST',
        data: reqData
    })
}

/**
 * 删除一个用户
 * @param {*} userId 待删除用户的id 
 * @returns 响应信息
 */
export function removeOne(userId = -1){
    return request({
        url: `user?userId=${userId}`,
        method: 'DELETE'
    })
}

/**
 * 为一个用户分配角色
 * @param {Object} assignVo 
 * @returns 响应信息
 */
export function doAssign(assignVo = {}){
    return request({
        url: '/user/roles',
        method: 'PUT',
        data: assignVo
    })
}

/**
 * 获取一个用户的各个课程评分
 * @param {Number} userId 用户id
 * @returns 评分信息
 */
export function getScoreMsg(userId = -1){
    return request({
        url: `/user/score/${userId}`
    })
}

/**
 * 查询一个用户名是否已经存在
 * @param {string} username 待查询用户名
 * @returns true: 已经存在，false: 未存在
 */
export function isExistUsername(username = ''){
    return request({
        url: `/user/username/exist?username=${username}`
    })
}

/**
 * 修改一个用户的信息
 * @param {Object} user 用户的新信息
 * @param {Number} isUpdatePwd 是否需要修改密码，0： 不需要，1： 需要
 * @returns 
 */
export function updateUser(user = {}, isUpdatePwd = 0){
    return request({
        url: `/user/${isUpdatePwd}`,
        method: 'PUT',
        data: user
    })
}