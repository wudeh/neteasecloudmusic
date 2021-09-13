<template>
  <div class="discover">播客</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "boke",
  setup() {
    const active = ref(0);
    return {
      active,
    };
  },
});
</script>

<style scoped></style>
