<template>
  <div>
    <div class="top_search" style="display: flex; width: 100vw">
      <div class="back" @click="router.go(-1)" style="display: flex; align-items: center; justify-content: center; width: 10vw; margin-left: 10px">
        <img @click="router.go(-1)" src="../../../public/img/icons/left_arrow_black.svg" alt="" />
      </div>
      <div style="flex: 1">
        <form action="/">
          <van-search v-model="data.word" @blur="notShowSuggest()" @focus="ShowSuggest()" shape="round" @update:model-value="suggest()" placeholder="请输入搜索关键词" @search="onSearch" />
        </form>
      </div>
    </div>

    <van-tabs ref="tab" v-model:active="data.activeName" sticky>
      <van-tab title="综合" name="1018">
        <van-pull-refresh v-model="data.allRefreshing" @refresh="onRefresh">
          <template v-slot:loading>
            <div style="display: flex; align-items: center; justify-content: center">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
              <span>加载中...</span>
            </div>
          </template>
          <van-list v-model:loading="data.allLoading" v-model:error="data.allError" :immediate-check="true" :finished="data.allFinish" error-text="请求失败，点击重新加载" finished-text="" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="wrapper" v-if="data.song.songs.length">
              <!-- 单曲 -->
              <div class="song" v-if="data.song">
                <div class="title">单曲</div>
                <div class="song_item" v-for="(item, index) in data.song.songs" :key="index">
                  <div class="info">
                    <div class="left" @click="playMusicSingle(item)">
                      <div v-word="data.word" class="name">
                        {{ item.name }}&nbsp;<span v-if="item.officialTags">{{ item.officialTags[0] }}</span>
                      </div>
                      <div class="author">
                        <span class="origin" v-for="(it, i) in item.specialTags" :key="i">{{ it }}</span>
                        <span v-word="data.word" class="origin" v-if="item.originCoverType == 1">原唱</span>
                        <span class="vip" v-if="item.fee == 1">VIP</span>
                        <span class="hear_try" v-if="item.fee == 1">试听</span>
                        <span class="sq" v-if="item.privilege.maxbr >= 999000">SQ</span>
                        <span class="sq" v-if="item.privilege.flag >= 60 && item.privilege.flag < 70">独家</span>
                        <span v-word="data.word" class="singer" v-for="(it, i) in item.ar" :key="i"><span v-if="i > 0">/</span>{{ it.name }} </span>
                        -
                        <span v-word="data.word" class="album">{{ item.al.name }}</span>
                      </div>
                      <div class="author" v-if="item.alia.length">{{ item.alia[0] }}</div>
                      <div class="originSinger" v-if="item.originSongSimpleData">
                        <span>原唱：</span>
                        <span v-for="(it, i) in item.originSongSimpleData.artists" :key="i"><i v-if="i > 0">/</i>{{ it.name }}</span>
                      </div>
                    </div>
                    <!-- <div class="rignt" @click="popMoreInfo(item, 0)">
                      <img src="../../../public/img/icons/more_gray.svg" alt="" />
                    </div> -->
                    <div class="more">
                      <!-- 歌曲可能有相关 mv -->
                      <van-icon v-if="item.mv != 0" name="play-circle-o" @click="goMv(item.mv)" />
                      <!-- 点击弹出歌曲底部弹框信息 -->
                      <img @click="popMoreInfo(item, 0)" src="../../../public/img/icons/more_gray.svg" alt="" />
                    </div>
                  </div>
                </div>
                <div v-if="data.song.more" @click="changeActive(`1`)" v-word="data.word" class="more">{{ data.song.moreText }}&nbsp;></div>
              </div>
              <!-- 歌手艺人 -->
              <div class="user" v-if="data.user">
                <div class="title">艺人</div>
                <div class="item" v-for="(item, index) in data.artist.artists" :key="index" @click="goSingerDetail(item.id)">
                  <div class="left">
                    <van-image class="img" radius="50%" :src="item.img1v1Url" />
                    <img v-if="item.picUrl" src="https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4874132307/4499/f228/d867/da64b9725e125943ad4e14e4c72d0884.png" alt="" />
                  </div>
                  <div class="info">
                    <div class="name" v-word="data.word">
                      {{ item.name }}
                    </div>
                  </div>
                  <span class="follow" v-if="!item.followed">+&nbsp;关注</span>
                  <span class="followed" v-else>已关注</span>
                </div>
                <div v-if="data.artist.more" @click="changeActive(`100`)" v-word="data.word" class="more">{{ data.artist.moreText }}&nbsp;></div>
              </div>
              <!-- 歌单 -->
              <div class="playList" v-if="data.playList">
                <div class="title">歌单</div>
                <div class="item" v-for="(item, index) in data.playList.playLists" :key="index" @click="router.push({ path: `/songList`, query: { id: item.id,type: 2 } })">
                  <div class="left">
                    <van-image class="img" radius="8" :src="item.coverImgUrl" />
                  </div>
                  <div class="info">
                    <div class="name" v-word="data.word">
                      {{ item.name }}
                    </div>
                    <span>{{ item.trackCount }}首，by&nbsp;{{ item.creator.nickname }}，播放{{ numFilter(item.playCount) }}次</span>
                  </div>
                </div>
                <div v-if="data.playList.more" @click="changeActive(`1000`)" v-word="data.word" class="more">{{ data.playList.moreText }}&nbsp;></div>
              </div>
              <!-- 视频 -->
              <div class="video" v-if="data.video">
                <div class="title">视频</div>
                <div class="item" v-for="(item, index) in data.video.videos" :key="index" @click="router.push({ path: `/vid`, query: { vid: item.vid, type: item.type } })">
                  <div class="left">
                    <van-image class="img" radius="8" :src="item.coverUrl" />
                    <img src="../../../public/img/icons/play_white.svg" alt="" />
                  </div>
                  <div class="info">
                    <div class="name" v-word="data.word">
                      {{ item.title }}
                    </div>
                    <span>{{ timeFilter(item.durationms) }}，by&nbsp;{{ item.creator[0].userName }}，{{ numFilter(item.playTime) }}播放</span>
                  </div>
                </div>
                <div v-if="data.video.more" @click="changeActive(`1014`)" v-word="data.word" class="more">{{ data.video.moreText }}&nbsp;></div>
              </div>
              <!-- 相关搜索 -->
              <div class="searchSimilar" v-if="data.sim_query">
                <div class="title">相关搜索</div>
                <div class="item" v-for="(item, index) in data.sim_query.sim_querys" :key="index" @click="suggestClick(item.keyword)">{{ item.keyword }}</div>
              </div>
              <!-- 专辑 -->
              <div class="playList" v-if="data.album">
                <div class="title">专辑</div>
                <div class="item" v-for="(item, index) in data.album.albums" :key="index" @click="router.push({ path: `/songList`, query: { id: item.id,type: 10 } })">
                  <div class="left">
                    <van-image class="img" radius="8" :src="item.picUrl" />
                  </div>
                  <div class="info">
                    <div class="name" v-word="data.word">
                      {{ item.name }}
                    </div>
                    <span v-word="data.word">{{ item.artist.name }}&nbsp; {{ getDate(item.publishTime) }}</span>
                  </div>
                </div>
                <div v-if="data.song.more" @click="changeActive(`10`)" v-word="data.word" class="more">{{ data.album.moreText }}&nbsp;></div>
              </div>
              <!-- 电台播单 -->
              <div class="djRadio" v-if="data.djRadio">
                <div class="title">播单（电台）</div>
                <div class="item" v-for="(item, index) in data.djRadio.djRadios" :key="index" @click="router.push({ path: `/djProgram`, query: { id: item.id } })">
                  <div class="left">
                    <van-image class="img" radius="8" :src="item.picUrl" />
                  </div>
                  <div class="info">
                    <div class="name" v-word="data.word">
                      {{ item.name }}
                    </div>
                    <span>{{ item.programCount }}个声音，by&nbsp;{{ item.dj.nickname }}，播放{{ numFilter(item.playCount) }}次</span>
                  </div>
                </div>
                <div v-if="data.djRadio.more" @click="changeActive(`1009`)" v-word="data.word" class="more">{{ data.djRadio.moreText }}&nbsp;></div>
              </div>
              <!-- 用户 -->
              <div class="user" v-if="data.user" @click="notDone()">
                <div class="title">用户</div>
                <div class="item" v-for="(item, index) in data.user.users" :key="index">
                  <div class="left">
                    <van-image class="img" radius="50%" :src="item.avatarUrl" />
                    <img v-if="item.avatarDetail" :src="item.avatarDetail.identityIconUrl" alt="" />
                  </div>
                  <div class="info">
                    <div class="name" v-word="data.word">
                      {{ item.nickname }}
                      <img v-if="item.gender == 1" src="../../../public/img/icons/gender_boy.svg" alt="" />
                      <img v-else src="../../../public/img/icons/gender_girl.svg" alt="" />
                    </div>
                    <span>{{ item.description }}</span>
                  </div>
                  <span class="follow" v-if="!item.followed">+&nbsp;关注</span>
                  <span class="followed" v-else>已关注</span>
                </div>
                <div v-if="data.user.more" @click="changeActive(`1002`)" v-word="data.word" class="more">{{ data.user.moreText }}&nbsp;></div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="单曲" name="1">
        <van-pull-refresh v-model="data.songRefreshing" @refresh="onRefresh">
          <template v-slot:loading>
            <div style="display: flex; align-items: center; justify-content: center">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
              <span>加载中...</span>
            </div>
          </template>
          <van-list v-model:loading="data.Loading" v-model:error="data.songError" :immediate-check="true" :finished="data.songFinish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="song" v-if="data.songs">
              <!-- <div class="title">
              播放全部
            </div> -->
              <div class="song_item" v-for="(item, index) in data.songs" :key="index">
                <div class="info">
                  <div class="left" @click="playMusicSingle(item)">
                    <div v-word="data.word" class="name">
                      {{ item.name }}&nbsp;<span v-if="item.officialTags">{{ item.officialTags[0] }}</span>
                    </div>
                    <div class="author">
                      <span class="origin" v-for="(it, i) in item.specialTags" :key="i">{{ it }}</span>
                      <span v-word="data.word" class="origin" v-if="item.originCoverType == 1">原唱</span>
                      <span class="sq" v-if="item.privilege.flag >= 60 && item.privilege.flag < 70">独家</span>
                      <span class="vip" v-if="item.fee == 1">VIP</span>
                      <span class="hear_try" v-if="item.fee == 1">试听</span>
                      <span class="sq" v-if="item.privilege.maxbr >= 999000">SQ</span>
                      <span v-word="data.word" class="singer" v-for="(it, i) in item.ar" :key="i"><span v-if="i > 0">/</span>{{ it.name }} </span>
                      -
                      <span v-word="data.word" class="album">{{ item.al.name }}</span>
                    </div>
                    <div class="author" v-if="item.alia.length">{{ item.alia[0] }}</div>
                    <div class="originSinger" v-if="item.originSongSimpleData">
                      <span>原唱：</span>
                      <span v-for="(it, i) in item.originSongSimpleData.artists" :key="i"><i v-if="i > 0">/</i>{{ it.name }}</span>
                    </div>
                  </div>
                  <!-- <div class="rignt" @click="popMoreInfo(item, 0)">
                    <img src="../../../public/img/icons/more_gray.svg" alt="" />
                  </div> -->
                  <div class="more">
                      <!-- 歌曲可能有相关 mv -->
                      <van-icon v-if="item.mv != 0" name="play-circle-o" @click="goMv(item.mv)" />
                      <!-- 点击弹出歌曲底部弹框信息 -->
                      <img @click="popMoreInfo(item, 0)" src="../../../public/img/icons/more_gray.svg" alt="" />
                    </div>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="专辑" name="10">
        <van-pull-refresh v-model="data.albumRefreshing" @refresh="onRefresh">
          <template v-slot:loading>
            <div style="display: flex; align-items: center; justify-content: center">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
              <span>加载中...</span>
            </div>
          </template>
          <van-list v-model:loading="data.albumLoading" v-model:error="data.albumError" :immediate-check="true" :finished="data.albumFinish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="playList">
              <div class="item" v-for="(item, index) in data.albums" :key="index" @click="router.push({ path: `/songList`, query: { id: item.id,type: 10 } })">
                <div class="left">
                  <van-image class="img" radius="8" :src="item.picUrl" />
                </div>
                <div class="info">
                  <div class="name" v-word="data.word">
                    {{ item.name }}
                  </div>
                  <span v-word="data.word">{{ item.artist.name }}&nbsp; {{ getDate(item.publishTime) }}</span>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="视频" name="1014">
        <van-pull-refresh v-model="data.videoRefreshing" @refresh="onRefresh">
          <template v-slot:loading>
            <div style="display: flex; align-items: center; justify-content: center">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
              <span>加载中...</span>
            </div>
          </template>
          <van-list v-model:loading="data.videoLoading" v-model:error="data.videoError" :immediate-check="true" :finished="data.videoFinish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="video">
              <div class="item" v-for="(item, index) in data.videos" :key="index" @click="router.push({ path: `/vid`, query: { vid: item.vid, type: item.type } })">
                <div class="left">
                  <van-image class="img" radius="8" :src="item.coverUrl" />
                  <img src="../../../public/img/icons/play_white.svg" alt="" />
                </div>
                <div class="info">
                  <div class="name" v-word="data.word">
                    {{ item.title }}
                  </div>
                  <span>{{ timeFilter(item.durationms) }}，by&nbsp;{{ item.creator[0].userName }}，{{ numFilter(item.playTime) }}播放</span>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="歌单" name="1000">
        <van-pull-refresh v-model="data.playListRefreshing" @refresh="onRefresh">
          <template v-slot:loading>
            <div style="display: flex; align-items: center; justify-content: center">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
              <span>加载中...</span>
            </div>
          </template>
          <van-list v-model:loading="data.playListLoading" v-model:error="data.playListError" :immediate-check="true" :finished="data.playListFinish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="playList">
              <div class="item" v-for="(item, index) in data.playLists" :key="index" @click="router.push({ path: `/songList`, query: { id: item.id,type: 2 } })">
                <div class="left">
                  <van-image class="img" radius="8" :src="item.coverImgUrl" />
                </div>
                <div class="info">
                  <div class="name" v-word="data.word">
                    {{ item.name }}
                  </div>
                  <span>{{ item.trackCount }}首，by&nbsp;{{ item.creator.nickname }}，播放{{ numFilter(item.playCount) }}次</span>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>

      <van-tab title="MV" name="1004">
        <van-pull-refresh v-model="data.MVRefreshing" @refresh="onRefresh">
          <template v-slot:loading>
            <div style="display: flex; align-items: center; justify-content: center">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
              <span>加载中...</span>
            </div>
          </template>
          <van-list v-model:loading="data.mvLoading" v-model:error="data.mvError" :immediate-check="true" :finished="data.mvFinish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="video">
              <div class="item" v-for="(item, index) in data.mvs" :key="index" @click="router.push({ path: `/vid`, query: { vid: item.id, type: item.type } })">
                <div class="left">
                  <van-image class="img" radius="8" :src="item.cover" />
                  <img src="../../../public/img/icons/play_white.svg" alt="" />
                </div>
                <div class="info">
                  <div class="name" v-word="data.word">
                    {{ item.name }}
                  </div>
                  <span>{{ timeFilter(item.duration) }}，by&nbsp;{{ item.artistName }}，{{ numFilter(item.playCount) }}播放</span>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <!-- <van-tab title="歌词" name="1006">歌词 3</van-tab> -->
      <van-tab title="电台" name="1009">
        <van-pull-refresh v-model="data.djRadioRefreshing" @refresh="onRefresh">
          <template v-slot:loading>
            <div style="display: flex; align-items: center; justify-content: center">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
              <span>加载中...</span>
            </div>
          </template>
          <van-list v-model:loading="data.djRadioLoading" v-model:error="data.djRadioError" :immediate-check="true" :finished="data.djRadioFinish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="djRadio">
              <div class="item" v-for="(item, index) in data.djRadios" :key="index" @click="router.push({ path: `/djProgram`, query: { id: item.id } })">
                <div class="left">
                  <van-image class="img" radius="8" :src="item.picUrl" />
                </div>
                <div class="info">
                  <div class="name" v-word="data.word">
                    {{ item.name }}
                  </div>
                  <span>{{ item.programCount }}个声音，by&nbsp;{{ item.dj.nickname }}，播放{{ numFilter(item.playCount) }}次</span>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="歌手" name="100">
        <van-pull-refresh v-model="data.artistRefreshing" @refresh="onRefresh">
          <template v-slot:loading>
            <div style="display: flex; align-items: center; justify-content: center">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
              <span>加载中...</span>
            </div>
          </template>
          <van-list v-model:loading="data.artistLoading" v-model:error="data.artistError" :immediate-check="true" :finished="data.artistFinish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="user">
              <div class="item" v-for="(item, index) in data.artists" :key="index">
                <div class="left">
                  <van-image class="img" radius="50%" :src="item.img1v1Url" />
                  <img v-if="item.picUrl" src="https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4874132307/4499/f228/d867/da64b9725e125943ad4e14e4c72d0884.png" alt="" />
                </div>
                <div class="info" @click="goSingerDetail(item.id)">
                  <div class="name" v-word="data.word">
                    {{ item.name }}
                  </div>
                  <span>{{ item.description }}</span>
                </div>
                <span class="follow" v-if="!item.followed">+&nbsp;关注</span>
                <span class="followed" v-else>已关注</span>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="用户" name="1002">
        <van-pull-refresh v-model="data.userRefreshing" @refresh="onRefresh">
          <template v-slot:loading>
            <div style="display: flex; align-items: center; justify-content: center">
              <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
              <span>加载中...</span>
            </div>
          </template>
          <van-list v-model:loading="data.userLoading" v-model:error="data.userError" :immediate-check="true" :finished="data.userFinish" error-text="请求失败，点击重新加载" finished-text="已经到底啦" @load="loadMore">
            <template v-slot:loading>
              <div style="display: flex; align-items: center; justify-content: center">
                <img width="18" src="../../../public/img/icons/loading.svg" alt="" />
                <span>加载中...</span>
              </div>
            </template>
            <div class="user" @click="notDone()">
              <div class="item" v-for="(item, index) in data.users" :key="index">
                <div class="left">
                  <van-image class="img" radius="50%" :src="item.avatarUrl" />
                  <img v-if="item.avatarDetail" :src="item.avatarDetail.identityIconUrl" alt="" />
                </div>
                <div class="info">
                  <div class="name" v-word="data.word">
                    {{ item.nickname }}
                    <img v-if="item.gender == 1" src="../../../public/img/icons/gender_boy.svg" alt="" />
                    <img v-else src="../../../public/img/icons/gender_girl.svg" alt="" />
                  </div>
                  <span>{{ item.description }}</span>
                </div>
                <span class="follow" v-if="!item.followed">+&nbsp;关注</span>
                <span class="followed" v-else>已关注</span>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 搜索建议 -->
    <div class="suggest" v-if="data.suggestWord.length" @click="notShowSuggest">
      <div class="item" v-for="(item, index) in data.suggestWord" :key="index" v-word="data.word" @mousedown.stop="suggestClick(item)">{{ item }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "searchResult"
}
</script>

