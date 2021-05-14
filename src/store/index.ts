import { createStore } from 'vuex'
import { getLyric, getSongUrl, getComment} from "../api/song"
interface song {
  song_info: {
    id: string,
    name: string,
    author: string,
    img: string,
    url: string,
    isPlaying: boolean,
    lyric: any[],
    currentTime: number | string, // 当前播放时间
    progressTime: number, // 进度条拖动时间
    duration: number,
    buffered: number, // 缓冲时间
    commentcount: number, // 评论数量
    list: any[], // 播放列表
    listIndex: number,
    playMode: '', // 播放模式
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
      isPlaying: false,
      lyric: [],
      currentTime: localStorage.getItem("songPlayTime") || 0, // 当前播放时间
      progressTime: 0, // 进度条拖动时间
      duration: 0,
      buffered: 0, // 缓冲时间
      commentcount: 0, // 评论数量
      list:[], // 播放列表
      listIndex: 0,
      playMode: '', // 播放模式
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
    // 设置歌曲信息
    setSongInfo(state, song) {
      if(song.url) state.song_info.url = song.url;
      state.song_info.id = song.id;
      state.song_info.name = song.name;
      state.song_info.author = song.author;
      state.song_info.img = song.img;
      
      // state.song_info.url = song.url;
      localStorage.setItem("songId",state.song_info.id);
      localStorage.setItem("songName",state.song_info.name);
      localStorage.setItem("songAuthor",state.song_info.author);
      localStorage.setItem("songImg",state.song_info.img);
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
    // 播放歌曲列表
    add_songList(state, list) {
      state.song_info.list = list;
      state.song_info.listIndex = 0;
    },
    // 下一首播放
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
          item.progress = i.progress >= 100 ? `下载完成` : i.progress
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
    }
  },
  actions: {
    // 播放下一首
    async play_next(ctx, i) {
      console.log("正在检查是否播放下一首");
      ctx.commit(`set_song_time`,0)
      // 有传参数 i ，播放上一首
      if(i) {
        if(--ctx.state.song_info.listIndex < ctx.state.song_info.list.length -1) {
          ctx.state.song_info.listIndex = ctx.state.song_info.list.length -1;
        }
      }else {
        // 播放下一首
        if(++ctx.state.song_info.listIndex > ctx.state.song_info.list.length -1 ) {
          ctx.state.song_info.listIndex = 0;
        }
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
      ctx.state.song_pop_detail = Object.assign({}, item);
      ctx.state.song_pop_detail.author = item.ar.map((i:any) => i.name).join("/")
      ctx.state.song_pop_detail.img = item.al.picUrl
      ctx.state.showDetail = true;
      ctx.state.showPop = true;
      // 获取一下评论数量
      let info = await getComment(item.id,0,1,20,1);
      ctx.state.song_pop_detail.commentCount = info.data.totalCount
      // 获取URL，以供下载
      info = await getSongUrl(ctx.state.song_info.list[ctx.state.song_info.listIndex].id);
      ctx.state.song_pop_detail.url = info.data[0].url
      
      console.log(ctx.state.song_pop_detail);
      
    }
  },
  modules: {
  }
})
