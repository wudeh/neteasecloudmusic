import { createApp } from "vue";
import App from "./App.vue";
// import "./registerServiceWorker";
import router from "./router";
import songStore from "./store/index";
import { createPinia } from "pinia"
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



// 注册一个全局自定义指令 用来替换关键搜索词颜色的指令
app.directive('word',{

  mounted(el, binding){
    // 可能有多个关键词，所有转成数组来循环替换
    let arr = binding.value.split(' ');

    arr.forEach((item: String) => {
      if(item) {
        el.innerHTML =  el.innerHTML.replaceAll(item, `<span style='color:rgb(0, 153, 255)'>${item}</span>`)
      }
    });
  }

  
  
  
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
app.use(createPinia()).use(router).mount("#app");
