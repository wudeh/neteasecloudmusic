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
