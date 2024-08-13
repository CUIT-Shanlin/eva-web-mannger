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