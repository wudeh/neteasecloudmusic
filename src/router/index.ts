import { createRouter, createWebHashHistory, RouteRecordRaw, createMemoryHistory } from "vue-router";
import songStore from '../store';
import { Toast } from "vant";



const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/",
  //   name: "person",
  //   // redirect: `/discover`,
  //   component: () => import(/* webpackChunkName: "login" */ "@/components/person.vue"),
  // },
  {
    path: "/",
    name: "Home",
    // redirect: `/discover`,
    component: () => import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
    meta: {
      keepAlive: true,
      level: 1,
      transitionName: "",
    },
    children: [
      {
        path: "/songList",
        name: "songList",
        meta: {
          keepAlive: true,
          level: 8,
        },
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/songList.vue"),
      },
      {
        path: "/song",
        name: "song",
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/song.vue"),
        meta: {
          keepAlive: true,
          level: 55,
        },
      },
      {
        path: "/discover",
        name: "discover",
        meta: {
          keepAlive: true,
          level: 1,
        },
        component: () => import(/* webpackChunkName: "login" */ "@/components/discover.vue"),
      },
      {
        path: "/searchResult",
        name: "searchResult",
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/searchResult.vue"),
        meta: {
          keepAlive: true,
          level: 3,
        },
      },
      {
        path: "/comment",
        name: "comment",
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/comment.vue"),
        meta: {
          keepAlive: true,
          level: 100,
        },
      },
      {
        path: "/search",
        name: "search",
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/search.vue"),
        meta: {
          keepAlive: true,
          level: 2,
        },
      },
      {
        path: "/download",
        name: "download",
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/download.vue"),
        meta: {
          keepAlive: true,
          level: 9,
        },
      },
      {
        path: "/djProgram",
        name: "djProgram",
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/djProgram.vue"),
        meta: {
          keepAlive: true,
          level: 9,
        },
      },
      {
        path: "/vid",
        name: "vid",
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/video.vue"),
        meta: {
          keepAlive: true,
          level: 9,
        },
      },
      {
        path: "/rank",
        name: "rank",
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/rank.vue"),
        meta: {
          keepAlive: true,
          level: 5,
        },
      },
      {
        path: "/singer",
        name: "singer",
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/singer.vue"),
        meta: {
          keepAlive: true,
          level: 6,
        },
      },
      {
        path: "/singerDetail",
        name: "singerDetail",
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/singer_detail.vue"),
        meta: {
          keepAlive: true,
          level: 101,
        },
      },
    ],
  },
  {
    path: "/404",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "@/components/page/404.vue"),
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      // console.log(savedPosition);
      // document.body.scrollTop = savedPosition.top
      sessionStorage.setItem(`scrollTop`,savedPosition.top.toString())
      return savedPosition
    }
  }
});



router.beforeEach((to, from, next) => {
  const store = songStore();
  // 防止从 URL 直接输入跳转到需要参数页面的情况
  if([`songList`, `searchResult`, `comment`, `djProgram`, `album`, `vid`, `singerDetail`].includes(to!.name!.toString()) && Object.keys(to.query).length == 0) {
    Toast(`你可真是个小基佬`)
    return next(`/gay`)
  }

  // 播放列表没有歌，输入URL跳转歌词页面会被拦截到错误页面
  if(store.song_info.list.length == 0 && to.name == `song`) {
    Toast(`你可真是个小基佬`)
    return next(`/gay`)
  }


  if(to.name == `Home` && from.name ) {
    // console.log(`不能回到Home`);
    
    store.close()
    return next(false)
  }
  if(to.name == `Home`) {
    // console.log(`home重定向`);
    
    store.close()
    return next(`/discover`)
  }
  if(from.name == `searchResult` && to.name == `comment`) {
    store.close()
    // next()
  }else if(store.showPop) {
    // console.log("当前有弹出框禁止后退");
    
    store.close()
    return next(false)
  }
  
  next()
})

router.afterEach(() => {
  
})


// router.beforeEach((to: any,from: any, next) => {
//   next()
  
// })

export default router;
