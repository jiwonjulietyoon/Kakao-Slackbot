<template>
  <div class="btnBoxMac">
    <div class="btn close" @click.prevent="onExitHandler" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
      <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
      <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
    </div>
    <div class="btn minimize" @click.prevent="onExitHandler" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
      <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
    </div>
    <div class="btn expand" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
      <div class="rectangle" :class="{'hidden': !windowBtnHover}"></div>
      <div class="diagonal" :class="{'hidden': !windowBtnHover}"></div>
    </div>
  </div>
</template>



<script>
export default {
  name: "MacWindowBtns",
  props: {
    onExit: {type: String}
  },
  data: () => ({
    windowBtnHover: false
  }),
  methods: {
    onExitHandler() {
      if (this.onExit === "toRoot") {
        this.$router.replace('/');
      }
      else if (this.onExit === "toHome") {
        this.$router.replace('/home');
      }
      else if (this.onExit === "closeDialog") {
        return this.$emit("child");
      }
    }
  }

}
</script>


<style lang="scss" scoped>
@import "@/css/style.scss";

.btnBoxMac {
  width: 100%;
  height: 20px;
  padding: 5px 7px;
  & > .btn {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    float: left;
    margin-right: 10px;
    border: 0.2px solid rgba(161, 155, 152, 0.8);
    &.close {
      background: $mac-red;
      position: relative;
      .cross {
        position: absolute;
        top: 50%; left: 50%;
        width: 60%;
        height: 1px;
        background: rgb(100, 7, 6);
        &:first-child {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        &:last-child {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      }
    }
    &.minimize {
      background: $mac-yellow;
      position: relative;
      .cross {
        position: absolute;
        top: 50%; left: 50%;
        width: 60%;
        height: 1px;
        background: rgb(153, 103, 17);
        transform: translate(-50%, -50%);
      }
    }
    &.expand {
      background: $mac-green;
      margin-right: 0;
      position: relative;
      overflow: hidden;
      .rectangle {
        width: 50%; height: 50%;
        background: rgb(1, 100, 0);
        position: absolute;
        top: 49%; left: 49%;
        transform: translate(-50%, -50%);
      }
      .diagonal {
        width: 2px;
        height: 100%;
        background: $mac-green;
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
    .hidden {
      opacity: 0;
    }
  }
}

</style>