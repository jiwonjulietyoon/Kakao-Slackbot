<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>

<style lang="scss" scoped>
@import "./css/reset.css";
@import "./css/style.scss";
</style>

<style lang="scss">
::-webkit-scrollbar {
  display: none;
}
</style>