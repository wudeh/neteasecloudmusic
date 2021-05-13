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
import "vant/lib/index.css";

const app = createApp(App);

router.beforeEach((to, from, next) => {
  if(store.state.showPop) {
    console.log("当前有弹出框禁止后退");
    
    store.commit("close")
    return next(false)
  }
  next()
})

// 注册一个全局自定义指令 用来替换关键搜索词颜色的指令
app.directive('word',(el,binding) => {
  
  el.innerHTML =  el.innerHTML.replace(binding.value, `<span style='color:rgb(0, 153, 255)'>${binding.value}</span>`)
})
// app.use(Tabbar);
// app.use(TabbarItem);
// app.use(Icon);
// app.use(Swipe);
// app.use(SwipeItem);
// app.use(VanImage);
// app.use(VanImage);
// app.use(Toast);
app.use(Vant);
app.use(store).use(router).mount("#app");
