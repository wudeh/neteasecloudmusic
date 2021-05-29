<template>
  <div>
    <div class="top">
    <div class="img_blur">
      <img :src="img" alt="">
    </div>
    <div class="nav">
      <div class="left_arrow" @click="router.go(-1)">
        <img src="../../../public/img/icons/left_arrow.svg" alt="">
      </div>
      <div class="title">专辑</div>
      <div class="search">
        <img src="../../../public/img/icons/search.svg" alt="">
      </div>
    </div>
    <div class="info">
      <div class="avatar">
        <van-image radius="8" class="img" :src="img" />
      </div>
      <div class="detail">
        <div class="title">{{title}}</div>
        <div class="person">
          <van-image radius="50%" class="img" :src="author.avatar" />
          <span class="name">{{author.nickname}}</span>
          <span class="Follow" v-if="author.followed">></span>
          <span class="notFollow" v-else>+</span>
        </div>
        <div class="des" @click="show = true">
          <div class="text">{{description}}</div>
          <img v-if="description" src="../../../public/img/icons/more.svg" alt="">
        </div>
      </div>
    </div>
  </div>
  <!-- 收藏 评论 分享 -->
  <div class="count">
    <div class="sub item">
        <img :src="subscribed?subedIcon:subIcon" alt="">
        <span>{{numFilter(subscribedCount)}}</span>
    </div>
    <div class="line"></div>
    <div class="comment item" @click="router.push({path: `/comment`, query: {id: id, type: 3}})">
      <img src="../../../public/img/icons/comment.svg" alt="">
        <span>{{numFilter(commentCount)}}</span>
    </div>
    <div class="line"></div>
    <div class="share item">
      <img src="../../../public/img/icons/share.svg" alt="">
        <span>{{numFilter(shareCount)}}</span>
    </div>
  </div>
  <!-- 全部播放 -->
  <div class="playAll">
    <div class="icon">
      <img @click="add_song_list" src="../../../public/img/icons/playAll.svg" alt="">
    </div>
    <div class="text">
      <div class="play_all_title">播放全部</div>
    </div>
    <div class="play_count">({{songListInfo.length}})</div>
  </div>
  <!-- 歌曲列表 -->
  <div class="songList">
    <div class="song_item" v-for="(item,index) in songListInfo" :key="index">
      <div class="index">
        <img v-if="item.id == store.state.song_info.id" width="18" src="../../../public/img/icons/loading.svg" alt="">
        <span v-else>{{index + 1}}</span>
      </div>
      <div class="song_info" @click="playMusicSingle(item)">
        <div class="info_top">
          <div class="song_name">{{item.name}}</div>
          <div class="song_TV" v-if="item.Tv">&nbsp;-&nbsp;{{item.Tv}}</div>
        </div>
        <div class="info_bottom">
          <span class="vip" v-if="item.vip">vip</span>
          <span class="hear_try" v-if="item.vip">试听</span>
          <span class="dujia" v-if="item.dujia">独家</span>
          <span class="sq" v-if="item.sq">SQ</span>
          {{item.author}}
          -
          {{item.des}}
        </div>
      </div>
      <div class="more">
        <img @click="store.dispatch(`set_pop_detail`, item)" src="../../../public/img/icons/songInfo.svg" alt="">
      </div>
    </div>
  </div>
  <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click="show = false">
        <van-image radius="8" class="img" :src="img" />
        <span class="title">{{ title }}</span>
        <div class="babel" v-if="tags.length">
          <span>标签：</span>
          <span class="babel_item" v-for="(it, i) in tags" :key="i">{{ it }}</span>
        </div>
        <p>{{ description }}</p>
      </div>
    </van-overlay>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, onBeforeMount,reactive } from "vue";
import { useRouter } from "vue-router"
import {getSongListInfo,getSongInfo,getAlbumDetail} from "../../api/song"
import { numFilter } from "../../utils/num";
import { useStore } from 'vuex'
import { Toast } from "vant"

