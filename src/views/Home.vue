<template>
  <div class="home">
      <router-view v-slot="{ Component }">
        <keep-alive :include="include">
              <component :is="Component"/>
        </keep-alive>
      </router-view>
    <!-- 用来撑开底部的盒子 -->
    <div class="songDiv" v-if="store.state.song_info.id && router.currentRoute.value.name != 'song'"></div>
    <div class="song" :class="{fixed_out: !store.state.song_info.id}" @click="goSong()" v-if="router.currentRoute.value.name != 'song'">
      <div class="song_img rotate"  :style="{animationPlayState: store.state.song_info.isPlaying ? 'running' : 'paused'}">
        <img :src="store.state.song_info.img" alt="">
      </div>
      <div class="song_name">{{store.state.song_info.name}}</div>
      <div class="song_author">-{{store.state.song_info.author}}</div>
      <div class="icon" @click.stop="change_play()">
        <img :src="store.state.song_info.isPlaying ? stopIcon : playIcon" alt="">
      </div>
      <img @click.stop="showPopList" src="../../public/img/icons/list_icon.svg" alt="">
    </div>
    <van-popup
      v-model:show="store.state.showList"
      round
      @close="store.commit(`close`)"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <div class="pop_list">
        <div class="title">当前播放列表({{ store.state.song_info.list.length }})</div>
        <div class="option">
          <div class="circulate">列表循环</div>
          <div class="get">收藏全部</div>
          <div class="del_list"></div>
        </div>
        <div class="list">
          <div class="item" v-for="(it, i) in store.state.song_info.list" :key="i">
            <div :class="{info: true, red: i == store.state.song_info.listIndex}">
              <div class="icon">
                <img v-if="i == store.state.song_info.listIndex" src="../../public/img/icons/loading.svg" alt="">
              </div>
              <span :class="{name: true, red: i == store.state.song_info.listIndex}">{{it.name}}</span>
              <span>&nbsp;-&nbsp;</span>
              <span class="author">{{it.author}}</span>
            </div>
            <img class="delete" src="../../public/img/icons/delete.svg" alt="">
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 加载弹框 -->
    <teleport to='#app'>
      <div class="load" v-if="store.state.showLoading">
        <img src="../../public/img/icons/loading.svg" alt="">
        <span>加载中...</span>
      </div>
    </teleport>

    <!-- 歌曲右侧弹框 -->
    <van-popup
      v-model:show="store.state.showDetail"
      round
      @close="store.commit(`close`)"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <div class="song_detail">
        <div class="info">
          <div class="img">
            <img :src="store.state.song_pop_detail.img" alt="">
          </div>
          <div class="title">
            <span>歌曲：{{ store.state.song_pop_detail.name }}</span>
            <span class="author">{{ store.state.song_pop_detail.author }}</span>
          </div>
        </div>
        <div class="item" @click="store.commit(`add_song`, store)">
          <img src="../../public/img/player/cover-bg-in.png" alt="">
          <span>下一首播放</span>
        </div>
        <div class="item">
          <img src="../../public/img/icons/sub.svg" alt="">
          <span>收藏到歌单</span>
        </div>
        <div class="item">
          <img src="../../public/img/icons/download_gray.svg" alt="">
          <span>下载</span>
        </div>
        <div class="item">
          <img src="../../public/img/icons/comment.svg" alt="">
          <span>评论（{{ store.state.song_pop_detail.commentCount }}）</span>
        </div>
        <div class="item">
          <img src="../../public/img/icons/share.svg" alt="">
          <span>分享</span>
        </div>
        <div class="item">
          <img src="../../public/img/icons/singer.svg" alt="">
          <span>歌手：{{ store.state.song_pop_detail.author }}</span>
        </div>
        <div class="item">
          <img src="../../public/img/icons/album.svg" alt="">
          <span>专辑：{{ store.state.song_pop_detail.al.name }}</span>
        </div>
        <div class="item">
          <img src="../../public/img/icons/cloud.svg" alt="">
          <span>云贝推歌</span>
        </div>
        <div class="item">
          <img src="../../public/img/icons/lingsheng.svg" alt="">
          <span>设置铃声</span>
        </div>
        <div class="item">
          <img src="../../public/img/icons/buy.svg" alt="">
          <span>单曲购买</span>
        </div>
        <div class="item">
          <img src="../../public/img/icons/hide.svg" alt="">
          <span>屏蔽歌曲或者歌手</span>
        </div>
        
      </div>
    </van-popup>
    <!-- <audio id="audio" ref="audio" :src="store.state.song_info.url"></audio> -->
     
    <!-- </van-popup> -->
    <!-- <van-tabbar
      v-model="active"
      @change="onChange"
      active-color="#ee0a24"
      inactive-color="#000"
    >
      <van-tabbar-item icon="music-o">发现</van-tabbar-item>
      <van-tabbar-item icon="volume-o">播客</van-tabbar-item>
      <van-tabbar-item icon="manager-o">我的</van-tabbar-item>
      <van-tabbar-item icon="phone-o">K歌</van-tabbar-item>
      <van-tabbar-item icon="friends-o">云村</van-tabbar-item>
    </van-tabbar> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref,onMounted,watch, onBeforeUnmount,reactive,nextTick, onUpdated } from "vue";
