import axios from 'axios'
import {
  getToken,
  removeToken
} from './auth';
import { 
  useWarningConfirm,
  useFailedTip
} from './msgTip';
import router from '@/router/permissions'

/**
 * 封装axios
 */

axios.defaults.withCredentials = true;

const request = axios.create({
    // baseURL: '/devApi'
    baseURL: '/api'
    // baseURL: import.meta.env.VITE_APP_BASE_URL
    
})

// 添加请求拦截-token处理
request.interceptors.request.use(
    config=>{
        // 登录请求直接放行
        if(config.url === '/login'){
            return config
        }

        const token = getToken()
        // TODO 没有token就取消请求，并提示
        if(!token){
            console.log('Token 未找到，取消请求');
            return Promise.reject(new Error('登录异常，Token 未找到，请求被取消'));
        }
        // 在请求头设置token
        config.headers.set('Authorization',token)

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
        if(data.code + '' === '200'){
            // useSuccessTip(data.msg)
            return Promise.resolve(data.data)
        }else{
            // useSuccessTip(data.msg)
            if(data.code + '' === '401'){ // authorized，token过期或token异常等的返回码
                useWarningConfirm('登录过期或异常，即将跳转登录页，重新登录').then(()=>{
                    removeToken()
                    window.location.reload()
                })
            }else if(data.code + '' === '403'){ // 没有权限的情况
                useFailedTip("您没有权限进行该操作！")
            }else{
                useFailedTip(data.msg)
            }
            return Promise.reject(data)
        }
    },
    error=>{
        useFailedTip('响应错误：' + error.message)
        if(!getToken()){
            useWarningConfirm('登录异常，即将跳转登录页，重新登录').then(()=>{
                // router.push('/login')
                window.location.reload()
            })
        }
        return Promise.reject(error)
    }
)


export default request