// 歌单
interface songList {
  id: number,
  numFilter: any,
  title: string,
  img: string,
  description: string,
  tags: Array<string>,
  subscribed: boolean, // 是否收藏
  songListInfo: Array<song>,
  shareCount:number,
  subscribedCount:number,
  commentCount:number,
  subedIcon: string,
  subIcon: string,
  show: boolean // 控制歌单详情遮罩层
}

// 歌曲
interface song {
  id: string | number,
  name: string,
  Tv: string, // 歌曲可能会有剧名
  author: string,
  des: string,
  sq: boolean, 
  vip: boolean,
  dujia: boolean
}

// 作者
interface author {
  avatar: string,
  nickname:string,
  userId: string,
  followed: false // 是否关注
}

  export default defineComponent({
    name: "album",
    setup() {
      //实例化路由
    const router = useRouter();
    const store = useStore();
    const img = ref<string>()
    const data = reactive<songList>({
      id: 0,
      numFilter:numFilter,
      title: '',
      img: '',
      description: '',
      tags: [],
      subscribed: false,
      songListInfo: [],
      shareCount: 0,
      subscribedCount: 0,
      commentCount: 0,
      subedIcon: require('../../../public/img/icons/subed.svg'),
      subIcon: require('../../../public/img/icons/sub.svg'),
      show: false
    })
    const author = reactive<author>({
      avatar: '',
      nickname: '',
      userId: '',
      followed: false // 是否关注
    })
    const id: any=  router.currentRoute.value.query.id;//获取参数
    onBeforeMount(async () => {
      store.commit("set_load", true)
      
      // 得到专辑数据
      const songList = await getAlbumDetail(id);
      // 组装歌单数据
      data.title = songList.album.name;
      data.id = songList.album.id;
      data.img = songList.album.picUrl;
      data.description = songList.album.description;
      data.tags = songList.album.tags;
      data.subscribed = songList.album.info.liked;
      
      data.subscribedCount = songList.album.info.likedCount;
      data.commentCount = songList.album.info.commentCount;
      data.shareCount = songList.album.info.shareCount;

      author.avatar = songList.album.artist.img1v1Url;
      author.userId = songList.album.artist.id;
      author.nickname = songList.album.artist.name;
      author.followed = songList.album.artist.followed;

      // 得到歌单里的全部歌曲信息

      data.songListInfo = songList.songs.map((item: any) => {

        return {
          id: item.id,
          name: item.name,
          Tv: item.alia.join("/"), // 歌曲可能会有剧名
          author: item.ar.map((item:any) => item.name).join("/"),
          img: item.al.picUrl,
          des: item.al.name,
          ar: item.ar,
          al: item.al,
          sq: item.privilege.maxbr >= 999000, 
          vip: item.privilege.fee == 1,
          dujia: item.privilege.flag == 1092
        }
      })

      store.commit("set_load", false)

      // songListInfo.privileges.forEach((item:any,index:number) => {
      //   data.songListInfo[index].sq = (item.maxbr >= 999000);
      //   data.songListInfo[index].vip = (item.fee == 1);
      //   data.songListInfo[index].dujia = (item.flag == 1092);
      // })
      
    })

    // 点击播放歌曲
     function playMusicSingle(item: any): void {
      
      if(item.id == store.state.song_info.id) {
        store.commit("play", !store.state.song_info.isPlaying);
        return
      }
      // 先判断和当前的歌曲是不是同一首,如果不是同一首
      if(item.resourceId != store.state.song_info.id) {
        store.commit("play", false);
        // 请求URL
        // const info = await getSongUrl(item.resourceId);
        let song = {
          id: item.id,
          name: item.name,
          author: item.ar.map((i:any) => i.name).join("/"),
          type: 0,
          // url: info.data[0].url,
          img: item.al.picUrl
        }
        // 设置歌曲信息
        store.commit("setSongInfo",song);
        // store.commit("add_songList",song)
        // 再播放
      store.commit("play", true);
      }
    }

    // 播放列表
    const add_song_list = () => {
      if(data.songListInfo.length == 0) {
        Toast(`还未获取到音乐列表，请稍后`)
        return
      }
      let list: any[] = [];
      data.songListInfo.forEach((item: any, index: number) => {
          list.push({
            id: item.id,
            type: 0,
            name: item.name,
            author: item.author,
            img: item.img
          })
      })
      store.commit(`add_songList`, list)
    }

    return {
      ...toRefs(data),
      author,
      store,
      router,
      playMusicSingle,
      add_song_list
    }

    }
    
  })
