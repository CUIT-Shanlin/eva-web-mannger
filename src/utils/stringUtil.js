/**
 * 处理字符串的工具js
 */

/**
 * 判断是不是空白字符串或是null
 * @param {string} str 传入字符串 
 * @returns 是否为空白字符串
 */
export function isSpace(str){
    return str == null || /^\s*$/.test(str);
}

/**
 * 去除一个字符串中空白字符
 * @param {string} str 传入字符串
 * @returns 去除空白字符之后的字符串
 */ 
export function removeSpace(str) {
    // 使用正则表达式匹配所有空白字符，并用空字符串替换它们
    return str.replace(/\s/g, '');
}

/**
 * 将一个rgb颜色字符串转成对应的数字的数组，eg: rgb(0,0,0) => [0,0,0]
 * @param {string} colorStr rgb颜色字符串
 * @returns 对应的数字的数组
 */
export function colorStrToArr(colorStr=''){
    if(isSpace(colorStr)){
        return ['','',''].map(Number);
    }
    // 去除字符串两端的'rgb('和')'，然后使用逗号分割字符串
    const colorArrValue = colorStr.replace(/^rgb\(|\)$/g, '').split(',');
    // 将分割后的字符串数组转换为数字数组
    return colorArrValue.map(Number);
}

/**
 * 检测一个字符串是否符合基本的邮箱格式
 * @param {string} str 传入字符串
 * @returns 是否符合
 */
export function isEmail(str = ''){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(str);
}

/**
 * 检测一个字符串是不是符合移动电话的基本格式
 * @param {string} str 传入字符串
 * @returns 是否符合
 */
export function isPhone(str = ''){
    const regex = /^1(3|4|5|6|7|8|9)\d{9}$/;
    return regex.test(str);
}

/**
 * 将一个字符串中的分隔符替换成变量
 * @param {string|number|...} data 变量
 * @param {string} str1 原始字符串，带分隔符 
 * @param {string} str2 分隔符，默认是 | 
 * @returns 替换完成的字符串
 */
export function replaceStr(data, str1 = '',str2='|'){
    const regex = new RegExp(str2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    return str1.replace(regex, data);
}