<template>
  <div class="dialogOuter">
    <section class="bgImg">
      <img src="https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fkakao-default-bg.png?alt=media&token=930bb1f3-da7f-41d7-a35e-ceffcaf1702b" alt="">
      <div class="layer"></div>
      <div class="msg">{{guideline}}</div>
    </section>
    <section class="profInfo">
      <div class="username">Slackbot</div>
      <div class="btnBox">
        <div class="btn chat">
          <div class="icon" @click.prevent="enterChatroomSlackbot">
            <div class="kakaoLogo"></div>
          </div>
          <div class="label">Contact</div>
        </div>
      </div>
    </section>
    <div class="profImg">
      <img src="@/assets/slack-icon.png" alt="" @click.stop="openImgFullSize('https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fslack-icon.png?alt=media&token=47b6b304-164a-4161-bc24-c6f66963868e')">
    </div>
  </div>
</template>


<script>
import { mapGetters } from "vuex";

export default {
  name: "ProfileDialogSlackbot",
  computed: {
    ...mapGetters({ isAdmin: "checkIfAdmin" }),
    guideline() {
      let guideline = "";
      if (this.isAdmin) {
        guideline = "챗봇 답장 시간이\n조금 걸릴 수 있습니다 :)\n차분히 기다려주세요~"
      }
      else {
        guideline = "방문자 계정은 읽기 전용입니다.\n챗봇과 대화하려면\n관리자로 로그인해주세요 :)"
      }
      return guideline
    }
  },
  methods: {
    closeDialog() {
      return this.$emit("child", false);
    },
    enterChatroomSlackbot() {
      if (this.$route.path === '/chat/slackbot') {
        this.closeDialog();
      }
      else {
        this.$router.replace('/chat/slackbot');
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