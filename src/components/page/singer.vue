<template>
  <div>
    <div class="top_search" style="display: flex;width: 100vw;height:50px;align-items:center">
      <div class="back" @click="router.go(-1)" style="display:flex;align-items:center;justify-content:center;width: 10vw;margin-left: 10px">
        <img @click="router.go(-1)" src="../../../public/img/icons/left_arrow_black.svg" alt="" />
      </div>
      <div style="margin-left: 104px;font-size:18px;text-align:center">
        歌手榜单
      </div>
    </div>
    <van-tabs v-model:active="data.activeName" sticky>
      <!-- <van-tab disabled></van-tab>
      <van-tab disabled></van-tab>
      <van-tab disabled></van-tab> -->
      <van-tab title="华语" name="1">
        <!-- <div class="wrapper"> -->
          <van-list v-model:loading="data.cn.loading" v-model:error="data.cn.error" :immediate-check="true" :finished="data.cn.finish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="time" v-if="data.cn.info.updateTime">更新时间：{{ new Date(data.cn.info.updateTime).getMonth() + 1 }}月{{ new Date(data.cn.info.updateTime).getDate() }}日</div>
            <div class="info">
              <div class="item" v-for="(it, i) in data.cn.info.artists" :key="it.id"  @click="router.push({ name: `singerDetail`,query:{id:it.id}})">
                <div class="index">
                  <span :class="{ num: true, red: i < 3 }">{{ i + 1 }}</span>
                  <span v-if="it.rank == i">-</span>
                  <span class="rank" style="color: red" v-else-if="it.lastRank < i"> <span class="up"></span> {{ i - it.lastRank }}</span>
                  <span class="rank" style="color: rgb(22, 202, 247)" v-else-if="it.lastRank > i"> <span class="down"></span> {{ it.lastRank - i }}</span>
                </div>
                <div class="img_wrapper">
                  <van-image lazy-load radius="8" class="img" :src="it.picUrl" />
                </div>
                <div class="detail">
                  <span class="name">{{ it.name }}</span>
                  <span class="hot">当前热度：{{ it.score }}</span>
                </div>
              </div>
            </div>
          </van-list>
        <!-- </div> -->
      </van-tab>
      <van-tab title="欧美" name="2">
        <!-- <div class="wrapper"> -->
          <van-list v-model:loading="data.en.loading" v-model:error="data.en.error" :immediate-check="true" :finished="data.en.finish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="time" v-if="data.en.info.updateTime">更新时间：{{ new Date(data.en.info.updateTime).getMonth() + 1 }}月{{ new Date(data.en.info.updateTime).getDate() }}日</div>
            <div class="info">
              <div class="item" v-for="(it, i) in data.en.info.artists" :key="it.id" @click="router.push({ name: `singerDetail`,query:{id:it.id}})">
                <div class="index">
                  <span :class="{ num: true, red: i < 3 }">{{ i + 1 }}</span>
                  <span v-if="it.rank == i">-</span>
                  <span class="rank" style="color: red" v-else-if="it.lastRank < i"> <span class="up"></span> {{ i - it.lastRank }}</span>
                  <span class="rank" style="color: rgb(22, 202, 247)" v-else-if="it.lastRank > i"> <span class="down"></span> {{ it.lastRank - i }}</span>
                </div>
                <div class="img_wrapper">
                  <van-image lazy-load radius="8" class="img" :src="it.picUrl" />
                </div>
                <div class="detail">
                  <span class="name">{{ it.name }}</span>
                  <span class="hot">当前热度：{{ it.score }}</span>
                </div>
              </div>
            </div>
          </van-list>
        <!-- </div> -->
      </van-tab>
      <van-tab title="韩国" name="3">
        <!-- <div class="wrapper"> -->
          <van-list v-model:loading="data.ko.loading" v-model:error="data.ko.error" :immediate-check="true" :finished="data.ko.finish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="time" v-if="data.ko.info.updateTime">更新时间：{{ new Date(data.ko.info.updateTime).getMonth() + 1 }}月{{ new Date(data.ko.info.updateTime).getDate() }}日</div>
            <div class="info">
              <div class="item" v-for="(it, i) in data.ko.info.artists" :key="it.id" @click="router.push({ name: `singerDetail`,query:{id:it.id}})">
                <div class="index">
                  <span :class="{ num: true, red: i < 3 }">{{ i + 1 }}</span>
                  <span v-if="it.rank == i">-</span>
                  <span class="rank" style="color: red" v-else-if="it.lastRank < i"> <span class="up"></span> {{ i - it.lastRank }}</span>
                  <span class="rank" style="color: rgb(22, 202, 247)" v-else-if="it.lastRank > i"> <span class="down"></span> {{ it.lastRank - i }}</span>
                </div>
                <div class="img_wrapper">
                  <van-image lazy-load radius="8" class="img" :src="it.picUrl" />
                </div>
                <div class="detail">
                  <span class="name">{{ it.name }}</span>
                  <span class="hot">当前热度：{{ it.score }}</span>
                </div>
              </div>
            </div>
          </van-list>
        <!-- </div> -->
      </van-tab>
      <van-tab title="日本" name="4">
        <!-- <div class="wrapper"> -->
          <van-list v-model:loading="data.ja.loading" v-model:error="data.ja.error" :immediate-check="true" :finished="data.ja.finish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="time" v-if="data.ja.info.updateTime">更新时间：{{ new Date(data.ja.info.updateTime).getMonth() + 1 }}月{{ new Date(data.ja.info.updateTime).getDate() }}日</div>
            <div class="info">
              <div class="item" v-for="(it, i) in data.ja.info.artists" :key="it.id" @click="router.push({ name: `singerDetail`,query:{id:it.id}})">
                <div class="index">
                  <span :class="{ num: true, red: i < 3 }">{{ i + 1 }}</span>
                  <span v-if="it.rank == i">-</span>
                  <span class="rank" style="color: red" v-else-if="it.lastRank < i"> <span class="up"></span> {{ i - it.lastRank }}</span>
                  <span class="rank" style="color: rgb(22, 202, 247)" v-else-if="it.lastRank > i"> <span class="down"></span> {{ it.lastRank - i }}</span>
                </div>
                <div class="img_wrapper">
                  <van-image lazy-load radius="8" class="img" :src="it.picUrl" />
                </div>
                <div class="detail">
                  <span class="name">{{ it.name }}</span>
                  <span class="hot">当前热度：{{ it.score }}</span>
                </div>
              </div>
            </div>
          </van-list>
        <!-- </div> -->
      </van-tab>
      <!-- <van-tab disabled></van-tab>
      <van-tab disabled></van-tab>
      <van-tab disabled></van-tab> -->
    </van-tabs>
  </div>
