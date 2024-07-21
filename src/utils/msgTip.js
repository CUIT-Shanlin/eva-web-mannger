import { ElMessage,ElMessageBox } from 'element-plus'
/**
 * 快捷生成消息提示以及消息对话框等的工具js
 */


function useTip(msg = '',type = 'success'){
    ElMessage({
        showClose: true,
        message: msg,
        type,
    })
}
/**
 * 返回成功的消息提示
 * @param {string} msg 成功信息
 */
export function useSuccessTip(msg = '操作成功'){
    useTip(msg,'success')
}

/**
 * 返回失败的消息提示
 * @param {string} msg 错误信息
 */
export function useFailedTip(msg = '操作失败'){
    useTip(msg,'error')
}

/**
 * 返回警告的消息提示
 * @param {string} msg 警告信息
 */
export function useWarnTip(msg = '操作警告'){
    useTip(msg,'warning')
}