<script lang="ts" setup>
import { defineComponent, onBeforeMount, reactive, toRefs, ref, watch } from "vue";
import { getSearchHot, getSuggest, getsearchResult } from "../../api/discover";
import songStore from "../../store";
import { useRouter, useRoute } from "vue-router";
import { sendTimeConversion, numFilter } from "../../utils/num";
import { Toast } from "vant";

interface info {
  word: string;
  activeName: number;
  pageNo: number;
  Loading: boolean;
  allLoading: boolean;
  Error: boolean;
  allError: boolean;
  Finish: boolean;
  allFinish: boolean;
  hotWord: Array<any>;
  suggestWordOrigin: Array<any>;
  suggestWord: Array<any>;
  showSuggest: boolean;
  timer: any;
  song: any;
  songs: any;
  songPageNo: number;
  songFinish: boolean;
  songError: boolean;
  playList: any;
  playLists: any;
  playListPageNo: number;
  playListLoading: boolean;
  playListFinish: boolean;
  playListError: boolean;
  video: { videos: any[]; Finish: boolean, more: boolean,moreText: string };
  videoPageNo: number;
  videos: any;
  videoLoading: boolean;
  videoFinish: boolean;
  videoError: boolean;
  sim_query: any;
  album: any;
  albumPageNo: number;
  albums: any;
  albumLoading: boolean;
  albumFinish: boolean;
  albumError: boolean;
  djRadio: any;
  djRadioPageNo: number;
  djRadios: any;
  djRadioLoading: boolean;
  djRadioFinish: boolean;
  djRadioError: boolean;
  user: any;
  userPageNo: number;
  users: any;
  userLoading: boolean;
  userFinish: boolean;
  userError: boolean;
  artist: any;
  artistPageNo: number;
  artists: any;
  artistLoading: boolean;
  artistFinish: boolean;
  artistError: boolean;
  MV: any;
  mvLoading: boolean;
  mvFinish: boolean;
  mvError: boolean;
  mvs: any;
  mvsPageNo: number;
  lyric: any;
  lyrics: Array<any>;
  lyricPageNo: number;
  lyricLoading: boolean;
  allRefreshing: boolean;
  songRefreshing: boolean;
  playListRefreshing: boolean;
  videoRefreshing: boolean;
  albumRefreshing: boolean;
  djRadioRefreshing: boolean;
  userRefreshing: boolean;
  artistRefreshing: boolean;
  MVRefreshing: boolean;
  // lyricRefreshing: boolean,
}

