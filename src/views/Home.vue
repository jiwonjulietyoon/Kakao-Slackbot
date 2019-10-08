<template>
  <div class="wrap">
    <div class="kakaoContainer">
      
      <!-- LEFT SIDE (VERTICAL MENU BAR) -->
      <section class="menubar">
        <!-- Mac Window Buttons -->
        <div class="btnBoxMac">
          <div class="btn close" @click.prevent="exitKakaoTalk" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
            <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
            <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
          </div>
          <div class="btn minimize" style="opacity: 0;">
            <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
          </div>
          <div class="btn expand" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
            <div class="rectangle" :class="{'hidden': !windowBtnHover}"></div>
            <div class="diagonal" :class="{'hidden': !windowBtnHover}"></div>
          </div>
        </div>
        
        <!-- Menu Buttons -->
        <div class="menuBtnBox">
          <i class="material-icons-round friends">person</i>
          <div class="chats"></div>
          <div class="menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <!-- Settings -->
        <div class="settingsBox">
          <div class="icons bell">
            <i class="material-icons-round">notifications</i>
          </div>
          <div class="icons settings" @click="showLogoutMenu = !showLogoutMenu">
            <i class="material-icons-round">wb_sunny</i>
            <div class="circle"></div>
          </div>
          <ul class="logoutmenu" :class="{'hidden': !showLogoutMenu}">
            <li @click="logout">Log out</li>
            <li @click="exitKakaoTalk">Quit</li>
          </ul>
        </div>
      </section>

      <!-- RIGHT SIDE -->
      <section class="friendsList">
        <!-- My Profile, Plus Friend, Friends -->
        <div class="Headline">Friends</div>
        <div class="search">
          <input type="text" v-model="friendsearch" placeholder="Search Friends">
          <i class="material-icons-round">search</i>
        </div>
        <div class="scrollable">
          <div class="myProfile">
            <div class="Title">My Profile</div>
            <div class="profileBox" @dblclick.prevent="enterChatroomSelf">
              <img :src="myProfileImg" alt="" @click.stop="profileDialogSelf = true">
              <div class="username">{{myProfileUsername}}</div>
              <div class="msg">cutie bbozzak</div>
            </div>
          </div>
          <div class="plusFriend">
            <div class="Title">Plus Friend</div>
            <div class="profileBox" @dblclick.prevent="enterChatroomSlackbot">
              <img src="@/assets/slack-icon.png" alt="" @click.stop="profileDialogSlackbot = true">
              <div class="username">Slack Chatbot</div>
              <div class="msg">안녕하세요!</div>
            </div>
          </div>
          <div class="friends">
            <div class="Title">Friends</div>
            <div class="profileBox" v-for="member in filteredMembers" :key="member.id" @dblclick.prevent="enterChatroomMembers(member.id)">
              <img :src="member.img" alt="" @click.stop="setProfileDialogInfo(member)">
              <div class="username">{{member.name}}</div>
              <div class="msg">{{member.msg}}</div>
            </div>
          </div>
        </div>

        <!-- Profile Dialog -->
        <v-dialog v-model="profileDialog" class="profileDialog" width="300">
          <ProfileDialog @child="parents" :dialog="profileDialog" :member="profileDialogMember" />
        </v-dialog>

        <!-- Profile Dialog for Slackbot -->
        <v-dialog v-model="profileDialogSlackbot" class="profileDialog" width="300">
          <ProfileDialogSlackbot />
        </v-dialog>

        <!-- Profile Dialog for Self (Currently Logged In User) -->
        <v-dialog v-model="profileDialogSelf" class="profileDialog" width="300">
          <ProfileDialogSelf />
        </v-dialog>

        <!-- Keyword Search, Realtime Keywords -->
        <div class="keywordSearch">
          <input type="text" ref="keywordFocus" v-model="keyword" @keydown.enter.prevent="searchKeyword" placeholder="Enter a keyword.">
          <span>S</span>
          <i class="material-icons-round" @click.prevent="clearKeyword" :class="{'hidden': !keyword}">cancel</i>
          <i class="material-icons-round" @click.prevent="searchKeyword">search</i>
          <div class="realtime">
            <div class="realtimeBtn">실시간</div>
            <div class="realtimeKeywords" id="realtimeKeyword">
              <span style="fontWeight: bold" id="realtime_num">1</span>
              <span id="realtime_txt">{{realtimeKeywords[0]}}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>




