import request from '@/utils/request.js'
import axios from 'axios'
import { getSemesterId } from '@/utils/service/semesterUtil';
import { getToken } from '@/utils/auth';
import { useFailedTip } from '@/utils/msgTip';

/**
 * 获取评教任务完成情况
 * @returns 
 */
export function getEvaSituation(){
    return request({
        url: `/evaluate/task/situation?semId=${getSemesterId()}`
    })
}

/**
 * 获取评教分数统计基础信息
 * @returns 
 */
export function getEvaScoreSituation(score = 95){
    return request({
        url: `/evaluate/score/situation?semId=${getSemesterId()}&score=${score}`
    })
}


/**
 * 分页获取评教记录信息
 * @param {Number} page 页数
 * @param {Number} size 一页的元素个数
 * @param {Object} queryObj 条件查询的对象
 * @returns 分页信息
 */
export function getPageData(reqData = {page: 0,size: 0,queryObj: {}}){
    return request({
        url: `/evaluate/records?semId=${getSemesterId()}`,
        method: 'POST',
        data: reqData
    })
}

/**
 * 删除单个评教记录
 * @param {Number} id 待删除的评教记录的id 
 * @returns 
 */
export function removeOne(id = -1){
    return request({
        url: `/evaluate/record?id=${id}`,
        method: 'DELETE'
    })
}

/**
 * 批量删除评教记录
 * @param {Number} idList 待删除的评教记录的id集合 
 * @returns 
 */
export function batchRemove(idList){
    return request({
        url: '/evaluate/records',
        method: 'DELETE',
        data: idList
    })
}

/**
 * 导出某学期的评教记录文件
 * @returns 
 */
export function exportRecordFile(){
    return new Promise((resolve, reject)=>{
        axios({
            url: `/api/evaluate/export?semId=${getSemesterId()}`,
            method: 'GET',
            responseType: 'blob',
            headers:{
                Authorization: getToken()
            }
        }).then(response => {
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            resolve(blob)
            
        }).catch(error => {
            console.log(error)
            useFailedTip(error.message)
            reject(error);
        })
    })
}