import { useRouter,useRoute } from "vue-router";
import { useStore } from 'vuex'
import { getTime } from "../utils/num"
import { getLyric, getSongUrl } from "../api/song"
import BScroll from "@better-scroll/core";
import { Toast } from "vant";
interface info {
  bs: any;
}
export default defineComponent({
  name: "Home",
  setup() {
    const router = useRouter();
    const rout = useRoute();;
    const active = ref(0);
    const store = useStore();
    const audio = ref(new Audio());
    const linePast = ref();
    const point = ref();
    const line = ref();
    const img = ref();
    const img_pop = ref();
    const stopIcon = require('../../public/img/icons/stop_icon.svg')
    const playIcon = require('../../public/img/icons/play_icon.svg')
    const playWhite = require('../../public/img/icons/play_white.svg')
    const stopWhite = require('../../public/img/icons/stop_white.svg')
    let timerSong = ref(); // 定时计算当前播放时间
    let current_song_time = ref('00:00.00');
    let lyric: Array<{time:string,lyric:string}> = reactive([]);
    let lyricTime: Array<string> = reactive([]);
    let lyricRef = ref()

    const include = reactive(["song", "discover"])
  

    function change_play():void {
      store.commit("play",!store.state.song_info.isPlaying);
    }

    const goSong = () => {
      router.push({path: "/song"});
    }

    // 定时方法，用来设置歌词滚动和圆点移动
    function interval(): void {
          timerSong.value = setInterval(() => {
            console.log(audio.value.currentTime);
            store.commit("set_song_time",audio.value.currentTime);
            store.commit("set_song_allTime",audio.value.duration);               
          },1000)
    }

    // 在首页监听播放状态的变化
    watch(() => store.state.song_info.isPlaying,(value,pre) => {
      console.log("监听到播放变化");
      if(value) {
        if(!audio.value.src) {
          audio.value.src = store.state.song_info.url;
        }
        console.log(store.state.song_info.url);
          audio.value.autoplay = true;
          audio.value.play();
          console.log("总时长");
          console.log(audio.value.duration); // 这是总时长
          console.log(store.state.song_info.duration);
          interval();
      }else {        
        audio.value.pause();
        clearInterval(timerSong.value);
      }
    })

    // 监听到播放歌曲变更
    watch(() => store.state.song_info.id, async (value,pre) => {
      console.log("监听到播放歌曲变更");
      audio.value.pause();
      // 请求URL
      // const info = await getSongUrl(store.state.song_info.id);
      // store.commit("set_song_url",info.data[0].url);
      audio.value.src = store.state.song_info.url;
      audio.value.play();
      store.commit("play",true);
    })

    // 监听歌词页面拖动进度条的变化
    watch(() => store.state.song_info.progressTime, () => {
      audio.value.currentTime = store.state.song_info.progressTime;
    })

    // 监听路由变化动态缓存
    watch(() => router.currentRoute.value, (to: any, from: any) => {
      console.log("====================");
      console.log(from);
      console.log(to);
      
      
      
        if(to.meta.level > from.meta.level) {
          if(from.name == "song") return;
          include.push(to.name)
          console.log(include);
          
        }else {
          if(to.name == "song") return;
            include.splice(include.indexOf(from.name), 1)
            console.log(include);
          console.log(include);
          
        }
    })

    onMounted(async () => {
      
      if(store.state.song_info.id) {
        // 请求URL
        const info = await getSongUrl(store.state.song_info.id);
        store.commit("set_song_url",info.data[0].url);
        if(store.state.song_info.list.length == 0) {
          store.commit("add_song", {
            id: store.state.song_info.id,
            name: store.state.song_info.name,
            author: store.state.song_info.author,
            img: store.state.song_info.img,
            url: store.state.song_info.url
          })
        }
      }

      audio.value.addEventListener('progress', () => {
        console.log('<-- 请求缓冲数据 ing -->')
        store.commit("set_song_allTime",audio.value.duration);
        // store.commit("play",false);
        let currentBuffered = audio.value.buffered.end(audio.value.buffered.length - 1)
        console.log(currentBuffered);
        store.commit("set_song_buffered",currentBuffered);
      });
      audio.value.addEventListener('loadstart', () => {
        console.log('<-- 开始请求数据 -->')
        console.log(audio.value.networkState);
        
        // store.commit("play",false);
        // this.SET_PAGE_DATA(['audio', 'isLoading', true])
      })
      audio.value.addEventListener('error', () => {
        console.log('<-- 请求失败 -->')
        console.log(audio.value.networkState);
        store.commit("play",false);
        Toast.fail('数据缓冲失败');
        // this.SET_PAGE_DATA(['audio', 'isLoading', false])
        // if (!window.navigator.onLine) this.$toast('歌曲请求失败，请检查网络')
      })
      audio.value.addEventListener('stalled', () => {
        console.log('<-- 网络失速 -->')
        console.log(audio.value.networkState);
        // store.commit("play",false);
        if(!store.state.song_info.duration) {
          store.commit("set_song_allTime",0);
        }
        Toast('网络失速')
      })
     audio.value.addEventListener('waiting', () => {
        console.log('<-- 等待数据 ing -->')
        // store.commit("play",false);
        // this.SET_PAGE_DATA(['audio', 'isLoading', true])
      })
      audio.value.addEventListener('canplaythrough', () => {
        console.log('<-- 加载完毕，可以播放 -->')
        console.log(audio.value.networkState);
        store.commit("set_song_allTime",audio.value.duration);
        // if (getGLOBAL('trigger').currentTime !== 0) {
        //   this.audio.currentTime = getGLOBAL('trigger').currentTime
        //   this.SET_PAGE_DATA(['trigger', 'currentTime', 0])
        // }
        // this.SET_PAGE_DATA(['audio', 'isLoading', false])
        // this.audio.volume = 0.5
        // this.audio.play()
      })
      audio.value.addEventListener('play', () => {
        console.log('<-- 播放 -->')
        // this.SET_PAGE_DATA(['audio', 'isPlaying', true])
        // this.sendCurrentTime('set')
      })
     audio.value.addEventListener('pause', () => {
        console.log('<-- 暂停 -->')
        // this.sendCurrentTime('clear')
      })
      audio.value.addEventListener('ended', () => {
        console.log('<-- 播放结束 -->')
        store.commit("play",false);
        store.dispatch("play_next");
      })

    })

    const route = useRoute();
    const animation = ref('slide');
    animation.value = 'slide-left'

    onBeforeUnmount(() => {
      console.log("onBeforeUnmount");
      
      clearInterval(timerSong.value);
    })

    const showPopList = () => {
      store.commit("set_pop_list", true)
    }

    const closePopList = () => {
      console.log("3553434344");
      
    }
    
    // const onChange = (index: number) => {
    //   index === 0 && router.push({ path: "/" });
    //   index === 1 && router.push({ path: "/boke" });
    //   index === 2 && router.push({ path: "/person" });
    //   index === 3 && router.push({ path: "/Ksing" });
    //   index === 4 && router.push({ path: "/cloud" });
    // };
    return {
      animation,
      active,
      audio,
      img,
      change_play,
      stopIcon,
      playIcon,
      playWhite,
      stopWhite,
      store,
      linePast,
      point,
      img_pop,
      lyric,
      lyricTime,
      lyricRef,
      getTime,
      line,
      goSong,
      current_song_time,
      router,
      include,
      closePopList,
      showPopList
      // onChange,
    };
  }
});
</script>
<style lang="less" scoped>
.home {
  width: 100vw;
  height: 100vh;
  // overflow: hidden;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active{
    height: 100%;
    will-change: transform;
    transition: all 500ms cubic-bezier(.55,0,.1,1);
    position: absolute;
    backface-visibility: hidden;
}
.slide-right-enter-active{
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active{
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}
.slide-left-enter-active{
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active{
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}
@keyframes rotate_img {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.rotate {
  animation: rotate_img 5s linear infinite forwards;
}
.songDiv {
  height: 50px;
}
.song {
  height: 50px;
  width: 100vw;
  padding: 5px 10px;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  z-index: 1111;
  img {
      width: 30px;
    }
  .song_img {
    width: 40px;
    height: 40px;
    margin-bottom: 20px;
    img {
      width: 40px;
      border-radius: 50%;
    }
  }
  .song_name {
    margin: 0 3px;
    white-space: nowrap;
  }
  .song_author {
    font-size: 12px;
    color: #ccc;
    width: 200px;
    height: 100%;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .icon {
    margin-right: 10px;
  }
}
.fixed_out {
  bottom: -50px;
}
.load {
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  img {
    width: 20px;
  }
}

.pop_list {
  padding: 10px;
  .title {
    margin-bottom: 10px;
  }
  .option {
    overflow: hidden;
    .circulate {
      float: left;
    }
    .get {
      float: right;
    }
    .del_list {
      float: right;
    }
  }
  .list {
    height: 100%;
    overflow: scroll;
    .item {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .info {
        display: flex;
        align-items: baseline;
        color: #ccc;
        font-size: 12px;
        margin-left: 4px;
        img {
          width: 25px;
        }
        .icon {
          width: 25px;
          height: 25px;
          position: relative;
          img {
            position: absolute;
            bottom: -4px;
          }
        }
        .name {
          font-size: 18px;
          color: black;
        }
        .red {
          color: red;
        }
      }
      .red {
        color: red;
      }
    }
  }
}

// 歌曲详情弹出框
.song_detail {
  padding: 10px;
  .info {
    display: flex;
    .img {
      img {
        width: 40px;
        border-radius: 8px;
      }
    }
    .title {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .author {
        font-size: 12px;
        color: #ccc;
      }
    }
  }
  .item {
    margin-top: 10px;
    display: flex;
    align-items: center;
    img {
      width: 20px;
      margin-right: 10px;
    }
    img:nth-child(1) {
      border-radius: 50%;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>
