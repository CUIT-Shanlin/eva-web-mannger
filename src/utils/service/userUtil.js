/**
 * 处理用户模块业务相关的工具js
 */

import { getUserAvatar } from "@/api/user";
import { isSpace } from "@/utils/stringUtil"
import {
    EVA_UNQUALIFIED_USER,
    UNQUALIFIED_USER,
}from '@/utils/service/staticData'

/**
 * 获取 头像url
 * @param {String|Number} userId 用户id 
 * @returns 头像url
 */
export async function getMyAvatar(userId = -1){
    // 默认头像地址
    const DEFAULT_AVATAR_URL = '/src/assets/img/default_avatar.png'
    try{
        let res = await getUserAvatar(userId)
        // if(!res instanceof Blob){
        //     return DEFAULT_AVATAR_URL;
        // }
        const avatar = URL.createObjectURL(res);
        if(isSpace(avatar) || res.status + '' === '404'){
            return DEFAULT_AVATAR_URL;
        }
        return avatar
    }catch{
        return DEFAULT_AVATAR_URL;
    }
}

export const DEFAULT_AVATAR_URL = '/src/assets/img/default_avatar.png'


// TODO 操作评教和被评教的达标要求设置

// 评教和被评教达标标准的key
const QUALIFIED_STANDARD_KEY = 'qualified_standard'

// 默认达标标准
export const DEFAULT_STANDARD = []
DEFAULT_STANDARD[UNQUALIFIED_USER] = 2
DEFAULT_STANDARD[EVA_UNQUALIFIED_USER] = 2

/**
 * 修改达标要求
 * @param {Array} standards 两个达标要求
 */
export function setQulifiedStandards(standards = []){
    localStorage.setItem(QUALIFIED_STANDARD_KEY, JSON.stringify(standards))
}

/**
 * 拿到两个达标要求的数组
 * @returns 
 */
export function getQulifiedStandards(){
    const data = localStorage.getItem(QUALIFIED_STANDARD_KEY)
    if(!data){
        return DEFAULT_STANDARD
    }
    return JSON.parse(data)
}

/**
 * 拿到被评教要求
 * @returns 
 */
export function getQulifiedStandard(){
    return getQulifiedStandards[UNQUALIFIED_USER]
}

/**
 * 拿到评教要求
 * @returns 
 */
export function getEvaQulifiedStandard(){
    return getQulifiedStandards[EVA_UNQUALIFIED_USER]
}

/**
 * 拿到指定类型的达标要求
 * @param {Number|String} type 指定类型
 * @returns 
 */
export function getMyStandard(type = EVA_UNQUALIFIED_USER){
    return getQulifiedStandards()[type]
}