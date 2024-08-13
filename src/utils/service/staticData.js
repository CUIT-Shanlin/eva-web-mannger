/**
 * 操作静态数据的js
 */

export const allIcons = [
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