const store = songStore();
const router = useRouter();
const id: any = router.currentRoute.value.query.word;
let tab = ref();
const data = reactive<info>({
  word: "",
  activeName: 1018,
  pageNo: 0,
  Loading: false,
  allLoading: false,
  Error: false,
  allError: false,
  Finish: false,
  allFinish: false,
  hotWord: [],
  suggestWord: [],
  suggestWordOrigin: [],
  showSuggest: false, // 是否显示搜索建议
  timer: null,
  song: { songs: [], Finish: false },
  songs: [],
  songPageNo: 0,
  songFinish: false,
  songError: false,
  playList: { playLists: [], Finish: false },
  playLists: [],
  playListPageNo: 0,
  playListLoading: false,
  playListFinish: false,
  playListError: false,
  video: { videos: [], Finish: false, more: true, moreText: "" },
  videoPageNo: 0,
  videos: [],
  videoLoading: false,
  videoFinish: false,
  videoError: false,
  sim_query: { sim_querys: [], Finish: false },
  album: { albums: [] },
  albumPageNo: 0,
  albums: [],
  albumLoading: false,
  albumFinish: false,
  albumError: false,
  djRadio: { djRadios: [], Finish: false },
  djRadioPageNo: 0,
  djRadios: [],
  djRadioLoading: false,
  djRadioFinish: false,
  djRadioError: false,
  user: { userprofiles: [], Finish: false },
  userPageNo: 0,
  users: [],
  userLoading: false,
  userFinish: false,
  userError: false,
  artist: { artists: [], Finish: false },
  artistPageNo: 0,
  artists: [],
  artistLoading: false,
  artistFinish: false,
  artistError: false,
  MV: { mvs: [], Finish: false },
  mvs: [],
  mvLoading: false,
  mvFinish: false,
  mvError: false,
  mvsPageNo: 0,
  lyric: {},
  lyrics: [],
  lyricPageNo: 0,
  lyricLoading: false,
  allRefreshing: false,
  songRefreshing: false,
  playListRefreshing: false,
  videoRefreshing: false,
  albumRefreshing: false,
  djRadioRefreshing: false,
  userRefreshing: false,
  artistRefreshing: false,
  MVRefreshing: false,
  // lyricRefreshing: false,
});

