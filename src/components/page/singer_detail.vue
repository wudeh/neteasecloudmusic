<template>
  <div class="nav" v-if="data.name">
    <div class="left_arrow" @click="router.go(-1)">
      <img src="../../../public/img/icons/left_arrow.svg" alt="" />
    </div>
  </div>
  <div class="Bg" v-if="data.name">
    <van-image class="img" width="375" height="280" :src="data.backgroundUrl" />
    <div class="avatar_info">
      <van-image class="img topMove" width="70" height="70" radius="70" :src="data.avatarUrl" />
      <div class="name topMove">{{ data.name }}</div>
      <div class="icondes topMove">{{ data.imageDesc }}</div>
    </div>

    <div class="detail_info" v-if="data.name">
      <div class="title">艺人百科</div>
      <div class="icondes">艺人名：{{ data.name }}</div>
      <div class="icondes" v-if="data.transNames">译名：{{ data.transNames }}</div>
      <div class="icondes">身份：{{ data.imageDesc }}</div>
      <div class="icondes">性别：{{ data.gender == 2 ? "女" : "男" }}</div>
      <div class="icondes" v-if="data.birthday">生日：{{ data.birthday }}</div>
      <div class="icondes" v-if="data.signature">个人简介：{{ data.signature }}</div>
    </div>

    <div class="detail_info" v-if="data.name">
      <div class="title">歌手简介</div>
      <div class="icondes">{{ data.briefDesc }}</div>
    </div>
  </div>
  <div class="loadAgain" v-if="data.error" @click="getInfo">请求出错，点击重试</div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, toRefs, onBeforeMount, reactive } from "vue";
import { useRouter } from "vue-router";
import { getSingerDetail } from "../../api/song";
import { numFilter } from "../../utils/num";
import songStore from "../../store";
import { Toast } from "vant";
import { singerDetail } from "../interface/interface";

interface info {
  backgroundUrl: string;
  name: string;
  avatarUrl: string;
  transNames: string; // 译名
  imageDesc: string; // icon 描述
  briefDesc: string; // 详细介绍
  secondaryExpertIdentiy: string; // 身份
  signature: string; // 签名
  gender: number; // 性别
  birthday: string; // 生日
  error: boolean;
}

const router = useRouter();
const store = songStore();
const id: string = router.currentRoute.value.query.id?.toString() || ""; //获取参数
const data = reactive<info>({
  backgroundUrl: "",
  name: "",
  avatarUrl: "",
  transNames: "", // 译名
  imageDesc: "",
  briefDesc: "", // 详细介绍
  secondaryExpertIdentiy: "", // 身份
  signature: "", // 签名
  gender: 1, // 签名
  birthday: "", // 签名
  error: false,
});

// 请求歌手信息
const getInfo = async (): Promise<void> => {
  try {
    data.error = false;
    store.set_load(true);
    let res: singerDetail = await getSingerDetail(id);
    data.backgroundUrl = res.data?.user?.backgroundUrl || res.data.artist.cover;
    data.avatarUrl = res.data?.user?.backgroundUrl || res.data.artist.cover;
    data.name = res.data.artist.name;
    data.transNames = res.data.artist.transNames.toString();
    data.imageDesc = res.data.identify.imageDesc;
    data.briefDesc = res.data.artist.briefDesc;
    data.secondaryExpertIdentiy = res.data.secondaryExpertIdentiy.map((i) => i.expertIdentiyName).join(`、`);
    data.signature = res.data?.user?.signature || "";
    data.gender = res.data?.user?.gender || 1;
    if (res.data.user) {
      let birth = new Date(res.data?.user?.birthday);
      data.birthday = `${birth.getFullYear()}-${birth.getMonth()}-${birth.getDay()}`;
    }
    store.set_load(false);
  } catch (error) {
    Toast("获取歌手详情失败");
    data.error = true;
    store.set_load(false);
  }
};

onBeforeMount(async () => {
  getInfo();
});

// export default defineComponent ({
//   name: 'singerDetail',
//   setup() {

//     return {
//       id,
//       getInfo,
//       router,
//       ...toRefs(data)
//     }
//   }
// })
</script>

<style lang="less">
.nav {
  position: fixed;
  top: 0;
  width: 100vw;

  padding-left: 20px;
  height: 50px;
  display: flex;
  align-items: center;
  z-index: 1111;
}
.Bg {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(238, 236, 236);
  min-height: 100vh;
  .avatar_info {
    width: 350px;
    background-color: #fff;
    border-radius: 20px;
    position: relative;
    top: -25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .topMove {
      position: relative;
      top: -25px;
    }
    img {
      position: relative;
      width: 70px;
      height: 70px;
      border-radius: 70px;
    }
    .name {
      font-weight: 600;
      font-size: 18px;
    }
  }
  .detail_info {
    width: 350px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px;
    border-radius: 20px;
    margin-bottom: 20px;
    .title {
      font-size: 18px;
      font-weight: 600;
      .icondes {
        font-size: 14px;
      }
    }
  }
}
.loadAgain {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>
