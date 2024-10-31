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
 * 将 Date对象 转成yyyy-MM-dd HH:mm:ss格式 
 * @param {Date} date 原始Date对象 
 * @returns 格式之后的date字符串
 */
export function formatDate(date) {
    if(date === null || !date){
        return '';
    }
    if(!isDateStrict(date)){
		date = new Date(date)
	}
    // 获取日期
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');

    // 获取时间
    let hour = String(date.getHours()).padStart(2, '0')
    let minute = String(date.getMinutes()).padStart(2, '0')
    let secend = String(date.getSeconds()).padStart(2, '0')

    // 拼接成 yyyy-MM-dd HH:mm:ss格式
    return `${year}-${month}-${day} ${hour}:${minute}:${secend}`;
}

/**
 * 判断传入数据是不是日期对象
 * @param {Object} date
 */
export function isDateStrict(date) {  
    return Object.prototype.toString.call(date) === '[object Date]';
}


/**
 * 将 Date对象 转成yyyy-MM-dd格式 
 * @param {Date} date 原始Date对象 
 * @returns 格式之后的date字符串
 */
export function formatDateNotTime(date) {
    if(date == null){
        return '';
    }
    // 获取日期
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    // 拼接成 yyyy-MM-dd格式
    return `${year}-${month}-${day}`;
}

/**
 * 处理日期字符串 将完整日期字符串转成yyyy-MM-DD格式
 * @param {string} dateString 日期字符串
 * @returns 处理完之后的日期字符串
 */
export function getTime(dateString){
    let parts = dateString.split(' ')[0].split('-');
    let year = parts[0];
    let month = parts[1];
    let day = parts[2].trim(); // 去除字符串两端的空格
    return `${year}-${month}-${day}`;
}

/**
 * 根据传入的日期计算出，距离现在有多少时间
 * @param {String|Date} date 传入时间
 * @returns 距离现在有多少时间的中文文本
 */
export function dateToDistanceTime(date){
    const pastTime = new Date(date).getTime()
    const nowTime = new Date().getTime()
    const passMinute = Number.parseInt((nowTime - pastTime) / (1000.0 * 60.0))
    // 不足一小时，直接返回是多少分钟前
    if(passMinute < 60){
        return `${passMinute}分钟前`
    }
    const passHour = Number.parseInt(passMinute / 60.0)
    // 不足一天，返回小时
    if(passHour < 24){
        // 余出来的分钟不足30分钟，只返回整数部分
        if(passMinute % 60 < 30){
            return `${passHour}小时前`
        }
        return `${passHour}.5小时前`
    }
    const passDay = Number.parseInt(passHour / 24.0)
    // 不足一个月，返回多少天
    if(passDay < 30){
        return `${passDay}天前`
    }
    const passMonth = Number.parseInt(passDay / 30.0)
    // 不足360天，返回月份
    if(passMonth < 12){
        return `${passMonth}个月前`
    }
    return `${Number.parseInt(passMonth / 12.0)}年前`
}