onBeforeMount(async () => {
  // store.commit("set_load", true)

  data.word = id;
});

// 输入搜索词，触发请求搜索建议
const suggest = async () => {
  data.suggestWord = [];
  if (!data.word) return;
  if (data.timer) clearTimeout(data.timer);
  data.timer = setTimeout(async () => {
    let info = await getSuggest(data.word);
    if (info.result && data.showSuggest) {
      data.suggestWordOrigin = info.result.allMatch;
      info.result.allMatch.forEach((item: any) => {
        data.suggestWord.push(item.keyword);
      });
    }
  }, 500);
};

// 下拉刷新
const onRefresh = () => {
  if (data.activeName == 1 && data.songs.length) {
    data.songs.splice(0);
    data.songFinish = false;
    (data.songPageNo = 0), (data.Loading = false);
  }
  if (data.activeName == 10 && data.albums.length) {
    data.albums.splice(0);
    data.albumFinish = false;
    (data.albumPageNo = 0), (data.albumLoading = false);
  }
  if (data.activeName == 100 && data.artists.length) {
    data.artists.splice(0);
    data.artistFinish = false;
    (data.artistPageNo = 0), (data.artistLoading = false);
  }
  if (data.activeName == 1000 && data.playLists.length) {
    data.playLists.splice(0);
    data.playListFinish = false;
    (data.playListPageNo = 0), (data.playListLoading = false);
  }
  if (data.activeName == 1002 && data.users.length) {
    data.users.splice(0);
    data.userFinish = false;
    (data.userPageNo = 0), (data.userLoading = false);
  }
  if (data.activeName == 1004 && data.mvs.length) {
    data.mvs.splice(0);
    data.mvLoading = false;
    data.mvFinish = false;
    data.mvsPageNo = 0;
  }
  // if(data.activeName == 1006 && data.lyric.length) {
  //   data.lyric.splice(0)
  // }
  if (data.activeName == 1009 && data.djRadios.length) {
    data.djRadios.splice(0);
    data.djRadioFinish = false;
    (data.djRadioPageNo = 0), (data.djRadioLoading = false);
  }
  if (data.activeName == 1014 && data.videos.length) {
    data.videos.splice(0);
    data.videoFinish = false;
    (data.videoPageNo = 0), (data.videoLoading = false);
  }
  if (data.activeName == 1018 && data.song.songs.length) {
    data.song = { songs: [] };
    data.playList = { playLists: [] };
    data.sim_query = { sim_querys: [] };
    data.video = { videos: [], Finish: false, more: true, moreText: "" };
    data.djRadio = { djRadios: [] };
    data.album = { albums: [] };
    data.user = { userprofiles: [] };
    data.artist = { artists: [] };
    data.MV = { mvs: [] };
  }
  data.pageNo = 0;
  loadMore();
};

