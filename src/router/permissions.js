import router from ".";
import {useUserStore} from '@/stores/userStore'
import { getInfo } from '@/api/user'
import { isSpace } from '@/utils/stringUtil'
import pinia from '@/utils/pinia'
import { getToken } from "@/utils/auth";

import Home from '@/views/Home.vue'
import ParentView from "@/components/ParentView.vue";


// const _import = require('./router/_import_'+process.env.NODE_ENV) // 获取组件的方法

/**
 * 处理路由守卫实现动态路由 + 获取权限
 * 
*/

router.beforeEach(async(to,from,next) => {
    // 转到登录的路由直接放行
    if(to.path === '/login'){
        // 没有token => 跳转登录页
        if(getToken()){
            next('/home')
        }else next()
    }else{
        // 非登录页 + 无token => 转到登录页
        if(!getToken()){
            next('/login')
        }
        // 未获取权限信息就发请求去拿
        if(!hasInfo()){
            await userInit()
        }
        let {menus} = useUserStore(pinia)
        if(menus.length < 1 || router.getRoutes().length <= 4){
            changeMenusToRouters(menus)
            menus.forEach(menu=>{
                router.addRoute(menu)
            })
            let lastRou = {
                path: '/:catchAll(.*)', // 使用参数匹配和正则表达式来捕获所有路径  
                component: ()=>import('../views/404.vue')
            }
            router.addRoute(lastRou)
            useUserStore(pinia).menus = menus
            // console.log(menus)
            // 保证添加路由的异步化操作完成后再转到目标路由
            next(to.fullPath);
        }else{
            next()
        }
    }
})

/**
 * 判断是否已经发起过获取权限等信息的请求 
 **/ 
function hasInfo(){
    return useUserStore(pinia).info.id !== -1
}

/**
 * 加载用户的权限信息和基础信息到pinia
 */
const userInit = async()=>{
    let data = await getInfo()
    // 将权限信息存入pinia

    let user = useUserStore(pinia)
    user.info = data.info
    user.perms = data.buttonList
    user.menus = data.routerList
    user.roles = data.roleList
}


/**
 * 将路径转成组件，路径不存在就是默认组件
 * @param {string} modulePath 传入路径
 * @returns 
 */
async function loadModule(modulePath){
    try{
        const module = await import(`/src/views${modulePath}.vue`)
        return module;
    } catch (error) {
        // 返回默认组件Empty
        console.error(error)
        return import('./../views/Empty.vue').then(m => m.default);
    }
}

/**
 * 将后端传过来的原始路由格式转成真正的路由数组
 * @param {*} routers
 */
function changeMenusToRouters(routers = []){
    for (var route of routers) {
        // 处理路由中的path属性
        if(!isSpace(route.path)){
            if(route.path.substring(0,1) !== '/'){
                route.path = `/${route.path}`
            }
        }
        if(isSpace(route.path)){
            continue
        }
        // 处理组件
        if(route.component === 'Home'){
            route.component = Home
        }else if(route.component === 'ParentView'){
            route.component = ParentView
        }else if(typeof route.component === 'string'){
            // route.path = route.component
            route.component = loadModule(route.component)
        }
        // 有子路由就递归继续处理
        if(route.children != null && route.children.length > 0){
            route.children = changeMenusToRouters(route.children)
        }
    }
    return routers
}


export default router