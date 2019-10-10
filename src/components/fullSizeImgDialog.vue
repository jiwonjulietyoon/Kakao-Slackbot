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
      <div class="imgContainer" :style="imgTransformStyle">
        <img :src="url" alt="">
      </div>
    </div>

    <div class="btnBox">
      <div class="btn zoomIn" title="Zoom In" @click.stop="zoomIn">
        <i class="material-icons-round">add</i>
      </div>
      <div class="btn zoomOut" title="Zoom Out" @click.stop="zoomOut">
        <i class="material-icons-round">remove</i>
      </div>
      <div class="btn rotate" title="Rotate" @click.stop="rotate">
        <i class="material-icons-round">replay</i>
      </div>
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
    imgRotate: 0,
    imgScale: 1,
  }),
  computed: {
    imgTransformStyle() {
      return {
        transform: 'scale(' + this.imgScale + ') rotate(' + this.imgRotate + 'turn)'
      }
    }
  },
  methods: {
    closeDialog() {
      this.$store.dispatch("setFullSizeImgDialog", false);
      this.reset();
    },
    reset() {
      this.imgRotate = 0;
      this.imgScale = 1;
    },
    zoomIn() {
      if (this.imgScale < 2.0) {
        this.imgScale += 0.1;
      }
    },
    zoomOut() {
      if (this.imgScale > 0.3) {
        this.imgScale -= 0.1;
      }
    },
    rotate() {
      this.imgRotate += 0.25;
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/css/style.scss";

.dialogOuter {
  width: 100%;
  height: 550px;
  background: white;
  overflow: hidden;
}
.btnBoxMac {
  height: 22px;
  background: $kakao-brown;
}
.Container {
  width: 100%;
  height: calc(100% - 67px);
  position: relative;
  overflow: hidden;
}
.bg, img, .imgContainer {
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

.btnBox {
  width: 100%;
  height: 45px;
  background: rgb(55, 55, 55);
  .btn {
    float: left;
    width: 45px;
    height: 45px;
    color: rgb(143, 143, 143);
    text-align: center;
    font-size: 1.7em;
    @include disable-user-select;
    cursor: pointer;
    position: relative;
    i {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }
    &:last-child {
      transform: rotateY(180deg);
    }
  }
}

</style>