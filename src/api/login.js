import request from '@/utils/request.js'

/**
 * 登录接口
 * @param {Object} user 用户输入的账户密码信息
 * @returns 
 */
export function login (user){
    return request({
        url: '/login',
        method: 'POST',
        data: user
    })
}

/**
 * 退出登录，调用此接口将无效化用户token
 * @returns 
 */
export function logOut (){
    return request({
        url: '/logout',
    })
}