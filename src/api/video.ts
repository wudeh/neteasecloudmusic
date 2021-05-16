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