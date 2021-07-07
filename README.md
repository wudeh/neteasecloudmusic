# 网易云移动端音乐

## 说明
- 技术栈：vue3 + vant + better-scroll
- 线上预览：https://neteasecloudmusic.vercel.app
- 数据来源：https://github.com/Binaryify/NeteaseCloudMusicApi
- 作为一个开源项目，大概主要亮点就是实现了歌词进度拖动功能吧，虽然在 GitHub 上网易云音乐项目已经被做烂了，不过我翻了半天项目都没找到有比较完整地实现全部音乐播放的项目，选择模仿安卓移动端主要是因为移动端的音乐播放功能要考虑实现的功能更多，所以本项目主要集中于实现音乐播放的相关功能，不会致力于实现全部移动端的网易云音乐功能；各位如果有兴趣的可以考虑自己实现。

## 主要完成功能
- 播放：列表循环播放，单曲循环播放，随机循环播放，播放上一首，播放下一首
- 歌词滚动高亮
- 进度控制：时间进度条拖动，歌词时间进度拖动
- 声音大小拖动控制
- 音乐下载
- 简单的搜索
- 简单的视频播放
- 等等（其他功能重复的有点多，将来有机会再开发）

## 截图
![image](./screenshot/首页.png) ![image](./screenshot/index_2.png) ![image](./screenshot/index_3.png) 
![image](./screenshot/index_4.png)  
![image](./screenshot/index_play.png) ![image](./screenshot/index_list.png) 
![image](./screenshot/audio.png) 
![image](./screenshot/audio_not.png) ![image](./screenshot/comment.png) ![image](./screenshot/comment_floor.png) 
![image](./screenshot/download.png) 
![image](./screenshot/info_more.png) ![image](./screenshot/list.png) ![image](./screenshot/list_overlay.png) 
![image](./screenshot/rank.png) 
![image](./screenshot/search.png) ![image](./screenshot/search_advice.png) ![image](./screenshot/search_album.png) 
![image](./screenshot/search_list.png) 
![image](./screenshot/search_result.png) ![image](./screenshot/search_video.png) ![image](./screenshot/video.png) 
![image](./screenshot/singer_rank.png) 
![image](./screenshot/album.png) ![image](./screenshot/dj.png) 


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
