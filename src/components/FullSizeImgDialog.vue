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
      <div class="imgContainer" :style="imgTransformStyle" id="drag">
        <img :src="url" alt="" draggable="false">
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
      <div class="btn reset" title="Reset" @click.stop="reset">
        <i class="material-icons-round">undo</i>
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
      this.$store.dispatch("setFullSizeImgURL", "");
      this.reset();
    },
    resetPosition() {
      const dragEl = document.getElementById('drag');
      dragEl.style.top = 0;
      dragEl.style.left = 0;
    },
    reset() {
      this.imgRotate = 0;
      this.imgScale = 1;
      this.resetPosition();
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
      if (this.imgScale == 1) {
        this.resetPosition();
      }
    },
    rotate() {
      this.imgRotate += 0.25;
      this.resetPosition();
    },
    dragImage(el) {
      let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
      let self = this;
      if (el) {
        el.onmousedown = dragMouseDown;
      }
      function dragMouseDown(e) {
        if (self.imgScale > 1) {
          e = e || window.event;
          e.preventDefault();
          p3 = e.clientX;
          p4 = e.clientY;
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
        }
      }
      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        p1 = p3 - e.clientX;
        p2 = p4 - e.clientY;
        p3 = e.clientX;
        p4 = e.clientY;
        el.style.top = (el.offsetTop - p2) + 'px';
        el.style.left = (el.offsetLeft - p1) + 'px';
        console.log(el.style.top, el.style.left);
      }
      function closeDragElement() {
        console.log('closeDragElement');
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  },
  mounted() {
    this.dragImage(document.getElementById('drag'));
  }
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
    &.rotate {
      transform: rotateY(180deg);
    }
  }
}

</style>
