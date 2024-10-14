/**
 * 消息相关接口对接
 */
import request from '@/utils/request.js'
import {
    DISPLAYED_MSG,
    READ_MSG,
    COMMON_MSG_MODE,
} from '@/utils/service/staticData'
import { useUserStore } from '@/stores/userStore';


/**
 * 获取当前用户自己的指定类型的所有消息
 * @param {Number|String} type 消息类型（null或者负数：全部，0：待办，1：通知）
 * @param {Number|String} mode 确定是普通消息还是评教消息，0: 普通消息；1：评教消息，null或者负数：全部
 * @returns 
 */
export function getAllMyMsg(type = null, mode = null){
    return request({
        url: `/msg/tips/${type}/${mode}`
    })
}

/**
 * 修改某条消息的显示状态
 * @param {Number|String} id 该条消息的id
 * @param {Number|String} isDisplayed 待改成的显示状态
 * @returns 
 */
export function updateIsDisplayed(id = -1, isDisplayed = DISPLAYED_MSG){
    return request({
        url: `/msg/tip/isDisplayed?id=${id}&isDisplayed=${isDisplayed}`,
        method: 'PUT'
    })
}

/**
 * 修改某条消息的已读状态
 * @param {Number|String} id 该条消息的id
 * @param {Number|String} isRead 待改成的已读状态
 * @returns 
 */
export function updateIsRead(id = -1, isRead = READ_MSG){
    return request({
        url: `/msg/tip/isRead?id=${id}&isRead=${isRead}`,
        method: 'PUT'
    })
}

/**
 * 批量修改消息的已读状态
 * @param {number} [mode=COMMON_MSG_MODE] 确定待批量修改的是普通消息还是评教消息
 * @returns 
 */
export function batchUpdateIsRead(mode = COMMON_MSG_MODE){
    return request({
        url: `/msg/tips/${mode}/${useUserStore().info.id}`,
        method: 'PUT'
    })
}