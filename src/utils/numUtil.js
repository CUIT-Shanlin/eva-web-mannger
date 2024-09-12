/**
 * 数字相关的工具js
 */

/**
 * 将阿拉伯数字转成中文数字
 * @param {Number | String} baseNum 阿拉伯数字
 * @returns {string} 中文数字
 */
export function getChineseNum(baseNum = 0) {
    // 字符串数字转成数字
    let num = Number(baseNum);
    // 获取正负符号
    let symbol = num < 0 ? '负' : '';
    num = Math.abs(num);
  
    const baseArr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const unitArr = ['', '十', '百', '千', '万', '亿'];

    let chineseStr = '';
    let unitIndex = 0;

    while (num > 0) {
        let digit = num % 10; // 获取当前位的数字
        let unit = unitArr[unitIndex]; // 获取当前位的单位
  
        // 处理特殊情况：十的倍数和连续零
        if (digit === 0) {
            if (chineseStr.length === 0 || chineseStr[chineseStr.length - 1] !== '零') {
                chineseStr = baseArr[digit] + chineseStr; // 只在非连续零时添加'零'
            }
        } else if (digit === 1 && unitIndex !== 0 && num % 100 !== 10) {
            // 处理十一位数的情况（如十一、二十一）
            chineseStr = baseArr[digit] + unitArr[unitIndex - 1] + chineseStr;
            num -= 10; // 减去已经处理的十位数
        } else if (digit === 2 && unitIndex === 1 && num % 100 === 20) {
            // 处理二十的情况
            chineseStr = baseArr[digit] + unit + chineseStr;
            num -= 20; // 减去已经处理的二十
        } else {
            chineseStr = baseArr[digit] + unit + chineseStr;
        }
  
        num = Math.floor(num / 10); // 处理下一位
        unitIndex++; // 移到下一位的单位
    }

    // 去除开头的'零'
    if (chineseStr.startsWith('零')) {
        chineseStr = chineseStr.substring(1);
    }

    return symbol + (chineseStr.length === 0 ? '零' : chineseStr);
}

/**
 * 将数字转成星期几
 * @param {Number | String} baseNum 数字
 * @returns {string} 星期几 eg: '7 => 日'
 */
export function getWeekByNum(baseNum = 1){
    // 字符串数字转成数字
    let num = Number(baseNum);
    const baseArr = ['一', '二', '三', '四', '五', '六', '日'];
    return baseArr[num - 1]
}

/**
 * 处理显示的数字，让数字在加载过来之前有加载显示
 * @param {Number|String} num 传入的数字
 * @param {number} [digit=1] 小数点后几位
 * @param {Boolean} isShowSymbol 是否要加 + 号
 */
export function getShowNum(num, isShowSymbol = false, digit = 1){
    const DEFAULT_SHOW = '--'
    if(!num && num !== 0){
        return DEFAULT_SHOW
    }
    num = formatNumberToOneDecimalPlace(num, digit)
    if(isShowSymbol){
        return num >= 0 ? `+${num}` : num
    }
    return num
}

/**
 * 将一个数字格式化，整数直接返回，小数会精确到指定小数点
 * @param {Number|string} num 待格式化的数字
 * @param {number} [digit=1] 小数点后几位
 * @returns 格式化后的数字
 */
export function formatNumberToOneDecimalPlace(num = 1, digit = 1) {
    num = Number(num)
    // 检查num是否为整数  
    if (Number.isInteger(num)) {
        return num;
    } else {
        return Number((Math.round(num * 10) / 10).toFixed(digit));
    }
}