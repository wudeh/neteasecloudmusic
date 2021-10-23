<template>
  <div>
    <div class="nav">
      <div class="back">
        <img src="../../../public/img/icons/left_arrow.svg" @click="router.go(-1)" />
      </div>
    </div>
    <video class="vid" webkit-playsinline playsinline x5-playsinline :src="url" controls></video>
    <div class="info">
      <van-tabs v-model:active="activeName" sticky>
        <van-tab title="简介" name="1">
          <div class="author">
            <van-image radius="50%" class="img" :src="avatarUrl" />
            <div class="detail">
              <span class="name">{{ nickname }}</span>
              <span class="fan" v-if="type == 5">{{ numFilter(fans) }}粉丝</span>
            </div>
            <div class="look">+ 关注</div>
          </div>
          <div class="vid_detail">
            <div class="title">{{ title }}</div>
            <div class="vid_count">
              <span class="playTime">播放量：{{ numFilter(playTime) }}&nbsp;&nbsp;</span>
              <span class="publishTime" v-if="type == 5">{{ sendTimeConversion(publishTime) }}</span>
              <span class="publishTime" v-else>{{ publishTime }}</span>
            </div>
            <div class="des">
              {{ description }}
            </div>
            <div class="count">
              <div class="count_item" v-if="praisedCount != 0">
                <img src="../../../public/img/icons/like_gray.svg" alt="" />
                <span>{{ praisedCount }}</span>
              </div>
              <div class="count_item">
                <img src="../../../public/img/icons/sub.svg" alt="" />
                <span>{{ subscribeCount }}</span>
              </div>
              <div class="count_item">
                <img src="../../../public/img/icons/share.svg" alt="" />
                <span>{{ shareCount }}</span>
              </div>
            </div>
            <div class="tag">
              <div class="item_tag" v-for="(it, i) in videoGroup" :key="i">{{ it.name }}</div>
            </div>
            <div class="related">
              <div class="item" v-for="(item, index) in videoRelated" :key="index" @click="vid = item.vid">
                <div class="left">
                  <van-image class="img" radius="8" :src="item.coverUrl" />
                  <img src="../../../public/img/icons/play_white.svg" alt="" />
                </div>
                <div class="info">
                  <div class="name">
                    {{ item.title }}
                  </div>
                  <span>{{ timeFilter(item.durationms) }}，by&nbsp;{{ item.creator[0].userName }}，{{ numFilter(item.playTime) }}播放</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab :title="`评论` + commentCount" name="2">
          <van-list v-model:loading="requestLoading" v-model:error="error" :finished="finish" :immediate-check="false" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="onLoad">
            <template v-slot:loading>
              <div style="display:flex;align-items:center;justify-content:center;">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <!-- 评论选择区 -->
            <van-sticky :offset-top="50">
              <div class="comment_choose">
                <div class="title">评论区</div>
                <div class="choose" v-show="!arrloading">
                  <span :class="{ choosed: sortType == 99 }" @click="change_sortType(99)">推荐</span>
                  <span :class="{ choosed: sortType == 2 }" @click="change_sortType(2)">最热</span>
                  <span :class="{ choosed: sortType == 3 }" @click="change_sortType(3)">最新</span>
                  <!-- <van-dropdown-menu >
                    <van-dropdown-item @change="change_sortType()" v-model="sortType" :options="sortTypeList" />
                  </van-dropdown-menu> -->
                </div>
              </div>
            </van-sticky>
            <!-- 评论区 -->
            <van-skeleton title avatar :row="3" :loading="arrloading">
              <div class="comment_area">
                <div class="comment_item" v-for="item in arr" :key="item.commentId">
                  <div class="avatar">
                    <van-image round width="30" height="30" :src="item.user.avatarUrl" />
                  </div>
                  <div class="info">
                    <div class="top">
                      <div class="top_left">
                        <div class="name">
                          {{ item.user.nickname }} &nbsp;
                          <span v-if="item.user.vipRights" style="display:flex;align-items: center">
                            <img src="../../../public/img/icons/1.png" alt="" />
                            <span v-if="item.user.vipRights.redVipLevel == 6" class="level">·陆</span>
                            <span v-if="item.user.vipRights.redVipLevel == 5" class="level">·伍</span>
                            <span v-if="item.user.vipRights.redVipLevel == 4" class="level">·肆</span>
                            <span v-if="item.user.vipRights.redVipLevel == 3" class="level">·仨</span>
                            <span v-if="item.user.vipRights.redVipLevel == 2" class="level">·贰</span>
                            <span v-if="item.user.vipRights.redVipLevel == 1" class="level">·一</span>
                          </span>
                        </div>
                        <div class="time">
                          <span class="time">{{ sendTimeConversion(item.time) }}</span>
                          <span v-if="item.tag.datas" style="margin: 0 2px">-</span>
                          <span class="tag" v-if="item.tag.datas">{{ item.tag.datas[0].text }}</span>
                        </div>
                      </div>
                      <div class="like_count">
                        <span class="count">{{ numFilter(item.likedCount) }}</span>
                        <img v-if="item.liked" src="../../../public/img/icons/liked.svg" alt="" />
                        <img v-else src="../../../public/img/icons/like_gray.svg" alt="" />
                      </div>
                    </div>
                    <div class="text">{{ item.content }}</div>
                    <div class="reply_count" @click="floorRequest(item, item.commentId)" v-if="item.showFloorComment.showReplyCount">{{ item.showFloorComment.replyCount }}条回复&nbsp;></div>
                  </div>
                </div>
              </div>
            </van-skeleton>
            <van-skeleton title avatar :row="3" :loading="arrloading" />
            <van-skeleton title avatar :row="3" :loading="arrloading" />
            <van-skeleton title avatar :row="3" :loading="arrloading" />
          </van-list>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 楼层弹出评论 -->
    <van-popup v-model:show="store.state.showFloor" closeable round @close="store.commit(`close`)" :close-on-popstate="true" close-icon-position="top-left" position="bottom" :style="{ height: '80%' }">
      <van-list v-model:loading="floorLoading" v-model:error="floorError" :immediate-check="true" :finished="floorFinish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="onLoadFloor">
        <template v-slot:loading>
          <div style="display:flex;align-items:center;justify-content:center;">
            <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
            <span>加载中...</span>
          </div>
        </template>
        <div class="floor">
          <div class="reply_count">回复({{ floorArr.length }})</div>
          <div class="comment_item floor_top">
            <div class="avatar">
              <van-image round width="30" height="30" :src="floorTopComment.user.avatarUrl" />
            </div>
            <div class="info">
              <div class="top">
                <div class="top_left">
                  <div class="name">{{ floorTopComment.user.nickname }}</div>
                  <div class="time">
                    <span class="time">{{ sendTimeConversion(floorTopComment.time) }}</span>
                    <!-- <span v-if="item.tag.datas" style="margin: 0 2px">-</span> -->
                    <!-- <span class="tag" v-if="item.tag.datas">{{ item.tag.datas[0].text }}</span> -->
                  </div>
                </div>
                <div class="like_count">
                  <span class="count">{{ numFilter(floorTopComment.likedCount) }}</span>
                  <img v-if="floorTopComment.liked" src="../../../public/img/icons/liked.svg" alt="" />
                  <img v-else src="../../../public/img/icons/like_gray.svg" alt="" />
                </div>
              </div>
              <div class="text">{{ floorTopComment.content }}</div>
            </div>
          </div>
          <div class="all_reply">全部回复</div>
          <div class="comment_item" v-for="item in floorArr" :key="item.commentId">
            <div class="avatar">
              <van-image round width="30" height="30" :src="item.user.avatarUrl" />
            </div>
            <div class="info">
              <div class="top">
                <div class="top_left">
                  <div class="name">
                    {{ item.user.nickname }} &nbsp;
                    <span v-if="item.user.vipRights" style="display:flex;align-items: center">
                      <img src="../../../public/img/icons/1.png" alt="" />
                      <span v-if="item.user.vipRights.redVipLevel == 6" class="level">·陆</span>
                      <span v-if="item.user.vipRights.redVipLevel == 5" class="level">·伍</span>
                      <span v-if="item.user.vipRights.redVipLevel == 4" class="level">·肆</span>
                      <span v-if="item.user.vipRights.redVipLevel == 3" class="level">·仨</span>
                      <span v-if="item.user.vipRights.redVipLevel == 2" class="level">·贰</span>
                      <span v-if="item.user.vipRights.redVipLevel == 1" class="level">·壹</span>
                    </span>
                  </div>
                  <div class="time">
                    <span class="time">{{ sendTimeConversion(item.time) }}</span>
                    <!-- <span v-if="item.tag.datas" style="margin: 0 2px">-</span> -->
                    <!-- <span class="tag" v-if="item.tag.datas">{{ item.tag.datas[0].text }}</span> -->
                  </div>
                </div>
                <div class="like_count">
                  <span class="count">{{ numFilter(item.likedCount) }}</span>
                  <img v-if="item.liked" src="../../../public/img/icons/liked.svg" alt="" />
                  <img v-else src="../../../public/img/icons/like_gray.svg" alt="" />
                </div>
              </div>
              <div class="text">{{ item.content }}</div>
              <div class="beReplied_item" v-if="item.beReplied[0].beRepliedCommentId != floorTopComment.commentId">
                <span class="beReplied_name">@{{ item.beReplied[0].user.nickname }}：</span>
                <span class="beReplied_content" v-if="item.beReplied[0].content">{{ item.beReplied[0].content }}</span>
                <span class="beReplied_content" v-else>该评论已删除</span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, toRefs, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { numFilter, sendTimeConversion, timeFilter, getDate } from "../../utils/num";
