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

// 获取歌曲评论
/**
 * 
 * @param id 音乐 id
 * @param limit 取出评论数量 , 默认为 20
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 * @returns 
 */
export function getSongComment(id: string,limit=20,offset?: number,before?: any): any {
  return axios.post("/comment/music",{id,limit,offset,before});
}