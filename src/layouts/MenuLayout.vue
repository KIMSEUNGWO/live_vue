
<template>
  <aside>
    <RouterLink class="menu" to="/">
      <svg class="menu-icon" width="21" height="21" viewBox="0 0 21 21" fill="C9CEDC" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.625 2.625C3.07272 2.625 2.625 3.07272 2.625 3.625V17.375C2.625 17.9273 3.07272 18.375 3.625 18.375H17.375C17.9273 18.375 18.375 17.9273 18.375 17.375V3.625C18.375 3.07272 17.9273 2.625 17.375 2.625H3.625ZM7.75 3.625H3.625L3.625 17.375H7.75V3.625ZM17.375 3.625H8.875V6H17.375V3.625ZM8.875 7.125H17.375V17.375H8.875V7.125Z"/>
      </svg>
      <span class="menu-text">대시보드</span>
    </RouterLink>
    <RouterLink class="menu" to="/video">
      <svg class="menu-icon" width="21" height="21" viewBox="0 0 21 21" fill="C9CEDC" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.6875 4.5H4.9375V14.75H18.6875V4.5ZM4.9375 3.5C4.38522 3.5 3.9375 3.94772 3.9375 4.5V14.75C3.9375 15.3023 4.38522 15.75 4.9375 15.75H18.6875C19.2398 15.75 19.6875 15.3023 19.6875 14.75V4.5C19.6875 3.94772 19.2398 3.5 18.6875 3.5H4.9375ZM13.6875 8.75449C14.0208 8.94694 14.0208 9.42806 13.6875 9.62051L10.5937 11.4067C10.2604 11.5991 9.84375 11.3586 9.84375 10.9737V7.40132C9.84375 7.01642 10.2604 6.77586 10.5938 6.96831L13.6875 8.75449ZM2.6875 7C2.6875 6.72386 2.46364 6.5 2.1875 6.5C1.91136 6.5 1.6875 6.72386 1.6875 7V16.5C1.6875 17.3284 2.35907 18 3.1875 18H15.3125C15.5886 18 15.8125 17.7761 15.8125 17.5C15.8125 17.2239 15.5886 17 15.3125 17H3.1875C2.91136 17 2.6875 16.7761 2.6875 16.5V7Z"/>
      </svg>
      <span class="menu-text">내 동영상</span>
    </RouterLink>
    <RouterLink class="menu" to="/notice">
      <svg class="menu-icon" width="21" height="21" viewBox="0 0 21 21" fill="C9CEDC" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.1795 7.82353H5.4359C5.05507 7.82353 4.68985 7.97227 4.42056 8.23703C4.15128 8.50178 4 8.86087 4 9.23529V12.0588C4 12.4332 4.15128 12.7923 4.42056 13.0571C4.68985 13.3218 5.05507 13.4706 5.4359 13.4706H6.15385V16.2941C6.15385 16.4813 6.22949 16.6609 6.36413 16.7933C6.49877 16.9256 6.68138 17 6.87179 17H8.30769C8.4981 17 8.68072 16.9256 8.81536 16.7933C8.95 16.6609 9.02564 16.4813 9.02564 16.2941V13.4706H11.1795L14.7692 16.2941V5L11.1795 7.82353ZM18 10.6471C18 11.8541 17.3108 12.9482 16.2051 13.4706V7.82353C17.3036 8.35294 18 9.44706 18 10.6471Z"/>
      </svg>

      <span class="menu-text">공지사항</span>
    </RouterLink>
  </aside>
</template>
<script setup>

</script>

<style scoped>
aside {
  width: 240px;
  height: calc(100vh - 60px);

  padding-top: 16px;
  padding-left: 20px;
  padding-right: 8px;

  display: flex;
  flex-direction: column;
  gap: 12px;

}
.menu {
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;

  text-decoration: none;
}
.menu:hover {
  background-color: var(--box-color);
}
.menu-text {
  font-size: var(--fs-14);
  font-weight: 300;
}
.menu-icon {
  fill: var(--f3);
}
.router-link-active .menu-text {
  color: var(--main-color);
}
.router-link-active .menu-icon {
  fill: var(--main-color);
}
</style>