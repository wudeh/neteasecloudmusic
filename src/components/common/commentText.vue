<template>
<div class="text-box">
    <div :class="['txt', { 'over-hidden': !unfold }]" ref="textBox">
      <span ref="spanBox">{{content}}</span>
    </div>
    <div class="btn" v-if="ifOver" @click="unfold = !unfold">{{unfold ? '收起' : '展开'}}</div>
</div>

</template>

<script lang="ts" setup>
import { onMounted, ref, watch, nextTick } from "vue";


const props = defineProps({ 
    content: {
        type: String as () => String, // 传进来的文本
        required: true, 
        default: () => "这是一个测试的标题的例子，这是一个测试的标题的例子，这是一个测试的标题的例子这是一个测试的标题的例子，这是一个测试的标题的例子，这是一个测试的标题的例子这是一个测试的标题的例子，这是一个测试的标题的例子，这是一个测试的标题的例子" 
    } 
});


// 显示展开还是收起
let changeButton = ref<boolean>(true)

let ifOver = ref<boolean>(false); // 文本是否超出三行，默认否
let unfold = ref<boolean>(false); // 文本是否是展开状态 默认为收起

let spanBox = ref()
let textBox = ref()

onMounted(() => {
  ifOver.value = spanBox.value.offsetHeight > textBox.value.offsetHeight
})

</script>
<style scoped>
.txt {
  font-size: 14px;
  color: #646464;
  margin-bottom: 5px;
}
.over-hidden {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.btn {
  color: #0099ff;
}
</style>
