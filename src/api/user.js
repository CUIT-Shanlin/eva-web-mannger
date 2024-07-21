import request from '@/utils/request.js'

/**
 * 获取用户自己的信息
 */
export function getInfo(){
    return request(
        {
            url: '/user/info',
            method: 'GET',
        }
    )
}