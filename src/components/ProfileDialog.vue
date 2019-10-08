<template>
  <div class="dialogOuter">
    <section class="bgImg">
      <img :src="member.bgImg" alt="">
      <div class="layer"></div>
      <div class="msg">{{member.msg}}</div>
    </section>
    <section class="profInfo">
      <div class="username">{{member.name}}</div>
      <div class="btnBox">
        <div class="btn chat">
          <div class="icon" @click.prevent="enterChatroomMembers(member.id)">
            <div class="kakaoLogo"></div>
          </div>
          <div class="label">Contact</div>
        </div>
        <div class="btn github">
          <a :href="`https://www.github.com/${member.github}`" target="_blank">
            <div class="icon">
              <img src="@/assets/github-logo.svg" alt="">
            </div>
          </a>
          <div class="label">GitHub</div>
        </div>
        <div class="btn website">
          <a :href="`https://${member.website}`" target="_blank">
            <div class="icon">
              <i class="material-icons-round">home</i>
            </div>
          </a>
          <div class="label">Website</div>
        </div>
        
      </div>
    </section>
    <div class="profImg">
      <img :src="member.img" alt="">
    </div>
  </div>
</template>


<script>
export default {
  name: "ProfileDialog",
  props: {
    dialog: {type: Boolean, default: false},
    member: {type: Object}
  },
  methods: {
    closeDialog() {
      return this.$emit("child", false);
    },
    enterChatroomMembers(name) {
      this.$router.replace(`/chat/${name}`)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/css/style.scss";
@import "@/css/profileDialog.scss";

</style>