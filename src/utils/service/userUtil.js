/**
 * 处理用户模块业务相关的工具js
 */

import { isSpace } from "../stringUtil"

/**
 * 获取 头像url
 * @param {String} avatar 原始头像url 
 * @returns 头像url
 */
export function getMyAvatar(avatar = ''){
    // 默认头像地址
    const DEFALUT_AVATAR_URL = '/src/assets/img/default_avatar.png'
    if(isSpace(avatar)){
        return DEFALUT_AVATAR_URL;
    }
    return avatar
}