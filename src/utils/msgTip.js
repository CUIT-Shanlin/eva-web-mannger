import { ElMessage,ElMessageBox } from 'element-plus'
/**
 * 快捷生成消息提示以及消息对话框等的工具js
 */

// 返回成功的消息提示
export function useSuccessTip(msg = '操作成功'){
    ElMessage({
        showClose: true,
        message: msg,
        type: 'success'
    })
}

// 返回失败的消息提示
export function useFailedTip(msg = '操作失败'){
    ElMessage({
        showClose: true,
        message: msg,
        type: 'error'
    })
}