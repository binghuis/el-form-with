<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div id="app" class="dark:bg-black bg-slate-50 p-4">
    <header class="flex justify-center">
      <el-button
        @click="
          () => {
            toggleDark();
          }
        "
        >Toggle Dark Mode</el-button
      >
    </header>
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