</script>

<style lang="less" scoped>
.top {
  padding: 0 8px;
  height: 200px;
  position: relative;
  .img_blur {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    filter: blur(50px);
    z-index: -1;
    img {
      // width: 100vw;
      height: 100vh;
    }
  }
  .nav {
    // margin-top: 10px;
    height: 50px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    z-index: 1;
    .left_arrow {
      margin-right: 20px;
      img {
        width: 20px;
      }
    }
    .title {
      color: #fff;
      font-size: 25px;
      margin-right: 250px;
    }
    .search {
      .img {
        width: 20 !important;
      }
    }
  }
  .info {
    display: flex;
    z-index: 1;
    .avatar {
      margin-right: 8px;
      .img {
        width: 110px;
        height: 110px;
      }
    }
    .detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 110px;
      width: 220px;
      .title {
        color: #fff;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .person {
        display: flex;
        align-items: center;
        .img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .name {
          font-size: 12px;
          margin: 0 3px;
          color: #fff;
          opacity: 0.5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .notFollow {
          padding: 2px 10px;
          border-radius: 10px;
          background-color: #fff;
          opacity: 0.3;
        }
        .follow {
          opacity: 0.3;
        }
      }
      .des {
        width: 200px;
        font-size: 12px;
        color: #fff;
        opacity: 0.5;
        display: flex;
        .text {
          width: 180px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        img {
          width: 10px;
        }
      }
    }
  }
}
.count {
  margin: 0 auto;
  padding: 0 20px;
  background-color: #fff;
  width: 300px;
  height: 40px;
  border-radius: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 15px;
  opacity: 0.3;
  white-space: nowrap;
  .line {
    height: 30px;
    border-left: 1px solid #ccc;
  }
  img {
    width: 18px;
    margin-right: 8px;
  }
  .item {
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.playAll {
  height: 40px;
  display: flex;
  align-items: center;
  .icon {
    width: 40px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 25px;
    }
  }
  .text {
    display: flex;
    .play_all_title {
      font-size: 15px;
      font-weight: bold;
      // color: #fff;
      margin-right: 8px;
    }
  }
  .play_count {
      // color: #fff;
      font-size: 12px;
      opacity: 0.5;
    }
}
.songList {
  height: 90vw;
  overflow: scroll;
  .song_item {
    display: flex;
    align-items: center;
    height: 40px;
    margin-bottom: 8px;
    color: #fff;
    .index {
      width: 40px;
      height: 40px;
      font-size: 18px;
      text-align: center;
      line-height: 40px;
    }
    .song_info {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 300px;
      justify-content: space-between;
      .info_top {
        // color: #fff;
        font-size: 18px;
        overflow: hidden;
        display: flex;
        .song_name {
          white-space: nowrap;
        }
        .song_TV {
          color: #fff;
          opacity: 0.5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .info_bottom {
        // color: #fff;
        opacity: 0.5;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 20px;
        .vip {
          color: red;
          border: 1px solid red;
          border-radius: 3px;
          opacity: 0.6;
        }
        .dujia {
          .vip
        }
        .sq {
          .vip
        }
        .hear_try {
          color: rgb(0, 217, 255);
          border: 1px solid rgb(0, 153, 255);
          border-radius: 3px;
          opacity: 0.6;
        }
      }
    }
    .more {
      img {
        width: 20px;
      }
    }
  }
}
.wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 100px 15px;
  color: #fff;
  .img {
    width: 200px;
    height: 200px;
    margin-bottom: 10px;
  }
  .title {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .babel {
    font-size: 13px;
    margin-bottom: 10px;
    .babel_item {
      padding: 3px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      margin-left: 8px;
    }
  }
  p {
    font-size: 12px;
  }
}
</style>