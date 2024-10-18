import request from '@/utils/request.js'
import axios from 'axios'
import { getSemesterId } from '@/utils/service/semesterUtil';
import { getToken } from '@/utils/auth';
import { DEFAULT_AVATAR_URL } from '@/utils/service/staticData';


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

/**
 * 修改用户的状态
 * @param {Number} userId 用户id 
 * @param {Number} status 状态，1为禁止，0为正常
 * @returns 
 */
export function updateUserStatus(userId = -1, status = 0){
    return request({
        url: `/user/status/${userId}/${status}`,
        method: 'PUT'
    })
}

/**
 * 新建一个用户
 * @param {Object} user 新用户
 * @returns
 */
export function addUser(user = {}){
    return request({
        url: '/user',
        method: 'POST',
        data: user
    })
}

/**
 * 获取所有用户的基础信息（仅有id和姓名）
 * @returns 
 */
export function getAllBaseUser(){
    return request({
        url: '/users/all'
    })
}

/**
 * 获取指定数目未达标的用户信息
 * @param {Number|String} type 0：获取 评教 未达标的用户、1：获取 被评教 次数未达标的用户
 * @param {Number|String} num 加载前几个用户数据
 * @param {Number|String} target 评教或被评教的目标 数目，大于等于该数目则达标，小于则未达标
 * @returns 
 */
export function getUnqualifiedUsers(type = 0, num = 5, target = 2){
    return request({
        url: `/users/unqualified/${type}/${num}/${target}`
    })
}

/**
 * 分页获取未达标用户的信息
 * @param {Number} page 页数
 * @param {Number} size 一页的元素个数
 * @param {Object} queryObj 条件查询的对象
 * @param {Number|String} type 确定是获取评教未达标用户还是被评教未达标用户
 * @param {Number|String} target 评教或被评教的目标 数目，大于等于该数目则达标，小于则未达标
 * @returns 分页信息
 */
export function getUnqulifiedPageData(type = 0, target = 2, reqData = {page: 0,size: 0,queryObj: {}}){
    return request({
        url: `/users/unqualified/${type}/${target}`,
        method: 'POST',
        data: reqData
    })
}


/**
 * 获取用户的头像
 * @param {Number} id 用户id
 * @returns 
 */
export function getUserAvatar(id = -1){
    return new Promise((resolve, reject)=>{
        axios({
            url: `/devApi/user/avatar/${id}`,
            method: 'GET',
            responseType: 'blob', // 指示axios以Blob形式处理响应
            headers:{
                Authorization: getToken()
            }
        })
        .then(response => {
            // 创建一个表示Blob数据的URL
            const url = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
            resolve(url); // HTTP 200时解析出URL并resolve
            // resolve(DEFAULT_AVATAR_URL)
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                // 如果是404错误，则resolve一个默认URL
                resolve(DEFAULT_AVATAR_URL);
            } else {
                // 其他情况则reject，并传递错误信息
                reject(error.response || error);
            }
        })
    })
}