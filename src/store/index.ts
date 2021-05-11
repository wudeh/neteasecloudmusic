import { createStore } from 'vuex'

export default createStore({
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
      playList: [], // 播放列表
      playMode: '', // 播放模式
      timer: null // 定时器
    },
    showLoading: true
  },
  mutations: {
    // 设置加载中
    set_load(state, i) {
      state.showLoading = i;
    },
    // 设置歌曲信息
    setSongInfo(state, song) {
      state.song_info.id = song.id;
      state.song_info.name = song.name;
      state.song_info.author = song.author;
      state.song_info.img = song.img;
      state.song_info.url = song.url;
      localStorage.setItem("songId",state.song_info.id);
      localStorage.setItem("songName",state.song_info.name);
      localStorage.setItem("songAuthor",state.song_info.author);
      localStorage.setItem("songImg",state.song_info.img);
      // localStorage.setItem("songUrl",state.song_info.url);
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
    }
  },
  actions: {
    // 请求歌曲信息
    getSongInfo(ctx) {
      ctx.commit("setSongInfo");
    }
  },
  modules: {
  }
})
