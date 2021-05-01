import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
// import {
//   Button,
//   Tabbar,
//   TabbarItem,
//   Icon,
//   Swipe,
//   SwipeItem,
//   Image as VanImage,
// } from "vant";
import Vant from "vant";
import "vant/lib/index.css";

const app = createApp(App);
// app.use(Tabbar);
// app.use(TabbarItem);
// app.use(Icon);
// app.use(Swipe);
// app.use(SwipeItem);
// app.use(VanImage);
app.use(Vant);
app.use(store).use(router).mount("#app");
