<template>
  <div>
    <van-list v-model:loading="data.requestLoading" v-model:error="data.error" :finished="data.finish" :immediate-check="false" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="onLoad">
      <template v-slot:loading>
        <div style="display: flex; align-items: center; justify-content: center">
          <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
          <span>加载中...</span>
        </div>
      </template>

      <!-- 导航 -->
      <van-sticky>
        <div class="navSongList">
          <div class="back" @click="router.go(-1)">
            <img src="../../../public/img/icons/left_arrow_black.svg" alt="" />
          </div>
          <div class="comment_count">评论({{ data.commentTotal }})</div>
        </div>
      </van-sticky>
      <!-- 音乐信息 -->
      <div class="song_info">
        <div class="img">
          <van-image radius="8" class="song_img" :src="data.img" />
        </div>
        <van-skeleton title :row="3" :loading="data.name == ``" />
        <div class="info" v-if="data.name">
          <div class="title">{{ data.name }}</div>
          <div v-if="type == 2" class="singer"><span style="color: black">by&nbsp;</span>{{ data.singer }}</div>
          <div v-else class="singer">
            <span style="color: black">by&nbsp;</span>
            <span  v-for="(item,index) in data.singerInfo" :key="item.id" style="color: black" @click="goSingerDetail(item.id)">{{ item.name }}<span v-if="index < data.singerInfo.length - 1">/</span></span>
          </div>
        </div>
      </div>
      <!-- </van-skeleton> -->
      <!-- 评论选择区 -->
      <van-sticky :offset-top="50">
        <div class="comment_choose">
          <div class="title">评论区</div>
          <div class="choose" v-show="!data.arrloading">
            <!-- <span :class="{choosed: sortType == 1}" @click="change_sortType(1)">推荐</span> -->
            <span :class="{ choosed: data.sortType == 2 }" @click="change_sortType(2)">最热</span>
            <span :class="{ choosed: data.sortType == 3 }" @click="change_sortType(3)">最新</span>
            <!-- <van-dropdown-menu >
            <van-dropdown-item @change="change_sortType()" v-model="sortType" :options="sortTypeList" />
          </van-dropdown-menu> -->
          </div>
        </div>
      </van-sticky>
      <!-- 评论区 -->
      <van-skeleton title avatar :row="3" :loading="data.arrloading">
        <div class="comment_area">
          <div class="comment_item" v-for="item in data.arr" :key="item.commentId">
            <div class="avatar">
              <van-image round width="30" height="30" :src="item.user.avatarUrl" />
            </div>
            <div class="info">
              <div class="top">
                <div class="top_left">
                  <div class="name">
                    {{ item.user.nickname }} &nbsp;
                    <span v-if="item.user.vipRights" style="display: flex; align-items: center">
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
                    <span class="tag" v-if="item.tag.datas != null && item.tag.datas.length">{{ item.tag.datas[0].text }}</span>
                  </div>
                </div>
                <div class="like_count">
                  <span class="count">{{ numFilter(item.likedCount) }}</span>
                  <img v-if="item.liked" src="../../../public/img/icons/liked.svg" alt="" />
                  <img v-else src="../../../public/img/icons/like_gray.svg" alt="" />
                </div>
              </div>
              <!-- <div class="text">{{ item.content }}</div> -->
              <comment-text :content="item.content"></comment-text>
              <div class="reply_count" @click="floorRequest(item, item.commentId)" v-if="item.showFloorComment.showReplyCount">{{ item.showFloorComment.replyCount }}条回复&nbsp;></div>
            </div>
          </div>
        </div>
      </van-skeleton>
      <van-skeleton title avatar :row="3" :loading="data.arrloading" />
      <van-skeleton title avatar :row="3" :loading="data.arrloading" />
      <van-skeleton title avatar :row="3" :loading="data.arrloading" />
    </van-list>

    <!-- 楼层弹出评论 -->
    <van-popup v-model:show="store.showFloor" closeable round @close="store.close()" :close-on-popstate="true" close-icon-position="top-left" position="bottom" :style="{ height: '80%' }">
      <van-list v-model:loading="data.floorLoading" v-model:error="data.floorError" :immediate-check="true" :finished="data.floorFinish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="onLoadFloor">
        <template v-slot:loading>
          <div style="display: flex; align-items: center; justify-content: center">
            <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
            <span>加载中...</span>
          </div>
        </template>
        <div class="floor">
          <div class="reply_count">回复({{ data.floorArr.length }})</div>
          <div class="comment_item floor_top">
            <div class="avatar">
              <van-image round width="30" height="30" :src="data.floorTopComment.user.avatarUrl" />
            </div>
            <div class="info">
              <div class="top">
                <div class="top_left">
                  <div class="name">{{ data.floorTopComment.user.nickname }}</div>
                  <div class="time">
                    <span class="time">{{ sendTimeConversion(data.floorTopComment.time) }}</span>
                    <!-- <span v-if="item.tag.datas" style="margin: 0 2px">-</span> -->
                    <!-- <span class="tag" v-if="item.tag.datas">{{ item.tag.datas[0].text }}</span> -->
                  </div>
                </div>
                <div class="like_count">
                  <span class="count">{{ numFilter(data.floorTopComment.likedCount) }}</span>
                  <img v-if="data.floorTopComment.liked" src="../../../public/img/icons/liked.svg" alt="" />
                  <img v-else src="../../../public/img/icons/like_gray.svg" alt="" />
                </div>
              </div>
              <!-- <div class="text">{{ data.floorTopComment.content }}</div> -->
              <comment-text :content="data.floorTopComment.content"></comment-text>
            </div>
          </div>
          <div class="all_reply">全部回复</div>
          <div class="comment_item" v-for="item in data.floorArr" :key="item.commentId">
            <div class="avatar">
              <van-image round width="30" height="30" :src="item.user.avatarUrl" />
            </div>
            <div class="info">
              <div class="top">
                <div class="top_left">
                  <div class="name">
                    {{ item.user.nickname }} &nbsp;
                    <span v-if="item.user.vipRights" style="display: flex; align-items: center">
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
              <!-- <div class="text">{{ item.content }}</div> -->
              <comment-text :content="item.content"></comment-text>
              <div class="beReplied_item" v-if="item.beReplied.length && item.beReplied[0].beRepliedCommentId != data.floorTopComment.commentId">
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
export default {
  name: "comment"
}
</script>
<script lang="ts" setup>
import { defineComponent, onMounted, reactive, onBeforeMount, toRefs } from "vue";
import { getComment, getSongInfo, getFloorComment, getPlayListDetail } from "../../api/song";
import { useRouter } from "vue-router";
import { sendTimeConversion, numFilter } from "../../utils/num";
import songStore from "../../store";
import { Toast } from "vant";
import commentText from "../common/commentText.vue"

