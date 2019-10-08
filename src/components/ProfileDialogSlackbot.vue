<template>
  <div class="dialogOuter">
    <section class="bgImg">
      <img src="" alt="">
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
      <img src="@/assets/slack-icon.png" alt="">
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
        guideline = "챗봇 답장 시간이 조금 걸릴 수 있습니다 :) 차분히 기다려주세요~"
      }
      else {
        guideline = "방문자 계정은 읽기 전용입니다. 챗봇과 대화하려면 관리자로 로그인해주세요 :)"
      }
      return guideline
    }
  },
  methods: {
    enterChatroomSlackbot() {
      this.$router.replace('/chat/slackbot')
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/css/style.scss";
@import "@/css/profileDialog.scss";

</style>