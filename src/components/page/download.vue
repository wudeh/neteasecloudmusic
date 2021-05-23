<template>
  <div>
    <div class="nav">
      <div class="back" @click="router.go(-1)">
        <img src="../../../public/img/icons/left_arrow_black.svg" alt="">
      </div>
      <div class="title">下载页面</div>
    </div>
    <div class="info">
      <div class="item" v-for="(it,i) in store.state.download_list" :key="i">
        <div class="text">
          <span class="name">{{ it.name }}</span>
          <span class="middle">-</span>
          <span>{{ it.author }}</span>
        </div>
        <div class="progress">
          <van-progress stroke-width="10" :percentage="it.progress" />
        </div>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useStore } from "vuex"
  import { useRouter } from "vue-router"

  export default defineComponent({
    name: "download",
    setup: () => {
      const store = useStore();
      const router = useRouter();
      
      return {
        store,
        router
      }
    }
  })
</script>

<style lang="less" scoped>
.nav {
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
.info {
  min-height: 545px;
  background-color: #fff;
  padding: 10px;
  .item {
    color: #ccc;
    font-size: 12px;
    .text {
      margin-bottom: 10px;
      .name {
      color: black;
      font-size: 18px;
      }
      .middle {
        margin: 0 2px;
      }
    }
    .progress {
      width: 330px;
    }
  }
}

</style>