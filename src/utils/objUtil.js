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