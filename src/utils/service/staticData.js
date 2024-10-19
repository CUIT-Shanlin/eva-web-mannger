/**
 * 操作静态数据的js
 */
import { getAssetsFile } from "../pubUse"

export const allIcons = [
    {
        name: '工作台',
        ico: '&#xe604;'
    },
    {
        name: '评教看板',
        ico: '&#xe630;'
    },
    {
        name: '系统',
        ico: '&#xe696;'
    },
    {
        name: '用户',
        ico: '&#xe642;'
    },
    {
        name: '角色',
        ico: '&#xe6a9;'
    },
    {
        name: '日志',
        ico: '&#xe6aa;'
    },
    {
        name: '指示板',
        ico: '&#xe6fa;'
    },
    {
        name: '菜单',
        ico: '&#xe605;'
    },
    {
        name: '管理',
        ico: '&#xe640;'
    },
    {
        name: '课程',
        ico: '&#xe601;'
    },
    {
        name: '评教',
        ico: '&#xe631;'
    },
    {
        name: '类型',
        ico: '&#xe787;'
    },
    {
        name: '记录',
        ico: '&#xe65a;'
    },
    {
        name: '设置',
        ico: '&#xe6dc;'
    },
    {
        name: '模板',
        ico: '&#xe614;'
    },
    {
        name: '列表',
        ico: '&#xe6cf;'
    },
    {
        name: '课表',
        ico: '&#xe606;'
    },
    {
        name: '日历',
        ico: '&#xe61c;'
    },
]

/**
 * 获取一个图标码对应的名称
 * @param {string} ico 图标码
 * @returns 图标名称
 */
export function getIconName(ico){
    return allIcons.find(icon => icon.ico == ico).name
}

/**
 * 用于确定同一表单的使用模式
 */
export const UPDATE_MODE = 0 // 修改模式
export const ADD_MODE = 1 // 新增模式
export const CHECK_MODE = 2 // 查看详情模式

/**
 * 用于确定课程性质
 */
export const THEORY_COURSE = 0 // 理论课性质
export const LAB_COURSE = 1 // 实验课性质
export const OTHER_COURSE = 3 // 其他课
export const allCourseNature = [
    {
        value: THEORY_COURSE,
        name: '理论课'
    },
    {
        value: LAB_COURSE,
        name: '实验课'
    },
    {
        value: OTHER_COURSE,
        name: '其他'
    },
]

/**
 * 用于确定菜单类型
 */
export const LIB_TYPE = 0
export const MENU_TYPE = 1
export const BTN_TYPE = 2

/**
 * 用于确定状态
 */
export const DISABLED_STATE = 0
export const NORMAL_STATE = 1

/**
 * 用于确定查询的是评教不达标还是被评不达标的用户
 */
export const EVA_UNQUALIFIED_USER = 0 // 评教未达标用户
export const UNQUALIFIED_USER = 1 // 被评教未达标用户


/**
 * 确定消息类型
 */
export const PENDING_MSG = 0 // 待办
export const NOTICOE_MSG = 1 // 通知
export const REMINDER_MSG = 2 // 提醒
export const WARN_MSG = 3 // 警告
// 所有消息类型
export const allMsgTypes = [
    {
        label: '待办',
        value: PENDING_MSG
    },
    {
        label: '通知',
        value: NOTICOE_MSG
    },
    {
        label: '提醒',
        value: REMINDER_MSG
    },
    {
        label: '警告',
        value: WARN_MSG
    },
]


/**
 * 确定消息性质
 */
export const COMMON_MSG_MODE = 0 // 普通消息
export const EVA_MSG_MODE = 1 // 评教消息

/**
 * 确定消息的显示状态
 */
export const NOT_DISPLAYED_MSG = 0 //未显示过的消息
export const DISPLAYED_MSG = 1 // 显示过的消息

/**
 * 确定消息已读状态
 */
export const UNREAD_MSG = 0 // 未读
export const READ_MSG = 1 // 已读


/**
 * 确定评教任务的状态
 */
export const PENDING_TASK = 0 // 待办任务
export const COMPLETED_TASK = 1 // 已完成的任务
export const CANCELLED_TASK = 2 // 取消的任务
export const allTaskStatus = [
    {
        label: '全部',
        value: -1,
        type: ''
    },
    {
        label: '待完成',
        value: PENDING_TASK,
        type: 'primary'
    },
    {
        label: '已完成',
        value: COMPLETED_TASK,
        type: 'success'
    },
    {
        label: '已撤回',
        value: CANCELLED_TASK,
        type: 'danger'
    },
]


/**
 * 确认默认情况
 */
export const THEORY_DEFAULT = 0 // 理论课默认数据
export const LAB_DEFAULT = 1 // 实验课默认数据
export const NOT_DEFAULT = -1 // 非默认数据
export const allDefaultData = [
    {
        value: THEORY_DEFAULT,
        label: '理论课默认'
    },
    {
        value: LAB_COURSE,
        label: '实验课默认'
    },
    {
        value: NOT_DEFAULT,
        label: '非默认'
    },
]


/**
 * 头像url
 */
export const DEFAULT_AVATAR_URL = getAssetsFile('default_avatar.png') // 默认头像
export const ERROR_AVATAR_URL = 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png' // 头像加载失败之后展示的回退图片
