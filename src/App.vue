<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HeaderLayout from "@/layouts/HeaderLayout.vue";
import MenuLayout from "@/layouts/MenuLayout.vue";
</script>

<template>
  <HeaderLayout></HeaderLayout>
  <div id="container">
    <MenuLayout></MenuLayout>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
main {
  padding: 32px;
  width: calc(100% - 240px);
}
</style>
