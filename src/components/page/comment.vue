<template>
  <!-- 导航 -->

  <div class="nav">
    <div class="back">
      <img style="transform: translate(180deg)" src="../../../public/img/icons/play.svg" alt="" />
    </div>
    <div class="comment_count">评论({{ commentTotal }})</div>
  </div>

  <!-- 音乐信息 -->
  <!-- <van-skeleton title :row="3" :loading="loading"> -->
  <div class="song_info">
    <div class="img">
      <van-image width="90" height="90" :src="img" />
    </div>
    <div class="info">
      <div class="title">{{ name }}</div>
      <div class="singer">{{ singer }}</div>
    </div>
  </div>
  <!-- </van-skeleton> -->
  <!-- 评论选择区 -->
  <van-sticky>
    <div class="comment_choose">
      <div class="title">评论区</div>
      <div class="choose">
        <span class="choosed">推荐</span>
        <span>最热</span>
        <span>最新</span>
      </div>
    </div>
  </van-sticky>
  <!-- 评论区 -->
  <van-skeleton title avatar :row="3" :loading="arrloading">
    <div class="comment_area">
      <div class="comment_item" v-for="item in arr" :key="item.commentId">
        <div class="avatar">
          <!-- <img :src="item.user.avatarUrl" alt=""> -->
          <van-image round width="30" height="30" :src="item.user.avatarUrl" />
        </div>
        <div class="info">
          <div class="top">
            <div class="top_left">
              <div class="name">{{ item.user.nickname }}</div>
              <div class="time">
                <span class="time">{{ sendTimeConversion(item.time) }}</span>
                <span v-if="item.tag.datas" style="margin: 0 2px">-</span>
                <span class="tag" v-if="item.tag.datas">{{ item.tag.datas[0].text }}</span>
              </div>
            </div>
            <div class="like_count">
              <span class="count">{{ item.likedCount }}</span>
              <img v-if="item.liked" src="../../../public/img/icons/liked.svg" alt="" />
              <img v-else src="../../../public/img/icons/like_gray.svg" alt="" />
            </div>
          </div>
          <div class="text">{{ item.content }}</div>
          <div class="reply_count" @click="floorRequest(item,item.commentId)" v-if="item.showFloorComment.showReplyCount">{{ item.showFloorComment.replyCount }}条回复&nbsp;></div>
        </div>
      </div>
    </div>
  </van-skeleton>
  <!-- 楼层弹出评论 -->
  <van-popup
    v-model:show="showFloor"
    closeable
    close-icon-position="top-left"
    position="bottom"
    :style="{ height: '60%' }"
  >
    <div class="floor">
      <div class="comment_item" v-for="item in floorArr" :key="item.commentId">
        <div class="avatar">
          <!-- <img :src="item.user.avatarUrl" alt=""> -->
          <van-image round width="30" height="30" :src="item.user.avatarUrl" />
        </div>
        <div class="info">
          <div class="top">
            <div class="top_left">
              <div class="name">{{ item.user.nickname }}</div>
              <div class="time">
                <span class="time">{{ sendTimeConversion(item.time) }}</span>
                <!-- <span v-if="item.tag.datas" style="margin: 0 2px">-</span> -->
                <!-- <span class="tag" v-if="item.tag.datas">{{ item.tag.datas[0].text }}</span> -->
              </div>
            </div>
            <div class="like_count">
              <span class="count">{{ item.likedCount }}</span>
              <img v-if="item.liked" src="../../../public/img/icons/liked.svg" alt="" />
              <img v-else src="../../../public/img/icons/like_gray.svg" alt="" />
            </div>
          </div>
          <div class="text">{{ item.content }}</div>
          <div class="beReplied_item" v-if="item.beReplied[0].beRepliedCommentId != floorTopComment.commentId">
            <span class="beReplied_name">@{{item.beReplied[0].user.nickname}}：</span>
            <span class="beReplied_content" v-if="item.beReplied[0].content">{{item.beReplied[0].content}}</span>
            <span class="beReplied_content" v-else>该评论已删除</span>
          </div>
        </div>
      </div>
    </div>
  
  </van-popup>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, onBeforeMount, toRefs } from "vue";
import { getComment, getSongInfo, getFloorComment } from "../../api/song";
import { useRouter } from "vue-router";
import { sendTimeConversion } from "../../utils/num";
interface info {
  img: string;
  name: string;
  singer: string;
  singerInfo: Array<any>;
  commentTotal: number;
  pageNo: number;
  floorPageNo: any;
  sortType: number;
  cursor: any; // 当sortType为3时且页数不是第一页时需传入,值为上一条数据的time
  arr: Array<any>;
  floorArr: Array<any>;
  floorTopComment: any,
  showFloor: boolean,
  imgloading: boolean;
  arrloading: boolean;
}
export default defineComponent({
  name: "comment",
  setup() {
    const router = useRouter();
    const id: any = router.currentRoute.value.query.id; //获取参数
    const data = reactive<info>({
      img: "",
      name: "",
      singer: "",
      singerInfo: [],
      commentTotal: 0,
      pageNo: 1,
      floorPageNo: 1,
      sortType: 1,
      cursor: "",
      arr: [],
      floorArr: [],
      floorTopComment: {},
      showFloor: false,
      imgloading: true,
      arrloading: true,
    });
    onBeforeMount(async () => {
      // 获取音乐图片，标题，歌手
      let info = await getSongInfo(id);
      data.img = info.songs[0].al.picUrl;
      data.name = info.songs[0].name;
      data.singerInfo.concat(info.songs[0].ar);
      info.songs[0].ar.forEach((item: any, index: number) => {
        if (index == 0) {
          data.singer += `${item.name}`;
        } else {
          data.singer += `/${item.name}`;
        }
      });
      info = await getComment(id, 0, data.pageNo, 20, 0, data.cursor);
      data.commentTotal = info.data.totalCount;
      data.arr = info.data.comments;
      data.arrloading = false;
      console.log("这是评论");
      console.log(info);

      console.log(data.arr);
    });

    // 获取楼层评论
    const floorRequest = async (topComment: any,parentCommentId: number) => {
      data.showFloor = true;
      let info = await getFloorComment(id,parentCommentId,0,data.floorPageNo);
      data.floorTopComment = topComment;
      data.floorArr = info.data.comments;
    }

    return {
      ...toRefs(data),
      sendTimeConversion,
      floorRequest
    };
  },
});
</script>

<style lang="less" scoped>
.van-skeleton {
  background-color: #fff;
}
.nav {
  height: 50px;
  display: flex;
  padding: 8px;
  background-color: #fff;
  .comment_count {
    font-size: 25px;
    font-weight: bold;
    margin-left: 10px;
  }
}

.song_info {
  height: 110px;
  margin-bottom: 8px;
  background-color: #fff;
  display: flex;
  .img {
    padding: 8px;
    border-radius: 8px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 8px;
    }
  }
  .info {
    height: 100%;
    .title {
      font-size: 18px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .singer {
      font-size: 12px;
      color: rgb(0, 153, 255);
    }
  }
}
.comment_choose {
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  height: 30px;
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
          .time {
            font-size: 12px;
            color: #ccc;
          }
          .tag {
            .time;
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
  padding-top: 30px;
  .beReplied_item {
    padding: 8px;
    .beReplied_name {
      color: rgb(0, 153, 255);
    }
    .beReplied_content {
      color: #ccc;
    }
  }
}
</style>
