import router from "../router";
import { Toast } from "vant";
// import { createStore } from "vuex";
import { defineStore } from 'pinia'
import { getLyric, getSongUrl, getComment } from "../api/song";
interface song {
  song_info: {
    id: string;
    name: string;
    author: string;
    img: string;
    url: string;
    type: number;
    al: string,
    isPlaying: boolean;
    lyric: string;
    lyricAll: any[];
    currentTime: number; // 当前播放时间
    progressTime: number; // 进度条拖动时间
    duration: number;
    buffered: number; // 缓冲时间
    volume: number;
    commentcount: number; // 评论数量
    list: any[]; // 播放列表
    listIndex: number;
    playMode: number; // 播放模式
    timer: null; // 定时器
  };
  showLoading: boolean;
  showList: boolean;
  showPop: boolean;
  showFloor: boolean;
  showDetail: boolean;
  song_pop_detail: {
    id: number;
    name: string;
    author: string;
    img: string;
    url: string;
    al: string;
    commentCount: number;
    type: number
  };
  download_list: Array<{
    id: number;
    name: string;
    author: string;
    progress: number;
  }>;
}

export default defineStore({
  id: 'song',
  state: (): song => {
    return { 
      song_info: {
      id: localStorage.getItem("songId") || '',
      name: localStorage.getItem("songName") || '',
      author: localStorage.getItem("songAuthor") || '',
      img: localStorage.getItem("songImg") || '',
      url: '',
      type: 0,
      al: localStorage.getItem("songAl") || '', // 专辑
      isPlaying: false,
      lyric: ``, // 当前歌词
      lyricAll: [], // 全部歌词
      currentTime: 0, // 当前播放时间
      progressTime: 0, // 进度条拖动时间
      duration: 0,
      buffered: 0, // 缓冲时间
      volume: 1,
      commentcount: 0, // 评论数量
      list: [], // 播放列表
      listIndex: 0,
      playMode: 1, // 播放模式：1 列表循环，2：随机播放，3：单曲循环
      timer: null, // 定时器
    },
    showLoading: false,
    showList: false,
    showPop: false,
    showFloor: false,
    showDetail: false,
    // 歌曲弹出框详情
    song_pop_detail: {
      id: 0,
      name: "",
      author: "",
      img: "",
      url: "",
      al: "",
      commentCount: 0,
      type: 0
    },
    download_list: [], }
  },
  actions: {
    // 设置加载中
    set_load(i: boolean) {
      this.showLoading = i;
    },
    // 设置歌词
    set_all_lyric(i: any[]) {
      this.song_info.lyricAll = i;
    },
    // 设置当前歌词
    set_lyric(i: string) {
      this.song_info.lyric = i;
    },
    // 设置歌曲信息
    setSongInfo(song: any) {
      if (song.url) this.song_info.url = song.url;
      this.song_info.id = song.id;
      this.song_info.name = song.name;
      this.song_info.author = song.author;
      this.song_info.img = song.img;
      this.song_info.type = song.type;
      this.song_info.al = song.al;

      // this.song_info.url = song.url;
      localStorage.setItem("songId", this.song_info.id);
      localStorage.setItem("songName", this.song_info.name);
      localStorage.setItem("songAuthor", this.song_info.author);
      localStorage.setItem("songImg", this.song_info.img);
      localStorage.setItem("songType", JSON.stringify(this.song_info.type));
      this.song_info.list = this.song_info.list.concat(song);
      this.song_info.listIndex += 1;
    },
    // 控制播放暂停
    play(play: boolean) {
      this.song_info.isPlaying = play;
    },
    // 设置播放链接
    set_song_url(url: string) {
      this.song_info.url = url;
    },
    // 设置歌曲时长
    set_song_allTime(time: number) {
      this.song_info.duration = Math.floor(time);
      // localStorage.setItem("songDuration",`${Math.floor(time)}`)
    },
    // 设置歌曲现在播放时间
    set_song_time(time: any) {
      this.song_info.currentTime = time;
    },
    // 设置歌曲拖动进度条的时间
    set_progress_time(time: any) {
      this.song_info.progressTime = time;
    },
    // 设置歌曲缓冲时间
    set_song_buffered(time: number) {
      this.song_info.buffered = time;
    },
    // 设置歌曲声音大小
    set_volume(i: number) {
      this.song_info.volume = i;
    },
    // 播放歌曲列表
    add_songList(list: any) {
      this.song_info.list.splice(0);
      this.song_info.list = this.song_info.list.concat(list);
      this.song_info.listIndex = 0;
      this.song_info.name = this.song_info.list[this.song_info.listIndex].name;
      this.song_info.author = this.song_info.list[this.song_info.listIndex].author;
      this.song_info.img = this.song_info.list[this.song_info.listIndex].img;
      this.song_info.type = this.song_info.list[this.song_info.listIndex].type;
      this.song_info.id = this.song_info.list[this.song_info.listIndex].id;
    },
    // 添加到下一首播放
    add_song(song: any) {
      // console.log(song);
      // console.log(this.song_info.list);
      let isInList: boolean = false;
      this.song_info.list.forEach((item) => {
        console.log(item.id);

        if (item.id == song.id) {
          Toast(`已在播放列表`);
          isInList = true;
        }
      });
      if (isInList) return;
      this.song_info.list.splice(this.song_info.listIndex + 1, 0, song);
      Toast(`已添加到播放列表`);
      // 添加完列表只有一首就要直接播放了
      if (this.song_info.list.length === 1) {
        this.song_info.listIndex = 0;
        this.song_info.id = this.song_info.list[this.song_info.listIndex].id;
        this.song_info.name = this.song_info.list[this.song_info.listIndex].name;
        this.song_info.author = this.song_info.list[this.song_info.listIndex].author;
        this.song_info.img = this.song_info.list[this.song_info.listIndex].img;
      }
    },
    // 第一次进来如果本地有上一次播放的信息就加入 list 列表
    add_local_info(info: any) {
      this.song_info.list.push(info);
      this.song_info.listIndex = 0;
      this.song_info.id = info.id;
      this.song_info.name = info.name;
      this.song_info.author = info.author;
      this.song_info.img = info.img;
      this.song_info.type = info.type;
    },
    // 展示当前播放列表
    set_pop_list(i: any) {
      this.showList = i;
      if (i) this.showPop = true;
    },
    // 展示楼层评论区
    set_floor_comment(i: any) {
      this.showFloor = i;
      if (i) this.showPop = true;
    },
    // 下载
    download_progress(i: any) {
      let have = false;
      this.download_list.forEach((item: any) => {
        if (item.id == i.id) {
          item.progress = i.progress;
          have = true;
          return;
        }
      });
      if (!have) {
        this.download_list.push(i);
      }
    },
    // 浏览器后退关闭弹出框
    close() {
      if (this.showList) this.showList = false;
      this.showFloor = false;
      this.showPop = false;
      this.showDetail = false;
    },
    // 改变播放模式
    set_circulate() {
      this.song_info.playMode++;
      this.song_info.playMode > 3 && (this.song_info.playMode = 1);
      this.song_info.playMode == 1 && Toast(`列表循环播放`);
      this.song_info.playMode == 2 && Toast(`随机播放`);
      this.song_info.playMode == 3 && Toast(`单曲循环`);
    },
    // 播放下一首
    async play_next(i: any) {
      if (this.song_info.list.length == 1) {
        Toast("当前列表只有一首歌");
        return;
      }
      this.song_info.list.forEach((item: any, index: number) => {
        if (item.id == this.song_info.id) {
          this.song_info.listIndex = index;
        }
      });
      // console.log("正在检查是否播放下一首");
      this.song_info.isPlaying = false;
      this.set_song_time(0);
      // 如果是列表循环
      if (this.song_info.playMode == 1) {
        // 参数 i < 0，播放上一首
        if (i < 0) {
          if (this.song_info.listIndex < 0) {
            this.song_info.listIndex = this.song_info.list.length - 1;
          }
        } else if (i >= 0) {
          // 播放指定歌曲
          this.song_info.listIndex = i;
        } else if (i) {
          this.song_info.list.forEach((item: any, index: number) => {
            if (item.id == i) {
              this.song_info.listIndex = index;
            }
          });
        } else {
          // 播放下一首
          // console.log(`正在播放下一首`);

          if (this.song_info.listIndex > this.song_info.list.length - 1) {
            this.song_info.listIndex = 0;
          }
        }
      }
      // console.log(`要播放的歌曲索引为${this.song_info.listIndex}`);

      // 如果是随机播放
      if (this.song_info.playMode == 2) {
        this.song_info.listIndex = Math.floor(Math.random() * this.song_info.list.length);
        // console.log(this.song_info.listIndex);
      }

      // 如果是单曲循环
      if (this.song_info.playMode == 3) {
        this.song_info.isPlaying = true;
        Toast(`当前播放模式为单曲循环，重新播放`);
        return;
      }

      // 请求URL
      //  const info = await getSongUrl(this.song_info.list[this.song_info.listIndex].id);
      //  commit("set_song_url",info.data[0].url);
      if (this.song_info.list[this.song_info.listIndex].url) {
        this.song_info.url = this.song_info.list[this.song_info.listIndex].url;
        this.song_info.id = this.song_info.list[this.song_info.listIndex].id;
        this.song_info.name = this.song_info.list[this.song_info.listIndex].name;
        this.song_info.author = this.song_info.list[this.song_info.listIndex].author;
        this.song_info.img = this.song_info.list[this.song_info.listIndex].img;
      } else {
        // console.log(`要播放的歌曲名为${this.song_info.list[this.song_info.listIndex].name}`);

        const info = await getSongUrl(this.song_info.list[this.song_info.listIndex].id);
        this.song_info.url = info.data[0].url;
        this.song_info.list[this.song_info.listIndex].url = info.data[0].url;
        this.song_info.id = this.song_info.list[this.song_info.listIndex].id;
        this.song_info.name = this.song_info.list[this.song_info.listIndex].name;
        this.song_info.author = this.song_info.list[this.song_info.listIndex].author;
        this.song_info.img = this.song_info.list[this.song_info.listIndex].img;
      }
    },
    // 通过 id 播放指定歌曲
    async play_by_id(id: string) {
      this.song_info.list.forEach((item: any, index: number) => {
        if (item.id == id) {
          this.song_info.listIndex = index;
        }
      });

      if (this.song_info.list[this.song_info.listIndex].url) {
        this.song_info.url = this.song_info.list[this.song_info.listIndex].url;
        this.song_info.id = this.song_info.list[this.song_info.listIndex].id;
        this.song_info.name = this.song_info.list[this.song_info.listIndex].name;
        this.song_info.author = this.song_info.list[this.song_info.listIndex].author;
        this.song_info.img = this.song_info.list[this.song_info.listIndex].img;
        this.song_info.type = this.song_info.list[this.song_info.listIndex].type;
      } else {
        // console.log(`要播放的歌曲名为${this.song_info.list[this.song_info.listIndex].name}`);

        const info = await getSongUrl(this.song_info.list[this.song_info.listIndex].id);
        this.song_info.url = info.data[0].url;
        this.song_info.list[this.song_info.listIndex].url = info.data[0].url;
        this.song_info.id = this.song_info.list[this.song_info.listIndex].id;
        this.song_info.name = this.song_info.list[this.song_info.listIndex].name;
        this.song_info.author = this.song_info.list[this.song_info.listIndex].author;
        this.song_info.img = this.song_info.list[this.song_info.listIndex].img;
        this.song_info.type = this.song_info.list[this.song_info.listIndex].type;
      }
    },
    // 设置歌曲弹出框详情
    async set_pop_detail(item: any) {
      this.showDetail = true;
      // this.showPop = true;

      if (this.song_pop_detail.id != item.id) {
        // 如果是电台
        if (item.type === 4) {
          // this.song_pop_detail = Object.assign({}, item);
          this.song_pop_detail.author = item.author;
          this.song_pop_detail.img = item.img;
          this.song_pop_detail.id = item.id;
          this.song_pop_detail.name = item.name;
          this.song_pop_detail.al = "无";
        } else {
          // 要么是歌曲，type === 0
          this.song_pop_detail = Object.assign({}, item);
          
          // 如果是歌词页面点击的话，直接拿当前播放的信息
          if(item.isSongClik){
            this.song_pop_detail.author = item.author;
            this.song_pop_detail.img = item.img;
          }else {
            this.song_pop_detail.author = item.ar.map((i: any) => i.name).join("/");
            this.song_pop_detail.img = item.al.picUrl;
            this.song_pop_detail.al = item.al.name;
          }
        }

        this.song_pop_detail.type = item.type;

        try {
          // 获取一下评论数量
          let info = await getComment(item.id, item.type, 1, 20, 3);
          this.song_pop_detail.commentCount = info.data.totalCount;
        } catch (error) {
          Toast(`评论获取失败`)
        }
        
        try {
          // 获取URL，以供下载
          let info = await getSongUrl(item.id);
          Toast(`已获取到下载链接，可以下载了`);
          this.song_pop_detail.url = info.data[0].url;
        } catch (error) {
          Toast(`下载链接获取失败`)
        }
      }
    },
    // 删除一首列表歌曲
    async delete(id: string) {
      let i = 0;
      this.song_info.list.forEach((item: any, index: number) => {
        if (item.id == id) {
          // console.log(`要删除的歌曲名为$${item.name}`);

          i = index;
          // console.log(i);
        }
      });
      // 当前列表只有一首歌，删除全部
      if (this.song_info.list.length == 1) {
        this.song_info.list.splice(0);
        this.song_info.listIndex = 0;
        this.song_info.isPlaying = false;
        // this.song_info.url = '' 不删除 URL，造成所有歌曲被删除的假象就行
        this.song_info.name = "";
        this.song_info.author = "";
        this.song_info.type = 0;
        this.song_info.id = "";
        this.song_info.img = "";
        localStorage.removeItem("songId");
        localStorage.removeItem("songName");
        localStorage.removeItem("songAuthor");
        localStorage.removeItem("songImg");
        localStorage.removeItem("songType");
        this.close();
        if (router.currentRoute.value.name == "song") router.go(-1);
      } else {
        // 如果删除的是当前播放的歌曲，先播放下一首歌
        if (id == this.song_info.id) {
          // console.log(`删除当前播放歌曲`);
          i++;
          if (i > this.song_info.list.length - 1) i = 0;
          const info = await getSongUrl(this.song_info.list[i].id);
          this.song_info.url = info.data[0].url;
          this.song_info.list[i].url = info.data[0].url;
          this.song_info.id = this.song_info.list[i].id;
          this.song_info.name = this.song_info.list[i].name;
          this.song_info.author = this.song_info.list[i].author;
          this.song_info.img = this.song_info.list[i].img;
        }
        this.song_info.list.forEach((item: any, index: number) => {
          if (item.id == id) {
            i = index;
          }
        });
        this.song_info.list.splice(i, 1);
        this.song_info.list.forEach((item: any, index: number) => {
          if (item.id == this.song_info.id) {
            this.song_info.listIndex = index;
          }
        });
      }
    },
    // 删除全部列表歌曲
    delete_all() {
      this.song_info.list.splice(0);
      this.song_info.listIndex = 0;
      this.song_info.isPlaying = false;
      // this.song_info.url = '' 不删除 URL，造成所有歌曲被删除的假象就行
      this.song_info.name = "";
      this.song_info.author = "";
      this.song_info.type = 0;
      this.song_info.id = "";
      this.song_info.img = "";
      localStorage.removeItem("songId");
      localStorage.removeItem("songName");
      localStorage.removeItem("songAuthor");
      localStorage.removeItem("songImg");
      localStorage.removeItem("songType");
      this.close();
      // 如果在歌词滚动页面删除全部列表歌曲需要后退
      if (router.currentRoute.value.name == "song") router.go(-1);
    },
  },
})

