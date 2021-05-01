<template>
  <div class="discover">我的</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "person",
  setup() {
    const active = ref(0);
    return {
      active,
    };
  },
});
</script>

<style scoped></style>
