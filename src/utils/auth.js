/**
 * 实现token设置和获取等的工具类
 */

import Cookies from 'js-cookie'

const TOKEN_KEY = 'eva_token'

export function getToken(){
    return Cookies.get(TOKEN_KEY)
}

export function setToken(token){
    return Cookies.set(TOKEN_KEY,token)
}

export function removeToken(){
    return Cookies.remove(TOKEN_KEY)
}