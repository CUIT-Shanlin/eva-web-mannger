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