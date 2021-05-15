import { createRouter, createWebHashHistory, RouteRecordRaw, createMemoryHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    redirect: `/discover`,
    component: () => import(/* webpackChunkName: "login" */ "@/views/Home.vue"),
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
          level: 99,
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
          level: 10,
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
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


// router.beforeEach((to: any,from: any, next) => {
//   next()
  
// })

export default router;
