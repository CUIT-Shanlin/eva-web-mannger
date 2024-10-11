/**
 * webSocket的工具js
 */
import { useFailedTip } from "@/utils/msgTip";
import { getMyToken } from "@/utils/auth";


// 后端socket的地址
const WSS_ADDRESS = 'wss://apifoxmock.com/m1/4684209-4335706-default:8080/send/msg'

// 重连时间(ms)
const RECONNECTION_TIME = 3000


/**
 * 二次封装的webSocket
 * @param {Function} handleMessage 接收消息的方法
 * @returns 
 */
export function useMySocket(handleMessage){
    if(typeof WebSocket === 'undefined'){
        useFailedTip('您的浏览器或当前环境不支持socket')
        return null
    }
    const wss = new WebSocket(WSS_ADDRESS)

    const init = ()=>{
        bindEvent()
    }

    function bindEvent (){
        wss.addEventListener('open', handleOpen, false)
        wss.addEventListener('close', handleClose, false)
        wss.addEventListener('message', handleMessage, false)
        wss.addEventListener('error', handleError, false)
    }

    init()

    function handleOpen(e){
        console.log('webSocket 开启', e)
        // dkh: 第一次握手的时候，发送token进行认证
        wss.send(`Authorization:${getMyToken()}`)
    }

    function handleClose(e){
        console.log('webSocket 关闭', e)
    }

    function handleError(e){
        console.log('webSocket 错误', e)
        useFailedTip('socket连接失败或中断，可能导致消息发送异常')
    }
    return wss
}

/**
 * 通用的消息发送方法
 * @param {Object} mySocket socket对象
 * @param {Object} msgObj 消息对象 
 * @returns 
 */
export function sendMySocketMsg(mySocket, msgObj = {}){
    try {
        if(!mySocket || mySocket.readyState + '' === WebSocket.CLOSED + ''){
            useFailedTip('socket已关闭，发送失败，尝试重连~')
            setTimeout(()=>{
                mySocket = useMySocket()
                if(!mySocket || mySocket.readyState === WebSocket.CLOSED){
                    useFailedTip('重连失败')
                    return
                }
                _sendMsg(msgObj)
            }, RECONNECTION_TIME)
            return
        }
        function _sendMsg(myMsg){
            mySocket.send(JSON.stringify(myMsg))
            useSuccessTip('发送成功~')
        }
        
        _sendMsg(msgObj)
    } catch (error) {
        useFailedTip('发送失败')
        console.log('发送失败', error)
    }
}