/**
 * webSocket的工具js
 */
import { useFailedTip } from "@/utils/msgTip";
import { getToken } from "@/utils/auth";

// 后端socket的地址
const HOST =
  import.meta.env.VITE_APP_MODE === "development"
    ? "apifoxmock.com/m1/4684209-4335706-default:8080"
    : "eva-test.project.littlestrange.site:52443/api";
// const HOST = import.meta.env.VITE_APP_MODE === 'development' ? 'apifoxmock.com/m1/4684209-4335706-default:8080' : '192.168.1.144:8080'
const WSS_ADDRESS = `wss://${HOST}/send/msg`;

/**
 * 二次封装的webSocket
 * @param {Function} handleMessage 接收消息的方法
 * @returns
 */
export function useMySocket(handleMyMessage) {
  if (typeof WebSocket === "undefined") {
    useFailedTip("您的浏览器或当前环境不支持socket");
    return null;
  }

  const wss = new WebSocket(`${WSS_ADDRESS}?Authorization=${getToken()}`);

  const init = () => {
    bindEvent();
  };

  function bindEvent() {
    wss.addEventListener("open", handleOpen, false);
    wss.addEventListener("close", handleClose, false);
    wss.addEventListener("message", handleMessage, false);
    wss.addEventListener("error", handleError, false);
  }

  init();

  function handleOpen(e) {
    console.log("webSocket 开启", e);
  }

  function handleClose(e) {
    console.log("webSocket 关闭", e);
    setTimeout(() => {
      useMySocket(() => {});
    }, 3000);
  }

  function handleError(e) {
    console.log("webSocket 错误", e);
    useFailedTip("socket连接失败或中断，可能导致消息接收异常");
  }

  function handleMessage(e) {
    let msgData = JSON.parse(e.data);
    if (msgData.code + "" !== "200") {
      useFailedTip(`接收消息失败，${msgData.msg}`);
      return;
    }
    // console.log(msgData.data);
    handleMyMessage(msgData.data);
  }

  return wss;
}
