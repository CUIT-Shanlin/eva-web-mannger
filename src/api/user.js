import request from '@/utils/request.js'



/**
 * 获取用户自己的信息
 */
export function getInfo(){
    return request(
        {
            url: '/user/info?semId=1',
            method: 'GET',
        }
    )
}

/**
 * 分页获取用户信息
 * @param {Number} page 页数
 * @param {Number} size 一页的元素个数
 * @param {Object} queryObj 条件查询的对象
 * @returns 分页信息
 */
export function getPageData(page = 0,size = 0,queryObj = {}){
    return request({
        url: '/users',
        method: 'POST',
        data: {
            page,
            size,
            queryObj,
        }
    })
}