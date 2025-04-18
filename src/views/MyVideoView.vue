<template>
  <div>
    <div class="top">
      <h2>내 동영상</h2>
      <RouterLink to="/video/upload" class="p-btn">동영상 업로드</RouterLink>
    </div>
  </div>
</template>

<script setup>

</script>


<style scoped>
.top {
  display: flex;
  align-items: center;
  gap: 40px;
}
.p-btn {
  padding: 10px 20px;
  color: white;
  font-size: var(--fs-16);
  font-weight: 600;
}
</style>