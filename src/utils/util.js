/**
 * time ago
 * @param {*} time
 */
export function timeAgo(time) {
    const minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    // const halfamonth = day * 15;
    const month = day * 30;
    const now = new Date().getTime();   //获取当前时间毫秒
    const diffValue = now - time;//时间差

    if (diffValue < 0) {
        return;
    }
    const minC = diffValue / minute;  //计算时间差的分，时，天，周，月
    const hourC = diffValue / hour;
    const dayC = diffValue / day;
    const weekC = diffValue / week;
    const monthC = diffValue / month;
    let result;
    if (monthC >= 1 && monthC <= 3) {
        result = " " + parseInt(monthC) + "月前";
    } else if (weekC >= 1 && weekC <= 4) {
        if (weekC > 4) {
            result = " " + Math.floor(weekC) + "周前";
        } else {
            result = " " + parseInt(weekC) + "周前";
        }
    } else if (dayC >= 1 && dayC <= 6) {
        result = " " + parseInt(dayC) + "天前";
    } else if (hourC >= 1 && hourC <= 23) {
        result = " " + parseInt(hourC) + "小时前";
    } else if (minC >= 1 && minC <= 59) {
        result = " " + parseInt(minC) + "分钟前";
    } else if (diffValue >= 0 && diffValue <= minute) {
        result = "刚刚";
    } else {
        var datetime = new Date();
        datetime.setTime(time);
        var Nyear = datetime.getFullYear();
        var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        // var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        result = Nyear + "/" + Nmonth + "/" + Ndate + " " + Nhour + ":" + Nminute;
    }
    return result;
}

// function formatDate(date, fmt) {
//     date = new Date(date);
//     if (/(y+)/.test(fmt)) {
//         fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
//     }
//     let o = {
//         'M+': date.getMonth() + 1,
//         'd+': date.getDate(),
//         'h+': date.getHours(),
//         'm+': date.getMinutes(),
//         's+': date.getSeconds()
//     };
//     for (let k in o) {
//         if (new RegExp(`(${k})`).test(fmt)) {
//             let str = o[k] + '';
//             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
//         }
//     }
//     return fmt;
// }

// function padLeftZero(str) {
//     return ('00' + str).substr(str.length);
// }

// From <https://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-9.php>
export function isUrl(str) {
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
    if (regexp.test(str)) {
        return true
    } else {
        return false
    }
}

export function isEmpty(content) {
    return content === null || content === undefined || content === ''
}

export function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object
}

export function validEmail(email) {
    var re = /^[A-Za-z1-9]+([-_.][A-Za-z1-9]+)*@([A-Za-z1-9]+[-.])+[A-Za-z]{2,8}$/
    return re.test(email);
}

export const queryStringify = query => {
    const queryString = Object.keys(query)
        .map(key => `${key}=${encodeURIComponent(query[key] || '')}`)
        .join('&')
    return queryString
}

export function getUrlKey(name) {
    return (
        decodeURIComponent(
            (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
                location.href
            ) || "")[1].replace(/\+/g, "%20")
        ) || null
    );
}

// 特殊字符转义成HTML标签
export function decodeHTML(html){
    var output, elem = document.createElement('div');
    elem.innerHTML = html;
    output = elem.innerText || elem.textContent;
    elem = null;
    return output;
}