// export default defineStore('song', {
//   state: () => {
//     song_info: {
//       id: localStorage.getItem("songId") || '',
//       name: localStorage.getItem("songName") || '',
//       author: localStorage.getItem("songAuthor") || '',
//       img: localStorage.getItem("songImg") || '',
//       url: '',
//       type: localStorage.getItem("songType") || `0`,
//       al: localStorage.getItem("songAl") || '', // 专辑
//       isPlaying: false,
//       lyric: ``, // 当前歌词
//       lyricAll: [], // 全部歌词
//       currentTime: localStorage.getItem("songPlayTime") || 0, // 当前播放时间
//       progressTime: 0, // 进度条拖动时间
//       duration: 0,
//       buffered: 0, // 缓冲时间
//       volume: 1,
//       commentcount: 0, // 评论数量
//       list: [], // 播放列表
//       listIndex: 0,
//       playMode: 1, // 播放模式：1 列表循环，2：随机播放，3：单曲循环
//       timer: null, // 定时器
//     },
//     showLoading: false,
//     showList: false,
//     showPop: false,
//     showFloor: false,
//     showDetail: false,
//     // 歌曲弹出框详情
//     song_pop_detail: {
//       id: 0,
//       name: "",
//       author: "",
//       img: "",
//       url: "",
//       al: "",
//       commentCount: 0,
//       type: 0
//     },
//     download_list: [],
//   },
//   // mutations: {
//   //   ,
//   // },
//   actions: {
//     // 设置加载中
//     set_load(i) {
//       this.showLoading = i;
//     },
//     // 设置歌词
//     set_all_lyric(i) {
//       this.song_info.lyricAll = i;
//     },
//     // 设置当前歌词
//     set_lyric(i) {
//       this.song_info.lyric = i;
//     },
//     // 设置歌曲信息
//     setSongInfo(song) {
//       if (song.url) this.song_info.url = song.url;
//       this.song_info.id = song.id;
//       this.song_info.name = song.name;
//       this.song_info.author = song.author;
//       this.song_info.img = song.img;
//       this.song_info.type = song.type;
//       this.song_info.al = song.al;

