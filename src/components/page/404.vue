<template>
  <div class="bg">
    <div>谁派你来的</div>
    <div>你为什么要这么做</div>
    <div>你的目的是什么</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent ({
  name: '404'
})
</script>


<style lang="less">
  .bg {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>