<script>
import firebaseAuth from "@/firebase/firebaseAuth";
import { mapGetters } from "vuex";
import ProfileDialog from "@/components/ProfileDialog.vue";
import ProfileDialogSlackbot from "@/components/ProfileDialogSlackbot.vue";
import ProfileDialogSelf from "@/components/ProfileDialogSelf.vue";

export default {
  components: {
    ProfileDialog,
    ProfileDialogSlackbot,
    ProfileDialogSelf
  },
  data: () => ({
    windowBtnHover: false,
    showLogoutMenu: false,
    friendsearch: "",
    members: [
      {
        id: "changmo",
        name: "Changmo Kang",
        msg: "1일 1혼나기",
        img: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fchangmo_prof_img.png?alt=media&token=9f883679-efa4-475b-9dfe-471569fa9ca9",
        bgImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fchangmo_bg_img.png?alt=media&token=fa69c858-cabb-47d0-ba94-658caa11c213",
        github: "ChangmoKang",
        website: "github.com/ChangmoKang",
      },
      {
        id: "hyeonbin",
        name: "Hyeonbin Park",
        msg: "현빈정점",
        img: "https://avatars0.githubusercontent.com/u/19828721?s=460&v=4",
        bgImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fhyeonbin_bg_img.png?alt=media&token=03b95d00-1590-45b3-ab02-b39808614251",
        github: "sksms17456",
        website: "sksms17456.github.io",
      },
      {
        id: "jiwon",
        name: "Jiwon Yoon",
        msg: "Juliet",
        img: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fjiwon_profile_img.png?alt=media&token=89419f1a-fb15-49c2-ac52-08d7cafe84f9",
        bgImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fcheolmin_prof_img.png?alt=media&token=290273d5-6e28-4110-8cca-1b0176b5908b",
        github: "jiwonjulietyoon",
        website: "www.jiwonjulietyoon.com",
      },
      {
        id: "joowon",
        name: "Joowon Lee",
        msg: "고양이 만세 🙆‍",
        img: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fjoowon_prof_img.jpg?alt=media&token=f8538452-733c-48fc-a392-d5830716c5b2",
        bgImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fjoowon_bg_img.png?alt=media&token=435f7eae-39f4-4d08-be6f-188bfd0f9d1b",
        github: "zooo1",
        website: "github.com/zooo1",
      },
      {
        id: "cheolmin",
        name: "Cheolmin Lee",
        msg: "autumn sky",
        img: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fcheolmin_bd_img.png?alt=media&token=3bb1dde6-e44d-411b-9f67-bee5675029e8",
        bgImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fcheolmin_bg_img.png?alt=media&token=235ce705-fd56-4a13-adb4-32d93b2a0ca2",
        github: "AutumnSky92",
        website: "github.com/AutumnSky92",
      },
    ],
    profileDialog: false,
    profileDialogMember: {},
    profileDialogSlackbot: false,
    profileDialogSelf: false,
    keyword: "",
    realtimeKeywords: [
      "SSAFY 1기 서울 2반 10조",
      "특화 프로젝트: AI 챗봇 구현",
      "프로젝트 기간: 2019.8.19 ~ 2019.10.11",
      "팀원: 강창모 박현빈 윤지원 이주원 이철민",
      "카톡 연동 (X); 카톡 UI만 클론 코딩 (O)",
      "Firestore-Slack 연동은 맞음 ㅎㅎ",
      "Python, Flask, Slack, Firebase, Vue"
    ],
    realtimeInterval: ""
  }),
  computed: {
    ...mapGetters(["user", "adminProfImg", "visitorProfImg"]),
    ...mapGetters({ isAdmin: "checkIfAdmin" }),
    myProfileUsername() {
      return this.isAdmin ? "Admin" : "Visitor"
    },
    myProfileImg() {
      return this.isAdmin ? this.adminProfImg : this.visitorProfImg
    },
    filteredMembers() {
      if (!this.friendsearch) {
        return this.members
      }

      let friendsearch = this.friendsearch.toLowerCase();

      return this.members.filter(member => {
        return member.name.toLowerCase().includes(friendsearch)
      });
    }
  },
  methods: {
    exitKakaoTalk() {
      this.$router.replace('/');
    },
    enterChatroomSelf() {
      this.$router.replace('/chat/self');
    },
    enterChatroomSlackbot() {
      this.$router.replace('/chat/slackbot');
    },
    enterChatroomMembers(name) {
      this.$router.replace(`/chat/${name}`)
    },
    logout() {
      firebaseAuth.signOut()
        .then(() => {
          this.$store.dispatch("setUserNull", null);
          this.$router.replace("/login");
        })
        .catch(err => console.log("Signout Error: ", err))
    },
    setProfileDialogInfo(member) {
      this.profileDialogMember = member;
      this.profileDialog = true;
    },
    parents(dialog) {
      this.profileDialog = dialog;
    },
    clearKeyword() {
      this.keyword = "";
      this.$refs.keywordFocus.focus();
    },
    searchKeyword() {
      if (this.keyword) {
        const url = "https://www.google.com/search?q=" + this.keyword
        window.open(url, "_blank");
      }
    },
    setRealtimeKeyword(idx, word) {
      document.getElementById('realtime_num').innerHTML = idx;
      document.getElementById('realtime_txt').innerHTML = word;
      // document.getElementById('realtimeKeyword').classList.remove('fade');
    },
    // setFadeOutEffect() {
    //   let target = document.getElementById('realtimeKeyword');
    //   // target.classList.add('fade');
    //   setInterval(function() {
    //     target.classList.add('fade');
    //   }, 5000);
    // }
  },
  mounted() {
    let i = 1;
    let words = this.realtimeKeywords;
    let self = this;
    this.realtimeInterval = setInterval(function() {
      self.setRealtimeKeyword(i+1, words[i++]);
      if (i === words.length) i = 0;
    }, 5000);
    // setTimeout(self.setFadeOutEffect(), 4500);
  },
  beforeDestroy() {
    clearInterval(this.realtimeInterval);
  }
}
</script>



