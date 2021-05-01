<template>
  <div class="discover">云村</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "cloud",
  setup() {
    const active = ref(0);
    return {
      active,
    };
  },
});
</script>

<style scoped></style>
