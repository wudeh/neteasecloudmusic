<template>
  <div class="popup">
      <div class="song_pop">
        <div class="bg_blur">
          <img :src="store.state.song_info.img" alt="">
        </div>
        <!-- 顶部 -->
        <div class="nav">
          <div class="back">
            <img src="../../../public/img/icons/arrow_down.svg" @click="back" alt="">
          </div>
          <div class="title">
            <div class="name">{{store.state.song_info.name}}</div>
            <div class="author">{{store.state.song_info.author}}</div>
          </div>
          <div class="share">
            <img src="../../../public/img/icons/share.svg" alt="">
          </div>
        </div>
        <img class="needle" :class="{needle_play: store.state.song_info.isPlaying,hidden: showLyric}" src="../../../public/img/player/needle.png" alt="">
        <!-- 旋转唱片 -->
        <div class="rotate" :class="{hidden: showLyric}" :style="{animationPlayState: store.state.song_info.isPlaying ? 'running' : 'paused'}" @click="showAllLyric()"> 
          <div class="middle">
            <img :src="store.state.song_info.img" alt="">
          </div>
        </div>
        <!-- 歌词 -->
        <div class="lyric_wrapper" :class="{show_all_lyric: showLyric}" @click="showAllLyric()">
            <!-- <div class="lyric_div" :class="{lyric_div_show: showLyric}"></div> -->
            <div class="lyric" :class="{lyric_show: showLyric}">
              <div  ref="lyricRef">
                <div v-for="(item,index) in lyric" :key="index" :id=" `s` + index" :class="{lyric_base:true,lyric_white: item.time <= current_song_time && current_song_time <= lyric[index+1].time}" v-html="item.lyric"></div>
                <div style="height:1000px"></div>
              </div>
            </div>
        </div>
        <!-- 收藏，评论 -->
        <div class="icon_top">
          <img src="../../../public/img/icons/comment_white.svg" alt="">
          <img src="../../../public/img/icons/comment_white.svg" alt="">
          <img src="../../../public/img/icons/comment_white.svg" alt="">
          <img src="../../../public/img/icons/comment_white.svg" alt="">
          <img src="../../../public/img/icons/comment_white.svg" alt="">
        </div>
        <!-- 进度条 -->
        <div class="progress">
          <div class="current_time">{{getTime(store.state.song_info.currentTime)}}</div>
          <div class="line" ref="line" @touchstart="processControlStart($event)" @touchmove="processControlMove($event)" @touchend="processControlEnd($event)">
            <div class="past" ref="linePast"></div>
            <div class="circle_point" ref="point"></div>
          </div>
          <div class="durasion">{{getTime(store.state.song_info.duration)}}</div>
        </div>
        <!-- 播放图标 -->
        <div class="bottom_icon">
          <img src="../../../public/img/icons/comment_white.svg" alt="" @click="test">
          <img src="../../../public/img/icons/comment_white.svg" alt="">
          <img class="bigPlay" @click.stop="change_play()" :src="store.state.song_info.isPlaying ? stopWhite : playWhite" alt="">
          <img src="../../../public/img/icons/comment_white.svg" alt="">
          <img src="../../../public/img/icons/comment_white.svg" alt="">
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref,onBeforeMount,onMounted,watch,onBeforeUnmount,reactive,nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex'
import { getTime } from "../../utils/num"
import BScroll from "@better-scroll/core";
import { getLyric, getSongUrl } from "../../api/song"
interface info {
  bs: any;
}
export default defineComponent({
  name: "song",
  setup() {
    const router = useRouter();
    const active = ref(0);
    const store = useStore();
    const playWhite = require('../../../public/img/icons/play_white.svg')
    const stopWhite = require('../../../public/img/icons/stop_white.svg')

    const showLyric = ref(false);  // 控制是否显示全部歌词
    const autoMovePoint = ref(true); // 是否自动随歌曲播放自动移动圆点，为了实现手动移动进度条，在点击进度条时置为 false，
    let lyric: Array<{time:string,lyric:string}> = reactive([]);
    const scroll = ref(true)
    let lyricRef = ref()

    const tempCurrentTime = ref(0); // 临时时间，用来计算手动点击进度条的时间
    let current_song_time = ref('00:00.00');

    const linePast = ref();
    const point = ref();
    const line = ref();
    let lyricScorll = reactive<info>({
      bs: ''
    });

    const back = () => {
      router.go(-1);
    }

    const lyricRequest = async () => {
      const data = await getLyric(store.state.song_info.id);
      console.log(data);
      console.log(data.lrc.lyric.split("["));
      let i = data.lrc.lyric.split("[");
      i.forEach((item:any,index: number) => {
        let temp = {
          time: item.split("]")[0].split(":").join(""),
          lyric: item.split("]")[1] || i[index+1].split("]")[1] || "", // 有些重复的歌词会有两个时间段
        };
        if(temp.lyric != "\n") lyric.push(temp);           
      });
      // 给歌词列表最后再加上一个最长的时间，因为判断歌词高亮的时间是当前播放时间大于上一条歌词时间，小于下一条歌词时间，让最后的歌词高亮的时候不会出 bug
      lyric.push({
        time: '9999999999',
        lyric: 'wudeh'
      })
      

      
      lyric.sort((a: any,b: any) => {
        return a.time - b.time;
      })
      console.log(lyric);
      console.log("这是歌词");
      if(data.tlyric.lyric) {
        let i = data.tlyric.lyric.split("[");
        i.forEach((item:any,index: number) => {
          let temp = {
            time: item.split("]")[0].split(":").join(""),
            lyric: item.split("]")[1] || i[index+1].split("]")[1] || "", // 有些重复的歌词会有两个时间段
          };
          lyric.forEach((item: any,index: number) => {
            if(item.time == temp.time) {
              lyric[index].lyric += `<br>${temp.lyric}`
            }
          })          

        });
      }
    }

    onBeforeMount(() => {
      console.log("onbeforMount");
      
    })

    onMounted(async () => {
      lyricScorll.bs = new BScroll(".lyric", {
        scrollX: false,
        scrollY: true,
        click: true,
        // bounce: false,
        // mouseWheel: false,
        // disableMouse: true
      })
      console.log("mounted");
      // 可能会出现首页已经缓冲好了导致vuex中的缓冲时间不变化，进而导致缓冲进度条监听不执行，所以一进来就设置一下
      linePast.value.style.width = `${store.state.song_info.buffered / store.state.song_info.duration * 100}%`
      
      // 如果有歌曲id 而没有歌词就请求歌词
      if(store.state.song_info.id && !lyric.length) {
        lyricRequest();
      }
    })

    // 歌词变更重新计算滚动高度
    watch(() => lyric.length, () => {
      nextTick(() => {
        lyricScorll.bs.refresh();
      })
    })

    // 歌曲变更重新请求歌词
    watch(() => store.state.song_info.id, () => {
      lyric.length = 0;
      lyricRequest();
    })

    // 不在歌词页面不让滚动
    watch(() => router.currentRoute.value.name, (value:any) => {
      if(value != "song") {
        console.log("不能滚动");
        scroll.value = false
      }else {
        console.log("可以滚动");
        scroll.value =true;
      }
    })


    // 监听歌曲时间，用来设置歌词滚动和圆点移动
    watch(() => store.state.song_info.currentTime, () => {
      
      current_song_time.value = (getTime(store.state.song_info.currentTime.toString().split(".")[0])).split(":").join("") + "."+ store.state.song_info.currentTime.toString().split(".")[1];
      if(scroll.value) {
        // 歌词滚动
        lyric.forEach((i:any,index,arr) => {
          if(current_song_time.value >= i.time && current_song_time.value <= arr[index+1].time) {
            lyricScorll.bs.scrollToElement(`#s${index}`,300)
          }
        })
      }
      
      // 判断是否可以随歌曲播放自动移动圆点
      if(autoMovePoint.value) {
        point.value.style.left = `${store.state.song_info.currentTime / store.state.song_info.duration * 100}%`
      } 
    })

    

    // 监听歌曲缓冲时间，用来缓冲进度条
    watch(() => store.state.song_info.buffered, () => {
      linePast.value.style.width = `${store.state.song_info.buffered / store.state.song_info.duration * 100}%`
    })

    // 暂停或者开始播放
    function change_play():void {
      store.commit("play",!store.state.song_info.isPlaying);
      nextTick(() => {
        lyricScorll.bs.refresh();
      })
    }

    // 控制是否显示全部歌词
    const showAllLyric = () => {
      showLyric.value = !showLyric.value;
      nextTick(() => {
        lyricScorll.bs.refresh();
      })
    }

    // 进度条拖动部分，ev 是事件对象，用来获取点击的位置
    const processControlStart = (ev: any) => {
      console.log(ev.touches[0].clientX);
      // console.log(line.value.offsetWidth);
      console.log(line.value.offsetLeft);
      
      
      autoMovePoint.value = false
      // 获得总进度条宽度
      let barOffsetWidth = line.value.offsetWidth
      // 算出点击位置距离总进度条左边的距离
      // let slideLength = Math.floor(ev.touches[0].clientX) - line.value.offsetLeft
      let slideLength = ev.touches[0].clientX - line.value.offsetLeft
      console.log(slideLength);
      
      // 算出点击位置距离总进度条左边距离的百分比
      let slidePercent = slideLength / barOffsetWidth
      // this.process = Math.floor(slidePercent * 100)
      // tempCurrentTime.value = Math.floor(getMusicList().duration / 1000 * slidePercent)
      tempCurrentTime.value = store.state.song_info.duration * slidePercent;
      console.log("这是tempCurrentTime");
      
      console.log(tempCurrentTime.value);
      
      point.value.style.left = `${slidePercent * 100}%`
    };
    // 圆点进度移动过程中
    const processControlMove = (ev:any) => {
      let barOffsetWidth = line.value.offsetWidth
      // let slideLength = Math.floor(ev.touches[0].clientX) - line.value.offsetLeft
      let slideLength = ev.touches[0].clientX - line.value.offsetLeft
      let slidePercent = slideLength / barOffsetWidth
      tempCurrentTime.value = store.state.song_info.duration * slidePercent;
      if(slidePercent >= 0 && slidePercent <= 1) {
        point.value.style.left = `${slidePercent * 100}%`
      }
      
    };
    // 点击结束或者移动结束
    const processControlEnd = (ev:any) => {
      console.log("移动结束");
      
      autoMovePoint.value = true;
      // audio.value.currentTime = tempCurrentTime.value;
      // 设置拖动进度条时间
      store.commit("set_progress_time",tempCurrentTime.value)
      // point.value.style.left = `${slidePercent / 100}%`
      // this.SET_PAGE_DATA(['trigger', 'process', this.tempCurrentTime])
    };

    return {
      back,
      playWhite,
      stopWhite,
      active,
      change_play,
      store,
      linePast,
      point,
      lyric,
      lyricRef,
      getTime,
      line,
      processControlStart,
      processControlMove,
      processControlEnd,
      current_song_time,
      showAllLyric,
      showLyric
    }
  }
});
</script>
<style lang="less" scoped>
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
      background-image: url("../../../public/img/player/cover-bg-in.png");
      background-size: cover;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 220px;
        height: 220px;
        border-radius: 50%;
      }
    }
  }
  .hidden {
    opacity: 0;
  }

  .lyric_wrapper {
    position: absolute;
    width: 350px;
    height: 40px;
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
      height: 100%;
      .lyric_base {
        transition: all 0.3s;
        height: 30px;
        margin-bottom: 10px;
        font-size: 13px;
      }
      .lyric_white {
        color: #fff;
        font-size: 15px;
      }
    }
    .lyric_show {
      height: 50%;
      margin-top: 65%;
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
    display: flex;
    align-items: center;
    .line {
      width: 280px;
      height: 2px;
      margin: 0 8px;
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.2);
      position: relative;
      .past {
        background-color: #fff;
        height: 100%;
      }
      .circle_point {
        position: absolute;
        background-color: #fff;
        border-radius: 50%;
        width: 6px;
        height: 6px;
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
