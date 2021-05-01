<template>
  <div class="home">
    <!-- <suspense> -->
    <router-view></router-view>
    <!-- </suspense> -->
    <div class="song">
      <div class="song_img">曲绘</div>
      <div class="song_name">曲名</div>
    </div>
    <van-tabbar
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
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "Home",
  setup() {
    const router = useRouter();
    const active = ref(0);
    const onChange = (index: number) => {
      index === 0 && router.push({ path: "/" });
      index === 1 && router.push({ path: "/boke" });
      index === 2 && router.push({ path: "/person" });
      index === 3 && router.push({ path: "/Ksing" });
      index === 4 && router.push({ path: "/cloud" });
    };
    return {
      active,
      onChange,
    };
  },
});
</script>
<style lang="less">
.song {
  height: 50px;
  width: 100vw;
  padding: 5px 10px;
  box-sizing: border-box;
  position: fixed;
  bottom: 50px;
  background-color: red;
  display: flex;
  z-index: 1111;
}
</style>
