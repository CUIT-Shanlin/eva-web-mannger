import router from ".";
import {useUserStore} from '@/stores/userStore'
import { getInfo } from '@/api/user'
import pinia from '@/utils/pinia'


/**
 * 处理路由守卫实现动态路由 + 获取权限
*/

router.beforeEach(async(to,from,next) => {
    // 转到登录的路由直接放行
    if(to.path === '/login'){
        if(useUserStore().token){
            next('/home')
        }else next()
    }else{
        // 未获取权限信息就发请求去拿
        if(!hasInfo()){
            await userInit()
        }
    }
})

// 判断是否已经发起过获取权限等信息的请求
function hasInfo(){
    return new string(useUserStore(pinia).id) !== '-1'
}

// 加载用户的权限信息和基础信息到pinia
const userInit = async()=>{
    let {data} = await getInfo()
    // 将权限信息存入pinia

    let user = useUserStore()
    

    console.log('==========info=======')
    console.log(data)
    console.log('==========info=======')

}