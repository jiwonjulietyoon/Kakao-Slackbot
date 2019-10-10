<template>
  <div class="kakaoContainer" v-if="member">
    <div class="botInfo">
      <!-- Mac Window Buttons -->
      <div class="btnBoxMac">
        <div class="btn close" @click.prevent="exitKakaoTalk" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
          <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
          <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
        </div>
        <div class="btn minimize" @click.prevent="exitKakaoTalk" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
          <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
        </div>
        <div class="btn expand" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
          <div class="rectangle" :class="{'hidden': !windowBtnHover}"></div>
          <div class="diagonal" :class="{'hidden': !windowBtnHover}"></div>
        </div>
      </div>

      <div class="infoBox">
        <img class="botImg" :src="member.img" alt="" @click.stop="profileDialog = true">
        <div class="botText">
          <div class="top">
            <div class="username left">{{member.name}}</div>
            <div class="scale right"></div>
          </div>
          <div class="bottom">
            <div class="members left clearfix">
              <i class="material-icons-round">person</i>
              <span>2</span>
            </div>
            <i class="material-icons-round left document">description</i>
            <div class="icons right">
              <i class="material-icons-round menu">menu</i>
            </div>
            <div class="icons right">
              <i class="material-icons-round bell">notifications</i>
            </div>
            <div class="icons right">
              <i class="material-icons-round search">search</i>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="messageContainer scrollable" id="scroll">
      <div v-for="c in conversations" :key="c.id">
        <div class="message" 
          :class="c.slackbot ? 'botMessage' : 'userMessage'"
        >
          <div class="profImg">
            <img :src="member.img" @click.stop="profileDialog = true">
          </div>
          <div class="msgContent">
            <div>{{c.message}}</div>
          </div>
          <div class="msgTime">
            <div
              :title="full_date(c)"
            >
              {{get_time(c)}}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="attach">
      <i class="material-icons-round icons left emoji">tag_faces</i>
      <i class="material-icons-round icons left clip">attachment</i>
      <i class="material-icons-round icons right video">videocam</i>
      <i class="material-icons-round icons right phone">phone</i>
    </div>
    
    <div class="sendMessage">
      <div class="inputContainer">
        <textarea v-model="message" @keydown.enter="handler" class="scrollable"></textarea>
      </div>
      <div class="btnContainer">
        <button @click.prevent="sendMsg" :disabled="!valid">Send</button>
      </div>
    </div>

    <!-- Profile Dialog -->
    <v-dialog v-model="profileDialog" class="profileDialog" width="300">
      <ProfileDialog @child="parents" :dialog="profileDialog" :member="member" />
    </v-dialog>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ProfileDialog from "@/components/ProfileDialog.vue";

export default {
  name: "Chat_Members",
  components: {
    ProfileDialog
  },
  data: () => ({
    windowBtnHover: false,
    message: "",
    conversations: [],
    profileDialog: false,
  }),
  computed: {
    ...mapGetters(["members"]),
    valid() {
      return this.message ? true : false
    },
    currentMember() {
      return this.$route.fullPath.slice(6, )
    },
    member() {
      return this.members.find(m => {
        return this.currentMember === m.id
      })
    },
  },
  methods: {
    exitKakaoTalk() {
      this.$router.replace('/home');
    },
    sendMsg() {
      const trimmedMsg = this.message.replace(/\s+/g, '');
      if (trimmedMsg) {
        let now = new Date();
        this.conversations.push({
          created_at: now.getTime(),
          slackbot: false,
          message: this.message,
          username: "User"
        });
        this.conversations.push({
          created_at: now.getTime(),
          slackbot: true,
          message: this.member.replyMsg,
          username: this.member.id
        })
        this.message = "";
        this.scrollToEnd();
      }
    },
    handler(e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        this.sendMsg();
      }
    },
    full_date(c) {
      if (c.created_at) {
        const date = new Date(c.created_at);
        return String(date).split("GMT")[0];
      }
      else {
        const date = new Date();
        return String(date).split("GMT")[0];
      }
    },
    get_time(c) {
      if (c.created_at) {
        const date = new Date(c.created_at);
        let h = date.getHours();
        let m = date.getMinutes();
        let ampm = "AM";
        if (h === 0) {
          h = 12;
        }
        else if (h > 12) {
          h -= 12;
          ampm = "PM";
        }
        if (m < 10) {
          m = '0'+m;
        }
        return `${h}:${m} ${ampm}`
      }
      else {
        const date = new Date();
        return `${date.getHours()}:${date.getMinutes()}`
      }
      
    },
    scrollToEnd () {
      this.$nextTick(() => {
        var elem = this.$el.querySelector('#scroll')
        elem.scrollTop = elem.scrollHeight
      })
    },
    parents(dialog) {
      this.profileDialog = dialog;
    },
  },
  mounted() {
    const membersName = ["changmo", "hyeonbin", "jiwon", "joowon", "cheolmin"];
    if (membersName.includes(this.currentMember)) {
      let now = new Date();
      this.conversations.push({
        created_at: now.getTime(),
        slackbot: true,
        message: this.member.initialMsg,
        username: this.member.id
      })
    }
    else {
      this.$router.replace('/home')
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/css/style.scss";
@import "@/css/chat.scss";

</style>