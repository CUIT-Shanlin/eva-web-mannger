import { useUserStore } from '@/stores/userStore';
import pinia from '@/utils/pinia'

/**
 * 判断当前用户是否有此按钮权限
 * @param {String} permission  按钮权限字符串 permission
 */
export function hasBtnPermission(permission = '') {
// 得到当前用户的所有按钮权限
  const myBtns = useUserStore(pinia).perms
  // 如果指定的功能权限在myBtns中, 返回true ==> 这个按钮就会显示, 否则隐藏
  return myBtns.indexOf(permission.trim()) !== -1
}