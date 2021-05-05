import axios from "./axios";

// 获取歌单数据
export function getSongListInfo(id:string): any {
  return axios.post("/playlist/detail",{id});
}

// 获取歌曲URL
export function getSongUrl(id: string): any {
  return axios.post("/song/url",{id,realIP:'116.25.146.177'});
}


// 获取歌曲信息
export function getSongInfo(ids: string): any {
  return axios.post("/song/detail",{ids});
}

// 获取歌词
export function getLyric(id: string): any {
  return axios.post("/lyric",{id});
}