//       // this.song_info.url = song.url;
//       localStorage.setItem("songId", this.song_info.id);
//       localStorage.setItem("songName", this.song_info.name);
//       localStorage.setItem("songAuthor", this.song_info.author);
//       localStorage.setItem("songImg", this.song_info.img);
//       localStorage.setItem("songType", JSON.stringify(this.song_info.type));
//       this.song_info.list = this.song_info.list.concat(song);
//       this.song_info.listIndex += 1;
//     },
//     // 控制播放暂停
//     play(play) {
//       this.song_info.isPlaying = play;
//     },
//     // 设置播放链接
//     set_song_url(url) {
//       this.song_info.url = url;
//     },
//     // 设置歌曲时长
//     set_song_allTime(time) {
//       this.song_info.duration = Math.floor(time);
//       // localStorage.setItem("songDuration",`${Math.floor(time)}`)
//     },
//     // 设置歌曲现在播放时间
//     set_song_time(time) {
//       this.song_info.currentTime = time;
//     },
//     // 设置歌曲拖动进度条的时间
//     set_progress_time(time) {
//       this.song_info.progressTime = time;
//     },
//     // 设置歌曲缓冲时间
//     set_song_buffered(time) {
//       this.song_info.buffered = time;
//     },
//     // 设置歌曲声音大小
//     set_volume(i) {
//       this.song_info.volume = i;
//     },
//     // 播放歌曲列表
//     add_songList(list) {
//       this.song_info.list.splice(0);
//       this.song_info.list = this.song_info.list.concat(list);
//       this.song_info.listIndex = 0;
//       this.song_info.name = this.song_info.list[this.song_info.listIndex].name;
//       this.song_info.author = this.song_info.list[this.song_info.listIndex].author;
//       this.song_info.img = this.song_info.list[this.song_info.listIndex].img;
//       this.song_info.type = this.song_info.list[this.song_info.listIndex].type;
//       this.song_info.id = this.song_info.list[this.song_info.listIndex].id;
//     },
//     // 添加到下一首播放
//     add_song(song) {
//       // console.log(song);
//       // console.log(this.song_info.list);
//       let isInList: boolean = false;
//       this.song_info.list.forEach((item) => {
//         console.log(item.id);

