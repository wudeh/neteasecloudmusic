// 过滤播放量函数
export function numFilter(num: number): string {
  if (num >= 100000 && num < 100000000) {
    const i = (num / 10000).toFixed(1);
    return i + "万";
  } else if (num >= 100000000) {
    const i = (num / 100000000).toFixed(1);
    return i + "亿";
  }
  return `${num}`;
}

// 手动删除cookie
export function deleteCookie(): void {
  // document.cookie = `MUSIC_U=; expires=${new Date(0).toGMTString()}`
  const date = new Date();
  const cookieExpire = date.getTime() - 1000; // 设置为一个过去的时间
  // 删除 cookie 时，名称、路径和域名必须相同
  document.cookie =
    " MUSIC_U=JavaScript  ; expire= " +
    cookieExpire +
    " ;path=/;domain=localhost:8080";
}

// 计算歌曲时长
export function getTime(time: number): string {
  let i = Math.floor(time);
  let hour = Math.floor(i / 3600);
  // console.log("计算后的小时" + hour);

  let min = Math.floor(i / 60 - hour * 60);
  // console.log("计算后的分钟" + min);
  
  let h = `${hour}`.padStart(2, '0');
  let m = `${min}`.padStart(2, '0');
  let sec = Math.floor(i % 60);
  // console.log("计算后的秒" + sec);
  let s = `${sec}`.padStart(2, '0');
  if(Number.isNaN(min)) return "00:00"
  if(hour>0) return h + `:` + m +':' + s;
  return m +':' + s;
}

/**
 * 评论发送日期转换
 * @param {Number} t 时间戳
 */
 export function sendTimeConversion(t: any) {
  let nowDate = null
  let todayLast = null
  if (nowDate === null || todayLast === null) {
    // 当前 Unix 时间戳
    nowDate = new Date().getTime()
    // 今天 23:59:59.999 时间戳
    todayLast = new Date(new Date().setHours(23, 59, 59, 999)).getTime()
  }
  if ((nowDate - t) <= 60000) {
    return '刚刚'
  } else if ((nowDate - t) > 60000 && (nowDate - t) <= 3600000) {
    let pastTimeUnix = nowDate - t
    let pastTime = new Date(Number(pastTimeUnix))
    return `${pastTime.getMinutes()}分钟前`
  } else if ((todayLast - t) > 3600000 && (todayLast - t) <= 86400000) {
    let userDate = new Date(Number(t))
    let UH = userDate.getHours() < 10 ? `0${userDate.getHours()}` : userDate.getHours()
    let Um = userDate.getMinutes() < 10 ? `0${userDate.getMinutes()}` : userDate.getMinutes()
    return `${UH}:${Um}`
  } else if ((todayLast - t) > 86400000 && (todayLast - t) <= 172800000) {
    let userDate = new Date(Number(t))
    let UH = userDate.getHours() < 10 ? `0${userDate.getHours()}` : userDate.getHours()
    let Um = userDate.getMinutes() < 10 ? `0${userDate.getMinutes()}` : userDate.getMinutes()
    return `昨天${UH}:${Um}`
  } else if ((todayLast - t) > 172800000 && (todayLast - t) <= 31557600000) {
    let userDate = new Date(Number(t))                         
    return `${userDate.getFullYear()}年${userDate.getMonth() + 1}月${userDate.getDate()}日`
  } else {
    let userDate = new Date(Number(t))
    return `${userDate.getFullYear()}年${userDate.getMonth() + 1}月${userDate.getDate()}日`
  }
}

// 计算视频时长
export function timeFilter (i: number) {
  let a = Math.floor(i / 1000);
  return `${Math.floor(a/60)}`.padStart(2, "00") + ":" + `${a % 60}`.padStart(2, "0")
}

// 计算日期
export function getDate (i: number) {
  let a = new Date(i);       
  return `${a.getFullYear()}.${a.getMonth() + 1}.${a.getDate()}`
}
