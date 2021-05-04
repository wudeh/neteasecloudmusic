<template>
  <router-view v-slot="{ Component }">
        <keep-alive include="Home">
          <component :is="Component" />
        </keep-alive>
      </router-view>
</template>

<style lang="less">
body {
  background-color: #eee;
}
</style>
