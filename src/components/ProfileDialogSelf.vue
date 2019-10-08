<template>
  <div class="dialogOuter">
    <section class="bgImg">
      <img src="" alt="">
      <div class="layer"></div>
      <div class="msg">{{myProfileMsg}}</div>
    </section>
    <section class="profInfo">
      <div class="username">{{myProfileUsername}}</div>
      <div class="btnBox">
        <div class="btn chat">
          <div class="icon" @click.prevent="enterChatroomSelf">
            <div class="kakaoLogo"></div>
          </div>
          <div class="label">My Chatroom</div>
        </div>
      </div>
    </section>
    <div class="profImg">
      <img :src="myProfileImg" alt="">
    </div>
  </div>
</template>


<script>
import { mapGetters } from "vuex";

export default {
  name: "ProfileDialogSelf",
  computed: {
    ...mapGetters(["user", "adminProfImg", "visitorProfImg"]),
    ...mapGetters({ isAdmin: "checkIfAdmin" }),
    myProfileUsername() {
      return this.isAdmin ? "Admin" : "Visitor"
    },
    myProfileImg() {
      return this.isAdmin ? this.adminProfImg : this.visitorProfImg
    },
    myProfileMsg() {
      let msg = "";
      if (this.isAdmin) {
        msg = "관리자 계정입니다 :)";
      }
      else {
        msg = "방문자 계정입니다. :)"
      }
      return msg
    }
  },
  methods: {
    enterChatroomSelf() {
      this.$router.replace('/chat/self')
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/css/style.scss";
@import "@/css/profileDialog.scss";

</style>