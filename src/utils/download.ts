import { Toast } from "vant"
// 点击下载文件
export default function downloadFile(url: string, downloadName: string) {
  // 音视频下载
  if (url.indexOf("http://") >= 0 || url.indexOf("https://") >= 0) {
    let handleUrl = "";
    // 本站用的https:// 接口返回的http，这样可能会跨域导致无法下载，这里手动将字符串的http转一下
    if (location.protocol === "https:") {
      handleUrl = url.replace("http://", "https://");
    } else {
      handleUrl = url;
    }
    let i = url.split(".");
    let last = i[i.length - 1];
    Toast("开始下载音乐")
    console.log("<---正在下载中--->");
    console.log(`<---下载链接为${handleUrl}--->`);
    console.log(`<---下载文件名为${downloadName}.${last}--->`);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", handleUrl, true);
    xhr.responseType = "blob";
    xhr.onload = function(e: any) {
      if (e.target.readyState === 4 && e.target.status === 200) {
        let blob = this.response;
        // 转换一个blob链接
        let u = window.URL.createObjectURL(new Blob([blob]));
        let a = document.createElement("a");
        a.download = `${downloadName}.${last}`;
        a.href = u;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
        // loading.close()
      }
    };
    xhr.send();
    // 监听下载进度
    xhr.addEventListener("progress", function(event) {
      if (event.lengthComputable) {
      let percentComplete = event.loaded / event.total * 100;
       
      console.log(`当前下载进度${percentComplete.toFixed(2)}%`);
      if(percentComplete >= 100) Toast("音乐下载成功")
      // ...
       
      } else {
      // Unable to compute progress information since the total size is unknown
      }
      }, false);
      xhr.onerror = function(){
        console.log("<-----文件下载失败----->");
      }
  }
}
