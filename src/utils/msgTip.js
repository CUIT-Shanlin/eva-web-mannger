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

/**
 * 全自定义的操作提示框
 * @param {string} message 提示信息
 * @param {string} title 提示标题
 * @param {Object} options 提示框结构 
 * @returns 提示框的promise对象
 */
export function useConfirm(message, title, options) {
    return ElMessageBox.confirm(message, title, options)
}

/**
 * 一般时候的操作提示框
 * @param {string} message 提示信息 
 * @returns 提示框的promise对象
 */
export function useSimpleConfirm(message){
    return useConfirm(message, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: true
    })
}

/**
 * 警示框（只能点确定）
 * @param {string} message 提示信息
 * @returns 警示框的promise对象
 */
export function useWarningConfirm(message){
    return useConfirm(message, '警告提醒', {
        confirmButtonText: '我知道了',
        showCancelButton: false,
        showClose: false,
        type: 'warning',
    })
}