import axios from "./axios";

// 获取视频播放地址
export function getVideoUrl(id:string): any {
  return axios.get(`/video/url?id=${id}`);
}


// 获取视频详情
export function getVideoDetail(id:string): any {
  return axios.get(`/video/detail?id=${id}`);
}

// 相关视频
export function getVideoRelated(id:string): any {
  return axios.get(`/related/allvideo?id=${id}`);
}

// 视频推荐评论
export function getVideoComment(id:string,offset=0, limit=20, before: any): any {
  return axios.get(`/comment/video?id=${id}&limit=${limit}&offset=${limit * offset}&before=${before}`);
}

// 视频热门评论
export function getVideoCommentHot(id:string,type: number,offset=0, limit=20, before: any): any {
  return axios.get(`/comment/hot?id=${id}&type=${type}&limit=${limit}&offset=${limit * offset}&before=${before}`);
}

// mv 地址
export function getMvUrl(id:string | number,): any {
  return axios.get(`/mv/url?id=${id}`);
}


// MV 信息

export function getMvDetail(id:string | number,): any {
  return axios.get(`/mv/detail?mvid=${id}`);
}