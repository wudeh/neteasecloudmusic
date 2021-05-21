<template>
  <div :class="name" style="width: 100%; height: 100%">
    <div :class="{scrollDiv: props.scrollX}">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import BScroll from "@better-scroll/core";
import {
  defineComponent,
  reactive,
  onMounted,
  onUpdated,
  nextTick,
  watch,
  onBeforeUnmount,
  toRefs,
  PropType,
} from "vue";
interface info {
  bs: any;
}
export default defineComponent({
  name: "scroll",
  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1,
    },
    name: {
      type: String as PropType<string>,
      default: "scroll-wrapper",
    },
    // 点击列表是否派发click事件
    click: {
      type: Boolean,
      default: true,
    },
    // 是否开启横向滚动
    scrollX: {
      type: Boolean,
      default: false,
    },
    // 是否开启纵向滚动
    scrollY: {
      type: Boolean,
      default: false,
    },
    // 是否派发滚动事件
    listenScroll: {
      type: Boolean,
      default: false,
    },
    // 列表的数据
    scrollData: {
      type: Array,
      default: [],
    },
    // 是否派发滚动到底部的事件，用于上拉加载
    pullup: {
      type: Boolean,
      default: false,
    },
    // 是否派发顶部下拉的事件，用于下拉刷新
    pulldown: {
      type: Boolean,
      default: false,
    },
    // 是否派发列表滚动开始的事件
    beforeScroll: {
      type: Boolean,
      default: false,
    },
    // 当数据更新后，刷新scroll的延时
    refreshDelay: {
      type: Number,
      default: 20,
    },
  },
  setup(props) {
    let data: info = reactive({
      bs: "",
    });
    function initScroll() {
      data.bs = new BScroll("." + props.name, {
        probeType: 3,
        click: false,
        scrollX: props.scrollX,
        scrollY: props.scrollY,
        preventDefault: false,
        // pullDownRefresh: true
        disableMouse: true,
        disableTouch: false,
        // eventPassthrough: "vertical",
      });

      // console.log(props.scrollX);
      // data.bs.on("scrollEnd", () => {

      // })
    }

    // watch(
    //   () => props.scrollData.length,
    //   () => {
    //     nextTick(() => {
    //       data.bs.refresh();
    //       console.log("数据改变了");
          
    //     });
    //   }
    // );

    onMounted(() => {
      // 在 DOM 渲染完毕后初始化 better-scroll
      initScroll();
      // data.bs.on("pullingDown",() => {
      //   console.log("下拉了");
        
      // })
    });

    // onBeforeUnmount(() => {
    //   window.removeEventListener("resize", () => {
    //     data.bs.refresh();
    //   });
    // });

    // onUpdated(() => {
    //   data.bs.refresh();
    //   console.log("再次计算滚动距离");
    // });

    return {
      initScroll,
      props,
      ...toRefs(data),
    };
  },
});
</script>

<style lang="less" scoped>
.scrollDiv {
  display: inline-block;
}
</style>
