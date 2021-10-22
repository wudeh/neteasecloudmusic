import axios from "./axios";

// 获取歌单数据
export function getSongListInfo(id:string): any {
  return axios.post("/playlist/detail",{id});
}

// 获取歌曲URL
export function getSongUrl(id: string): any {
  return axios.post("/song/url",{id,realIP:'116.25.146.177'});
  // return axios.post("/song/url",{id});
}


// 获取歌曲信息
export function getSongInfo(ids: string): any {
  return axios.post("/song/detail",{ids});
}

// 获取歌词
export function getLyric(id: string): any {
  // return axios.post("/lyric",{id});
  return axios.get(`/lyric?id=${id}&timestamp=${new Date().getTime()}`)
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

// 获取评论
/**
 * 
 * @param id 资源id
 * @param type 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
 * @param pageNo 分页参数,第N页,默认为1
 * @param pageSize 分页参数,每页多少条数据,默认20
 * @param sortType 排序方式,1:按推荐排序,2:按热度排序,3:按时间排序
 * @param cursor 当sortType为3时且页数不是第一页时需传入,值为上一条数据的time
 * @returns 
 */
export function getComment(id: number | string,type: number,pageNo: number,pageSize=20,sortType: number,cursor?: any): any {
  // if(sortType == 3) {
    if(cursor) {
      return axios.get(`/comment/new?id=${id}&type=${type}&pageNo=${pageNo}&pageSize=${pageSize}&sortType=${sortType}&cursor=${cursor}`);
    }else {
      return axios.get(`/comment/new?id=${id}&type=${type}&pageNo=${pageNo}&pageSize=${pageSize}&sortType=${sortType}`);
    }
  // }else {
  //   return axios.get(`/comment/new?id=${id}&type=${type}&pageNo=${pageNo}&pageSize=${pageSize}&sortType=${sortType}`);
  // }
  // return axios.get(`/comment/new?id=${id}&type=${type}&pageNo=${pageNo}&pageSize=${pageSize}&sortType=${sortType}&cursor=${cursor}`,{id,type,pageNo,pageSize,sortType,cursor});
  
}

// 获取楼层评论
/**
 * 
 * @param id 资源id
 * @param parentCommentId 楼层评论 id
 * @param tpye 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
 * @param time 分页参数,取上一页最后一项的 time 获取下一页数据
 * @param limit 取出评论数量 , 默认为 20
 * @returns 
 */
export function getFloorComment(id: number | string,parentCommentId: number,type: number,time?: any,limit?:number): any {
  // return axios.post("/comment/floor",{id,parentCommentId,type,time,limit});
  return axios.get(`/comment/floor?parentCommentId=${parentCommentId}&id=${id}&type=${type}&time=${time}`);
}

/**
 * 
 * @param rid 获取电台信息
 * @returns 
 */
export function getDjDetail(rid: number): any {
  return axios.get(`/dj/detail?rid=${rid}`);
}
/**
 * 获取电台节目
 * @param rid 
 * @param limit 返回数量 , 默认为 30
 * @param offset 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param asc 排序方式,默认为 false (新 => 老 ) 设置 true 可改为 老 => 新
 * @returns 
 */
export function getDjProgram(rid: number,asc=false,limit=999,offset=0): any {
  return axios.get(`/dj/program?rid=${rid}&limit=${limit}&asc=${asc}`);
}


export function getPlayListDetail(id: number): any {
  return axios.get(`/playlist/detail?id=${id}`);
}

// 专辑详情
export function getAlbumDetail(id: number): any {
  return axios.get(`/album?id=${id}`);
}

// 歌手排行榜
export function getTopList(type: number): any {
  return axios.get(`/toplist/artist?type=${type}`);
}