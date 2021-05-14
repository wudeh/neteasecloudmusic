<template>
  <div>
    <form action="/">
      <van-search
        v-model="word"
        @update:model-value="suggest()"
        placeholder="请输入搜索关键词"
        @search="onSearch"
      />
    </form>
    <van-tabs ref="tab" v-model:active="activeName"  sticky @click="onClick">
      <van-tab title="综合" name="1018">
        <div class="wrapper" v-if="song">
          <!-- 单曲 -->
          <div class="song" v-if="song">
            <div class="title">
              单曲
            </div>
            <div class="song_item" v-for="(item, index) in song.songs" :key="index">
              <div class="info">
                <div class="left"  @click="playMusicSingle(item)">
                  <div  v-word="word" class="name">{{ item.name }}&nbsp;<span v-if="item.officialTags">{{ item.officialTags[0]}}</span></div>
                  <div class="author">
                    <span class="origin" v-for="(it, i) in item.specialTags" :key="i">{{ it }}</span>
                    <span  v-word="word" class="origin" v-if="item.originCoverType == 1">原唱</span>
                    <span class="vip" v-if="item.fee == 1">VIP</span>
                    <span class="hear_try" v-if="item.fee == 1">试听</span>
                    <span class="sq" v-if="item.privilege.maxbr >= 999000">SQ</span>
                    <span  v-word="word" class="singer" v-for="(it, i) in item.ar" :key="i"><span v-if="i > 0">/</span>{{ it.name }} </span>
                    - 
                    <span  v-word="word" class="album">{{ item.al.name }}</span>
                  </div>
                  <div class="originSinger" v-if="item.originSongSimpleData">
                    <span>原唱：</span>
                    <span v-for="(it, i) in item.originSongSimpleData.artists" :key="i"><i v-if="i > 0">/</i>{{it.name}}</span>
                  </div>
                </div>
                <div class="rignt" @click="store.dispatch(`set_pop_detail`, item)">
                  <img src="../../../public/img/icons/more_gray.svg" alt="">
                </div>
              </div>
            </div>
            <div v-if="song.more" @click="changeActive(`1`)"  v-word="word" class="more">{{ song.moreText }}&nbsp;></div>
          </div>
          <!-- 歌手艺人 -->
          <div class="user" v-if="user">
             <div class="title">艺人</div>
              <div class="item" v-for="(item, index) in artist.artists" :key="index">
                <div class="left">
                  <van-image class="img" radius="50%" :src="item.img1v1Url" />
                  <img v-if="item.picUrl" src="https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4874132307/4499/f228/d867/da64b9725e125943ad4e14e4c72d0884.png" alt="">
                </div>
                <div class="info">
                  <div class="name"  v-word="word">
                    {{ item.name}}
                  </div>
                </div>
                <span class="follow" v-if="!item.followed">+&nbsp;关注</span>
                <span class="followed" v-else>已关注</span>
              </div>
              <div v-if="artist.more" @click="changeActive(`100`)"  v-word="word" class="more">{{ artist.moreText }}&nbsp;></div>
          </div>
          <!-- 歌单 -->
          <div class="playList" v-if="playList">
            <div class="title">歌单</div>
            <div class="item" v-for="(item, index) in playList.playLists" :key="index" @click="router.push({path:`/songList`, query:{id: item.id}})">
              <div class="left">
                <van-image class="img" radius="8" :src="item.coverImgUrl" />
              </div>
              <div class="info">
                <div class="name"  v-word="word">
                  {{ item.name}}
                </div>
                <span>{{ item.trackCount }}首，by&nbsp;{{ item.creator.nickname }}，播放{{ numFilter(item.playCount) }}次</span>
              </div>
            </div>
            <div v-if="playList.more" @click="changeActive(`1000`)"  v-word="word" class="more">{{ playList.moreText }}&nbsp;></div>
          </div>
          <!-- 视频 -->
          <div class="video" v-if="video">
            <div class="title">视频</div>
            <div class="item" v-for="(item, index) in video.videos" :key="index">
              <div class="left">
                <van-image class="img" radius="8" :src="item.coverUrl" />
                <img src="../../../public/img/icons/play_white.svg" alt="">
              </div>
              <div class="info">
                <div class="name"  v-word="word">
                  {{ item.title }}
                </div>
                <span>{{ timeFilter(item.durationms) }}，by&nbsp;{{ item.creator[0].userName }}，{{ numFilter(item.playTime) }}播放</span>
              </div>
            </div>
            <div v-if="video.more" @click="changeActive(`1014`)"  v-word="word" class="more">{{ video.moreText }}&nbsp;></div>
          </div>
          <!-- 相关搜索 -->
          <div class="searchSimilar" v-if="sim_query">
            <div class="title">相关搜索</div>
            <div class="item" v-for="(item, index) in sim_query.sim_querys" :key="index">{{ item.keyword }}</div>
          </div>
          <!-- 专辑 -->
          <div class="playList" v-if="album">
            <div class="title">专辑</div>
            <div class="item" v-for="(item, index) in album.albums" :key="index">
              <div class="left">
                <van-image class="img" radius="8" :src="item.picUrl" />
              </div>
              <div class="info">
                <div class="name"  v-word="word">
                  {{ item.name}}
                </div>
                <span v-word="word">{{ item.artist.name }}&nbsp; {{ getDate(item.publishTime) }}</span>
              </div>
            </div>
            <div v-if="song.more" @click="changeActive(`10`)"  v-word="word" class="more">{{ album.moreText }}&nbsp;></div>
          </div>
          <!-- 电台播单 -->
          <div class="djRadio" v-if="djRadio">
            <div class="title">播单（电台）</div>
            <div class="item" v-for="(item, index) in djRadio.djRadios" :key="index">
              <div class="left">
                <van-image class="img" radius="8" :src="item.picUrl" />
              </div>
              <div class="info">
                <div class="name"  v-word="word">
                  {{ item.name}}
                </div>
                <span>{{ item.programCount }}个声音，by&nbsp;{{ item.dj.nickname }}，播放{{ numFilter(item.playCount) }}次</span>
              </div>
            </div>
            <div v-if="djRadio.more" @click="changeActive(`1009`)"  v-word="word" class="more">{{ djRadio.moreText }}&nbsp;></div>
          </div>
          <!-- 用户 -->
          <div class="user" v-if="user">
             <div class="title">用户</div>
              <div class="item" v-for="(item, index) in user.users" :key="index">
                <div class="left">
                  <van-image class="img" radius="50%" :src="item.avatarUrl" />
                  <img v-if="item.avatarDetail" :src="item.avatarDetail.identityIconUrl" alt="">
                </div>
                <div class="info">
                  <div class="name"  v-word="word">
                    {{ item.nickname}}
                    <img v-if="item.gender == 1" src="../../../public/img/icons/gender_boy.svg" alt="">
                    <img v-else src="../../../public/img/icons/gender_girl.svg" alt="">
                  </div>
                  <span>{{ item.description}}</span>
                </div>
                <span class="follow" v-if="!item.followed">+&nbsp;关注</span>
                <span class="followed" v-else>已关注</span>
              </div>
              <div v-if="user.more" @click="changeActive(`1002`)"  v-word="word" class="more">{{ user.moreText }}&nbsp;></div>
          </div>
        </div>
      </van-tab>
      <van-tab title="单曲" name="1">
        <van-list
          v-model:loading="Loading"
          v-model:error="Error"
          :immediate-check="false"
          :finished="song.Finish"
          error-text="请求失败，点击重新加载"
          finished-text="已经到底啦"
          @load="loadMore"
        >
          <template v-slot:loading>
            <div style="display:flex;align-items:center;justify-content:center;">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="">
              <span>加载中...</span>
            </div>
          </template>
          <div class="song" v-if="songs">
            <div class="title">
              播放全部
            </div>
            <div class="song_item" v-for="(item, index) in songs" :key="index">
              <div class="info">
                <div class="left" @click="playMusicSingle(item)">
                  <div  v-word="word" class="name">{{ item.name }}&nbsp;<span v-if="item.officialTags">{{ item.officialTags[0]}}</span></div>
                  <div class="author">
                    <span class="origin" v-for="(it, i) in item.specialTags" :key="i">{{ it }}</span>
                    <span  v-word="word" class="origin" v-if="item.originCoverType == 1">原唱</span>
                    <span class="vip" v-if="item.fee == 1">VIP</span>
                    <span class="hear_try" v-if="item.fee == 1">试听</span>
                    <span class="sq" v-if="item.privilege.maxbr >= 999000">SQ</span>
                    <span  v-word="word" class="singer" v-for="(it, i) in item.ar" :key="i"><span v-if="i > 0">/</span>{{ it.name }} </span>
                    - 
                    <span  v-word="word" class="album">{{ item.al.name }}</span>
                  </div>
                  <div class="originSinger" v-if="item.originSongSimpleData">
                    <span>原唱：</span>
                    <span v-for="(it, i) in item.originSongSimpleData.artists" :key="i"><i v-if="i > 0">/</i>{{it.name}}</span>
                  </div>
                </div>
                <div class="rignt">
                  <img src="../../../public/img/icons/more_gray.svg" alt="">
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="专辑" name="10">
        <van-list
          v-model:loading="albumLoading"
          v-model:error="Error"
          :immediate-check="false"
          :finished="album.Finish"
          error-text="请求失败，点击重新加载"
          finished-text="已经到底啦"
          @load="loadMore"
        >
          <template v-slot:loading>
            <div style="display:flex;align-items:center;justify-content:center;">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="">
              <span>加载中...</span>
            </div>
          </template>
          <div class="playList">
            <div class="item" v-for="(item, index) in albums" :key="index">
              <div class="left">
                <van-image class="img" radius="8" :src="item.picUrl" />
              </div>
              <div class="info">
                <div class="name"  v-word="word">
                  {{ item.name}}
                </div>
                <span v-word="word">{{ item.artist.name }}&nbsp; {{ getDate(item.publishTime) }}</span>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="视频" name="1014">
        <van-list
          v-model:loading="videoLoading"
          v-model:error="Error"
          :immediate-check="false"
          :finished="video.Finish"
          error-text="请求失败，点击重新加载"
          finished-text="已经到底啦"
          @load="loadMore"
        >
        <template v-slot:loading>
            <div style="display:flex;align-items:center;justify-content:center;">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="">
              <span>加载中...</span>
            </div>
          </template>
        <div class="video">
            <div class="item" v-for="(item, index) in videos" :key="index">
              <div class="left">
                <van-image class="img" radius="8" :src="item.coverUrl" />
                <img src="../../../public/img/icons/play_white.svg" alt="">
              </div>
              <div class="info">
                <div class="name"  v-word="word">
                  {{ item.title }}
                </div>
                <span>{{ timeFilter(item.durationms) }}，by&nbsp;{{ item.creator[0].userName }}，{{ numFilter(item.playTime) }}播放</span>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="歌手" name="100">
        <van-list
          v-model:loading="artistLoading"
          v-model:error="Error"
          :immediate-check="false"
          :finished="artist.Finish"
          error-text="请求失败，点击重新加载"
          finished-text="已经到底啦"
          @load="loadMore"
        >
        <template v-slot:loading>
            <div style="display:flex;align-items:center;justify-content:center;">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="">
              <span>加载中...</span>
            </div>
          </template>
        <div class="user">
              <div class="item" v-for="(item, index) in artists" :key="index">
                <div class="left">
                  <van-image class="img" radius="50%" :src="item.img1v1Url" />
                  <img v-if="item.picUrl" src="https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4874132307/4499/f228/d867/da64b9725e125943ad4e14e4c72d0884.png" alt="">
                </div>
                <div class="info">
                  <div class="name"  v-word="word">
                    {{ item.name}}
                  </div>
                  <span>{{ item.description}}</span>
                </div>
                <span class="follow" v-if="!item.followed">+&nbsp;关注</span>
                <span class="followed" v-else>已关注</span>
              </div>
          </div>
          </van-list>
      </van-tab>
      <van-tab title="歌单" name="1000">
        <van-list
          v-model:loading="playListLoading"
          v-model:error="Error"
          :immediate-check="false"
          :finished="playList.Finish"
          error-text="请求失败，点击重新加载"
          finished-text="已经到底啦"
          @load="loadMore"
        >
        <template v-slot:loading>
            <div style="display:flex;align-items:center;justify-content:center;">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="">
              <span>加载中...</span>
            </div>
          </template>
        <div class="playList">
            <div class="item" v-for="(item, index) in playLists" :key="index">
              <div class="left">
                <van-image class="img" radius="8" :src="item.coverImgUrl" />
              </div>
              <div class="info">
                <div class="name"  v-word="word">
                  {{ item.name}}
                </div>
                <span>{{ item.trackCount }}首，by&nbsp;{{ item.creator.nickname }}，播放{{ numFilter(item.playCount) }}次</span>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="用户" name="1002">
        <van-list
          v-model:loading="userLoading"
          v-model:error="Error"
          :immediate-check="false"
          :finished="user.Finish"
          error-text="请求失败，点击重新加载"
          finished-text="已经到底啦"
          @load="loadMore"
        >
        <template v-slot:loading>
            <div style="display:flex;align-items:center;justify-content:center;">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="">
              <span>加载中...</span>
            </div>
          </template>
         <div class="user">
              <div class="item" v-for="(item, index) in users" :key="index">
                <div class="left">
                  <van-image class="img" radius="50%" :src="item.avatarUrl" />
                  <img v-if="item.avatarDetail" :src="item.avatarDetail.identityIconUrl" alt="">
                </div>
                <div class="info">
                  <div class="name"  v-word="word">
                    {{ item.nickname}}
                    <img v-if="item.gender == 1" src="../../../public/img/icons/gender_boy.svg" alt="">
                    <img v-else src="../../../public/img/icons/gender_girl.svg" alt="">
                  </div>
                  <span>{{ item.description}}</span>
                </div>
                <span class="follow" v-if="!item.followed">+&nbsp;关注</span>
                <span class="followed" v-else>已关注</span>
              </div>
          </div>
          </van-list>
      </van-tab>
      <van-tab title="MV" name="1004">
        <van-list
          v-model:loading="mvLoading"
          v-model:error="Error"
          :immediate-check="false"
          :finished="MV.Finish"
          error-text="请求失败，点击重新加载"
          finished-text="已经到底啦"
          @load="loadMore"
        >
        <template v-slot:loading>
            <div style="display:flex;align-items:center;justify-content:center;">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="">
              <span>加载中...</span>
            </div>
          </template>
        <div class="video">
            <div class="item" v-for="(item, index) in mvs" :key="index">
              <div class="left">
                <van-image class="img" radius="8" :src="item.cover" />
                <img src="../../../public/img/icons/play_white.svg" alt="">
              </div>
              <div class="info">
                <div class="name"  v-word="word">
                  {{ item.name }}
                </div>
                <span>{{ timeFilter(item.duration) }}，by&nbsp;{{ item.artistName }}，{{ numFilter(item.playCount) }}播放</span>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="歌词" name="1006">歌词 3</van-tab>
      <van-tab title="电台" name="1009">
        <van-list
          v-model:loading="djRadioLoading"
          v-model:error="Error"
          :immediate-check="false"
          :finished="djRadio.Finish"
          error-text="请求失败，点击重新加载"
          finished-text="已经到底啦"
          @load="loadMore"
        >
        <template v-slot:loading>
            <div style="display:flex;align-items:center;justify-content:center;">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="">
              <span>加载中...</span>
            </div>
          </template>
        <div class="djRadio">
            <div class="item" v-for="(item, index) in djRadios" :key="index">
              <div class="left">
                <van-image class="img" radius="8" :src="item.picUrl" />
              </div>
              <div class="info">
                <div class="name"  v-word="word">
                  {{ item.name}}
                </div>
                <span>{{ item.programCount }}个声音，by&nbsp;{{ item.dj.nickname }}，播放{{ numFilter(item.playCount) }}次</span>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
    <!-- 搜索建议 -->
    <div class="suggest" v-if="suggestWord.length">
      <div class="item" v-for="(item,index) in suggestWord" :key="index" v-html="item"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, onBeforeMount,reactive, toRefs, ref, watch} from 'vue'
  import { getSearchHot, getSuggest, getsearchResult } from "../../api/discover"
  import { useStore } from 'vuex'
  import { useRouter,useRoute } from "vue-router";
  import { sendTimeConversion, numFilter } from "../../utils/num";

  interface info {
    word: string,
    activeName: number,
    pageNo: number,
    Loading: boolean,
    Error: boolean,
    Finish: boolean,
    hotWord: Array<any>,
    suggestWord: Array<any>,
    timer: any,
    song: any,
    songs: any,
    songPageNo: number,
    playList: any,
    playLists: any,
    playListPageNo: number,
    playListLoading: boolean,
    video: any,
    videoPageNo: number,
    videos: any,
    videoLoading: boolean,
    sim_query: any,
    album: any,
    albumPageNo: number,
    albums: any,
    albumLoading: boolean,
    djRadio: any,
    djRadioPageNo: number,
    djRadios: any,
    djRadioLoading: boolean,
    user: any,
    userPageNo: number,
    users: any,
    userLoading: boolean,
    artist: any,
    artistPageNo: number
    artists: any,
    artistLoading: boolean,
    MV: any,
    mvLoading: boolean,
    mvs: any,
    mvsPageNo: number
    lyric: any,
    lyrics: Array<any>,
    lyricPageNo: number,
    lyricLoading: boolean
  }
  export default defineComponent({
    name: "searchResult",
    setup: () => {
      const store = useStore();
      const router = useRouter();
      const id: any = router.currentRoute.value.query.word;
      let tab = ref();
      const data = reactive<info>({
        word: "",
        activeName: 1018,                                        
        pageNo: 0,
        Loading: true,
        Error: false,
        Finish: false,
        hotWord: [],
        suggestWord: [],
        timer: null,
        song: {songs:[]},
        songs: [],
        songPageNo: 0,
        playList: {playLists:[]},
        playLists: [],
        playListPageNo: 0,
        playListLoading: false,
        video: {videos:[]},
        videoPageNo: 0,
        videos: [],
        videoLoading: false,
        sim_query: {sim_querys:[]},
        album: {albums:[]},
        albumPageNo: 0,
        albums: [],
        albumLoading: false,
        djRadio: {djRadios:[]},
        djRadioPageNo: 0,
        djRadios: [],
        djRadioLoading: false,
        user: {userprofiles:[]},
        userPageNo: 0,
        users: [],
        userLoading: false,
        artist: {artists:[]},
        artistPageNo: 0,
        artists: [],
        artistLoading: false,
        MV: {mvs:[]},
        mvs: [],
        mvLoading: false,
        mvsPageNo: 0,
        lyric: {},
        lyrics: [],
        lyricPageNo: 0,
        lyricLoading: false
      })

      onBeforeMount(async () => {
        // store.commit("set_load", true)
        data.word = id;
        // let info = await getsearchResult(data.word,data.activeName,data.pageNo);
        // data.song = info.result.song;
        // data.playList = info.result.playList;
        // data.video = info.result.video;
        // data.sim_query = info.result.sim_query;
        // data.album = info.result.album;
        // data.djRadio = info.result.djRadio;
        // data.user = info.result.user;
        // data.artist = info.result.artist;
        // store.commit("set_load", false)
      })

      const suggest = async (i: string) => {
        data.suggestWord = [];
        if(!data.word) return;
        if(data.timer) clearTimeout(data.timer);
        data.timer = setTimeout(async () => {
          let info = await getSuggest(data.word);
          if(info.result) {
            info.result.allMatch.forEach((item: any) => {
              data.suggestWord.push(item.keyword.replace(data.word,`<span style="color: red">${data.word}</span>`))
            });
          }
        }, 500);
      }

      const onSearch = () => {
        router.push({path: "/searchResult", query: {word: data.word}})
      }

      const onClick = async (name: number, title: string) => {
        // console.log(name);
        // data.song = {songs:[]}
        // data.playList = {playLists:[]}
        // data.video = {videos:[]}
        // data.sim_query = {sim_querys:[]}
        // data.album = {albums:[]}
        // data.djRadio = {djRadios:[]}
        // data.user = {userprofiles:[]}
        // data.MV = {mvs:[]}
        // data.artist = {artists:[]}
        // data.lyric = [];
        // data.pageNo = 0;
        // data.Finish = false;
        // loadMore();
      }

      const loadMore = async () => {
        console.log("触发加载更多");
        
        if(data.activeName == 1) {
          data.Loading = true;
          let info = await getsearchResult(data.word,data.activeName,data.songPageNo);
          data.songs = data.songs.concat(info.result.songs);
          data.Loading = false;
          data.songPageNo += 1;
          if(data.songs.length >= info.result.songCount) {
            data.song.Finish = true;
          }
        }
        if(data.activeName == 10) {
          data.albumLoading = true;
          let info = await getsearchResult(data.word,data.activeName,data.albumPageNo);
          data.albums = data.albums.concat(info.result.albums);
          data.albumLoading = false;
          data.albumPageNo += 1;
          if(data.albums.length >= info.result.albumCount) {
            data.album.Finish = true;
          }
        }
        if(data.activeName == 100) {
          data.artistLoading = true
          let info = await getsearchResult(data.word,data.activeName,data.artistPageNo);
          data.artists = data.artists.concat( info.result.artists);
          data.artistLoading = false
          data.artistPageNo += 1;
          if(data.artist.artists.length >= info.result.artistCount) {
            data.artist.Finish = true
          }
        }
        if(data.activeName == 1000) {
          data.playListLoading = true;
          let info = await getsearchResult(data.word,data.activeName,data.playListPageNo);
          data.playLists = data.playLists.concat( info.result.playlists);
          data.playListLoading = false;
          data.playListPageNo += 1;
          if(!info.result.hasMore) {
            data.playList.Finish = true;
          }
        }
        if(data.activeName == 1002) {
          data.userLoading = true;
          let info = await getsearchResult(data.word,data.activeName,data.userPageNo);
          data.users = data.users.concat(info.result.userprofiles);
          data.userPageNo += 1;
          data.userLoading = false;
          if(data.users.length >=  info.result.userprofileCount) {
            data.user.Finish = true;
          }
        }
        if(data.activeName == 1004) {
          data.mvLoading = true
          let info = await getsearchResult(data.word,data.activeName,data.mvsPageNo);
          if(info.result.mvs) {
            data.mvs = data.mvs.concat(info.result.mvs);
          }
          data.mvLoading = false;
          data.mvsPageNo += 1;
          if(data.mvs.length >= info.result.mvCount) {
            data.MV.Finish = true;
          }
        }
        if(data.activeName == 1006) {
          data.lyricLoading = true;
          let info = await getsearchResult(data.word,data.activeName,data.lyricPageNo);
          data.lyrics = data.lyrics.concat(info.result.songs);
          data.lyricLoading = false;
          data.lyricPageNo += 1;
          if(data.lyrics.length >= info.result.songCount) {
            data.lyric.Finish = true
          }
        }
        if(data.activeName == 1009) {
          data.djRadioLoading = true
          let info = await getsearchResult(data.word,data.activeName,data.djRadioPageNo);
          data.djRadios = data.djRadios.concat(info.result.djRadios);
          data.djRadioLoading = false
          data.djRadioPageNo += 1;
          if(data.djRadios.length >= info.result.djRadiosCount) {
            data.djRadio.Finish = true;
          }
        }
        if(data.activeName == 1014) {
          data.videoLoading = true;
          let info = await getsearchResult(data.word,data.activeName,data.videoPageNo);
          data.videos =  data.videos.concat(info.result.videos);
          data.videoLoading = false;
          data.videoPageNo += 1;
          if(data.videos.length >= info.result.videoCount) {
            data.video.Finish = true;
          }
        }
        if(data.activeName == 1018) {
          store.commit("set_load", true)
          data.word = id;
          let info = await getsearchResult(data.word,data.activeName,data.pageNo);
          data.song = info.result.song;
          data.playList = info.result.playList;
          data.video = info.result.video;
          data.sim_query = info.result.sim_query;
          data.album = info.result.album;
          data.djRadio = info.result.djRadio;
          data.user = info.result.user;
          data.artist = info.result.artist;
          store.commit("set_load", false)
        }
        data.pageNo +=1;
        
      }

      const changeActive = (i: any) => {
        tab.value.scrollTo(i);
        if(data.activeName == 1 && data.songs.length) {
          return
        }
        if(data.activeName == 10 && data.albums.length) {
          return
          
        }
        if(data.activeName == 100 && data.artists.length) {
          return
        }
        if(data.activeName == 1000 && data.playLists.length) {
          return
        }
        if(data.activeName == 1002 && data.users.length) {
          return
        }
        if(data.activeName == 1004 && data.mvs.length) {
          return
        }
        if(data.activeName == 1006 && data.lyric.length) {
          return
        }
        if(data.activeName == 1009 && data.djRadios.length) {
          return
        }
        if(data.activeName == 1014 && data.videos.length) {
          return
        }
        if(data.activeName == 1018 && data.song.songs.length) {
          return
        }
        data.pageNo +=1;
        
        data.activeName = i;
        loadMore()
      }

      watch(() => data.activeName, (value) => {
        console.log(value);
        changeActive(value)
      })

      // 点击播放歌曲
     function playMusicSingle(item: any): void {
      console.log(item);
      console.log(item.ar);
      console.log(store.state.song_info.id);
      
      if(item.id == store.state.song_info.id) {
        console.log("是同一首");
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

      // 计算视频时长
      const timeFilter = (i: number) => {
        let a = Math.floor(i / 1000);
        return `${Math.floor(a/60)}`.padStart(2, "00") + ":" + `${a % 60}`.padStart(2, "0")
      }

      // 计算日期
      const getDate = (i: number) => {
        let a = new Date(i);       
        return `${a.getFullYear()}.${a.getMonth() + 1}.${a.getDate()}`
      }
      return {
        suggest,
        onSearch,
        tab,
        numFilter,
        timeFilter,
        onClick,
        playMusicSingle,
        router,
        store,
        changeActive,
        loadMore,
        getDate,
        ...toRefs(data)
      }
    },
    // activated: () => {
    //   // console.log(router.cur);
    //   router.push
      
    // },
    // deactivated
    // directives: {
    //   // 用来替换关键搜索词颜色的指令
    //   word(el,binding): void {
    //     // 参数 el, binding, vnode, oldVnode
    //     // beforeMount(el,binding) {
    //      el.innerHTML =  el.innerHTML.replace(binding.value, `<span style='color:rgb(0, 153, 255)'>${binding.value}</span>`)
    //     // },
    //   }
    // },
  })
</script>

<style lang="less" scoped>
.hot {
  padding: 8px;
  .title {
    font-size: 15px;
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 50%;
      display: flex;
      align-items: center;
      
      margin: 8px 0;
      .index {
        width: 22px;
        color: #ccc;
      }
      .three_color {
        color: red;
      }
      .three_text {
        font-weight: bold;
      }
      .img {
        width: 20px;
        // height: 20px;
        margin-left: 3px;
      }
    }
  }
}
.suggest {
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.2);
  .item {
    padding-left: 40px;
    padding-top: 8px;
    padding-bottom: 8px;
    background-color: #fff;
    border-bottom: 1px solid #ccc;

  }
}
.wrapper {
  padding: 8px;
  background-color: rgb(245,245,245);
}
  .song {
    padding: 8px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 10px;
    .title {
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
    }
    .song_item {
      padding: 8px 0;
      border-bottom: 1px solid #ccc;
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          flex-direction: column;
          color: #ccc;
          width: 300px;
          .name {
            color: black;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            span {
              color: orange;
              font-size: 12px;
            }
          }
          .vip {
            color: red;
            border: 1px solid red;
            border-radius: 3px;
            opacity: 0.6;
            font-size: 12px;
            margin-right: 1px;
          }
          .origin {
            .vip;
            color: #fff;
            background-color: red;
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
          .author {
            font-size: 14px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            height: 20px;
          }
          .originSinger {
            font-size: 12px;
          }
        }
      }
    }
  }
  .more {
    font-size: 13px;
    text-align: center;
    height: 30px;
    line-height: 30px;
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
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.video {
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
    }
   }
}
.searchSimilar {
  .playList;
  overflow: hidden;
  .item {
    float: left;
    padding: 8px;
    background-color: rgb(245, 245, 245);
    margin-right: 8px;
    margin-bottom: 8px;
    border-radius: 8px;
  }
}
.djRadio {
  .playList;
   padding: 8px;
   border-radius: 8px;
   background-color: #fff;
   margin-bottom: 10px;
}
.user {
  .djRadio;
  .item {
    align-items: center;
    .left {
    position: relative;
    img {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 20px;
      border-radius: 50%;
    }
  }
  .info {
    justify-content: space-around;
  }
  .followed {
    color: #ccc;
    padding: 5px;
    border: 1px solid #ccc;
    font-size: 12px;
    line-height: 12px;
    border-radius: 20px;
    white-space: nowrap;
    text-align: center
  }
  .follow {
    .followed;
    color: orange;
    border-color: orange;
  }
  }
}
// 单曲
.song {
  
}
</style>