// 点击搜索建议，点击相关搜索词，重新搜索
const suggestClick = (i: string) => {
  router.replace({ path: "/searchResult", query: { word: i } });
  data.word = i;
  onSearch();
};

// 重新搜索
const onSearch = () => {
  data.suggestWord.splice(0);
  router.replace({ path: "/searchResult", query: { word: data.word }});
  (data.allLoading = false), (data.allError = false), (data.allFinish = false), (data.pageNo = 0), (data.Loading = false), (data.Error = false), (data.Finish = false), (data.hotWord = []), (data.suggestWord = []), (data.timer = null), (data.song = { songs: [] }), (data.songs = []), (data.songPageNo = 0), (data.songFinish = false);
  (data.playList = { playLists: [] }),
    (data.playLists = []),
    (data.playListPageNo = 0),
    (data.playListLoading = false),
    (data.playListFinish = false),
    (data.video = { videos: [], Finish: false, more: true, moreText: ""}),
    (data.videoPageNo = 0),
    (data.videos = []),
    (data.videoLoading = false),
    (data.videoFinish = false),
    (data.sim_query = { sim_querys: [] }),
    (data.album = { albums: [] }),
    (data.albumPageNo = 0),
    (data.albums = []),
    (data.albumLoading = false),
    (data.albumFinish = false),
    (data.djRadio = { djRadios: [] }),
    (data.djRadioPageNo = 0),
    (data.djRadios = []),
    (data.djRadioLoading = false),
    (data.djRadioFinish = false),
    (data.user = { userprofiles: [] }),
    (data.userPageNo = 0),
    (data.users = []),
    (data.userLoading = false),
    (data.userFinish = false),
    (data.artist = { artists: [] }),
    (data.artistPageNo = 0),
    (data.artists = []),
    (data.artistLoading = false),
    (data.artistFinish = false),
    (data.MV = { mvs: [] }),
    (data.mvs = []),
    (data.mvLoading = false),
    (data.mvFinish = false),
    (data.mvsPageNo = 0),
    // data.lyric =  {},
    // data.lyrics =  [],
    // data.lyricPageNo =  0,
    // data.lyricLoading = false
    (data.activeName = 1018);
  // changeActive(data.activeName);
  loadMore();
};

