<template>
  <div>
    <van-sticky>
      <div class="navSongList">
        <div class="back" @click="router.go(-1)">
          <img src="../../../public/img/icons/left_arrow_black.svg" alt="" />
        </div>
        <div class="title">排行榜</div>
      </div>
    </van-sticky>
    <!-- 官方榜 -->
    <div class="title" v-if="data.official.length">官方榜</div>
    <div class="official" v-if="data.official.length">
      <div class="official_item" @click="router.push({ path: `/songList`, query: { id: it.id, type: 2 } })" v-for="(it, i) in data.official" :key="i">
        <div class="img_wrapper">
          <van-image radius="8" class="img" :src="it.coverImgUrl" />
          <div class="text">{{ it.updateFrequency }}</div>
        </div>
        <div class="info">
          <span v-for="(sub, s) in it.tracks" :key="s"> {{ s + 1 }}.{{ sub.first }}&nbsp;-&nbsp;{{ sub.second }} </span>
        </div>
      </div>
      <div class="official_item" @click="router.push({ path: `/singer` })">
        <div class="img_wrapper">
          <van-image radius="8" class="img" :src="data.artistToplist.coverUrl" />
          <div class="text">{{ data.artistToplist.upateFrequency }}</div>
        </div>
        <div class="info">
          <span v-for="(it, i) in data.artistToplist.artists" :key="i"> {{ i + 1 }}.{{ it.first }} </span>
        </div>
      </div>
    </div>
    <!-- 其他榜单 -->
    <div class="title" v-if="data.official.length">其他榜单</div>
    <div class="other">
      <div class="other_item" v-for="(it, i) in data.other" :key="i" @click="router.push({ path: `/songList`, query: { id: it.id, type: 2 } })">
        <div class="img_wrapper">
          <van-image lazy-load radius="8" class="img" :src="it.coverImgUrl" />
          <span>{{ it.updateFrequency }}</span>
        </div>
        <span>{{ it.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "rank"
}
</script>


<script lang="ts" setup>
import { defineComponent, onBeforeMount, reactive, toRefs } from "vue";
import songStore from "../../store";
import { useRouter } from "vue-router";
import { getRank } from "../../api/discover";
import { Lazyload } from "vant";

interface info {
  official: Array<any>;
  artistToplist: any;
  other: Array<any>;
}

const store = songStore();
const router = useRouter();
const data = reactive<info>({
  official: [],
  artistToplist: {},
  other: [],
});

onBeforeMount(async () => {
  store.set_load(true);
  let info = await getRank();
  store.set_load(false);
  info.list.map((item: any) => {
    if (item.tracks.length) {
      data.official.push(item);
    } else {
      data.other.push(item);
    }
  });
  data.artistToplist = info.artistToplist;
});

// export default defineComponent({
//   name: "rank",
//   setup: () => {

//     return {
//       store,
//       ...toRefs(data),
//       router
//     }
//   }
// })
</script>

<style lang="less" scoped>
.navSongList {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
  .back {
    margin-right: 110px;
    img {
      width: 25px;
    }
  }
  .title {
    font-size: 20px;
  }
}

.title {
  background-color: #fff;
  padding-left: 8px;
  font-size: 16px;
  font-weight: bold;
}

.official {
  background-color: #fff;
  padding: 8px;
  width: 100vw;
  box-sizing: border-box;
  .official_item {
    display: flex;
    .img_wrapper {
      margin-right: 8px;
      position: relative;
      .img {
        width: 100px;
        height: 100px;
      }
      .text {
        font-size: 14px;
        position: absolute;
        left: 8px;
        bottom: 8px;
        color: #fff;
        opacity: 0.8;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      span {
        width: 250px;
        font-size: 14px;
        color: #ccc;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .artistToplist {
      .info;
    }
  }
}

.other {
  background-color: #fff;
  width: 100vw;
  box-sizing: border-box;
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 114px);
  gap: 8px;
  .other_item {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    .img_wrapper {
      position: relative;
      width: 114px;
      height: 114px;
      span {
        position: absolute;
        left: 8px;
        bottom: 8px;
        color: #fff;
        opacity: 0.8;
        font-size: 12px;
      }
    }
    span {
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>
