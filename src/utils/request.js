import axios from 'axios'
import { getToken } from './auth';
import { useSuccessTip,useFailedTip } from './msgTip';
/**
 * 封装axios
 */

axios.defaults.withCredentials = true;

const request = axios.create({
    baseURL: '/devApi'
})

// 添加请求拦截-token处理
request.interceptors.request.use(
    config=>{
        // 登录请求直接放行
        if(config.url === '/login'){
            return config
        }

        // 其他请求在请求头设置token
        // config.headers.set('token',localStorage.getItem('token'))
        config.headers.set('token',getToken())

        return config
    },
    error=>{
        useFailedTip('请求错误：' + error.message)
        return Promise.reject(error)
    }
)

// 添加响应拦截
request.interceptors.response.use(
    response=>{
        let {data} = response
        if(data.code === 200){
            useSuccessTip(data.msg)
            return Promise.resolve(data.data)
        }else{
            useSuccessTip(data.msg)
            return Promise.reject(data.data)
        }
    },
    error=>{
        useFailedTip('请求错误：' + error.message)
        return Promise.reject(error)
    }
)


export default request