</template>

<script lang="ts">
export default {
  name: "singer"
}
</script>

<script name="singer" lang="ts" setup>
import { defineComponent, onBeforeMount, reactive, toRefs, watch } from "vue";
import { getTopList } from "../../api/song";
import { useRouter } from "vue-router";

interface info {
  activeName: number,
  cn: {
    loading: boolean,
    finish: boolean,
    error: boolean,
    info: {
      artists: any[],
      updateTime: number
    },
  },
  en: {
    loading: boolean,
    finish: boolean,
    error: boolean,
    info: {
      artists: any[],
      updateTime: number
    },
  },
  ko: {
    loading: boolean,
    finish: boolean,
    error: boolean,
    info: {
      artists: any[],
      updateTime: number
    },
  },
  ja: {
    loading: boolean,
    finish: boolean,
    error: boolean,
    info: {
      artists: any[],
      updateTime: number
    },
  },
}

const router = useRouter();
const data = reactive<info>({
  activeName: 1,
  cn: {
    loading: false,
    finish: false,
    error: false,
    info: {
      artists: [],
      updateTime: 0
    },
  },
  en: {
    loading: false,
    finish: false,
    error: false,
    info: {
      artists: [],
      updateTime: 0
    },
  },
  ko: {
    loading: false,
    finish: false,
    error: false,
    info: {
      artists: [],
      updateTime: 0
    },
  },
  ja: {
    loading: false,
    finish: false,
    error: false,
    info: {
      artists: [],
      updateTime: 0
    },
  },
});

// dfsdfdf
const loadMore = async () => {
  if (data.activeName == 1) {
    if (data.cn.info.artists.length || data.cn.loading) return;
    data.cn.loading = true;
    let res = await getTopList(data.activeName);
    data.cn.loading = false;
    data.cn.info = res.list;
    data.cn.finish = true;
  }
  if (data.activeName == 2) {
    if (data.en.info.artists.length || data.en.loading) return;
    data.en.loading = true;
    let res = await getTopList(data.activeName);
    data.en.loading = false;
    data.en.info = res.list;
    data.en.finish = true;
  }
  if (data.activeName == 3) {
    if (data.ko.info.artists.length || data.ko.loading) return;
    data.ko.loading = true;
    let res = await getTopList(data.activeName);
    data.ko.loading = false;
    data.ko.info = res.list;
    data.ko.finish = true;
  }
  if (data.activeName == 4) {
    if (data.ja.info.artists.length || data.ja.loading) return;
    data.ja.loading = true;
    let res = await getTopList(data.activeName);
    data.ja.loading = false;
    data.ja.info = res.list;
    data.ja.finish = true;
  }
};

watch(
  () => data.activeName,
  () => {
    loadMore();
  }
);

// export default defineComponent({
//   name: `singer`,
//   setup: () => {
    

//     return {
//       ...toRefs(data),
//       loadMore,
//       router,
//     };
//   },
// });
</script>

<style lang="less" scoped>
.nav {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 50px;
  padding: 8px;
  font-size: 22px;
  img {
    margin-right: 110px;
    width: 25px;
  }
}
// .wrapper {
//   height: 573px;
//   overflow: scroll;
// }
.time {
  font-size: 18px;
  padding: 8px;
}

.info {
  .item {
    display: flex;
    .index {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ccc;
      width: 40px;
      .num {
        font-size: 20px;
      }
      .red {
        color: red;
      }
      .rank {
        display: flex;
        align-items: center;
        .up {
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 8px solid red;
        }
        .down {
          width: 0;
          height: 0;
          border-top: 8px solid rgb(22, 202, 247);
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
        }
      }
    }
    .img_wrapper {
      .img {
        width: 90px;
        height: 70px;
        margin-right: 8px;
      }
    }
    .detail {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .name {
        font-size: 18px;
      }
      .hot {
        color: #ccc;
        font-size: 12px;
      }
    }
  }
}
.van-tabs :deep(.van-tabs__line) {
  transform: translateX(47px);
}
</style>
