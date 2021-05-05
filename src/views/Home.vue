<template>
  <div class="home">
      <router-view v-slot="{ Component }">
        <keep-alive include="discover">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    <!-- 用来撑开底部的盒子 -->
    <div class="songDiv" v-if="store.state.song_info.id"></div>
    <div class="song" :class="{fixed_out: !store.state.song_info.id}" @click="showPopup">
      <div class="song_img">
        <img  ref="img" :src="store.state.song_info.img" alt="">
      </div>
      <div class="song_name">{{store.state.song_info.name}}</div>
      <div class="song_author">-{{store.state.song_info.author}}</div>
      <div class="icon" @click.stop="change_play()">
        <img :src="store.state.song_info.isPlaying ? stopIcon : playIcon" alt="">
      </div>
      <img src="../../public/img/icons/list_icon.svg" alt="">
    </div>
    <audio id="audio" ref="audio" :src="store.state.song_info.url"></audio>
    <!-- <van-popup
      v-model:show="show"
      closeable
      close-icon="arrow-down"
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    > -->
    <div class="popup" :class="{pop_down: !show}">
      <div class="song_pop">
        <div class="bg_blur">
          <img :src="store.state.song_info.img" alt="">
        </div>
        <!-- 顶部 -->
        <div class="nav">
          <div class="back">
            <img src="../../public/img/icons/arrow_down.svg" @click="show = false" alt="">
          </div>
          <div class="title">
            <div class="name">{{store.state.song_info.name}}</div>
            <div class="author">{{store.state.song_info.author}}</div>
          </div>
          <div class="share">
            <img src="../../public/img/icons/share.svg" alt="">
          </div>
        </div>
        <img class="needle" :class="{needle_play: store.state.song_info.isPlaying,hidden: showLyric}" src="../../public/img/player/needle.png" alt="">
        <!-- 旋转唱片 -->
        <div class="rotate" :class="{hidden: showLyric}" @click="showAllLyric()"> 
          <div class="middle">
            <img ref="img_pop" :src="store.state.song_info.img" alt="">
          </div>
        </div>
        <!-- 歌词 -->
        <div class="lyric_wrapper" :class="{show_all_lyric: showLyric}" @click="showAllLyric()">
            <div class="lyric_div" :class="{lyric_div_show: showLyric}"></div>
            <div class="lyric" :class="{lyric_show: showLyric}">
              <div>
                <div v-for="(item,index) in lyric" ref="lyricRef" :key="index" :id=" `s` + index" :class="{lyric_base:true,lyric_white: item.time <= current_song_time && current_song_time <= lyric[index+1].time}">{{item.lyric}}</div>
                <div style="height:1000px"></div>
              </div>
            </div>
        </div>
        <!-- 收藏，评论 -->
        <div class="icon_top">
          <img src="../../public/img/icons/comment_white.svg" alt="">
          <img src="../../public/img/icons/comment_white.svg" alt="">
          <img src="../../public/img/icons/comment_white.svg" alt="">
          <img src="../../public/img/icons/comment_white.svg" alt="">
          <img src="../../public/img/icons/comment_white.svg" alt="">
        </div>
        <!-- 进度条 -->
        <div class="progress">
          <div class="current_time">{{getTime(store.state.song_info.playTime)}}</div>
          <div class="line">
            <div class="past" ref="linePast"></div>
            <div class="circle_point"></div>
          </div>
          <div class="durasion">{{getTime(store.state.song_info.duration)}}</div>
        </div>
        <!-- 播放图标 -->
        <div class="bottom_icon">
          <img @click="scroll" src="../../public/img/icons/comment_white.svg" alt="">
          <img src="../../public/img/icons/comment_white.svg" alt="">
          <img class="bigPlay" @click.stop="change_play()" :src="store.state.song_info.isPlaying ? stopWhite : playWhite" alt="">
          <img src="../../public/img/icons/comment_white.svg" alt="">
          <img src="../../public/img/icons/comment_white.svg" alt="">
        </div>
      </div>
    </div>
     
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
import { defineComponent, ref,onMounted,watch, onBeforeUnmount,reactive,nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex'
import { getTime } from "../utils/num"
import { getLyric } from "../api/song"
import BScroll from "@better-scroll/core";
interface info {
  bs: any;
}
export default defineComponent({
  name: "Home",
  setup() {
    const router = useRouter();
    const active = ref(0);
    const store = useStore();
    const audio = ref();
    const linePast = ref();
    const img = ref();
    const img_pop = ref();
    const stopIcon = require('../../public/img/icons/stop_icon.svg')
    const playIcon = require('../../public/img/icons/play_icon.svg')
    const playWhite = require('../../public/img/icons/play_white.svg')
    const stopWhite = require('../../public/img/icons/stop_white.svg')
    let timer = ref();  // 控制头像旋转
    let timerSong = ref(); // 定时计算当前播放时间
    let current_song_time = ref('00:00.00');
    let num = ref(0);
    let lyric: Array<{time:string,lyric:string}> = reactive([]);
    let lyricTime: Array<string> = reactive([]);
    const show = ref(false);  // 控制歌词页面展出
    const showLyric = ref(false);  // 控制是否显示全部歌词
    let lyricScorll = reactive<info>({
      bs: ''
    });

    // 控制歌词页面展出
    const showPopup = () => {
      show.value = true;
      window.addEventListener('popstate', back, false)
    };

    // 控制是否显示全部歌词
    const showAllLyric = () => {
      showLyric.value = !showLyric.value;
    }

    const scroll = () => {
       lyricScorll.bs.scrollToElement("#s12",300)
    }

    function change_play():void {
      store.commit("play",!store.state.song_info.isPlaying);
      audio.value.progress = function () {
        console.log("在播放中");
        
      }
    }

    function interval(): void {
      timer.value = setInterval(() => {
            img.value.style.transform = `rotate(${num.value}deg)`;
            img_pop.value.style.transform = `rotate(${num.value}deg)`;
            num.value >= 360 && (num.value = 0);
            num.value ++;
            current_song_time.value = getTime(audio.value.currentTime.toString().split(".")[0]) + audio.value.currentTime.toString().split(".")[1];
            lyricScorll.bs.refresh();
            lyric.forEach((i:any,index,arr) => {
              if(current_song_time.value >= i.time && current_song_time.value <= arr[index+1].time) {
                lyricScorll.bs.scrollToElement(`#s${index}`,300)
              }
            })
          },70)

          timerSong.value = setInterval(() => {
            console.log(audio.value.currentTime);
            
            store.commit("set_song_allTime",audio.value.duration);
            store.commit("set_song_time",audio.value.currentTime);
            linePast.value.style.width = `${audio.value.currentTime / audio.value.duration * 100}%`
            console.log(audio.value.ended);
            
            if(audio.value.ended) {
              store.commit("play",!store.state.song_info.isPlaying);
            }
            
            
          },1000)
    }

    watch(() => show.value, (value,pre) => {
      if(value) {
        window.addEventListener('popstate', back, false)
      }else {
        window.removeEventListener('popstate', back, false);
      }
    })

    // 在首页监听播放状态的变化
    watch(() => store.state.song_info.isPlaying,(value,pre) => {
      console.log("监听到播放变化");
      if(value) {
        console.log(store.state.song_info.url);
        console.log(img.value);
        
          // 本来想用 css 的 keyframe 动画 来写 头像的旋转动画
          // 用了之后发现暂停之后不会停在当前旋转的角度，会变回 0deg ，只好自己用定时器写了
          audio.value.autoplay = true;
          audio.value.play();
          console.log("总时长");
          console.log(audio.value.duration); // 这是总时长
          store.commit("set_song_allTime",audio.value.duration);
          console.log(store.state.song_info.duration);

          interval();
          
          
      }else {
        audio.value.pause();
        clearInterval(timer.value);
        clearInterval(timerSong.value);
      }
    })

    watch(() => lyric.length, () => {
      nextTick(() => {
        lyricScorll.bs.refresh();
      })
      
      
    })


    // 监听后退的时候关闭歌词弹出页
    function back(): void {
      console.log("监听到后退事件");
      
      if(show.value) {
        show.value = false;
      }
    }

    onMounted(async () => {
      console.log(img);
      img.value.style.transform = `rotate(90deg)`;
      
      if (window.history) {
				history.pushState(null, '', document.URL)
				window.addEventListener('popstate', back, false)
			}

      if(!store.state.song_info.lyric.length){
        const data = await getLyric(store.state.song_info.id);
        console.log(data);
        console.log(data.lrc.lyric.split("["));
        let i = data.lrc.lyric.split("[");
        let x:Array<{}> = [];
        i.forEach((item:any) => {
          lyric.push({
            // time: item.split("]")[0].split(".")[0],
            time: item.split("]")[0],
            lyric: item.split("]")[1] || '',
          })
        });
        // 给歌词列表最后再加上一个最长的时间，因为判断歌词高亮的时间是当前播放时间大于上一条歌词时间，小于下一条歌词时间，让最后的歌词高亮的时候不会出 bug
        lyric.push({
          time: '99:99:99.9999',
          lyric: ''
        })
        

        lyricScorll.bs = new BScroll(".lyric", {
          scrollX: false,
          scrollY: true,
          click: true,
          mouseWheel: false,
          // disableMouse: true
        })

        nextTick(() => {
          lyricScorll.bs.refresh();
        })
        
        console.log(x);
        // lyric = x;
        console.log(lyric);
        console.log("这是歌词");
        
        x.forEach((item: any) => {
          lyricTime.push(item.time)
        })
      }

    })

    onBeforeUnmount(() => {
      clearInterval(timer.value);
      clearInterval(timerSong.value);
      window.removeEventListener('popstate', back, false);
    })
    
    // const onChange = (index: number) => {
    //   index === 0 && router.push({ path: "/" });
    //   index === 1 && router.push({ path: "/boke" });
    //   index === 2 && router.push({ path: "/person" });
    //   index === 3 && router.push({ path: "/Ksing" });
    //   index === 4 && router.push({ path: "/cloud" });
    // };
    return {
      scroll,
      active,
      audio,
      img,
      change_play,
      stopIcon,
      playIcon,
      playWhite,
      stopWhite,
      store,
      show,
      showPopup,
      linePast,
      img_pop,
      lyric,
      lyricTime,
      getTime,
      current_song_time,
      showAllLyric,
      showLyric
      // onChange,
    };
  },
});
</script>
<style lang="less">
// @keyframes rotate_img {
//   0% {
//     transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(360deg);
//   }
// }
// .rotate {
//   animation: rotate_img 5s linear infinite forwards;
// }
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
    border-radius: 50%;
    overflow: hidden;
    width: 40px;
    height: 40px;
    margin-bottom: 20px;
    img {
      width: 40px;
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
.popup {
  background-color: rgba(0, 0, 0);
  position: fixed;
  width: 100vw;
  height: 100vh;
  bottom: 0;
  z-index: 2222;
  transition: all 0.3s;
}
.pop_down {
  bottom: -100vh;
}
.song_pop {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  .bg_blur {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    filter: blur(100px);
    z-index: -1;
  }
  .nav {
    width: 100vw;
    height: 40px;
    box-sizing: border-box;
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    .back {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img {
      width: 30px;
    }
    .title {
      color: #fff;
      text-align: center;
      .name {
        font-size: 20px;
      }
      .author {
        font-size: 12px;
        opacity: 0.5;
      }
    }
    img {
      width: 30px;
    }
  }
  .needle {
    width: 150px;
    // transform: translate(28%);
    margin-left: 50px;
    margin-bottom: -90px;
    margin-top: -10px;
    transform-origin:0% 0%;
    transition: all 0.3s;
    transform: rotate(-20deg);
    z-index: 1;
  }
  .needle_play {
    transform: rotate(-5deg);
  }
  .rotate {
    width: 300px;
    height: 300px;
    opacity: 1;
    .middle {
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background-image: url("../../public/img/player/cover-bg-in.png");
      background-size: cover;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 210px;
        height: 210px;
        border-radius: 50%;
      }
    }
  }
  .hidden {
    opacity: 0;
  }

  .lyric_wrapper {
    position: absolute;
    width: 300px;
    height: 35px;
    top: 75%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    font-size: 12px;
    overflow: hidden;
    box-sizing: border-box;
    padding-top: 0;
    color: rgba(255, 255, 255, 0.5);
    .lyric_div {
      height: 0;
    }
    .lyric_div_show {
      height: 50%;
    }
    .lyric {
      height: 35px;
      .lyric_base {
        transition: all 0.3s;
      }
      .lyric_white {
        color: #fff;
        font-size: 15px;
      }
    }
    .lyric_show {
      height: 50%;
    }
  }
  .show_all_lyric {
    height: 410px;
    top: 40%;
  }
  .icon_top {
    display: flex;
    justify-content: space-between;
    width: 280px;
    margin-top: 50px;
    margin-bottom: 20px;
    img {
      width: 30px;
    }
  }
  .progress {
    font-size: 12px;
    color: #fff;
    opacity: 0.5;
    display: flex;
    align-items: center;
    .line {
      width: 280px;
      height: 2px;
      margin: 0 8px;
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.2);
      .past {
        background-color: rgba(255, 255, 255, 0.8);
        height: 100%;
      }
      .circle_point {
        background-color: #fff;
        border-radius: 50%;
        width: 4px;
        height: 4px;
      }
    }
  }
  .bottom_icon {
    .icon_top;
    margin-top: 10px;
    .bigPlay {
      width: 40px;
    }
  }
}
</style>
