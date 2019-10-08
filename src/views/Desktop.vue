<template>
  <div class="wrap">
    <div class="shortcutsBox">
      <div class="shortcutIcon readme" @dblclick.prevent="openReadme">
        <div class="logo l1">
          <div class="logo l2">
            <div class="logo l3">
              <div class="logo l4">T</div>
            </div>
          </div>
        </div>
        <div class="text">README.md</div>
      </div>
      <div class="shortcutIcon kakao" @dblclick.prevent="openKakaoTalk">
        <div class="logo">TALK</div>
        <div class="text">KakaoTalk</div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["user"]),
    ...mapGetters({ isAdmin: "checkIfAdmin" })
  },
  methods: {
    openKakaoTalk() {
      if (this.user) {
        this.$router.replace('/home');
      }
      else {
        this.$router.replace('/login');
      }
    },
    openReadme() {
      this.$router.replace('/readme');
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/css/style.scss";

.wrap {
  position: relative;
}

.shortcutsBox {
  width: 200px;
  height: 100px;
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-between;
}

.shortcutIcon {
  width: 60px; height: 60px;
  cursor: pointer;
  position: relative;
  & > .text {
    position: absolute;
    top: 115%;
    width: 100%;
    text-align: center;
    color: white;
    font-size: 0.7em;
    font-weight: bold;
    @include disable-user-select;
  }
}

.readme {
  width: 55px; height: 55px;
  top: 3px;
  .logo {
    position: absolute;
    width: 100%; height: 100%;
    top: 0; left: 0;
    border: 0.5px solid rgb(235, 230, 228);
    background: white;
    &.l1 {
      transform: rotate(-12deg);
    }
    &.l2 {
      transform: rotate(4deg);
    }
    &.l3 {
      transform: rotate(4deg);
    }
    &.l4 {
      width: 90%; height: 90%;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: rgb(235, 230, 228);
      line-height: 45px;
      font-family: 'Noto Serif KR', serif;
      font-size: 2em;
      text-align: center;
      @include disable-user-select;
    }
  }
  & > .text {
    top: calc(115% + 3px);
  }
}

.kakao {
  background: $kakao-yellow;
  border-radius: 5px;
  .logo {
    width: 45px; height: 38px;
    line-height: 38px;
    border-radius: 50%;
    background: $kakao-brown;
    color: $kakao-yellow;
    text-align: center;
    font-family: $font-kakao-round;
    font-size: 0.9em;
    position: absolute;
    top: 47%; left: 50%;
    transform: translate(-50%, -50%);
    @include disable-user-select;
    &::after {
      position: absolute;
      width: 0; height: 0;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-top: 9px solid $kakao-brown;
      border-radius: 1px;
      top: 80%;
      right: 55%;
      transform: rotate(-70deg);
    }
  }
}
</style>