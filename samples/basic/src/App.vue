<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div id="app" class="dark:bg-black">
    <el-button
      @click="
        () => {
          toggleDark();
        }
      "
      >Toggle Dark Mode</el-button
    >
    <router-view />
  </div>
</template>

<style scoped></style>
