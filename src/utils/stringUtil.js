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
export function removeWhiteSpaces(str) {
    // 使用正则表达式匹配所有空白字符，并用空字符串替换它们
    return str.replace(/\s/g, '');
}
