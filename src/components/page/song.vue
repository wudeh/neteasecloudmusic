<template>
  
</template>

<script lang="ts">
import { defineComponent, ref,onMounted,watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex'

export default defineComponent({
  name: "Home",
  setup() {
    const router = useRouter();
    const active = ref(0);
    const store = useStore();
    const audio = ref();
    const img = ref();
    const stopIcon = require('../../public/img/icons/stop_icon.svg')
    const playIcon = require('../../public/img/icons/play_icon.svg')
    let timer = ref();
    let num = ref(0);

    function change_play():void {
      store.commit("play",!store.state.song_info.isPlaying);
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
            num.value >= 360 && (num.value = 0);
            num.value ++;
          },50)
      }else {
        audio.value.pause();
        clearInterval(timer.value);
      }
    })
    return {
      active,
      audio,
      img,
      change_play,
      stopIcon,
      playIcon,
      store
      // onChange,
    };
  },
});
</script>
<style lang="less">
.song {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .nav {
    height: 40px;
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    img {
      width: 30px;
    }
  }
}
</style>
