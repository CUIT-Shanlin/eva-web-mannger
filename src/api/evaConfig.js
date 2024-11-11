/**
 * 评教配置文件相关接口
 */
import request from '@/utils/request.js'

/**
 * 获取评教配置文件信息
 * @returns 
 */
export function getEvaConfig(){
    return request({
        url: '/evaluate/config'
    })
}

/**
 * 修改评教配置文件信息
 * @param {{ minEvaNum: number; minBeEvaNum: number; maxBeEvaNum: number; }} [config] 新配置信息
 * @returns 
 */
export function updateEvaConfig(config = {
    minEvaNum: 2,
    minBeEvaNum: 2,
    maxBeEvaNum: 8
  }){
    return request({
        url: '/evaluate/config',
        method: 'PUT',
        data: config
    })
}