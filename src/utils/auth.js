/**
 * 实现token设置和获取等的工具类
 */

import Cookies from 'js-cookie'
import {useUserStore} from '@/stores/userStore'
import pinia from '@/utils/pinia'


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


// 实现自动登录
export function setMyToken(token = '',isAutoLogin = true){
    if(isAutoLogin){
        setToken(token)
    }else{
        removeToken()
    }
    useUserStore(pinia).token = token
}

// 获取临时token或cookie中的token
export function getMyToken(){
    if(getToken()){
        return getToken()
    }
    return useUserStore(pinia).token
}

// 确定是否让浏览器记住用户名
const USERNAME_KEY = 'eva_is_remember_username'

export function setUsername(username = ''){
    return localStorage.setItem(USERNAME_KEY,username)
}

export function getUsername(){
    return localStorage.getItem(USERNAME_KEY)
}