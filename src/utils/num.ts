// 过滤播放量函数
export function numFilter(num: number): number | string {
  if (num >= 100000 && num < 100000000) {
    const i = Math.floor(num / 10000);
    return i + "万";
  } else if (num >= 100000000) {
    const i = Math.floor(num / 100000000);
    return i + "亿";
  }
  return num;
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

  let min = Math.floor(i / 60);
  // console.log("计算后的分钟" + min);
  
  let h = `${hour}`.padStart(2, '0');
  let m = `${min}`.padStart(2, '0');
  let sec = Math.floor(i % 60);
  // console.log("计算后的秒" + sec);
  let s = `${sec}`.padStart(2, '0');
  if(hour>0) return h + m +':' + s;
  return m +':' + s;
}
