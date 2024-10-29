
/**
 * 处理学期模块业务相关的工具js
 */

const SEMESTER_KEY =  'eva_semester_id_key'

/**
 * 全局session存当前的学期id
 * @param {*} semId 当前的学期id
 * @returns 
 */
export function setSemesterId(semId){
    return sessionStorage.setItem(SEMESTER_KEY,semId);
}

/**
 * 获取全局session存的学期id
 * @returns 当前的学期id
 */
export function getSemesterId(){
    return sessionStorage.getItem(SEMESTER_KEY) | -1;
}

/**
 * 仅看学期年份，获取去重后学期数组
 * @param {Array} originArr 全部的学期
 * @returns 去重后学期数组
 */
export function getDistinctSemsters(originArr = []){
    // 创建一个Map，其中键是由startYear和endYear拼接而成的字符串
    const map = new Map();
    originArr.forEach(sem => {
        const key = `${sem.startYear}-${sem.endYear}`
        if(!map.has(key)){
            map.set(key,sem)
        }
    });
    return Array.from(map.values());
}

/**
 * 判断两个学期年份是不是一样
 * @param {object} sem1 
 * @param {object} sem2 
 * @returns 是否一样
 */
export function isCommonYear(sem1 = {},sem2 = {}){
    return sem1.startYear === sem2.startYear && sem1.endYear === sem2.endYear
}