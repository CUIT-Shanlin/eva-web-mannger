/**
 * webSocket的工具js
 */
import { useFailedTip } from "@/utils/msgTip";


// 后端地址
const SOCKET_SERVER_URL = 'https://apifoxmock.com/m1/4684209-4335706-default/socket'

/**
 * 初始化socket
 */
export function initSocket(){
    if(typeof WebSocket === 'undefined'){
        useFailedTip('您的浏览器或当前环境不支持socket')
        return
    }
    try{
        const socket = new WebSocket(SOCKET_SERVER_URL)
        socket.onerror = ()=>{
            useFailedTip('socket连接失败，可能导致消息发送异常')
        }
        return socket
    }catch{
        useFailedTip('连接失败, 无法连接到服务端地址')
    }
}