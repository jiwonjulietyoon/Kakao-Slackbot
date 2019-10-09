<template>
  <div class="dialogOuter">
    <!-- Mac Window Buttons -->
    <div class="btnBoxMac">
      <div class="btn close" @click.prevent="closeDialog" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
        <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
        <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
      </div>
      <div class="btn minimize" @click.prevent="closeDialog" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
        <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
      </div>
      <div class="btn expand" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
        <div class="rectangle" :class="{'hidden': !windowBtnHover}"></div>
        <div class="diagonal" :class="{'hidden': !windowBtnHover}"></div>
      </div>
    </div>
    
    <div class="Container">
      <div class="bg"></div>
      <img :src="url" alt="">
    </div>
    
  </div>
</template>


<script>

export default {
  name: "FullSizeImgDialog",
  props: {
    url: {type: String}
  },
  data: () => ({
    windowBtnHover: false,
  }),
  methods: {
    closeDialog() {
      this.$store.dispatch("setFullSizeImgDialog", false);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/css/style.scss";

.dialogOuter {
  width: 100%;
  height: 500px;
  background: white;
  overflow: hidden;
}
.btnBoxMac {
  height: 22px;
  background: $kakao-brown;
}
.Container {
  width: 100%;
  height: calc(100% - 22px);
  position: relative;
}
.bg, img {
  width: 100%; height: 100%;
  position: absolute;
  top: 0; left: 0;
}
.bg {
  background: black;
}
img {
  object-fit: contain;
}

</style>