//         if (item.id == song.id) {
//           Toast(`已在播放列表`);
//           isInList = true;
//         }
//       });
//       if (isInList) return;
//       this.song_info.list.splice(this.song_info.listIndex + 1, 0, song);
//       Toast(`已添加到播放列表`);
//       // 添加完列表只有一首就要直接播放了
//       if (this.song_info.list.length === 1) {
//         this.song_info.listIndex = 0;
//         this.song_info.id = this.song_info.list[this.song_info.listIndex].id;
//         this.song_info.name = this.song_info.list[this.song_info.listIndex].name;
//         this.song_info.author = this.song_info.list[this.song_info.listIndex].author;
//         this.song_info.img = this.song_info.list[this.song_info.listIndex].img;
//       }
//     },
//     // 第一次进来如果本地有上一次播放的信息就加入 list 列表
//     add_local_info(info) {
//       this.song_info.list.push(info);
//       this.song_info.listIndex = 0;
//       this.song_info.id = info.id;
//       this.song_info.name = info.name;
//       this.song_info.author = info.author;
//       this.song_info.img = info.img;
//       this.song_info.type = info.type;
//     },
//     // 展示当前播放列表
//     set_pop_list(i) {
//       this.showList = i;
//       if (i) this.showPop = true;
//     },
//     // 展示楼层评论区
//     set_floor_comment(i) {
//       this.showFloor = i;
//       if (i) this.showPop = true;
//     },
//     // 下载
//     download_progress(i) {
//       let have = false;
//       this.download_list.forEach((item: any) => {
//         if (item.id == i.id) {
//           item.progress = i.progress;
//           have = true;
//           return;
//         }
//       });
//       if (!have) {
//         this.download_list.push(i);
//       }
//     },
//     // 浏览器后退关闭弹出框
//     close(state) {
//       if (this.showList) this.showList = false;
//       this.showFloor = false;
//       this.showPop = false;
//       this.showDetail = false;
//     },
//     // 改变播放模式
//     set_circulate(state) {
//       this.song_info.playMode++;
//       this.song_info.playMode > 3 && (this.song_info.playMode = 1);
//       this.song_info.playMode == 1 && Toast(`列表循环播放`);
//       this.song_info.playMode == 2 && Toast(`随机播放`);
//       this.song_info.playMode == 3 && Toast(`单曲循环`);
//     },
//     // 播放下一首
//     async play_next(ctx, i) {
//       if (this.song_info.list.length == 1) {
//         Toast("当前列表只有一首歌");
//         return;
//       }
//       this.song_info.list.forEach((item: any, index: number) => {
//         if (item.id == this.song_info.id) {
//           this.song_info.listIndex = index;
//         }
//       });
//       // console.log("正在检查是否播放下一首");
//       this.song_info.isPlaying = false;
//       commit(`set_song_time`, 0);
//       // 如果是列表循环
//       if (this.song_info.playMode == 1) {
//         // 参数 i < 0，播放上一首
//         if (i < 0) {
//           if (--this.song_info.listIndex < 0) {
//             this.song_info.listIndex = this.song_info.list.length - 1;
//           }
//         } else if (i >= 0) {
//           // 播放指定歌曲
//           this.song_info.listIndex = i;
//         } else if (i) {
//           this.song_info.list.forEach((item: any, index: number) => {
//             if (item.id == i) {
//               this.song_info.listIndex = index;
//             }
//           });
//         } else {
//           // 播放下一首
//           // console.log(`正在播放下一首`);

