import request from '@/utils/request.js'
import axios from 'axios'



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
    // return axios.get('/user/info?semId=1')
}