interface info {
  img: string;
  name: string;
  singer: string;
  singerInfo: Array<any>;
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
  floorError: false;
  imgloading: boolean;
  arrloading: boolean;
  requestLoading: boolean; // 请求是否完成
  error: boolean;
  finish: boolean; // 是否没有更多数据了
  haveFirstFloorPop: boolean;
}

const router = useRouter();
const store = songStore();
const id: any = router.currentRoute.value.query.id; //获取参数
let type: any = router.currentRoute.value.query.type; //获取参数
const data = reactive<info>({
  img: "",
  name: "",
  singer: "",
  singerInfo: [],
  commentTotal: 0,
  pageNo: 1,
  floorPageNo: 0,
  sortType: 2,
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
  haveFirstFloorPop: false,
});
onBeforeMount(async () => {
  // 获取音乐图片，标题，歌手
  let info;
  if (type == 2) {
    // 歌单
    info = await getPlayListDetail(id);
    data.img = info.playlist.coverImgUrl;
    data.singer = info.playlist.creator.nickname;
    data.name = info.playlist.name;
  }
  // 等于 0 或者不传默认是歌曲
  if (type == 0 || type == undefined) {
    type = 0;
    info = await getSongInfo(id);
    data.img = info.songs[0].al.picUrl;
    data.name = info.songs[0].name;
    data.singerInfo = data.singerInfo.concat(info.songs[0].ar);
    
    info.songs[0].ar.forEach((item: any, index: number) => {
      if (index == 0) {
        data.singer += `${item.name}`;
      } else {
        data.singer += `/${item.name}`;
      }
    });
  }

  // 电台评论由于未知原因暂时无法获取
  if (type == 4) Toast("电台评论暂时无法获取");

  info = await getComment(id, type, data.pageNo, 20, data.sortType, data.cursor); // 默认按推荐排序
  data.commentTotal = info.data.totalCount;
  data.arr = info.data.comments;
  if (info.data.cursor) data.cursor = info.data.cursor;
  info.data.sortTypeList.forEach((item: any, index: number) => {
    data.sortTypeList.push({
      text: item.sortTypeName,
      value: item.sortType,
    });
  });
  // data.sortType = data.sortTypeList[0].value;

  data.arrloading = false;
  data.pageNo += 1;

  if (!info.data.hasMore) {
    data.finish = true;
  }
});