import { getComment, getSongInfo, getFloorComment, getPlayListDetail } from "../../api/song";
import { getUserDetail } from "../../api/user";
import { Toast } from "vant";
import { getVideoDetail, getVideoUrl, getVideoRelated, getMvUrl, getMvDetail, getArtistFans, getArtistDetail } from "../../api/video";
interface creator {
  vid: string;
  type: number;
  activeName: string;
  url: string;
  followed: boolean;
  userId: number | string;
  fans: number;
  nickname: string;
  avatarUrl: string;
  identityIconUrl: string;
  title: string;
  description: string;
  durationms: number;
  playTime: number;
  praisedCount: number;
  commentCount: number;
  shareCount: number;
  subscribeCount: number;
  publishTime: number;
  videoGroup: Array<any>; // 标签
  videoRelated: Array<any>; // 标签
  commentTotal: number;
  pageNo: number;
  floorPageNo: any;
  sortType: number;
  sortTypeName: string;
  sortTypeList: Array<any>;
  cursor: any; // 当sortType为3时且页数不是第一页时需传入,值为上一条数据的time
  arr: Array<any>;
  floorArr: Array<any>;
  floorTopComment: any;
  showFloor: boolean;
  floorLoading: boolean;
  floorFinish: boolean;
  floorError: boolean;
  imgloading: boolean;
  arrloading: boolean;
  requestLoading: boolean; // 请求是否完成
  error: boolean;
  finish: boolean; // 是否没有更多数据了
  haveFirstFloorPop: boolean
}
export default defineComponent({
  name: "vid",
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const vid: any = router.currentRoute.value.query.vid; //获取参数
    const data = reactive<creator>({
      vid: "",
      type: 5,
      activeName: "1",
      url: "",
      followed: false,
      userId: 0,
      fans: 0,
      nickname: "",
      avatarUrl: "",
      identityIconUrl: "",
      title: "",
      description: "",
      durationms: 0,
      playTime: 0,
      praisedCount: 0,
      commentCount: 0,
      shareCount: 0,
      subscribeCount: 0,
      publishTime: 0,
      videoGroup: [],
      videoRelated: [],
      commentTotal: 0,
      pageNo: 1,
      floorPageNo: 1,
      sortType: 99, // 99: 推荐排序，2：热度排序，3：时间最新排序
      sortTypeName: "",
      sortTypeList: [],
      cursor: "",
      arr: [],
      floorArr: [],
      floorTopComment: { user: { avatarUrl: "" } },
      floorLoading: false,
      floorError: false,
      floorFinish: false,
      showFloor: false,
      imgloading: true,
      arrloading: true,
      requestLoading: false,
      error: false,
      finish: false,
      haveFirstFloorPop: false // 是否已经弹出过楼层了，已经弹出过楼层就需要自己请求楼层的第一次评论
    });

    onBeforeMount(async () => {
      if (Number.isNaN(Number(vid))) {
        data.type = 5;
      } else {
        data.type = 1;
      }
      data.vid = vid;

      // init()

      data.arrloading = true;
      // 开始获取评论
      let info = await getComment(vid, data.type, data.pageNo, 20, data.sortType, data.cursor); // 默认按推荐排序
      data.arrloading = false;
      if (info.code == 400) {
        data.error = true;
        return;
      }
      data.commentCount = info.data.totalCount;
      data.arr = info.data.comments;
      if (info.data.cursor) data.cursor = info.data.cursor;
      info.data.sortTypeList.forEach((item: any, index: number) => {
        data.sortTypeList.push({
          text: item.sortTypeName,
          value: item.sortType,
        });
      });
      // data.sortType = data.sortTypeList[0].value;

      data.pageNo += 1;

      if (!info.data.hasMore) {
        data.finish = true;
      }
    });

    watch(
      () => data.vid,
      (value, pre) => {
        data.url = "";

        init();
      }
    );

    const init = async () => {
      data.videoGroup.splice(0);
      let info;

      if (data.type == 5) {
        info = await getVideoDetail(data.vid);
        data.vid = info.data.vid;
        data.followed = info.data.creator.followed;
        data.nickname = info.data.creator.nickname;
        data.userId = info.data.creator.userId;
        data.avatarUrl = info.data.creator.avatarUrl;
        data.identityIconUrl = info.data.creator.avatarDetail ? info.data.creator.avatarDetail.identityIconUrl : "";
        data.title = info.data.title;
        data.description = info.data.description;
        data.durationms = info.data.durationms;
        data.playTime = info.data.playTime;
        data.praisedCount = info.data.praisedCount;
        // data.commentCount = info.data.commentCount
        data.shareCount = info.data.shareCount;
        data.subscribeCount = info.data.subscribeCount;
        data.publishTime = info.data.publishTime;
        data.videoGroup = info.data.videoGroup;
      }
      if (data.type == 1) {
        info = await getMvDetail(data.vid);
        data.url = info.data.url;
        data.vid = info.data.id;
        data.followed = info.data.artists[0].followed;
        data.nickname = info.data.artistName;
        data.userId = info.data.artistId;
        // data.avatarUrl = info.data.cover
        // data.identityIconUrl = info.data.avatarDetail ? info.data.creator.avatarDetail.identityIconUrl : ''
        data.title = info.data.briefDesc;
        data.description = info.data.desc;
        data.durationms = info.data.duration;
        data.playTime = info.data.playCount;
        data.praisedCount = info.data.praisedCount || 0;
        data.commentCount = info.data.commentCount;
        data.shareCount = info.data.shareCount;
        data.subscribeCount = info.data.subCount;
        data.publishTime = info.data.publishTime;
        data.videoGroup = info.data.videoGroup;
      }

      if (data.type == 5) {
        info = await getVideoUrl(data.vid);
        data.url = info.urls[0].url;
        if (info.urls[0].needPay) {
          Toast(`当前视频需付费观看`);
        }

        // 获取用户详情，用来获取粉丝量
        info = await getUserDetail(data.userId);
        data.fans = info.profile.followeds;
      }

      if (data.type == 1) {
        info = await getMvUrl(data.vid);
        data.url = info.data.url;
        // 获取歌手信息
        info = await getArtistDetail(data.userId);
        data.avatarUrl = info.data.artist.cover;
        // 获取歌手粉丝量
        // info = await getArtistFans(data.userId)
      }

      // 获取相关视频
      info = await getVideoRelated(data.vid);
      data.videoRelated = info.data;
    };

    // 获取楼层评论
    const floorRequest = async (topComment: any, parentCommentId: number) => {
      console.log('弹出楼层');
      
      data.floorTopComment = topComment;
      data.floorLoading = true;
      store.commit("set_floor_comment", true);
      data.floorArr = [];
      data.floorFinish = false;
      data.floorPageNo = 0;
      // 如果设置了:immediate-check="true"，第一次弹出楼层，组件会自己检查发一次请求；所以如果不是第一次的话，再弹出楼层评论就需要自己发第一次请求了
      if(data.haveFirstFloorPop) {
        let info = await getFloorComment(vid, parentCommentId, data.type, data.floorPageNo);
        data.floorLoading = false;
        if (info.code == 400) {
          data.floorError = true;
          return;
        }
        data.floorArr = info.data.comments;
        if(data.floorArr.length) {
          data.floorPageNo = data.floorArr[data.floorArr.length - 1].time;
        }
        
        if (!info.data.hasMore) {
          data.floorFinish = true;
        }
      }
      
    };

    // 加载更多楼层评论
    const onLoadFloor = async () => {
      data.floorError = false;
      data.floorLoading = true;
      // 触发了加载更多楼层评论方法说明已经弹出过一次楼层了
      if(!data.haveFirstFloorPop) data.haveFirstFloorPop = true;
      let info = await getFloorComment(vid, data.floorTopComment.commentId, data.type, data.floorPageNo);
      data.floorLoading = false;
      if (info.code == 400) {
        data.floorError = true;
        return;
      }
      data.floorArr = data.floorArr.concat(info.data.comments);
      data.floorLoading = false;
      if(data.floorArr.length) {
          data.floorPageNo = data.floorArr[data.floorArr.length - 1].time;
        }
      if (!info.data.hasMore) {
        data.floorFinish = true;
      }
    };

    // 加载更多评论
    const onLoad = async () => {
      data.error = false;
      data.requestLoading = true;
      let info = await getComment(vid, data.type, data.pageNo, 20, data.sortType, data.cursor);
      data.arrloading = false;
      data.requestLoading = false;
      if (info.code == 400) {
        data.error = true;
        return;
      }
      data.commentCount = info.data.totalCount;
      data.cursor = info.data.cursor;
      data.arr = data.arr.concat(info.data.comments);
      data.arrloading = false;
      data.pageNo += 1;
      if (!info.data.hasMore || data.arr.length >= info.data.totalCount) {
        data.finish = true;
      }
    };

    const change_sortType = async (index: any) => {
      data.sortType = index;
      data.finish = false;
      data.pageNo = 1;
      data.arr = [];
      data.cursor = '';
      onLoad();
    };

    return {
      store,
      router,
      numFilter,
      timeFilter,
      getDate,
      change_sortType,
      floorRequest,
      onLoad,
      onLoadFloor,
      sendTimeConversion,
      ...toRefs(data),
    };
  },
});
</script>

