import request from '@/utils/request.js'

/**
* 分页获取评教模板信息
* @param {Number} page 页数
* @param {Number} size 一页的元素个数
* @param {Object} queryObj 条件查询的对象
* @returns 分页信息
*/
export function getPageData(reqData = {page: 0,size: 0,queryObj: {}}){
   return request({
       url: '/evaluate/templates',
       method: 'POST',
       data: reqData
   })
}

/**
 * 删除单个评教模板
 * @param {Number} templateId 待删除的评教模板的id 
 * @returns 
 */
export function removeOne(templateId){
    return request({
        url: `/evaluate/template?templateId=${templateId}`,
        method: 'DELETE'
    })
}

/**
 * 批量删除评教模板
 * @param {Number} idList 待删除的评教模板的id集合 
 * @returns 
 */
export function batchRemove(idList){
    return request({
        url: '/evaluate/templates',
        method: 'DELETE',
        data: idList
    })
}