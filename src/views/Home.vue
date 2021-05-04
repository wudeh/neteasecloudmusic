<template>
  <div class="home">
      <router-view v-slot="{ Component }">
        <keep-alive include="discover">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    <!-- 用来撑开底部的盒子 -->
    <div class="songDiv" v-if="store.state.song_info.id"></div>
    <div class="song" v-if="store.state.song_info.id" @click="showPopup">
      <div class="song_img" ref="img">
        <img :src="store.state.song_info.img" alt="">
      </div>
      <div class="song_name">{{store.state.song_info.name}}</div>
      <div class="song_author">-{{store.state.song_info.author}}</div>
      <div class="icon" @click.stop="change_play()">
        <img :src="store.state.song_info.isPlaying ? stopIcon : playIcon" alt="">
      </div>
      <img src="../../public/img/icons/list_icon.svg" alt="">
    </div>
    <audio id="audio" ref="audio" :src="store.state.song_info.url"></audio>
    <van-popup
      v-model:show="show"
      closeable
      close-icon="arrow-down"
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
     <div class="song_pop">
       <div class="bg_blur">
         <img :src="store.state.song_info.img" alt="">
       </div>
      <!-- 顶部 -->
      <div class="nav">
        <!-- <div class="back">
          <img src="" alt="">
        </div> -->
        <div class="title">
          <div class="name">{{store.state.song_info.name}}</div>
          <div class="author">{{store.state.song_info.author}}</div>
        </div>
        <!-- <div class="share">
          <img src="" alt="">
        </div> -->
      </div>
      <img class="needle" :class="{needle_play: store.state.song_info.isPlaying}" src="../../public/img/player/needle.png" alt="">
      <!-- 旋转唱片 -->
      <div class="rotate"> 
        <div class="middle">
          <img ref="img_pop" :src="store.state.song_info.img" alt="">
        </div>
      </div>
      <!-- 歌词 -->
      <div class="liric"></div>
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
        <img src="../../public/img/icons/comment_white.svg" alt="">
        <img src="../../public/img/icons/comment_white.svg" alt="">
        <img class="bigPlay" @click.stop="change_play()" :src="store.state.song_info.isPlaying ? stopWhite : playWhite" alt="">
        <img src="../../public/img/icons/comment_white.svg" alt="">
        <img src="../../public/img/icons/comment_white.svg" alt="">
      </div>
    </div>
    </van-popup>
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
import { defineComponent, ref,onMounted,watch, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex'
import {getTime} from "../utils/num"

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
    let num = ref(0);
    const show = ref(false);  // 控制歌词页面展出
    const showPopup = () => {
      show.value = true;
    };

    function change_play():void {
      store.commit("play",!store.state.song_info.isPlaying);
      audio.value.progress = function () {
        console.log("在播放中");
        
      }
    }

    // 在首页监听播放状态的变化
    watch(() => store.state.song_info.isPlaying,(value,pre) => {
      console.log("监听到播放变化");
      if(value) {
        console.log(store.state.song_info.url);
          // 本来想用 css 的 keyframe 动画 来写 头像的旋转动画
          // 用了之后发现暂停之后不会停在当前旋转的角度，会变回 0deg ，只好自己用定时器写了
          audio.value.autoplay = true;
          audio.value.play();
          console.log("总时长");
          console.log(audio.value.duration); // 这是总时长
          store.commit("set_song_allTime",audio.value.duration);
          console.log(store.state.song_info.duration);
          
          
          timer.value = setInterval(() => {
            img.value.style.transform = `rotate(${num.value}deg)`;
            img_pop.value.style.transform = `rotate(${num.value}deg)`;
            num.value >= 360 && (num.value = 0);
            num.value ++;
          },50)

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
      }else {
        audio.value.pause();
        clearInterval(timer.value);
        clearInterval(timerSong.value);
      }
    })

    onBeforeUnmount(() => {
      clearInterval(timer.value);
      clearInterval(timerSong.value);
    })
    
    // const onChange = (index: number) => {
    //   index === 0 && router.push({ path: "/" });
    //   index === 1 && router.push({ path: "/boke" });
    //   index === 2 && router.push({ path: "/person" });
    //   index === 3 && router.push({ path: "/Ksing" });
    //   index === 4 && router.push({ path: "/cloud" });
    // };
    return {
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
      getTime
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
.van-popup {
  background-color: rgba(0, 0, 0);
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
    height: 40px;
    padding: 0 8px;
    display: flex;
    justify-content: center;
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
