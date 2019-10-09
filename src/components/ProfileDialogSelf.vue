<template>
  <div class="dialogOuter">
    <section class="bgImg">
      <img src="https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fkakao-default-bg.png?alt=media&token=930bb1f3-da7f-41d7-a35e-ceffcaf1702b" alt="">
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
      <img :src="myProfileImg" alt="" @click.stop="openImgFullSize(myProfileImg)">
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
    closeDialog() {
      return this.$emit("child", false);
    },
    enterChatroomSelf() {
      if (this.$route.path === '/chat/self') {
        this.closeDialog();
      }
      else {
        this.$router.replace('/chat/self');
      }
    },
    openImgFullSize(imgURL) {
      this.$store.dispatch("setFullSizeImgURL", imgURL);
      this.$store.dispatch("setFullSizeImgDialog", true);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/css/style.scss";
@import "@/css/profileDialog.scss";

</style>