const loadMore = async () => {
  if (data.activeName == 1) {
    try {
      data.Loading = true;
      let info = await getsearchResult(data.word, data.activeName, data.songPageNo);
      data.songRefreshing = false;
      data.songs = data.songs.concat(info.result.songs);
      data.Loading = false;
      data.songPageNo += 1;
      if (data.songs.length >= info.result.songCount) {
        // data.song.Finish = true;
        data.songFinish = true;
      }
    } catch (error) {
      data.Loading = false;
      data.songError = true;
    }
  }
  if (data.activeName == 10) {
    try {
      data.albumLoading = true;
      let info = await getsearchResult(data.word, data.activeName, data.albumPageNo);
      data.albumRefreshing = false;
      data.albums = data.albums.concat(info.result.albums);
      data.albumLoading = false;
      data.albumPageNo += 1;
      if (data.albums.length >= info.result.albumCount) {
        // data.album.Finish = true;
        data.albumFinish = true;
      }
    } catch (error) {
      data.albumLoading = false;
      data.albumError = true;
    }
  }
  if (data.activeName == 100) {
    try {
      data.artistLoading = true;
      let info = await getsearchResult(data.word, data.activeName, data.artistPageNo);
      data.artistRefreshing = false;
      data.artists = data.artists.concat(info.result.artists);
      data.artistLoading = false;
      data.artistPageNo += 1;
      if (data.artist.artists.length >= info.result.artistCount) {
        // data.artist.Finish = true;
        data.artistFinish = true;
      }
    } catch (error) {
      data.artistLoading = false;
      data.artistError = true;
    }
  }
  if (data.activeName == 1000) {
    try {
      data.playListLoading = true;
      let info = await getsearchResult(data.word, data.activeName, data.playListPageNo);
      data.playListRefreshing = false;
      data.playLists = data.playLists.concat(info.result.playlists);
      data.playListLoading = false;
      data.playListPageNo += 1;
      if (!info.result.hasMore) {
        // data.playList.Finish = true;
        data.playListFinish = true;
      }
    } catch (error) {
      data.playListLoading = false;
      data.playListError = true;
    }
  }
  if (data.activeName == 1002) {
    try {
      data.userLoading = true;
      let info = await getsearchResult(data.word, data.activeName, data.userPageNo);
      data.userRefreshing = false;
      data.users = data.users.concat(info.result.userprofiles);
      data.userLoading = false;
      data.userPageNo += 1;
      if (data.users.length >= info.result.userprofileCount) {
        // data.user.Finish = true;
        data.userFinish = true;
      }
    } catch (error) {
      data.userLoading = false;
      data.userError = true;
    }
  }
  if (data.activeName == 1004) {
    try {
      data.mvLoading = true;
      let info = await getsearchResult(data.word, data.activeName, data.mvsPageNo);
      data.MVRefreshing = false;
      if (info.result.mvs) {
        data.mvs = data.mvs.concat(info.result.mvs);
      }
      data.mvLoading = false;
      data.mvsPageNo += 1;
      if (data.mvs.length >= info.result.mvCount) {
        // data.MV.Finish = true;
        data.mvFinish = true;
      }
    } catch (error) {
      data.mvLoading = false;
      data.mvError = true;
    }
  }
  // 歌词暂时不弄
  // if (data.activeName == 1006) {
  //   data.lyricLoading = true;
  //   let info = await getsearchResult(data.word, data.activeName, data.lyricPageNo);
  //   data.lyrics = data.lyrics.concat(info.result.songs);
  //   data.lyricLoading = false;
  //   data.lyricPageNo += 1;
  //   if (data.lyrics.length >= info.result.songCount) {
  //     data.lyric.Finish = true;
  //   }
  // }
  if (data.activeName == 1009) {
    try {
      data.djRadioLoading = true;
      let info = await getsearchResult(data.word, data.activeName, data.djRadioPageNo);
      data.djRadioRefreshing = false;
      data.djRadios = data.djRadios.concat(info.result.djRadios);
      data.djRadioLoading = false;
      data.djRadioPageNo += 1;
      if (data.djRadios.length >= info.result.djRadiosCount) {
        // data.djRadio.Finish = true;
        data.djRadioFinish = true;
      }
    } catch (error) {
      data.djRadioError = true;
      data.djRadioLoading = false;
    }
  }
  if (data.activeName == 1014) {
    try {
      data.videoLoading = true;
      let info = await getsearchResult(data.word, data.activeName, data.videoPageNo);
      data.videoRefreshing = false;
      data.videoLoading = false;
      if (info.code != 200 || !info.result) {
        data.Error = true;
        return;
      }
      data.videos = data.videos.concat(info.result.videos);
      data.videoPageNo += 1;
      if (data.videos.length >= info.result.videoCount) {
        data.videoFinish = true;
      }
    } catch (error) {
      data.videoLoading = false;
      data.videoError = true;
    }
  }
  if (data.activeName == 1018) {
    try {
      data.allFinish = false;
      data.allLoading = true;
      let info = await getsearchResult(data.word, data.activeName, data.pageNo);
      data.allRefreshing = false;
      data.allLoading = false;
      if (info.code != 200 || !info.result) {
        data.allError = true;
        return;
      }
      data.allFinish = true;
      data.song = info.result.song;
      data.playList = info.result.playList;
      data.video = info.result.video;
      data.sim_query = info.result.sim_query;
      data.album = info.result.album;
      data.djRadio = info.result.djRadio;
      data.user = info.result.user;
      data.artist = info.result.artist;
    } catch (error) {
      data.allError = true;
      data.allLoading = false;
    }
  }

  data.pageNo += 1;
};

