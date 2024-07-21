/**
 * 实现token设置和获取等的工具类
 */

import Cookies from 'js-cookie'


const TOKEN_KEY = 'eva_token'

// 拿Cookie中的token
export function getToken(){
    return Cookies.get(TOKEN_KEY)
}

// 存Cookie中的token
export function setToken(token){
    return Cookies.set(TOKEN_KEY,token)
}

export function removeToken(){
    return Cookies.remove(TOKEN_KEY)
}


// 实现自动登录: 自动登录=>token存Cookie 临时登录=>token存session
export function setMyToken(token = '',isAutoLogin = true){
    if(isAutoLogin){
        setToken(token)
    }else{
        removeToken()
        sessionStorage.setItem(TOKEN_KEY,token)
    }
}

// 获取临时token或cookie中的token
export function getMyToken(){
    if(getToken()){
        return getToken()
    }
    return sessionStorage.getItem(TOKEN_KEY)
}

// 确定是否让浏览器记住用户名
const USERNAME_KEY = 'eva_is_remember_username'

export function setUsername(username = ''){
    return localStorage.setItem(USERNAME_KEY,username)
}

export function getUsername(){
    return localStorage.getItem(USERNAME_KEY)
}