/**
 * 实现token设置和获取等的工具类
 */

import Cookies from 'js-cookie'


const TOKEN_KEY = 'eva_token'

// 存Cookie的tokend的过期时间 =》 1周
const TOKEN_EXPIRATION_DAY = 7
// 拿Cookie中的token
export function getToken(){
    return Cookies.get(TOKEN_KEY)
}

// 存Cookie中的token
export function setToken(token){
    return Cookies.set(TOKEN_KEY, token, { expires: TOKEN_EXPIRATION_DAY })
}

export function removeToken(){
    sessionStorage.removeItem(TOKEN_KEY)
    Cookies.remove(TOKEN_KEY)
}

// 确定是否让浏览器记住用户名
const USERNAME_KEY = 'eva_is_remember_username'

export function setUsername(username = ''){
    return localStorage.setItem(USERNAME_KEY,username)
}

export function getUsername(){
    return localStorage.getItem(USERNAME_KEY)
}