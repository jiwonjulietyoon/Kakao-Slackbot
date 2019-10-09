<template>
  <v-app>
    <router-view />
    <v-dialog :value="fullSizeImgDialog" width="400" persistent>
      <FullSizeImgDialog :url="fullSizeImgURL" />
    </v-dialog>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import FullSizeImgDialog from "@/components/FullSizeImgDialog";

export default {
  name: 'App',
  components: {
    FullSizeImgDialog
  },
  data: () => ({
    //
  }),
  computed: {
    ...mapGetters(["fullSizeImgDialog", "fullSizeImgURL"]),
  },
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