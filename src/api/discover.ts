import axios from "./axios";

// 首页数据
export function getDiscoverInfo(cursor: any): any {
  // return axios.get("/homepage/block/page");
  return axios.post("/homepage/block/page",{cursor});
}

// 首页圆形图标数据
export function getIconInfo(): any {
  return axios.get("/homepage/dragon/ball");
}