//           if (++this.song_info.listIndex > this.song_info.list.length - 1) {
//             this.song_info.listIndex = 0;
//           }
//         }
//       }
//       // console.log(`要播放的歌曲索引为${this.song_info.listIndex}`);

//       // 如果是随机播放
//       if (this.song_info.playMode == 2) {
//         this.song_info.listIndex = Math.floor(Math.random() * this.song_info.list.length);
//         // console.log(this.song_info.listIndex);
//       }

//       // 如果是单曲循环
//       if (this.song_info.playMode == 3) {
//         this.song_info.isPlaying = true;
//         Toast(`当前播放模式为单曲循环，重新播放`);
//         return;
//       }

//       // 请求URL
//       //  const info = await getSongUrl(this.song_info.list[this.song_info.listIndex].id);
//       //  commit("set_song_url",info.data[0].url);
//       if (this.song_info.list[this.song_info.listIndex].url) {
//         this.song_info.url = this.song_info.list[this.song_info.listIndex].url;
//         this.song_info.id = this.song_info.list[this.song_info.listIndex].id;
//         this.song_info.name = this.song_info.list[this.song_info.listIndex].name;
//         this.song_info.author = this.song_info.list[this.song_info.listIndex].author;
//         this.song_info.img = this.song_info.list[this.song_info.listIndex].img;
//       } else {
//         // console.log(`要播放的歌曲名为${this.song_info.list[this.song_info.listIndex].name}`);

