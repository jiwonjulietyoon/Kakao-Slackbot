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
        <img class="botImg" :src="profImg" alt="">
        <div class="botText">
          <div class="top">
            <div class="username left">{{name}}</div>
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
            <img :src="profImg">
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
  </div>
</template>

<script>


export default {
  name: "Chat_Members",
  data: () => ({
    windowBtnHover: false,
    message: "",
    conversations: [],
  }),
  computed: {
    valid() {
      return this.message ? true : false
    },
    member() {
      return this.$route.fullPath.slice(6, )
    },
    name() {
      let name = ""
      if (this.member === "changmo") {
        name = "Changmo Kang"
      }
      else if (this.member === "hyeonbin") {
        name = "Hyeonbin Park"
      }
      else if (this.member === "jiwon") {
        name = "Jiwon Yoon"
      }
      else if (this.member === "joowon") {
        name = "Joowon Lee"
      }
      else if (this.member === "cheolmin") {
        name = "Cheolmin Lee"
      }
      return name
    },
    profImg() {
      let img = ""
      if (this.member === "changmo") {
        img = "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fchangmo_prof_img.png?alt=media&token=9f883679-efa4-475b-9dfe-471569fa9ca9"
      }
      else if (this.member === "hyeonbin") {
        img = "https://avatars0.githubusercontent.com/u/19828721?s=460&v=4"
      }
      else if (this.member === "jiwon") {
        img = "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fjiwon_profile_img.png?alt=media&token=89419f1a-fb15-49c2-ac52-08d7cafe84f9"
      }
      else if (this.member === "joowon") {
        img = "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fjoowon_prof_img.jpg?alt=media&token=f8538452-733c-48fc-a392-d5830716c5b2"
      }
      else if (this.member === "cheolmin") {
        img = "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fcheolmin_bd_img.png?alt=media&token=3bb1dde6-e44d-411b-9f67-bee5675029e8"
      }
      return img
    }
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
          message: ":D",
          username: "Member"
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
    }
  },
  created() {
    let now = new Date();
    const initial_message = {
      created_at: now.getTime(),
      slackbot: true,
      message: "",
      username: this.member
    }
    if (this.member === "changmo") {
      initial_message.message = "안녕하세요. SSAFY 1기 강창모입니다.";
    }
    else if (this.member === "hyeonbin") {
      initial_message.message = "안녕하세요 제가 바로 현빈정점입니다.";
    }
    else if (this.member === "jiwon") {
      initial_message.message = "안녕하세요? jiwonjulietyoon@gmail.com으로 연락주세요 :)";
    }
    else if (this.member === "joowon") {
      initial_message.message = "안녕하세요. 궁금한 것이 있으면 marulover7@gmail.com 으로 문의 주세요. 😘";
    }
    else if (this.member === "cheolmin") {
      initial_message.message = "안녕하세요, 저는 마음속에 고양이를 키우고 있습니다.";
    }
    this.conversations.push(initial_message)
  },
  mounted() {
    this.scrollToEnd();
    const members = ["changmo", "hyeonbin", "jiwon", "joowon", "cheolmin"];
    if (members.includes(this.member)) {
      // pass
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