onMounted(() => {});

// 获取楼层评论
const floorRequest = async (topComment: any, parentCommentId: number) => {
  data.floorTopComment = topComment;
  data.floorLoading = true;
  store.set_floor_comment(true);
  data.floorArr = [];
  data.floorFinish = false;
  data.floorPageNo = 0;
  if (data.haveFirstFloorPop) {
    let info = await getFloorComment(id, parentCommentId, type, data.floorPageNo);
    data.floorArr = info.data.comments;
    data.floorPageNo += 1;
    if (data.floorArr.length) {
      data.floorPageNo = data.floorArr[data.floorArr.length - 1].time;
    }
    if (!info.data.hasMore) {
      data.floorFinish = true;
    }
    data.floorLoading = false;
  }
};

// 加载更多楼层评论
const onLoadFloor = async () => {
  data.floorLoading = true;
  // 触发了加载更多楼层评论方法说明已经弹出过一次楼层了
  if (!data.haveFirstFloorPop) data.haveFirstFloorPop = true;
  let info = await getFloorComment(id, data.floorTopComment.commentId, type, data.floorPageNo);
  data.floorArr = data.floorArr.concat(info.data.comments);
  data.floorPageNo += 1;
  data.floorLoading = false;
  // data.floorPageNo = info.data.time;
  if (data.floorArr.length) {
    data.floorPageNo = data.floorArr[data.floorArr.length - 1].time;
  }
  if (!info.data.hasMore) {
    data.floorFinish = true;
  }
};

// 加载更多评论
const onLoad = async () => {
  data.requestLoading = true;
  let info = await getComment(id, type, data.pageNo, 20, data.sortType, data.cursor);
  if (info.code != 200) {
    data.error = true;
    data.requestLoading = false;
    return;
  }
  data.requestLoading = false;
  data.commentTotal = info.data.totalCount;
  data.cursor = info.data.cursor;
  data.arr = data.arr.concat(info.data.comments);
  data.arrloading = false;
  data.pageNo += 1;
  if (!info.data.hasMore) {
    data.finish = true;
  }
};

// 改变评论排序方式
const change_sortType = async (index: any) => {
  data.sortType = index;
  data.finish = false;
  data.cursor = "";
  data.pageNo = 1;
  data.arr = [];
  data.error = false;
  onLoad();
};

const goSingerDetail = (id: any):void => {
  router.push({ name: "singerDetail", query:{id}})
}
</script>

<style lang="less" scoped>
.van-skeleton {
  background-color: #fff;
}
.navSongList {
  height: 50px;
  display: flex;
  padding: 8px;
  background-color: #fff;
  .back {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 30px;
    }
  }
  .comment_count {
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
    line-height: 50px;
  }
}

.song_info {
  height: 80px;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #fff;
  display: flex;
  .img {
    border-radius: 8px;
    margin-right: 8px;
    .song_img {
      width: 80px;
      height: 80px;
    }
  }
  .info {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      font-size: 15px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .singer {
      font-size: 12px;
      color: rgb(0, 153, 255);
      display: flex;
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