// 综合 tab 页里面点击跳转的方法
const changeActive = (i: any) => {
  tab.value.scrollTo(i);
};



// 点击播放歌曲
function playMusicSingle(item: any): void {
  if (item.id == store.song_info.id) {
    store.play(!store.song_info.isPlaying);
    return;
  }
  // 先判断和当前的歌曲是不是同一首,如果不是同一首
  if (item.resourceId != store.song_info.id) {
    let song = {
      id: item.id,
      name: item.name,
      type: 0,
      author: item.ar.map((i: any) => i.name).join("/"),
      al: item.al.name,
      img: item.al.picUrl,
    };
    // 设置歌曲信息
    store.setSongInfo(song);
  }
}

// 输入框失去焦点就不显示搜索建议
const notShowSuggest = (): void => {

  data.showSuggest = false;
  data.suggestWord.splice(0);
};

// 输入框获得焦点允许显示搜索建议
const ShowSuggest = (): void => {
  data.showSuggest = true;
};

// 计算视频时长
const timeFilter = (i: number) => {
  let a = Math.floor(i / 1000);
  return `${Math.floor(a / 60)}`.padStart(2, "00") + ":" + `${a % 60}`.padStart(2, "0");
};

// 计算日期
const getDate = (i: number) => {
  let a = new Date(i);
  return `${a.getFullYear()}.${a.getMonth() + 1}.${a.getDate()}`;
};

