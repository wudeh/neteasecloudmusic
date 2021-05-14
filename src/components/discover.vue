<template>
<!-- 导航栏 -->
  <div class="nav" @click="goSearch()">
    <div class="pop">
      <van-icon name="chat-o" badge="" />
    </div>
    <div class="search">
      <van-icon name="search" />
      <p>{{ searchWord }}</p>
    </div>
    <img @click.stop="router.push({path: `/download`})" src="../../public/img/icons/download.svg" alt="">
  </div>
  <div class="discover" v-if="swiper.length">
    <bsscroll :scrollY="true" name="discover_scroll" :scrollData="swiper" :pulldown="true">
      <div class="top">
      <!-- 轮播图 -->
      <div class="swiper">
        <van-swipe
          class="my-swipe"
          :autoplay="3000"
          indicator-color="white"
          :lazy-render="true"
          @change="onChange"
        >
          <van-swipe-item v-for="(item, index) in swiper" :key="index">
            <img :src="item.pic" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- 模糊背景图 -->
      <div class="top_blur" ref="topBg"></div>
      <!-- 圆形图标区域 -->
      <div class="icon_top">
        <bsscroll :scrollX="true" :scrollData="icon" name="icon_scroll">
          <div class="icon_wrapper">
            <div
              class="icon_item"
              v-for="item in icon"
              :key="item.id"
              @click="show(item.name)"
            >
              <div class="img_wrapper">
                <img :src="item.iconUrl" alt="" />
              </div>
              <span class="des">{{ item.name }}</span>
            </div>
          </div>
        </bsscroll>
      </div>
    </div>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <div class="rec_title" @click="logoutDD()">
        <div class="rec_des">{{ recommend.titleTex }}</div>
        <div class="rec_more">
          <span>{{ recommend.button.text }}</span>
          <img src="../../public/img/icons/more.svg" alt="" />
        </div>
      </div>
      <bsscroll
        :scrollX="true"
        :scrollData="recommend.arrData"
        name="recommend_scroll"
      >
        <div class="rec_song">
          <div
            class="rec_item"
            v-for="item in recommend.arrData"
            :key="item.creativeId"
            @click="goSongList(item.resources[0].resourceId)"
          >
            <van-image
              class="img"
              show-loading
              radius="8"
              :src="item.uiElement.image.imageUrl"
            />
            <span>{{ item.uiElement.mainTitle.title }}</span>
            <div class="playCount">
              <img src="../../public/img/icons/play.svg" alt="" />
              <span>{{
                numFilter(item.resources[0].resourceExtInfo.playCount)
              }}</span>
            </div>
          </div>
        </div>
      </bsscroll>
    </div>
    <!-- 较长的区域 -->
    <div class="long">
      <div class="rec_title">
        <div class="rec_des">{{ long.uiElement.subTitle.title }}</div>
        <div class="rec_more">
          <img src="../../public/img/icons/videoPlay.svg" alt="" />
          <span>{{ long.uiElement.button.text }}</span>
        </div>
      </div>
      <bsscroll :scrollX="true" :scrollData="long.creatives" name="long_scroll">
        <div class="swiper">
          <div
            class="swiper_item"
            v-for="(item, index) in long.creatives"
            :key="index"
          >
            <div
              class="item"
              v-for="subItem in item.resources"
              :key="subItem.resourceId"
              @click="playMusicSingle(subItem)"
            >
              <div class="img_wrapper">
                <van-image class="img" :src="subItem.uiElement.image.imageUrl">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </div>
              <div class="info">
                <div class="song_title">
                  <div class="song_name">
                    {{ subItem.uiElement.mainTitle.title }}
                  </div>
                  <span style="color: #ccc; margin: 0 2px">-</span>
                  <div
                    class="song_author"
                    v-for="(author_title, index) in subItem.resourceExtInfo
                      .artists"
                    :key="author_title.id"
                  >
                    {{ author_title.name }}
                    <span
                      v-if="index < subItem.resourceExtInfo.artists.length - 1"
                      >/</span
                    >
                  </div>
                </div>
                <div
                  class="song_subTitle"
                  :class="{
                    percent:
                      subItem.uiElement.subTitle.title.indexOf('%') != -1,
                  }"
                  v-if="subItem.uiElement.subTitle"
                >
                  <span class="SQ" v-if="subItem.resourceExtInfo.songPrivilege.maxbr >= 999000">SQ</span>
                  <span class="vip" v-if="subItem.resourceExtInfo.songPrivilege.fee == 1">vip</span>
                  <span class="hear_try" v-if="subItem.resourceExtInfo.songPrivilege.fee == 1">试听</span>
                  <span class="dujia" v-if="subItem.resourceExtInfo.songPrivilege.flag == 1092">独家</span>
                  {{ subItem.uiElement.subTitle.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </bsscroll>
    </div>
    <!-- 精选音乐视频 -->
    <div class="recommend MUSIC_MLOG" v-if="HOMEPAGE_MUSIC_MLOG.uiElement.subTitle.title">
      <div class="rec_title">
        <div class="rec_des">
          {{ HOMEPAGE_MUSIC_MLOG.uiElement.subTitle.title }}
        </div>
        <div class="rec_more">
          <span>{{ HOMEPAGE_MUSIC_MLOG.uiElement.button.text }}</span>
          <img src="../../public/img/icons/more.svg" alt="" />
        </div>
      </div>
      <bsscroll
        :scrollX="true"
        :scrollData="HOMEPAGE_MUSIC_MLOG.extInfo"
        name="HOMEPAGE_MUSIC_MLOG_scroll"
      >
        <div class="rec_song">
          <div
            class="rec_item"
            v-for="item in HOMEPAGE_MUSIC_MLOG.extInfo"
            :key="item.creativeId"
            @click="show(item.creativeId)"
          >
            <van-image
              class="img"
              show-loading
              radius="8"
              :src="item.resource.mlogBaseData.coverUrl"
            />
            <span>{{ item.resource.mlogBaseData.text }}</span>
            <div class="playCount">
              <img src="../../public/img/icons/play.svg" alt="" />
              <span>{{ numFilter(item.resource.mlogExtVO.playCount) }}</span>
            </div>
          </div>
        </div>
      </bsscroll>
    </div>
    <!-- 雷达歌单 -->
    <div class="recommend">
      <div class="rec_title">
        <div class="rec_des">
          {{ HOMEPAGE_BLOCK_MGC_PLAYLIST.uiElement.subTitle.title }}
        </div>
        <div class="rec_more">
          <span>{{ HOMEPAGE_BLOCK_MGC_PLAYLIST.uiElement.button.text }}</span>
          <img src="../../public/img/icons/more.svg" alt="" />
        </div>
      </div>
      <bsscroll
        :scrollX="true"
        :scrollData="HOMEPAGE_BLOCK_MGC_PLAYLIST.extInfo"
        name="HOMEPAGE_BLOCK_MGC_PLAYLIST_scroll"
      >
        <div class="rec_song">
          <div
            class="rec_item"
            v-for="item in HOMEPAGE_BLOCK_MGC_PLAYLIST.creatives"
            :key="item.creativeId"
            @click="goSongList(item.resources[0].resourceId)"
          >
            <van-image
              class="img"
              show-loading
              radius="8"
              :src="item.uiElement.image.imageUrl"
            />
            <span>{{ item.uiElement.mainTitle.title }}</span>
            <div class="playCount">
              <img src="../../public/img/icons/play.svg" alt="" />
              <span>{{
                numFilter(item.resources[0].resourceExtInfo.playCount)
              }}</span>
            </div>
          </div>
        </div>
      </bsscroll>
    </div>
    <!-- 视频合辑 -->
    <div class="video">
      <div class="rec_title">
        <div class="rec_des">
          {{ HOMEPAGE_BLOCK_VIDEO_PLAYLIST.uiElement.subTitle.title }}
        </div>
        <div class="rec_more">
          <span>{{
            HOMEPAGE_BLOCK_VIDEO_PLAYLIST.uiElement.button.text
          }}</span>
          <img src="../../public/img/icons/more.svg" alt="" />
        </div>
      </div>
      <bsscroll
        :scrollX="true"
        :scrollData="HOMEPAGE_BLOCK_VIDEO_PLAYLIST.creatives"
        name="HOMEPAGE_BLOCK_VIDEO_PLAYLIST_scroll"
      >
        <div class="rec_song">
          <div
            class="rec_item"
            v-for="item in HOMEPAGE_BLOCK_VIDEO_PLAYLIST.creatives"
            :key="item.creativeId"
            @click="show(item.creativeId)"
          >
            <div class="img_wrapper">
              <van-image class="img" radius="8" :src="item.uiElement.image.imageUrl"/>
              <div class="mirror">
                <van-image class="img_mirror" show-loading radius="8" :src="item.uiElement.image.imageUrl"/>
              </div>
            </div>
            <span>{{ item.uiElement.mainTitle.title }}</span>
            <div class="playCount">
              <img src="../../public/img/icons/play.svg" alt="" />
              <span>{{
                numFilter(item.resources[0].resourceExtInfo.playCount)
              }}</span>
            </div>
          </div>
        </div>
      </bsscroll>
    </div>
    <!-- 音乐日历 -->
    <div class="calendar" v-if="HOMEPAGE_MUSIC_CALENDAR">
      <div class="rec_title" @click="logoutDD()">
        <div class="rec_des">
          {{ HOMEPAGE_MUSIC_CALENDAR.uiElement.subTitle.title }}
        </div>
        <div class="rec_more">
          <span>{{ HOMEPAGE_MUSIC_CALENDAR.uiElement.button.text }}</span>
          <img src="../../public/img/icons/more.svg" alt="" />
        </div>
      </div>
      <!-- 今天 -->
      <div
        class="item_calendar"
        v-for="item in HOMEPAGE_MUSIC_CALENDAR.creatives"
        :key="item.creativeId"
      >
        <div class="left">
          <div class="left_top">
            <span class="day">{{item.resources[0].uiElement.labelTexts ? "今天" : "明天"}}</span>
            <span class="label" v-if="item.resources[0].uiElement.labelTexts">{{item.resources[0].uiElement.labelTexts[0]}}</span>
            <span class="label_tomrrow" v-else>预告</span>
          </div>
          <div class="left_bottom">
            {{ item.resources[0].uiElement.mainTitle.title }}
          </div>
        </div>
        <div class="right_img">
          <img :src="item.resources[0].uiElement.image.imageUrl" alt="" />
        </div>
      </div>
    </div>
    <!-- 专属场景歌单 -->
    <div class="recommend">
      <div class="rec_title">
        <div class="rec_des">
          {{ HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST.uiElement.subTitle.title }}
        </div>
        <div class="rec_more">
          <span>{{
            HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST.uiElement.button.text
          }}</span>
          <img src="../../public/img/icons/more.svg" alt="" />
        </div>
      </div>
      <bsscroll
        :scrollX="true"
        :scrollData="HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST.creatives"
        name="HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST_scroll"
      >
        <div class="rec_song">
          <div
            class="rec_item"
            v-for="item in HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST.creatives"
            :key="item.creativeId"
            @click="goSongList(item.resources[0].resourceId)"
          >
            <van-image
              class="img"
              show-loading
              radius="8"
              :src="item.uiElement.image.imageUrl"
            />
            <span>{{ item.uiElement.mainTitle.title }}</span>
            <div class="playCount">
              <img src="../../public/img/icons/play.svg" alt="" />
              <span>{{
                numFilter(item.resources[0].resourceExtInfo.playCount)
              }}</span>
            </div>
          </div>
        </div>
      </bsscroll>
    </div>
    <!-- 新歌，新碟，数字专辑 -->
    <div class="new">
      <div class="rec_title">
        <div class="rec_des">
          <span
            @click="change_new(0)"
            :class="{ notClick: HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.index != 0 }"
            >新歌</span
          >
          <span style="color: #ccc; margin: 0 3px">|</span>
          <span
            @click="change_new(1)"
            :class="{ notClick: HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.index != 1 }"
            >新碟</span
          >
          <span style="color: #ccc; margin: 0 3px">|</span>
          <span
            @click="change_new(2)"
            :class="{ notClick: HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.index != 2 }"
            >数字专辑</span
          >
        </div>
        <div class="rec_more">
          <img src="../../public/img/icons/videoPlay.svg" alt="" />
          <span>更多</span>
        </div>
      </div>
      <bsscroll
        :scrollX="true"
        :scrollData="HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.arrData"
        name="HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG_scroll"
      >
        <div class="swiper">
          <div
            class="swiper_item"
            v-for="(item, index) in HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.arrData[
              HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.index
            ]"
            :key="index"
          >
            <div
              class="item"
              v-for="subItem in item.resources"
              :key="subItem.resourceId"
            >
              <div class="img_wrapper">
                <van-image class="img" :src="subItem.uiElement.image.imageUrl">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </div>
              <div class="info">
                <div class="song_title">
                  <div class="song_name">
                    {{ subItem.uiElement.mainTitle.title }}
                  </div>
                  <span style="color: #ccc; margin: 0 2px">-</span>
                  <div
                    class="song_author"
                    v-for="(author_title, index) in subItem.resourceExtInfo
                      .artists"
                    :key="author_title.id"
                  >
                    {{ author_title.name }}
                    <span
                      v-if="index < subItem.resourceExtInfo.artists.length - 1"
                      >/</span
                    >
                  </div>
                </div>
                <div
                  class="song_subTitle"
                  :class="{percent:subItem.uiElement.subTitle.title.indexOf('%') != -1}"
                  v-if="subItem.uiElement.subTitle"
                >
                  <span class="SQ" v-if="subItem.resourceExtInfo.songPrivilege && subItem.resourceExtInfo.songPrivilege.maxbr >= 999000">SQ</span>
                  {{ subItem.uiElement.subTitle.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </bsscroll>
    </div>
    <!-- 推荐新歌云贝广告 -->
    <div class="yunbei" v-if="HOMEPAGE_YUNBEI_NEW_SONG.uiElement.subTitle.title">
      <div class="rec_title">
        <div class="rec_des">{{ HOMEPAGE_YUNBEI_NEW_SONG.uiElement.subTitle.title }}</div>
      </div>
      <bsscroll :scrollX="true" :scrollData="HOMEPAGE_YUNBEI_NEW_SONG.creatives" name="yunbei_scroll">
        <div class="swiper">
          <div class="swiper_item" v-for="(item, index) in HOMEPAGE_YUNBEI_NEW_SONG.creatives" :key="index">
            <div class="item">
              <div class="img_wrapper">
                <van-image class="img" :src="item.resources[0].uiElement.image.imageUrl">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </div>
              <div class="info">
                <div class="song_title">
                  <div class="song_name">
                    {{ item.resources[0].uiElement.mainTitle.title }}
                  </div>
                  <span style="color: #ccc; margin: 0 2px">-</span>
                  <div
                    class="song_author"
                    v-for="(author_title, index) in item.resources[0].resourceExtInfo.artists"
                    :key="author_title.id"
                  >
                    {{ author_title.name }}
                    <span v-if="index < item.resources[0].resourceExtInfo.artists.length - 1">/</span>
                  </div>
                </div>
                <div
                  class="song_subTitle"
                  :class="{percent:item.uiElement.subTitle.title.indexOf('%') != -1}"
                  v-if="item.uiElement.subTitle"
                >
                  <span class="SQ" v-if="item.resourceExtInfo.songPrivilege.maxbr >= 999000">SQ</span>
                  {{ item.uiElement.subTitle.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </bsscroll>
    </div>
    <!-- 播客合辑 -->
    <div class="recommend">
      <div class="rec_title">
        <div class="rec_des">
          {{ HOMEPAGE_VOICELIST_RCMD.uiElement.subTitle.title }}
        </div>
        <div class="rec_more">
          <span>{{
            HOMEPAGE_VOICELIST_RCMD.uiElement.button.text
          }}</span>
          <img src="../../public/img/icons/more.svg" alt="" />
        </div>
      </div>
      <bsscroll
        :scrollX="true"
        :scrollData="HOMEPAGE_VOICELIST_RCMD.creatives"
        name="HOMEPAGE_VOICELIST_RCMD_scroll"
      >
        <div class="rec_song">
          <div
            class="rec_item"
            v-for="item in HOMEPAGE_VOICELIST_RCMD.creatives"
            :key="item.creativeId"
            @click="show(item.creativeId)"
          >
            <van-image
              class="img"
              show-loading
              radius="8"
              :src="item.uiElement.image.imageUrl"
            />
            <span>{{ item.uiElement.mainTitle.title }}</span>
            <div class="playCount">
              <img src="../../public/img/icons/play.svg" alt="" />
              <span>{{
                numFilter(item.creativeExtInfoVO.playCount)
              }}</span>
            </div>
          </div>
        </div>
      </bsscroll>
    </div>
    <!-- 24 小时播客 -->
    <div class="podcast24" v-if="false">
      <div class="rec_title">
        <div class="rec_des">
          {{ HOMEPAGE_PODCAST24.uiElement.subTitle.title }}
        </div>
      </div>
      <bsscroll
        :scrollX="true"
        :scrollData="HOMEPAGE_PODCAST24.creatives"
        name="HOMEPAGE_PODCAST24_scroll"
      >
        <div class="rec_song">
          <div
            class="rec_item"
            v-for="item in HOMEPAGE_PODCAST24.creatives"
            :key="item.creativeId"
            @click="show(item.creativeId)"
          >
            <van-image
              class="img"
              show-loading
              radius="50%"
              :src="item.uiElement.image.imageUrl"
            />
            <span style="text-align:center">{{ item.uiElement.mainTitle.title }}</span>
            <div class="play">
              <img src="../../public/img/icons/play_white.svg" style="color: #fff" />
            </div>
          </div>
        </div>
      </bsscroll>
    </div>
    </bsscroll>
    
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  toRefs,
  onBeforeMount,
  watch,
  nextTick,
} from "vue";
import { getDiscoverInfo, getIconInfo, getSearchWord } from "../api/discover";
import { getSongUrl } from "../api/song";
import { useRouter } from "vue-router";
import { recentcontact, loginByPhoneAndPassword, logout } from "../api/user";
import bsscroll from "./common/scroll.vue";
import { numFilter } from "../utils/num";
import { useStore } from 'vuex'
import axios from "axios";

interface data {
  numFilter: any;
  swiper: Array<any>;
  icon: Array<any>;
  recommend: Record<string, unknown>;
  long: Record<string, unknown>;
  HOMEPAGE_MUSIC_MLOG: Record<string, unknown>;
  HOMEPAGE_BLOCK_MGC_PLAYLIST: Record<string, unknown>;
  HOMEPAGE_MUSIC_CALENDAR: any;
}
// 首页的发现组件
export default defineComponent({
  name: "discover",
  components: {
    bsscroll,
  },
  setup() {
    const router = useRouter();
    const active = ref<number>(0);
    const topBg = ref<HTMLElement>();
    const store = useStore()
    const info = reactive<any>({
      cursor: {},  // 首页在登录状态下需要带上上一次请求回来的 cursor，作用相当于分页的页数
      numFilter: numFilter,// 播放量过滤函数
      searchWord: "",
      swiper: [], // 轮播图
      icon: [], // 圆形图标数据
      // 推荐歌单
      recommend: {
        arrData: [],
        titleTex: "",
        button: {},
      }, 
      // 可刷新的长标题区域
      long: {
        uiElement: {
          subTitle: {},
          button: {},
        },
      },
      // 精选音乐视频
      HOMEPAGE_MUSIC_MLOG: {
        img: [],
        extInfo: [],
        uiElement: {
          subTitle: {},
          button: {},
        },
      },
      // 雷达歌单
      HOMEPAGE_BLOCK_MGC_PLAYLIST: {
        uiElement: {
          subTitle: {},
          button: {},
        },
      },
      // 音乐日历
      HOMEPAGE_MUSIC_CALENDAR: {
        creatives: [
        ],
        uiElement: {
          subTitle: {},
          button: {},
        },
      },
      // 专属场景歌单
      HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST: {
        uiElement: {
          subTitle: {},
          button: {},
        },
      },
      // 新歌，新碟，数字专辑
      HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG: {
        index: 0,
        title: [],
        arrData: [[], [], []], // 存储排好顺序的数组
        arrOri: [],
      },
      // 推荐新歌云贝广告
      HOMEPAGE_YUNBEI_NEW_SONG: {
        uiElement: {
          subTitle: {},
          button: {},
        },
      },
      // 播客合集
      HOMEPAGE_VOICELIST_RCMD: {
        creatives: [],
        uiElement: {
          subTitle: {},
          button: {},
        },
      },
      // 24 小时播客
      HOMEPAGE_PODCAST24: {
        creatives: [],
        uiElement: {
          subTitle: {},
          button: {},
        },
      },
      // 视频合集
      HOMEPAGE_BLOCK_VIDEO_PLAYLIST: {
        creatives: [],
        uiElement: {
          subTitle: {},
          button: {},
        },
      }
    });

    // 数据请求
    onMounted(async () => {
      store.commit("set_load", true)
      let discoverInfo = await getDiscoverInfo(info.cursor);
      store.commit("set_load", false)
      // 分页数据
      info.cursor = discoverInfo.data.cursor;
      discoverInfo.data.blocks.map((item: any) => {
        // 轮播图
        if(item.blockCode == "HOMEPAGE_BANNER") {
          info["swiper"] = item.extInfo.banners;
          nextTick(() => {
            topBg.value?.setAttribute(
            "style",
            `background-image:url(${info.swiper[0].pic});background-color:red`
          );
          })
        }
        // 推荐歌单
        if(item.blockCode == "HOMEPAGE_BLOCK_PLAYLIST_RCMD") {
          console.log("这是推荐歌单");
          info.recommend.arrData = item.creatives;
          info.recommend.titleTex = item.uiElement.subTitle.title;
          info.recommend.button = item.uiElement.button;
        }
        if(item.blockCode == "HOMEPAGE_BLOCK_STYLE_RCMD") {
          console.log("这是较长的推荐区域");
          // 较长的推荐区域
          info.long = item;
        }
        if(item.blockCode == "HOMEPAGE_MUSIC_MLOG") {
          console.log("这是精选音乐视频");
          // 精选音乐视频
          info.HOMEPAGE_MUSIC_MLOG = item;
        }
        if(item.blockCode == "HOMEPAGE_BLOCK_MGC_PLAYLIST") {
          console.log("这是雷达歌单");
          // 雷达歌单
         info.HOMEPAGE_BLOCK_MGC_PLAYLIST = item;
        }
        if(item.blockCode == "HOMEPAGE_MUSIC_CALENDAR") {
          console.log("这是音乐日历");
          // 音乐日历
         info.HOMEPAGE_MUSIC_CALENDAR = item;
        }
        if(item.blockCode == "HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST") {
          // 专属场景歌单
         info.HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST = item;
        }
        if(item.blockCode == "HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG") {
          // 新歌，新碟，数字专辑
         info.HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.arrOri =
            item.creatives;
          info.HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.arrOri.map(
            (item: { creativeType: string }) => {
              // 如果是新歌
              if (item.creativeType == "NEW_SONG_HOMEPAGE") {
                info.HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.arrData[0].push(item);
              }
              // 新碟
              if (item.creativeType == "NEW_ALBUM_HOMEPAGE") {
                info.HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.arrData[1].push(item);
              }
              // 数字专辑
              if (item.creativeType == "DIGITAL_ALBUM_HOMEPAGE") {
                info.HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.arrData[2].push(item);
              }
            }
          );
        }
        if(item.blockCode == "HOMEPAGE_YUNBEI_NEW_SONG") {
          // 推荐新歌云贝广告
         info.HOMEPAGE_YUNBEI_NEW_SONG = item;
        }
        if(item.blockCode == "HOMEPAGE_VOICELIST_RCMD") {
          // 播客合辑
         info.HOMEPAGE_VOICELIST_RCMD = item;
        }
        if(item.blockCode == "HOMEPAGE_PODCAST24") {
          // 24小时播客
         info.HOMEPAGE_PODCAST24 = item;
        }
        if(item.blockCode == "HOMEPAGE_BLOCK_VIDEO_PLAYLIST") {
          // 视频合集
         info.HOMEPAGE_BLOCK_VIDEO_PLAYLIST = item;
         console.log("这是视频合集");
         
         console.log(info.HOMEPAGE_BLOCK_VIDEO_PLAYLIST);
         
        }
      })
      // 只要有分页数据就继续请求数据
      while(info.cursor) {
        discoverInfo = await getDiscoverInfo(info.cursor);
      // 分页数据
      info.cursor = discoverInfo.data.cursor;
        // 分配数据
      discoverInfo.data.blocks.map((item: any) => {
        // 轮播图
        if(item.blockCode == "HOMEPAGE_BANNER") {
          info["swiper"] = item.extInfo.banners;
        }
        // 推荐歌单
        if(item.blockCode == "HOMEPAGE_BLOCK_PLAYLIST_RCMD") {
          console.log("这是推荐歌单");
          info.recommend.arrData = item.creatives;
          info.recommend.titleTex = item.uiElement.subTitle.title;
          info.recommend.button = item.uiElement.button;
        }
        if(item.blockCode == "HOMEPAGE_BLOCK_STYLE_RCMD") {
          console.log("这是较长的推荐区域");
          // 较长的推荐区域
          info.long = item;
        }
        if(item.blockCode == "HOMEPAGE_MUSIC_MLOG") {
          console.log("这是精选音乐视频");
          // 精选音乐视频
          info.HOMEPAGE_MUSIC_MLOG = item;
          info.HOMEPAGE_MUSIC_MLOG.extInfo.map((i: any) => {
            console.log('开始处理');
          })
        }
        if(item.blockCode == "HOMEPAGE_BLOCK_MGC_PLAYLIST") {
          console.log("这是雷达歌单");
          // 雷达歌单
         info.HOMEPAGE_BLOCK_MGC_PLAYLIST = item;
        }
        if(item.blockCode == "HOMEPAGE_MUSIC_CALENDAR") {
          console.log("这是音乐日历");
          // 音乐日历
         info.HOMEPAGE_MUSIC_CALENDAR = item;
        }
        if(item.blockCode == "HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST") {
          // 专属场景歌单
         info.HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST = item;
        }
        if(item.blockCode == "HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG") {
          // 新歌，新碟，数字专辑
         info.HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.arrOri =
            item.creatives;
          info.HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.arrOri.map(
            (item: { creativeType: string }) => {
              // 如果是新歌
              if (item.creativeType == "NEW_SONG_HOMEPAGE") {
                info.HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.arrData[0].push(item);
              }
              // 新碟
              if (item.creativeType == "NEW_ALBUM_HOMEPAGE") {
                info.HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.arrData[1].push(item);
              }
              // 数字专辑
              if (item.creativeType == "DIGITAL_ALBUM_HOMEPAGE") {
                info.HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.arrData[2].push(item);
              }
            }
          );
        }
        if(item.blockCode == "HOMEPAGE_YUNBEI_NEW_SONG") {
          // 推荐新歌云贝广告
         info.HOMEPAGE_YUNBEI_NEW_SONG = item;
        }
        if(item.blockCode == "HOMEPAGE_VOICELIST_RCMD") {
          // 播客合辑
         info.HOMEPAGE_VOICELIST_RCMD = item;
        }
        if(item.blockCode == "HOMEPAGE_PODCAST24") {
          // 24小时播客
         info.HOMEPAGE_PODCAST24 = item;
        }
        if(item.blockCode == "HOMEPAGE_BLOCK_VIDEO_PLAYLIST") {
          // 视频合集
         info.HOMEPAGE_BLOCK_VIDEO_PLAYLIST = item;
         console.log("这是视频合集");
         
         console.log(info.HOMEPAGE_BLOCK_VIDEO_PLAYLIST);
         
        }
      })
      
      }
      const iconInfo = await getIconInfo();
      // 圆形图标
      info.icon = iconInfo.data;
      let word = await getSearchWord();
      info.searchWord = word.data.showKeyword;
    });

    // 获取 top 的dom 元素, 根据轮播图轮播事件动态改变背景图片模糊
    
    const onChange = (index: number) => {
      topBg.value?.setAttribute(
        "style",
        `background-image:url(${info.swiper[index].pic});`
      );
    };

    // 新歌，新碟，数字专辑
    function change_new(index: number): void {
      info.HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.index = index;
    }
    // 监听索引变化，改变为对应新歌，新碟，数字专辑的数组数据
    watch(
      () => info.HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG.index,
      (i) => {
        console.log(i);
      }
    );


    // 点击播放歌曲
    async function playMusicSingle(item: any):Promise<void> {
      console.log(item);
      console.log(store.state.song_info.id);
      
      if(item.resourceId == store.state.song_info.id) {
        console.log("是同一首");
        store.commit("play", !store.state.song_info.isPlaying);
      }
      // 先判断和当前的歌曲是不是同一首,如果不是同一首
      if(item.resourceId != store.state.song_info.id) {
        store.commit("play", false);
        // 请求URL
        const info = await getSongUrl(item.resourceId);
        let song = {
          id: item.resourceId,
          name: item.resourceExtInfo.songData.name,
          author: item.resourceExtInfo.artists.map((i:any) => i.name).join("/"),
          url: info.data[0].url,
          img: item.uiElement.image.imageUrl
        }
        console.log(song);
        
        // 设置歌曲信息
        store.commit("setSongInfo",song);
        // store.commit("add_songList",song)
        // 再由 home 页面监听播放
      // store.commit("play", true);
      }
    }
    const show = function icon_click(a: string): void {
      console.log(a);
    };

    // 登录
    async function login(): Promise<void> {
      const info = await loginByPhoneAndPassword();
      localStorage.setItem("cookieMusic", info.cookie);
      localStorage.setItem("tokenMusic", info.token);
    }

    const goSearch = () => {
      router.push({path: "/search", query: {}})
    }

    // 退出登录
    function logoutDD(): void {
      localStorage.removeItem("cookieMusic");
      localStorage.removeItem("tokenMusic");
      logout();
    }

    function recentcontactDD(): void {
      recentcontact();
    }

    function goSongList(id: string):void {
      router.push({path:"/songList", query:{id}})
    }

    return {
      active,
      show,
      login,
      router,
      goSearch,
      logoutDD,
      onChange,
      topBg,
      change_new,
      goSongList,
      recentcontactDD,
      ...toRefs(info),
      playMusicSingle
    };
  },
});
</script>

<style lang="less" scoped>
.nav {
    position: fixed;
    z-index: 1111;
    top: 0;
    padding: 0 8px;
    height: 40px;
    display: flex;
    align-items: center;
    .pop {
      font-size: 16px;
      .van-icon {
        font-size: 20px;
        color: #fff;
      }
    }
    .search {
      width: 300px;
      height: 30px;
      border-radius: 30px;
      margin-left: 8px;
      display: flex;
      align-items: center;
      background-color: #fff;
      padding-left: 10px;
      .pop();
      p {
        margin-left: 5px;
        color: #ccc;
      }
    }
    img {
      width: 30px;
    }
  }
.discover {
  // overflow: hidden;
  background-color: rgb(245,245,245);
  width: 100vw;
  height: 617px;
  
  
  .top {
    position: relative;
    padding-top: 40px;
    transition: all 0.5s;
    height: 260px;
    box-sizing: border-box;
    z-index: 111;
    overflow: hidden;
    // 用来加模糊背景图片
    .top_blur {
      position: absolute;
      top: 0;
      height: 260px;
      left: 0;
      width: 375px;
      filter: blur(10px);
      z-index: -11111;
      transition: all 0.5s;
    }
    .swiper {
      padding: 8px 0;
      height: 140px;
      .my-swipe {
        .van-swipe-item {
          box-sizing: border-box;
          padding: 0 8px;
          display: flex;
          align-items: center;
          img {
            width: 100%;
            border-radius: 5px;
          }
        }
      }
    }
    // 圆形图标
    .icon_top {
      box-sizing: border-box;
      // background-color: #fff;
      padding: 8px;
      width: 375px;
      height: 70px;
      border-bottom: 1px solid #ccc;
      z-index: 111;
      .icon_wrapper {
        box-sizing: border-box;
        border-radius: 8px;
        display: flex;
        font-size: 10px;
        .icon_item {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          width: 68px;
          box-sizing: border-box;
          padding-bottom: 3px;
          text-align: center;
          color: #fff;
          .img_wrapper {
            width: 35px;
            height: 35px;
            background-color: rgb(247, 0, 0);
            border-radius: 50%;
            img {
              width: 35px;
            }
          }
        }
      }
    }
  }
  // 推荐歌单
  .recommend {
    width: 100vw;
    height: 190px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 8px;
    overflow: hidden;
    .rec_title {
      display: flex;
      justify-content: space-between;
      margin: 8px;
      .rec_des {
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .rec_more {
        font-size: 12px;
        border: 1px solid #ccc;
        border-radius: 15px;
        padding: 3px 6px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        box-sizing: border-box;
        min-width: 50px;
        img {
          width: 8px;
        }
      }
    }
    .rec_song {
      display: flex;
      padding-left: 8px;
      .rec_item {
        width: 110px;
        position: relative;
        margin-right: 8px;
        .img {
          width: 110px;
          height: 110px;
        }
        span {
          font-size: 12px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .playCount {
          position: absolute;
          top: 2px;
          right: 2px;
          padding: 2px 4px;
          color: #fff;
          font-size: 10px;
          display: flex;
          padding: 3px;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 5px;
          img {
            width: 9px;
          }
        }
      }
    }
  }
  // 长推荐区域
  .long {
    .recommend;
    box-sizing: border-box;
    background-color: #fff;
    height: 210px;
    margin-bottom: 8px;
    box-sizing: border-box;
    .swiper {
      margin-left: 8px;
      display: flex;
      .swiper_item {
        height: 160px;
        width: 350px;
        margin-right: 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .item {
          height: 60px;
          display: flex;
          box-sizing: border-box;
          margin-bottom: 3px;
          .img_wrapper {
            height: 100%;
            width: 50px;
            padding-right: 5px;
            // padding-bottom: 5px;
            box-sizing: border-box;
            .img {
              width: 45px;
              height: 45px;
              border-radius: 5px;
              box-sizing: border-box;
              overflow: hidden;
            }
          }
          .info {
            width: 280px;
            height: 100%;
            display: flex;
            flex-direction: column;
            margin-left: 7px;
            border-bottom: 1px solid #ccc;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            .song_title {
              font-size: 10px;
              margin: 2px 0;
              display: flex;
              align-items: center;
              .song_name {
                font-size: 15px;
                white-space: nowrap;
              }
              .song_author {
                color: #ccc;
                font-size: 10px;
                white-space: nowrap;
              }
            }
            .song_subTitle {
              font-size: 12px;
              color: rgb(182, 182, 182);
              .vip {
                color: red;
                border: 1px solid red;
                border-radius: 3px;
                opacity: 0.6;
              }
              .dujia {
                .vip
              }
              .SQ {
                .vip
              }
              .hear_try {
                color: rgb(0, 217, 255);
                border: 1px solid rgb(0, 153, 255);
                border-radius: 3px;
                opacity: 0.6;
              }
            }
            .percent {
              color: #f0d470;
              font-size: 10px;
            }
          }
        }
      }
    }
  }
  // .MUSIC_MLOG {
  //   .item_img {
  //     width: 110px;
  //     height: 151px;
  //     display: flex;
  //     background-color: rgba(0,0,0,0.8);
  //     align-items: center;
  //     .van-image__img {
  //       height: auto !important;
  //     }
  //   }
  // }
  // 音乐日历
  .calendar {
    .recommend;
    padding: 8px;
    height: 160px;
    .rec_title {
      margin: 0;
      margin-bottom: 8px;
    }
    .item_calendar {
      height: 50px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      .left {
        width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-bottom: 1px solid #ccc;
        .left_top {
          .day {
            color: #ccc;
            font-size: 14px;
            margin-right: 3px;
          }
          .label {
            color: #f0d470;
            background-color: rgb(252, 252, 183);
            font-size: 12px;
          }
          .label_tomrrow {
            .label;
            color: black;
            background-color: rgba(0, 0, 0, 0.1);
            padding: 2px;
            border-radius: 3px;
          }
        }
        .left_bottom {
          font-size: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .right_img {
        img {
          width: 45px;
          height: 45px;
          border-radius: 5px;
        }
      }
    }
  }
  // 新歌，新碟
  .new {
    .long;
    margin-bottom: 0;
    .notClick {
      color: #ccc;
    }
  }
  // 云贝广告
  .yunbei {
    .long;
    height: 90px;
    .rec_des {
      font-size: 12px;
      color: black;
      font-weight: 0 !important;
    }
    .info {
      border-bottom: 0 !important;
    }
  }
  // 24小时播客
  .podcast24 {
    .recommend();
    .play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-35%,-83%);
      opacity: .5;
    }
  }
  // 视频合集
  .video {
    .recommend;
    // 这里实现背景模糊，中间一小块区域清晰的思路是：父div相对定位，一个字div用来放模糊图片当背景，用css中的blur来模糊，注意别设置 z-index 太小，否则会导致图片加载完后不主动显示，要鼠标点击一下才显示；
                                                        // 另一个子div用来放清晰图片，两个图片链接一样，这个放清晰图片的div绝对定位到父div的中间即可，写display flex 的目的是让图片居中
    .img_wrapper {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      .img {
        filter: blur(10px);
        // z-index: -1111;
      }
      .mirror {
        width: 100px;
        height: 65px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        overflow: hidden;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        .img_mirror {
          width: 110px;
          height: 110px;
      }
      }
    }
  }
}
</style>
