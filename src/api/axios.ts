import axios from "axios";
import { Toast } from "vant";
//  import router from '../router'

axios.defaults.baseURL =
  process.env.NODE_ENV == "development"
    ? "https://netease-cloud-music-api-jet.vercel.app/"
    : "https://netease-cloud-music-api-jet.vercel.app/";
axios.defaults.withCredentials = true;

// axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
//  axios.defaults.headers['token'] = localStorage.getItem('token') || ''
// axios.defaults.headers.post["Content-Type"] = "application/json";

// 请求拦截
axios.interceptors.request.use((config) => {
  console.log("请求拦截");
  console.log(config);
  if (!config.url?.startsWith("https")) {
    // 加上时间戳
    const timestamp = new Date().getTime();
    if (config.url?.indexOf("?") != -1) {
      config.url = config.url + `&timestamp=${timestamp}`;
    } else {
      config.url = config.url + `?timestamp=${timestamp}`;
    }
    config.data = Object.assign({}, config.data);
    config.data.timestamp = timestamp;
    // // 手动传cookie
    const cookieDD = localStorage.getItem("cookieMusic");
    if (cookieDD) {
      const cookieEncode = encodeURIComponent(cookieDD);
      if (config.method == "get") {
        config.url = config.url + `?cookie=${cookieEncode}`;
      }
      config.data.cookie = cookieEncode;
    }

    // config.data.token = localStorage.getItem("tokenMusic");
  }

  return config;
});

//  响应拦截
axios.interceptors.response.use(
  (res) => {
    console.log("响应拦截");
    console.log(res);
    if (res.data.code == "301") {
      Toast("登录已过期");
      localStorage.removeItem("cookieMusic");
      localStorage.removeItem("tokenMusic");
    }
    return res.data;
  },
  (error) => {
    // 获取错误状态码
    // const { status } = error.response;
    console.log("拦截到错误");
    console.log(error);
    return Promise.reject(error);
  }
);

export default axios;