//         const info = await getSongUrl(this.song_info.list[this.song_info.listIndex].id);
//         this.song_info.url = info.data[0].url;
//         this.song_info.list[this.song_info.listIndex].url = info.data[0].url;
//         this.song_info.id = this.song_info.list[this.song_info.listIndex].id;
//         this.song_info.name = this.song_info.list[this.song_info.listIndex].name;
//         this.song_info.author = this.song_info.list[this.song_info.listIndex].author;
//         this.song_info.img = this.song_info.list[this.song_info.listIndex].img;
//       }
//     },
//     // 通过 id 播放指定歌曲
//     async play_by_id(ctx, id) {
//       this.song_info.list.forEach((item: any, index: number) => {
//         if (item.id == id) {
//           this.song_info.listIndex = index;
//         }
//       });

//       if (this.song_info.list[this.song_info.listIndex].url) {
//         this.song_info.url = this.song_info.list[this.song_info.listIndex].url;
//         this.song_info.id = this.song_info.list[this.song_info.listIndex].id;
//         this.song_info.name = this.song_info.list[this.song_info.listIndex].name;
//         this.song_info.author = this.song_info.list[this.song_info.listIndex].author;
//         this.song_info.img = this.song_info.list[this.song_info.listIndex].img;
//         this.song_info.type = this.song_info.list[this.song_info.listIndex].type;
//       } else {
//         // console.log(`要播放的歌曲名为${this.song_info.list[this.song_info.listIndex].name}`);

