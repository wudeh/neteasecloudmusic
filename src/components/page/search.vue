<template>
  <div style="width: 100vw">
    <div class="top_search" style="display: flex; width: 100vw">
      <div class="back" @click="router.go(-1)" style="display: flex; align-items: center; justify-content: center; width: 10vw; margin-left: 10px">
        <img @click="router.go(-1)" src="../../../public/img/icons/left_arrow_black.svg" alt="" />
      </div>
      <div style="flex: 1">
        <form action="/">
          <van-search v-model="data.word" shape="round" @update:model-value="suggest()" placeholder="请输入搜索关键词" @search="onSearch" />
        </form>
      </div>
    </div>

    <!-- 历史搜索 -->
    <div class="history">
      <div class="title"></div>
      <div class="item">
        <span></span>
      </div>
    </div>
    <!-- 热搜 -->
    <div class="hot" v-if="data.hotWord.length">
      <div class="title">热搜榜</div>
      <div class="list">
        <div class="item" v-for="(item, index) in data.hotWord" :key="index" @click="onSearch(item.searchWord)">
          <span :class="{ three_color: index < 3, index: true }">{{ index + 1 }}</span>
          <span :class="{ three_text: index < 3 }">{{ item.searchWord }}</span>
          <van-image class="img" v-if="item.iconUrl" :src="item.iconUrl" />
        </div>
      </div>
    </div>
    <!-- 搜索建议 -->
    <div class="suggest" @click="clearSearchSuggest" v-if="data.suggestWord.length">
      <div class="item" v-word="data.word" v-for="(item, index) in data.suggestWord" :key="index" @click="onSearch(item.keyword)">{{ item.keyword }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "search"
}
</script>

<script lang="ts" setup>
import { defineComponent, onBeforeMount, reactive, toRefs } from "vue";
import { getSearchHot, getSuggest } from "../../api/discover";
import songStore from "../../store";
import { useRouter, useRoute } from "vue-router";
interface info {
  word: string;
  hotWord: Array<any>;
  suggestWord: Array<any>;
  searchHistory: Array<any>;
  timer: any;
}

const store = songStore();
const router = useRouter();
const data = reactive<info>({
  word: "",
  hotWord: [],
  searchHistory: [],
  suggestWord: [],
  timer: null,
});

onBeforeMount(async () => {
  store.set_load(true);
  let info = await getSearchHot();
  data.hotWord = info.data;
  store.set_load(false);
});

const suggest = async () => {
  data.suggestWord = [];
  if (data.word == "") return;
  if (data.timer) clearTimeout(data.timer);
  data.timer = setTimeout(async () => {
    let info = await getSuggest(data.word);
    if (info.result.allMatch) {
      data.suggestWord = info.result.allMatch;
      // info.result.allMatch.forEach((item: any) => {
      //   data.suggestWord.push(item.keyword.replace(data.word,`<span style="color: red">${data.word}</span>`))
      // });
    }
  }, 1000);
};

const onSearch = (i: string) => {
  if (i) {
    router.push({ path: "/searchResult", query: { word: i } });
  } else {
    router.push({ path: "/searchResult", query: { word: data.word } });
  }
};

// 清除搜索建议
const clearSearchSuggest = () => {
  data.suggestWord.splice(0);
};

// export default defineComponent({
//   name: "search",
//   setup: () => {

//     return {
//       suggest,
//       onSearch,
//       router,
//       clearSearchSuggest,
//       ...toRefs(data)
//     }
//   },
// })
</script>

<style lang="less" scoped>
.hot {
  padding: 8px;
  .title {
    font-size: 15px;
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 50%;
      display: flex;
      align-items: center;

      margin: 8px 0;
      .index {
        width: 22px;
        color: #ccc;
      }
      .three_color {
        color: red;
      }
      .three_text {
        font-weight: bold;
      }
      .img {
        width: 20px;
        // height: 20px;
        margin-left: 3px;
      }
    }
  }
}
.suggest {
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  .item {
    padding-left: 40px;
    padding-top: 8px;
    padding-bottom: 8px;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
  }
}
</style>