// 提示还没做
const notDone = () => {
  Toast("敬请期待");
};

// 弹出更多信息
const popMoreInfo = (item: any, type: number): void => {
  item.type = type;
  store.set_pop_detail(item);
};

// 跳转歌手详情
const goSingerDetail = (id: string): void => {
  router.push({ name: "singerDetail", query: { id } });
};

// 点击跳转 mv
const goMv = (mvId: number): void => {
  router.push({ name: "vid", query: { vid: mvId } });
};


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
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 11;
  .item {
    padding-left: 40px;
    padding-top: 8px;
    padding-bottom: 8px;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    z-index: 111;
  }
}
.wrapper {
  padding: 8px;
  background-color: rgb(245, 245, 245);
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
          .vip;
        }
        .sq {
          .vip;
        }
        .hear_try {
          color: rgb(0, 217, 255);
          border: 1px solid rgb(0, 153, 255);
          border-radius: 3px;
          opacity: 0.6;
          font-size: 12px;
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
      .more {
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        img {
          float: right;
          width: 20px;
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
        text-overflow: ellipsis;
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
      overflow: hidden;
      text-overflow: ellipsis;
      .name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
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
      font-size: 12px;
      line-height: 12px;
      border-radius: 20px;
      white-space: nowrap;
      text-align: center;
    }
    .follow {
      background-color: red;
      .followed;
      color: #fff;
    }
  }
}
</style>
