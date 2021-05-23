import { Toast } from "vant";
import store from "../store";
// 点击下载文件
export default function downloadFile(url: string, item: any) {
  if(!url) {
    Toast(`还未获取到下载链接，请稍后`)
    return
  }
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
    Toast(`${item.name} 开始下载`);
    console.log("<---正在下载中--->");
    console.log(`<---下载链接为${handleUrl}--->`);
    console.log(`<---下载文件名为${item.name}.${last}--->`);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", handleUrl, true);
    xhr.responseType = "blob";
    xhr.onload = function(e: any) {
      if (e.target.readyState === 4 && e.target.status === 200) {
        let blob = this.response;
        // 转换一个blob链接
        let u = window.URL.createObjectURL(new Blob([blob]));
        let a = document.createElement("a");
        a.download = `${item.name}.${last}`;
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
    xhr.addEventListener(
      "progress",
      function(event) {
        if (event.lengthComputable) {
          let percentComplete = (event.loaded / event.total) * 100;
          // const store = useStore();
          console.log(`当前下载进度${percentComplete.toFixed(2)}%`);
          store.commit("download_progress", {
            id: item.id,
            name: item.name,
            author: item.author,
            progress: percentComplete.toFixed(2)
          });
          if (percentComplete >= 100) Toast(`${item.name} 下载成功`);
          // ...
        } else {
          // Unable to compute progress information since the total size is unknown
          Toast.fail("当前音乐已在下载，但无法获取下载进度");
        }
      },
      false
    );
    xhr.onerror = function() {
      console.log("<-----文件下载失败----->");
    };
  }
}
