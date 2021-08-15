import { createRouter, createWebHashHistory, RouteRecordRaw, createMemoryHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/",
  //   name: "person",
  //   // redirect: `/discover`,
  //   component: () => import( "@/components/person.vue"),
  // },
  {
    path: "/",
    name: "Home",
    // redirect: `/discover`,
    component: () => import( "@/views/Home.vue"),
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
        component: () => import( "@/components/page/songList.vue"),
      },
      {
        path: "/song",
        name: "song",
        component: () => import( "@/components/page/song.vue"),
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
        component: () => import( "@/components/discover.vue"),
      },
      {
        path: "/searchResult",
        name: "searchResult",
        component: () => import( "@/components/page/searchResult.vue"),
        meta: {
          keepAlive: true,
          level: 3,
        },
      },
      {
        path: "/comment",
        name: "comment",
        component: () => import( "@/components/page/comment.vue"),
        meta: {
          keepAlive: true,
          level: 100,
        },
      },
      {
        path: "/search",
        name: "search",
        component: () => import( "@/components/page/search.vue"),
        meta: {
          keepAlive: true,
          level: 2,
        },
      },
      {
        path: "/download",
        name: "download",
        component: () => import( "@/components/page/download.vue"),
        meta: {
          keepAlive: true,
          level: 9,
        },
      },
      {
        path: "/djProgram",
        name: "djProgram",
        component: () => import( "@/components/page/djProgram.vue"),
        meta: {
          keepAlive: true,
          level: 9,
        },
      },
      {
        path: "/album",
        name: "album",
        component: () => import( "@/components/page/album.vue"),
        meta: {
          keepAlive: true,
          level: 9,
        },
      },
      {
        path: "/vid",
        name: "vid",
        component: () => import( "@/components/page/video.vue"),
        meta: {
          keepAlive: true,
          level: 9,
        },
      },
      {
        path: "/rank",
        name: "rank",
        component: () => import( "@/components/page/rank.vue"),
        meta: {
          keepAlive: true,
          level: 5,
        },
      },
      {
        path: "/singer",
        name: "singer",
        component: () => import( "@/components/page/singer.vue"),
        meta: {
          keepAlive: true,
          level: 6,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      console.log(savedPosition);
      // document.body.scrollTop = savedPosition.top
      sessionStorage.setItem(`scrollTop`,savedPosition.top.toString())
      return savedPosition
    }else {
      return {left: 0, top: 500}
    }
  }
});


// router.beforeEach((to: any,from: any, next) => {
//   next()
  
// })

export default router;