//         const info = await getSongUrl(this.song_info.list[this.song_info.listIndex].id);
//         this.song_info.url = info.data[0].url;
//         this.song_info.list[this.song_info.listIndex].url = info.data[0].url;
//         this.song_info.id = this.song_info.list[this.song_info.listIndex].id;
//         this.song_info.name = this.song_info.list[this.song_info.listIndex].name;
//         this.song_info.author = this.song_info.list[this.song_info.listIndex].author;
//         this.song_info.img = this.song_info.list[this.song_info.listIndex].img;
//         this.song_info.type = this.song_info.list[this.song_info.listIndex].type;
//       }
//     },
//     // 设置歌曲弹出框详情
//     async set_pop_detail(ctx: any, item: any) {
//       this.showDetail = true;
//       // this.showPop = true;

//       if (this.song_pop_detail.id != item.id) {
//         // 如果是电台
//         if (item.type === 4) {
//           // this.song_pop_detail = Object.assign({}, item);
//           this.song_pop_detail.author = item.author;
//           this.song_pop_detail.img = item.img;
//           this.song_pop_detail.id = item.id;
//           this.song_pop_detail.name = item.name;
//           this.song_pop_detail.al = "无";
//         } else {
//           // 要么是歌曲，type === 0
//           this.song_pop_detail = Object.assign({}, item);
          
