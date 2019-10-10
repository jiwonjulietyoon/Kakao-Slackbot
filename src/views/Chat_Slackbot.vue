<template>
  <div class="kakaoContainer">
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
        <img class="botImg" src="@/assets/slack-icon.png" alt="" @click.stop="profileDialog = true">
        <div class="botText">
          <div class="top">
            <div class="username left">Slack Chatbot</div>
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
            <img src="@/assets/slack-icon.png" @click.stop="profileDialog = true">
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
        <textarea v-model="message" @keydown.enter="handler" class="scrollable" autofocus :placeholder="isAdmin ? '' : 'Read Only for Visitors :)'"></textarea>
      </div>
      <div class="btnContainer">
        <button @click.prevent="sendMsgVisitor" :disabled="!valid">Send</button>
        <button @click.prevent="sendMsgAdmin" :class="{'hidden': !isAdmin}" :disabled="!valid">Send</button>
      </div>
    </div>

    <!-- Profile Dialog for Slackbot -->
    <v-dialog v-model="profileDialog" class="profileDialog" width="300">
      <ProfileDialogSlackbot @child="parents" :dialog="profileDialog" />
    </v-dialog>

  </div>
</template>

<script>
import firestore from "@/firebase/firebase";
import firebase from "firebase/app";
import { mapGetters } from "vuex";
import ProfileDialogSlackbot from "@/components/ProfileDialogSlackbot.vue";

export default {
  name: "Chat_Slackbot",
  components: {
    ProfileDialogSlackbot
  },
  data() {
    return {
      windowBtnHover: false,
      message: "",
      conversations: [],
      profileDialog: false,
    }
  },
  computed: {
    ...mapGetters(["user"]),
    ...mapGetters({ isAdmin: "checkIfAdmin" }),
    valid() {
      return this.message ? true : false
    }
  },
  methods: {
    exitKakaoTalk() {
      this.$router.replace('/home');
    },
    sendMsgAdmin() {
      const trimmedMsg = this.message.replace(/\s+/g, '');
      if (trimmedMsg) {
        firestore.collection('conversations')
          .add({
            created_at: firebase.firestore.FieldValue.serverTimestamp(),
            slackbot: false,
            message: this.message,
            username: "Admin"
          });
        firestore.collection('questions')
          .add({
            question: this.message
          });
        this.message = "";
      }
    },
    sendMsgVisitor() {
      const trimmedMsg = this.message.replace(/\s+/g, '');
      if (trimmedMsg) {
        let now = new Date();
        this.conversations.push({
          created_at: now.getTime(),
          slackbot: false,
          message: this.message,
          username: "Visitor"
        });
        this.conversations.push({
          created_at: now.getTime(),
          slackbot: true,
          message: "Visitor 계정은 챗봇에 연결되어 있지 않습니다 :(",
          username: "Slackbot"
        })
        this.message = "";
        this.scrollToEnd();
      }
    },
    handler(e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        if (this.isAdmin) {
          this.sendMsgAdmin();
        }
        else {
          this.sendMsgVisitor();
        }
      }
    },
    full_date(c) {
      let date = new Date();
      if (c.created_at) {
        date = new Date(c.created_at);
      }
      return String(date).split("GMT")[0];
    },
    get_time(c) {
      let date = new Date();
      if (c.created_at) {
        date = new Date(c.created_at);
      }
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
    },
    scrollToEnd () {
      this.$nextTick(() => {
        const elem = this.$el.querySelector('#scroll')
        elem.scrollTop = elem.scrollHeight
      })
    },
    parents(dialog) {
      this.profileDialog = dialog;
    },
  },
  created() {
    firestore.collection('conversations').orderBy("created_at")
      .onSnapshot(snapshot => {
        this.conversations = snapshot.docs.map(doc => {
          let data = doc.data()
          data.created_at !== null 
            ? data.created_at = Number(String(data.created_at.seconds) + String(data.created_at.nanoseconds).slice(0,3))
            : undefined
          return data
        });
        this.scrollToEnd();
      })
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
