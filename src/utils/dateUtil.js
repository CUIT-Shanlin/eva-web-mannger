/**
 * 用于处理日期的工具js
 */

/**
 * 处理日期字符串 将完整日期字符串转成MM.DD格式
 * @param {string} dateString 日期字符串
 * @returns 处理完之后的日期字符串
 */
export function choreDateStr(dateString){
    let parts = dateString.split(' ')[0].split('-');
    let month = parts[1];
    let day = parts[2].trim(); // 去除字符串两端的空格
    return `${month}.${day}`;
}

/**
 * 将 Date对象 转成yyyy-MM-dd 格式 
 * @param {Date} date 原始Date对象 
 * @returns 格式之后的date字符串
 */
export function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    // 获取日期
    let day = String(date.getDate()).padStart(2, '0');
    // 拼接成 yyyy-MM-dd 格式
    return `${year}-${month}-${day}`;
}