<style lang="less" scoped>
.nav {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  padding: 10px;
  box-sizing: border-box;
  width: 100vw;
  height: 50px;
  // background-color: red;
  z-index: 2222;
  .back {
    position: absolute;
    z-index: 1111;
    img {
      width: 25px;
    }
  }
}
.vid {
  width: 100vw;
  height: 210px;
}
.info {
  background-color: #fff;
  .author {
    // display: flex;
    // align-items: center;
    height: 56px;
    box-sizing: border-box;
    padding: 8px;
    .img {
      float: left;
      width: 40px;
      margin-right: 8px;
    }
    .detail {
      float: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 10px;
      transition: all 0.3s;
      white-space: nowrap;
      .fan {
        color: #ccc;
        font-size: 12px;
      }
    }
    .look {
      float: right;
      height: 20px;
      padding: 2px;
      font-size: 14px;
      border-radius: 8px;
      color: orange;
      border: 1px solid orange;
      white-space: nowrap;
    }
  }
  .vid_detail {
    padding: 8px;
    .title {
      min-height: 20px;
      transition: all 0.5s;
    }
    .vid_count {
      font-size: 12px;
      color: #ccc;
      min-height: 10px;
      transition: all 0.3s;
      margin-bottom: 8px;
    }
    .des {
      font-size: 12px;
      color: #ccc;
      margin-bottom: 10px;
      min-height: 10px;
      transition: all 0.3s;
    }
    .count {
      display: flex;
      justify-content: space-around;
      margin-bottom: 10px;
      .count_item {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 14px;
        img {
          width: 30px;
        }
      }
    }
    .tag {
      display: flex;
      flex-wrap: wrap;
      .item_tag {
        padding: 4px;
        line-height: 20px;
        background-color: rgba(0, 0, 0, 0.1);
        margin-right: 8px;
        margin-bottom: 8px;
        border-radius: 10px;
      }
    }
    .playList {
      padding: 8px;
      border-radius: 8px;
      background-color: #fff;
      margin-bottom: 10px;
      .title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .item {
        display: flex;
        .left {
          .img {
            width: 45px;
            height: 45px;
            border-radius: 8px;
          }
        }
        .info {
          display: flex;
          flex-direction: column;
          color: #ccc;
          margin-left: 6px;
          width: 280px;
          .name {
            color: black;
          }
          span {
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .related {
      .playList;
      padding: 8px;
      border-radius: 8px;
      background-color: #fff;
      margin-bottom: 10px;
      .item {
        .left {
          position: relative;
          .img {
            width: 100px;
            height: 60px;
          }
          img {
            width: 20px;
            height: 20px;
            opacity: 0.5;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .info {
          width: 100%;
          justify-content: space-around;
          .name {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
        }
      }
    }
  }
}

.comment_choose {
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  height: 30px;
  .van-dropdown-menu__bar {
    height: auto !important;
    box-shadow: 0;
    background-color: red;
  }
  .choose {
    width: 120px;
    display: flex;
    justify-content: space-around;
    color: #ccc;
    white-space: nowrap;
    .choosed {
      color: black;
    }
  }
}

.comment_area {
  background-color: #fff;
  .comment_item {
    padding: 8px;
    display: flex;
    .avatar {
      padding-right: 8px;
    }
    .info {
      font-size: 14px;
      width: 100%;
      padding-bottom: 3px;
      border-bottom: 1px solid #ccc;
      color: #646464;
      .top {
        display: flex;
        justify-content: space-between;
        .top_left {
          .name {
            display: flex;
            img {
              height: 16px;
            }
            .level {
              height: 16px;
              font-size: 12px;
              font-weight: bold;
              color: rgb(244, 218, 214);
              background-color: black;
              margin-left: -2px;
              border-top-right-radius: 3px;
              border-bottom-right-radius: 3px;
              padding-right: 3px;
              filter: blur(0.4px);
            }
          }
          .time {
            font-size: 12px;
            color: #ccc;
          }
          .tag {
            .time;
          }
        }
        .like_count {
          span {
            margin-right: 2px;
          }
        }
      }
      .text {
        margin: 3px 0;
      }
      .reply_count {
        color: rgb(0, 153, 255);
      }
    }
  }
}
.floor {
  .comment_area;
  background-color: rgba(0, 0, 0, 0.1);
  .reply_count {
    height: 52px;
    line-height: 52px;
    // font-size: 18px;
    padding-left: 50px;
    background-color: #fff;
  }
  .all_reply {
    .reply_count;
  }
  .floor_top {
    margin-bottom: 8px;
  }
  .comment_item {
    background-color: #fff;
    .avatar {
      padding-left: 1vw;
    }
  }
  .beReplied_item {
    padding: 8px;
    background-color: #fff;
    .beReplied_name {
      color: rgb(0, 153, 255);
    }
    .beReplied_content {
      color: #ccc;
    }
  }
}
:deep(.van-dropdown-menu__bar) {
  box-shadow: 0 0 0 0;
  height: auto;
}

:deep(.van-popup__close-icon--top-left) {
  left: 3.0667vw;
}
</style>
