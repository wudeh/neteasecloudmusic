<template>
  <div class="discover">K歌</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Ksing",
  setup() {
    const active = ref(0);
    return {
      active,
    };
  },
});
</script>

<style scoped></style>
