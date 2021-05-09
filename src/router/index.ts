import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "login" */ "@/views/Home.vue"),
    meta: {
      keepAlive: true,
      level: 1,
      transitionName: ""
    },
    children: [
      {
        path: "/songList",
        name: "songList",
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/songList.vue"),
      },
      {
        path: "/song",
        name: "song",
        component: () => import(/* webpackChunkName: "login" */ "@/components/page/song.vue"),
        meta: {
          keepAlive: true,
          level: 2,
          transitionName: ""
        }
      },
      {
        path: "/",
        name: "discover",
        meta: {
          keepAlive: true,
          level: 1,
          transitionName: ""
        },
        component: () =>
          import(/* webpackChunkName: "login" */ "@/components/discover.vue"),
      },
      
    ],
  },
    {
      path: "/comment",
      name: "comment",
      component: () => import(/* webpackChunkName: "login" */ "@/components/page/comment.vue"),
      meta: {
        keepAlive: true,
        level: 2,
        transitionName: ""
      }
    },
    {
      path: "/search",
      name: "search",
      component: () => import(/* webpackChunkName: "login" */ "@/components/page/search.vue"),
      meta: {
        keepAlive: true,
        level: 2,
        transitionName: ""
      }
    },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