<style lang="scss" scoped>
@import "@/css/style.scss";

section {
  float: left;
  height: 100%;
}
.menubar {
  background: $kakao-brown;
  width: 75px;
  position: relative;
}
.menuBtnBox {
  width: 60px;
  height: auto;
  margin: 50px auto 0;
  // border: 1px solid cyan;
  & > .friends {
    color: white;
    width: 100%;
    text-align: center;
    font-size: 2.8em;
    margin-bottom: 30px;
    @include disable-user-select;
  }
  & > .chats {
    width: 30px;
    height: 25px;
    border-radius: 50%;
    background: $btn-gray;
    margin: 0 auto 40px;
    position: relative;
    &::after {
      position: absolute;
      width: 0; height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid $btn-gray;
      border-radius: 1px;
      top: 80%;
      right: 55%;
      transform: rotate(-70deg);
    }
  }
  & > .menu {
    width: 40px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    & > span {
      width: 8px; height: 8px; border-radius: 50%;
      background: $btn-gray;
    }
  }
}

.settingsBox {
  position: absolute;
  width: 100%;
  height: auto;
  bottom: 25px;
  .icons {
    width: 20px;
    height: 20px;
    margin: 25px auto 0;
    position: relative;
    color: $btn-gray;
    i {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      @include disable-user-select;
    }
    &.settings {
      cursor: pointer;
      .circle {
        width: 17px; height: 17px;
        border-radius: 50%;
        background: $btn-gray;
        position: absolute;
        top: 46%; left: 51%;
        transform: translate(-50%, -50%);
        &::after {
          width: 11.5px; height: 11.5px;
          border-radius: 50%;
          background: $kakao-brown;
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      &:hover {
        color: $btn-gray-hover;
        .circle {background: $btn-gray-hover;}
      }
    }
  }
  .logoutmenu {
    width: 120%;
    height: auto;
    border-radius: 5px;
    position: absolute;
    bottom: 35px;
    left: 30%;
    background: $mac-gray;
    z-index: 999;
    padding: 5px 0 !important;
    overflow: hidden;
    li {
      width: 100%;
      text-align: center;
      font-size: 0.9em;
      padding: 0 15px;
      cursor: pointer;
      &:hover {
        background: $mac-blue;
        color: white;
      }
    }
    &.hidden {display: none;}
  }
}



.friendsList {
  width: calc(100% - 75px);
}
.Headline {
  height: 60px;
  border-bottom: 1px solid $outline-gray;
  padding: 15px;
  font-size: 1.3em;
  font-weight: bold;
}
.search {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid $outline-gray;
  padding: 10px 15px;
  position: relative;
  input {
    width: 100%; height: 100%;
    border-radius: 5px;
    border: 1px solid #D2D2D2;
    padding-left: 30px;
    &::placeholder {
      color: #D2D2D2;
    }
    &:focus {
      outline: none;
    }
  }
  i {
    position: absolute;
    color: #AAAAAA;
    left: 18px; top: 13px;
  }
}

.scrollable {
  height: calc(100% - 110px - 100px);
  overflow-y: auto;
}

.Title {
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid $outline-gray;
  font-size: 0.9em;
  padding-left: 20px;
  color: rgb(194, 192, 192);
}
.profileBox {
  height: 70px;
  padding: 10px 15px;
  cursor: pointer;
  &:hover {
    background: $btn-disabled;
  }
  img {
    width: 50px; height: 50px;
    border-radius: 20px;
    border: 0.5px solid $btn-disabled;
    object-fit: cover;
    margin-right: 15px;
  }
  .username, .msg {
    display: inline-block;
    vertical-align: top;
    height: 50px;
    line-height: 50px;
    @include text-truncate;
    @include disable-user-select;
  }
  .username {
    width: 50%;
    margin-right: 30px;
    font-weight: bold;
    font-size: 0.9em;
  }
  .msg {
    width: calc(50% - 100px);
    text-align: right;
    color: $btn-gray-hover;
    font-size: 0.85em;
  }
}

.keywordSearch {
  height: 100px;
  border-top: 1px solid $outline-gray;
  padding: 10px 15px;
  position: relative;
  input {
    width: 100%; height: 45px;
    border-radius: 5px;
    border: 2px solid $kakao-yellow;
    padding-left: 40px;
    padding-right: 60px;
    &::placeholder {
      color: #D2D2D2;
    }
    &:focus {
      outline: none;
    }
  }
  input + span {
    position: absolute;
    top: 12px;
    left: 28px;
    font-family: $font-kakao-round;
    font-size: 1.8em;
    @include disable-user-select;
    background: linear-gradient(to bottom right, #f7ff00, #db36a4);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  i {
    position: absolute;
    color: $mac-gray;
    @include disable-user-select;
    transition: all 0.2s;
    &:hover {color: $btn-gray-hover;}
    &.hidden {display: none;}
    &:nth-of-type(1) {
      top: 24px; right: 50px;
      font-size: 1.3em;
    }
    &:nth-of-type(2) {
      top: 22px; right: 20px;
    }
  }
  .realtime {
    height: calc(100% - 55px);
    margin-top: 10px;
    .realtimeBtn {
      float: left;
      height: 100%;
      padding: 4px 6px;
      border-radius: 5px;
      font-size: 0.8em;
      background: #A5A5A5;
      color: white;
      margin-right: 15px;
    }
    .realtimeKeywords {
      float: left;
      width: calc(100% - 75px);
      height: 100%;
      overflow: hidden;
      transition: opacity 0.5s ease;
      @include text-truncate;
      & > span {
        margin-right: 5px;
        font-size: 0.85em;
        position: relative;
        top: -1px;
      }
    }
    .fade {
      opacity: 0;
    }
  }
}
</style>