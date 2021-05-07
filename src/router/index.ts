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
      {
        path: "/boke",
        name: "boke",
        component: () =>
          import(/* webpackChunkName: "login" */ "@/components/boke.vue"),
      },
      {
        path: "/person",
        name: "person",
        component: () =>
          import(/* webpackChunkName: "login" */ "@/components/person.vue"),
      },
      {
        path: "/Ksing",
        name: "Ksing",
        component: () =>
          import(/* webpackChunkName: "login" */ "@/components/Ksing.vue"),
      },
      {
        path: "/cloud",
        name: "cloud",
        component: () =>
          import(/* webpackChunkName: "login" */ "@/components/cloud.vue"),
      },
    ],
  },
  
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
