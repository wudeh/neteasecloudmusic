import router from '@/router';
import { Toast } from 'vant';
import { createStore } from 'vuex'
import { getLyric, getSongUrl, getComment} from "../api/song"
interface song {
  song_info: {
    id: string,
    name: string,
    author: string,
    img: string,
    url: string,
    type: number | string,
    isPlaying: boolean,
    lyric: string,
    lyricAll: any[],
    currentTime: number | string, // 当前播放时间
    progressTime: number, // 进度条拖动时间
    duration: number,
    buffered: number, // 缓冲时间
    volume: number,
    commentcount: number, // 评论数量
    list: any[], // 播放列表
    listIndex: number,
    playMode: number, // 播放模式
    timer: null // 定时器
    },
    showLoading: boolean,
    showList: boolean,
    showPop: boolean,
    showFloor: boolean,
    showDetail: boolean,
    song_pop_detail: {
      id: number,
      name: string,
      author: string,
      img: string,
      url: string,
      al: string,
      commentCount: number
    },
    download_list: Array<{
      id: number,
      name: string,
      author: string,
      progress: number
    }>
  
}
export default createStore<song>({
  state: {
    song_info: {
      id: localStorage.getItem("songId") || '',
      name: localStorage.getItem("songName") || '',
      author: localStorage.getItem("songAuthor") || '',
      img: localStorage.getItem("songImg") || '',
      url: '',
      type: localStorage.getItem("songType") || `0`,
      isPlaying: false,
      lyric: ``, // 当前歌词
      lyricAll: [], // 全部歌词
      currentTime: localStorage.getItem("songPlayTime") || 0, // 当前播放时间
      progressTime: 0, // 进度条拖动时间
      duration: 0,
      buffered: 0, // 缓冲时间
      volume: 1,
      commentcount: 0, // 评论数量
      list:[], // 播放列表
      listIndex: 0,
      playMode: 1, // 播放模式：1 列表循环，2：随机播放，3：单曲循环
      timer: null // 定时器
    },
    showLoading: false,
    showList: false,
    showPop: false,
    showFloor: false,
    showDetail: false,
    // 歌曲弹出框详情
    song_pop_detail: {
      id: 0,
      name: '',
      author: '',
      img: '',
      url: '',
      al: '',
      commentCount: 0
    },
    download_list: []
  },
  mutations: {
    // 设置加载中
    set_load(state, i) {
      state.showLoading = i;
    },
    // 设置歌词
    set_all_lyric(state, i) {
      state.song_info.lyricAll = i;
    },
    // 设置当前歌词
    set_lyric(state, i) {
      state.song_info.lyric = i;
    },
    // 设置歌曲信息
    setSongInfo(state, song) {
      if(song.url) state.song_info.url = song.url;
      state.song_info.id = song.id;
      state.song_info.name = song.name;
      state.song_info.author = song.author;
      state.song_info.img = song.img;
      state.song_info.type = song.type;
      
      // state.song_info.url = song.url;
      localStorage.setItem("songId",state.song_info.id);
      localStorage.setItem("songName",state.song_info.name);
      localStorage.setItem("songAuthor",state.song_info.author);
      localStorage.setItem("songImg",state.song_info.img);
      localStorage.setItem("songType",JSON.stringify(state.song_info.type));
      state.song_info.list = state.song_info.list.concat(song);
      state.song_info.listIndex += 1;
    },
    // 控制播放暂停
    play(state,play) {
      state.song_info.isPlaying = play;
    },
    // 设置播放链接
    set_song_url(state,url) {
      state.song_info.url = url;
    },
    // 设置歌曲时长
    set_song_allTime(state, time) {
      state.song_info.duration = Math.floor(time);
      // localStorage.setItem("songDuration",`${Math.floor(time)}`)
    },
    // 设置歌曲现在播放时间
    set_song_time(state, time) {
      state.song_info.currentTime = time;
    },
    // 设置歌曲拖动进度条的时间
    set_progress_time(state, time) {
      state.song_info.progressTime = time;
    },
    // 设置歌曲缓冲时间
    set_song_buffered(state, time) {
      state.song_info.buffered = time;
    },
    // 设置歌曲声音大小
    set_volume(state, i) {
      state.song_info.volume = i;
    },
    // 播放歌曲列表
    add_songList(state, list) {
      state.song_info.list.splice(0);
      state.song_info.list = state.song_info.list.concat(list);
      state.song_info.listIndex = 0;
      state.song_info.name = state.song_info.list[state.song_info.listIndex].name;
      state.song_info.author = state.song_info.list[state.song_info.listIndex].author;
      state.song_info.img = state.song_info.list[state.song_info.listIndex].img;
      state.song_info.type = state.song_info.list[state.song_info.listIndex].type;
      state.song_info.id = state.song_info.list[state.song_info.listIndex].id;
    },
    // 添加到下一首播放
    add_song(state, song) {
      state.song_info.list.splice(state.song_info.listIndex, 0, song);
    },
    // 展示当前播放列表
    set_pop_list(state, i) {
      state.showList = i;
      if(i) state.showPop = true;
    },
    // 展示楼层评论区
    set_floor_comment(state, i) {
      state.showFloor = i;
      if(i) state.showPop = true;
    },
    // 下载
    download_progress(state, i) {
      let have = false
      state.download_list.forEach((item: any) => {
        if(item.id == i.id) {
          item.progress = i.progress
          have = true
          return
        }
      })
      if(!have) {
        state.download_list.push(i)
      }
    },
    // 浏览器后退关闭弹出框
    close(state) {
      if(state.showList) state.showList = false;
      state.showFloor = false;
      state.showPop = false;
      state.showDetail = false;
    },
    // 改变播放模式
    set_circulate(state) {
      state.song_info.playMode ++;
      state.song_info.playMode > 3 && (state.song_info.playMode = 1)
      state.song_info.playMode == 1 && Toast(`列表循环播放`)
      state.song_info.playMode == 2 && Toast(`随机播放`)
      state.song_info.playMode == 3 && Toast(`单曲循环`)
    },
    
  },
  actions: {
    // 播放下一首
    async play_next(ctx, i) {
      if(ctx.state.song_info.list.length == 1) {
        Toast("当前列表只有一首歌")
        return
      }
      ctx.state.song_info.list.forEach((item: any, index: number) => {
        if(item.id == ctx.state.song_info.id) {
          ctx.state.song_info.listIndex = index;          
        }
      });
      // console.log("正在检查是否播放下一首");
      ctx.state.song_info.isPlaying = false
      ctx.commit(`set_song_time`,0)
      // 如果是列表循环
      if(ctx.state.song_info.playMode == 1) {
        // 参数 i < 0，播放上一首
        if(i < 0) {
          if(--ctx.state.song_info.listIndex < 0) {
            ctx.state.song_info.listIndex = ctx.state.song_info.list.length -1;
          }
        }else if(i >=0 ) {
          // 播放指定歌曲
          ctx.state.song_info.listIndex = i;
        }else if(i) {
          ctx.state.song_info.list.forEach((item: any, index: number) => {
            if(item.id == i) {
              ctx.state.song_info.listIndex = index;          
            }
          });
        }else {
          // 播放下一首
          // console.log(`正在播放下一首`);
          
          if(++ctx.state.song_info.listIndex > ctx.state.song_info.list.length -1 ) {
            ctx.state.song_info.listIndex = 0;
          }
        }
      }
      // console.log(`要播放的歌曲索引为${ctx.state.song_info.listIndex}`);
      

      // 如果是随机播放
      if(ctx.state.song_info.playMode == 2) {
        ctx.state.song_info.listIndex = Math.floor(Math.random() * ctx.state.song_info.list.length);
        // console.log(ctx.state.song_info.listIndex);
        
      }
      
      // 如果是单曲循环
      if(ctx.state.song_info.playMode == 3) {
        ctx.state.song_info.isPlaying = true;
        Toast(`当前播放模式为单曲循环，重新播放`)
        return;
      }
      
       // 请求URL
      //  const info = await getSongUrl(ctx.state.song_info.list[ctx.state.song_info.listIndex].id);
      //  ctx.commit("set_song_url",info.data[0].url);
      if(ctx.state.song_info.list[ctx.state.song_info.listIndex].url) {
        ctx.state.song_info.url = ctx.state.song_info.list[ctx.state.song_info.listIndex].url;
        ctx.state.song_info.id = ctx.state.song_info.list[ctx.state.song_info.listIndex].id;
        ctx.state.song_info.name = ctx.state.song_info.list[ctx.state.song_info.listIndex].name;
        ctx.state.song_info.author = ctx.state.song_info.list[ctx.state.song_info.listIndex].author;
        ctx.state.song_info.img = ctx.state.song_info.list[ctx.state.song_info.listIndex].img;
      }else {
        // console.log(`要播放的歌曲名为${ctx.state.song_info.list[ctx.state.song_info.listIndex].name}`);
        
        const info = await getSongUrl(ctx.state.song_info.list[ctx.state.song_info.listIndex].id);
        ctx.state.song_info.url = info.data[0].url
        ctx.state.song_info.list[ctx.state.song_info.listIndex].url = info.data[0].url
        ctx.state.song_info.id = ctx.state.song_info.list[ctx.state.song_info.listIndex].id;
        ctx.state.song_info.name = ctx.state.song_info.list[ctx.state.song_info.listIndex].name;
        ctx.state.song_info.author = ctx.state.song_info.list[ctx.state.song_info.listIndex].author;
        ctx.state.song_info.img = ctx.state.song_info.list[ctx.state.song_info.listIndex].img;
      }
    },
    // 通过 id 播放指定歌曲
    async play_by_id(ctx, id) {
      ctx.state.song_info.list.forEach((item: any, index: number) => {
        if(item.id == id) {
          ctx.state.song_info.listIndex = index;          
        }
      });

      if(ctx.state.song_info.list[ctx.state.song_info.listIndex].url) {
        ctx.state.song_info.url = ctx.state.song_info.list[ctx.state.song_info.listIndex].url;
        ctx.state.song_info.id = ctx.state.song_info.list[ctx.state.song_info.listIndex].id;
        ctx.state.song_info.name = ctx.state.song_info.list[ctx.state.song_info.listIndex].name;
        ctx.state.song_info.author = ctx.state.song_info.list[ctx.state.song_info.listIndex].author;
        ctx.state.song_info.img = ctx.state.song_info.list[ctx.state.song_info.listIndex].img;
      }else {
        // console.log(`要播放的歌曲名为${ctx.state.song_info.list[ctx.state.song_info.listIndex].name}`);
        
        const info = await getSongUrl(ctx.state.song_info.list[ctx.state.song_info.listIndex].id);
        ctx.state.song_info.url = info.data[0].url
        ctx.state.song_info.list[ctx.state.song_info.listIndex].url = info.data[0].url
        ctx.state.song_info.id = ctx.state.song_info.list[ctx.state.song_info.listIndex].id;
        ctx.state.song_info.name = ctx.state.song_info.list[ctx.state.song_info.listIndex].name;
        ctx.state.song_info.author = ctx.state.song_info.list[ctx.state.song_info.listIndex].author;
        ctx.state.song_info.img = ctx.state.song_info.list[ctx.state.song_info.listIndex].img;
      }
    },
    // 设置歌曲弹出框详情
    async set_pop_detail(ctx, item) {
      ctx.state.showDetail = true;
      ctx.state.showPop = true;

      if(ctx.state.song_pop_detail.id != item.id) {
        ctx.state.song_pop_detail = Object.assign({}, item);
        ctx.state.song_pop_detail.author = item.ar.map((i:any) => i.name).join("/")
        ctx.state.song_pop_detail.img = item.al.picUrl
      
        // 获取一下评论数量
        let info = await getComment(item.id,0,1,20,3);
        ctx.state.song_pop_detail.commentCount = info.data.totalCount
        // 获取URL，以供下载
        info = await getSongUrl(item.id);
        Toast(`已获取到下载链接，可以下载了`)
        ctx.state.song_pop_detail.url = info.data[0].url
      }
    },
    // 删除一首列表歌曲
    async delete(ctx, id) {
      let i = 0;
      ctx.state.song_info.list.forEach((item: any, index: number) => {
        if(item.id == id) {
          // console.log(`要删除的歌曲名为$${item.name}`);
          
          i = index;
          // console.log(i);
          
        }
      });
      // 当前列表只有一首歌，删除全部
      if(ctx.state.song_info.list.length == 1) {
        ctx.state.song_info.list.splice(0)
        ctx.state.song_info.listIndex = 0;
        ctx.state.song_info.isPlaying = false;
        // ctx.state.song_info.url = '' 不删除 URL，造成所有歌曲被删除的假象就行
        ctx.state.song_info.name = ''
        ctx.state.song_info.author = ''
        ctx.state.song_info.type = 0
        ctx.state.song_info.id = ''
        ctx.state.song_info.img = ''
        localStorage.removeItem("songId");
        localStorage.removeItem("songName");
        localStorage.removeItem("songAuthor");
        localStorage.removeItem("songImg");
        localStorage.removeItem("songType");
        ctx.commit(`close`)
        if(router.currentRoute.value.name == 'song') router.go(-1)
        
      }else {
        // 如果删除的是当前播放的歌曲，先播放下一首歌
        if(id == ctx.state.song_info.id) {
          // console.log(`删除当前播放歌曲`);
          i++
          if(i > ctx.state.song_info.list.length - 1 ) i = 0;
          const info = await getSongUrl(ctx.state.song_info.list[i].id);
          ctx.state.song_info.url = info.data[0].url
          ctx.state.song_info.list[i].url = info.data[0].url
          ctx.state.song_info.id = ctx.state.song_info.list[i].id;
          ctx.state.song_info.name = ctx.state.song_info.list[i].name;
          ctx.state.song_info.author = ctx.state.song_info.list[i].author;
          ctx.state.song_info.img = ctx.state.song_info.list[i].img;
        }
        ctx.state.song_info.list.forEach((item: any, index: number) => {
          if(item.id == id) {
            i = index;
          }
        });
        ctx.state.song_info.list.splice(i, 1)
        ctx.state.song_info.list.forEach((item: any, index: number) => {
          if(item.id == ctx.state.song_info.id) {
            ctx.state.song_info.listIndex = index;
          }
        });
      }
    },
    // 删除全部列表歌曲
    delete_all(ctx) {
      ctx.state.song_info.list.splice(0)
      ctx.state.song_info.listIndex = 0;
      ctx.state.song_info.isPlaying = false;
      // ctx.state.song_info.url = '' 不删除 URL，造成所有歌曲被删除的假象就行
      ctx.state.song_info.name = ''
      ctx.state.song_info.author = ''
      ctx.state.song_info.type = 0
      ctx.state.song_info.id = ''
      ctx.state.song_info.img = ''
      localStorage.removeItem("songId");
      localStorage.removeItem("songName");
      localStorage.removeItem("songAuthor");
      localStorage.removeItem("songImg");
      localStorage.removeItem("songType");
      ctx.commit(`close`)
      if(router.currentRoute.value.name == 'song') router.go(-1)
    }
  },
  modules: {
  }
})
