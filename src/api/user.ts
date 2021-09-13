import axios from "./axios";

// 手机加密码登录
export function loginByPhoneAndPassword(): any {
  return axios.get("/login/cellphone?phone=&password=");
}

// 退出登录
export function logout(): any {
  document.cookie = '';
  return axios.get("/logout");
}

// 检查登录状态
export function loginStatus(): any {
  document.cookie = '';
  return axios.post("/login/status");
}

// 用户详情
export function getUserDetail(uid: any): any {
  return axios.post(`/user/detail?uid=${uid}`);
}


// 最近联系人
export function recentcontact(): any {
  return axios.post("/msg/private");
}

// 歌手信息
export function singerInfo(id: number): any {
  return axios.post(`/artist/detail?id=${id}`);
}
