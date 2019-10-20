<template>
  <div class="kakaoContainer">
    <div class="botInfo">
      <!-- Mac Window Buttons -->
      <MacWindowBtns :onExit="'toHome'" />

      <div class="infoBox">
        <img class="botImg" :src="myProfileImg" alt="" @click.stop="profileDialog = true">
        <div class="botText">
          <div class="top">
            <div class="username left">{{myProfileUsername}}</div>
            <div class="scale right"></div>
          </div>
          <div class="bottom">
            <div class="members left clearfix">
              <i class="material-icons-round">person</i>
              <span>1</span>
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
            <img :src="myProfileImg">
          </div>
          <div class="msgContent">
            <div>{{c.message}}</div>
          </div>
          <div class="msgInfo">
            <!-- .msgEdit, .msgUnread merely act as placeholders in this component -->
            <div class="msgEdit"></div>
            <div class="msgUnread"></div>
            <div class="msgTime">
              <div :title="full_date(c)">{{get_time(c)}}</div>
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
        <textarea v-model="message" @keydown.enter="handler" class="scrollable" autofocus></textarea>
      </div>
      <div class="btnContainer">
        <button @click.prevent="sendMsg" :disabled="!valid">Send</button>
      </div>
    </div>

    <!-- Profile Dialog for Self (Currently Logged In User) -->
    <v-dialog v-model="profileDialog" class="profileDialog" width="300">
      <ProfileDialogSelf @child="parents" :dialog="profileDialog" />
    </v-dialog>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MacWindowBtns from "@/components/MacWindowBtns.vue";
import ProfileDialogSelf from "@/components/ProfileDialogSelf.vue";

export default {
  name: "Chat_Self",
  components: {
    MacWindowBtns,
    ProfileDialogSelf
  },
  data() {
    return {
      message: "",
      conversations: [],
      profileDialog: false,
    }
  },
  computed: {
    ...mapGetters(["user", "adminProfImg", "visitorProfImg"]),
    ...mapGetters({ isAdmin: "checkIfAdmin" }),
    myProfileUsername() {
      return this.isAdmin ? "Admin" : "Visitor"
    },
    myProfileImg() {
      return this.isAdmin ? this.adminProfImg : this.visitorProfImg
    },
    valid() {
      return this.message ? true : false
    }
  },
  methods: {
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
    this.scrollToEnd();
  }
};
</script>

<style lang="scss" scoped>
@import "@/css/style.scss";
@import "@/css/chat.scss";

</style>
