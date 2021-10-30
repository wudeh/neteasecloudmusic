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
    <van-tabs v-model:active="activeName" sticky>
      <!-- <van-tab disabled></van-tab>
      <van-tab disabled></van-tab>
      <van-tab disabled></van-tab> -->
      <van-tab title="华语" name="1">
        <!-- <div class="wrapper"> -->
          <van-list v-model:loading="cn.loading" v-model:error="cn.error" :immediate-check="true" :finished="cn.finish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="time" v-if="cn.info.updateTime">更新时间：{{ new Date(cn.info.updateTime).getMonth() + 1 }}月{{ new Date(cn.info.updateTime).getDate() }}日</div>
            <div class="info">
              <div class="item" v-for="(it, i) in cn.info.artists" :key="it.id"  @click="router.push({ name: `singerDetail`,query:{id:it.id}})">
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
          <van-list v-model:loading="en.loading" v-model:error="en.error" :immediate-check="true" :finished="en.finish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="time" v-if="en.info.updateTime">更新时间：{{ new Date(en.info.updateTime).getMonth() + 1 }}月{{ new Date(en.info.updateTime).getDate() }}日</div>
            <div class="info">
              <div class="item" v-for="(it, i) in en.info.artists" :key="it.id" @click="router.push({ name: `singerDetail`,query:{id:it.id}})">
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
          <van-list v-model:loading="ko.loading" v-model:error="ko.error" :immediate-check="true" :finished="ko.finish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="time" v-if="ko.info.updateTime">更新时间：{{ new Date(ko.info.updateTime).getMonth() + 1 }}月{{ new Date(ko.info.updateTime).getDate() }}日</div>
            <div class="info">
              <div class="item" v-for="(it, i) in ko.info.artists" :key="it.id" @click="router.push({ name: `singerDetail`,query:{id:it.id}})">
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
          <van-list v-model:loading="ja.loading" v-model:error="ja.error" :immediate-check="true" :finished="ja.finish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="time" v-if="ja.info.updateTime">更新时间：{{ new Date(ja.info.updateTime).getMonth() + 1 }}月{{ new Date(ja.info.updateTime).getDate() }}日</div>
            <div class="info">
              <div class="item" v-for="(it, i) in ja.info.artists" :key="it.id" @click="router.push({ name: `singerDetail`,query:{id:it.id}})">
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
import { defineComponent, onBeforeMount, reactive, toRefs, watch } from "vue";
import { getTopList } from "../../api/song";
import { sendTimeConversion, numFilter } from "../../utils/num";
import { useRouter } from "vue-router";
export default defineComponent({
  name: `singer`,
  setup: () => {
    const router = useRouter();
    const data = reactive({
      activeName: 1,
      cn: {
        loading: false,
        finish: false,
        error: false,
        info: {
          artists: [],
        },
      },
      en: {
        loading: false,
        finish: false,
        error: false,
        info: {
          artists: [],
        },
      },
      ko: {
        loading: false,
        finish: false,
        error: false,
        info: {
          artists: [],
        },
      },
      ja: {
        loading: false,
        finish: false,
        error: false,
        info: {
          artists: [],
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

    return {
      ...toRefs(data),
      loadMore,
      router,
    };
  },
});
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
