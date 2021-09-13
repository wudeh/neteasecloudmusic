import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import {
  Button,
  Tabbar,
  TabbarItem,
  Icon,
  Swipe,
  SwipeItem,
  Toast,
  Image as VanImage,
} from "vant";
import Vant from "vant";
import { Lazyload } from 'vant';
import "vant/lib/index.css";

const app = createApp(App);

router.beforeEach((to, from, next) => {

  if(to.name == `Home` && from.name ) {
    // console.log(`不能回到Home`);
    
    store.commit("close")
    return next(false)
  }
  if(to.name == `Home`) {
    // console.log(`home重定向`);
    
    store.commit("close")
    return next(`/discover`)
  }
  if(from.name == `searchResult` && to.name == `comment`) {
    store.commit("close")
    // next()
  }else if(store.state.showPop) {
    // console.log("当前有弹出框禁止后退");
    
    store.commit("close")
    return next(false)
  }
  
  next()
})

router.afterEach(() => {
  
})

// 注册一个全局自定义指令 用来替换关键搜索词颜色的指令
app.directive('word',(el,binding) => {

  // 可能有多个关键词，所有转成数组来循环替换
  let arr = binding.value.split(' ');

  arr.forEach((item: String) => {
    if(item) {
      el.innerHTML =  el.innerHTML.replaceAll(item, `<span style='color:rgb(0, 153, 255)'>${item}</span>`)
    }
  });
  
  
})
// app.use(Tabbar);
// app.use(TabbarItem);
// app.use(Icon);
// app.use(Swipe);
// app.use(SwipeItem);
// app.use(VanImage);
// app.use(VanImage);
// app.use(Toast);
app.use(Lazyload);
app.use(Vant);
app.use(store).use(router).mount("#app");