//           // 如果是歌词页面点击的话，直接拿当前播放的信息
//           if(item.isSongClik){
//             this.song_pop_detail.author = item.author;
//             this.song_pop_detail.img = item.img;
//           }else {
//             this.song_pop_detail.author = item.ar.map((i: any) => i.name).join("/");
//             this.song_pop_detail.img = item.al.picUrl;
//             this.song_pop_detail.al = item.al.name;
//           }
//         }

//         this.song_pop_detail.type = item.type;

//         try {
//           // 获取一下评论数量
//           let info = await getComment(item.id, item.type, 1, 20, 3);
//           this.song_pop_detail.commentCount = info.data.totalCount;
//         } catch (error) {
//           Toast(`评论获取失败`)
//         }
        
//         try {
//           // 获取URL，以供下载
//           let info = await getSongUrl(item.id);
//           Toast(`已获取到下载链接，可以下载了`);
//           this.song_pop_detail.url = info.data[0].url;
//         } catch (error) {
//           Toast(`下载链接获取失败`)
//         }
//       }
//     },
//     // 删除一首列表歌曲
//     async delete(ctx, id) {
//       let i = 0;
//       this.song_info.list.forEach((item: any, index: number) => {
//         if (item.id == id) {
//           // console.log(`要删除的歌曲名为$${item.name}`);

//           i = index;
//           // console.log(i);
//         }
//       });
//       // 当前列表只有一首歌，删除全部
//       if (this.song_info.list.length == 1) {
//         this.song_info.list.splice(0);
//         this.song_info.listIndex = 0;
//         this.song_info.isPlaying = false;
//         // this.song_info.url = '' 不删除 URL，造成所有歌曲被删除的假象就行
//         this.song_info.name = "";
//         this.song_info.author = "";
//         this.song_info.type = 0;
//         this.song_info.id = "";
//         this.song_info.img = "";
//         localStorage.removeItem("songId");
//         localStorage.removeItem("songName");
//         localStorage.removeItem("songAuthor");
//         localStorage.removeItem("songImg");
//         localStorage.removeItem("songType");
//         commit(`close`);
//         if (router.currentRoute.value.name == "song") router.go(-1);
//       } else {
//         // 如果删除的是当前播放的歌曲，先播放下一首歌
//         if (id == this.song_info.id) {
//           // console.log(`删除当前播放歌曲`);
//           i++;
//           if (i > this.song_info.list.length - 1) i = 0;
//           const info = await getSongUrl(this.song_info.list[i].id);
//           this.song_info.url = info.data[0].url;
//           this.song_info.list[i].url = info.data[0].url;
//           this.song_info.id = this.song_info.list[i].id;
//           this.song_info.name = this.song_info.list[i].name;
//           this.song_info.author = this.song_info.list[i].author;
//           this.song_info.img = this.song_info.list[i].img;
//         }
//         this.song_info.list.forEach((item: any, index: number) => {
//           if (item.id == id) {
//             i = index;
//           }
//         });
//         this.song_info.list.splice(i, 1);
//         this.song_info.list.forEach((item: any, index: number) => {
//           if (item.id == this.song_info.id) {
//             this.song_info.listIndex = index;
//           }
//         });
//       }
//     },
//     // 删除全部列表歌曲
//     delete_all(ctx) {
//       this.song_info.list.splice(0);
//       this.song_info.listIndex = 0;
//       this.song_info.isPlaying = false;
//       // this.song_info.url = '' 不删除 URL，造成所有歌曲被删除的假象就行
//       this.song_info.name = "";
//       this.song_info.author = "";
//       this.song_info.type = 0;
//       this.song_info.id = "";
//       this.song_info.img = "";
//       localStorage.removeItem("songId");
//       localStorage.removeItem("songName");
//       localStorage.removeItem("songAuthor");
//       localStorage.removeItem("songImg");
//       localStorage.removeItem("songType");
//       commit(`close`);
//       // 如果在歌词滚动页面删除全部列表歌曲需要后退
//       if (router.currentRoute.value.name == "song") router.go(-1);
//     },
//   },
//   modules: {},
// });


// export songStore;