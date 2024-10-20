import { isSpace } from "./stringUtil";

/**
 * 深拷贝对象
 * @param {*} source 
 * @returns 深拷贝之后的对象
 */
export function deepCopy(source) {  
    if (typeof source !== 'object' || source === null) {
        // 基本数据类型，直接返回
        // alert('直接返回了')
        return source;
    }
  
    let target;

    if (Array.isArray(source)) {
        // 数组
        target = [];  
        for (let i = 0; i < source.length; i++) {  
            target[i] = deepCopy(source[i]);
        }
    } else {
        // 对象  
        target = {};
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = deepCopy(source[key]);
            }
        }
    }
  
    return target;  
}

/**
 * 判断一个数组是不是空数组
 * @param {Array} arr 
 * @returns 
 */
export function isEmptyArr(arr = []){
    return arr === undefined || (Array.isArray(arr) && arr.length === 0);
}

/**
 * 判断一个对象是不是空对象
 * @param {Object} obj 
 * @returns 
 */
export function isEmptyObj(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * 让一个字符串数组中两个及以上完全相同且不为空的字符串后面加上序号
 * @param {Array} arr 原始字符串数组
 * @returns 处理好的数组
 */
export function addSuffixToDuplicates(arr) {
    // 使用一个空对象来跟踪每个字符串及其出现次数
    const stringCounts = {};
    const result = [];
    
    arr.forEach((str, index) => {
      if (!isSpace(str)) {
        if (!stringCounts[str]) {
          stringCounts[str] = 0;
        }
        if (++stringCounts[str] > 1) {
          let newStr = `${str}(${stringCounts[str] - 1})`
          while(stringCounts[newStr]){
            newStr = `${str}(${++stringCounts[str] - 1})`
          }
          result.push(newStr);
        } else {
          result.push(str);
        }
      } else {
        result.push(''); // 处理空字符串的情况
      }
    });
    return result;
}

/**
 * 移除一个字符串数组中的空白字符串
 * @param {Array} arr 原始字符串数组
 * @returns 处理后的字符串数组
 */
export function removeSpaceStrToArr(arr = []){
    return arr.filter(item => !isSpace(item))
}


/**
 * 判断一个对象是否是空对象或者null或者undefined
 * @param {Object} obj 传入对象
 */
export function isEmptyOrNullOrUndefined(obj) {
  return  (obj === null || obj === undefined) || 
(Object.keys(obj).length === 0 && obj.constructor === Object);
}