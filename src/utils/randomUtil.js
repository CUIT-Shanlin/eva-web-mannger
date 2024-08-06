/**
 * 随机生成相关的工具js
 */

/**
 * 生成指定范围（闭区间）的随机整数
 * @param {Number} minNum 最小数字
 * @param {Number} maxNum 最大数字
 * @returns 指定范围（闭区间）的随机整数
 */
export function getRandomNumber(minNum = 0, maxNum = 3) {
    // 最大值小于最小值就交换
    if(maxNum < minNum){
        return getRandomNumber(maxNum,minNum);
    }
    return minNum + Math.floor(Math.random() * (maxNum + 1));
}