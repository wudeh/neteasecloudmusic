import axios from "./axios";

// 首页数据
export function getDiscoverInfo(cursor: any): any {
  // return axios.get("/homepage/block/page");
  return axios.post("/homepage/block/page", { cursor });
}

// 首页圆形图标数据
export function getIconInfo(): any {
  return axios.get("/homepage/dragon/ball");
}

// 首页默认搜索词
export function getSearchWord(): any {
  return axios.get("/search/default");
}

// 首页推荐歌单
export function getRecommendSongList(): Promise<any> {
  return axios.get("/personalized");
}


// 首页轮播图
export function getSwiperInfo(): Promise<any> {
  return axios.get("/banner?type=1");
}

// 热搜
export function getSearchHot(): any {
  return axios.get("/search/hot/detail");
}

// 搜索建议

export function getSuggest(word: string): any {
  return axios.get(`/search/suggest?keywords=${word}&type=mobile`);
}

// 搜索

/**
 *
 * @param keywords 关键词
 * @param type 搜索种类
 * @param offset 分页
 * @param limit 返回数量
 * @returns
 */
export function getsearchResult(keywords: string, type = 1, offset = 0, limit = 20): any {
  // if(type == 1) {
  //   return axios.post(`/search`,{ keywords, type, offset: offset*limit, limit});
  // }else {
  //   return axios.post(`/search`,{ keywords, type, offset: offset*limit, limit});
  // }
  if (type == 1) {
    return axios.get(`/cloudsearch?keywords=${keywords}&type=${type}&offset=${offset * limit}&limit=${limit}`);
  } else {
    return axios.get(`/search?keywords=${keywords}&type=${type}&offset=${offset * limit}&limit=${limit}`);
  }
}

// 排行榜
export function getRank(): any {
  return axios.get(`/toplist/detail`);
}
