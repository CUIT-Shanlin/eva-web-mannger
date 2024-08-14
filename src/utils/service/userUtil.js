/**
 * 处理用户模块业务相关的工具js
 */

import { isSpace } from "../stringUtil"
import { getUserAvatar } from "@/api/user";

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