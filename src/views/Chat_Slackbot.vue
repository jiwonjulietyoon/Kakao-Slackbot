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
      <div v-for="(c,idx) in conversations" :key="idx" class="messageItem">
        <div class="message" 
          :class="c.slackbot ? 'botMessage' : 'userMessage'"
        >
          <div class="profImg">
            <img src="@/assets/slack-icon.png" @click.stop="profileDialog = true">
          </div>
          <div v-if="!c.isEdit" class="msgContent">
            <div>{{c.message}}</div>
          </div>
          <!-- https://vuetifyjs.com/en/components/text-fields#validation -->
          <div v-else class="msgContent">
            <div>{{c.message}}</div>
            <v-divider></v-divider>
            <v-sheet>
              <v-textarea
                v-model="c.editMessage"
                :auto-grow="true"
                :outlined="true"
                :clearable="true"
                :loading="true"
                :rows="2"
              >
              </v-textarea>
            </v-sheet>
          </div>
          <div class="msgTime">
            <div
              :title="full_date(c)"
            >
              {{get_time(c)}}
              <span class="unread" :class="{'display': c.unread}">1</span>
              <div v-if='c.slackbot && !c.feedback'>
                <div v-if="c.isEdit" class="feedbackBtnBox1" :class="{'hidden' : !isAdmin}">
                  <!-- https://vuetifyjs.com/en/components/ratings#usage -->
                  <div class="btn" @click="report(c)">
                    <i class="material-icons-round">check</i>
                  </div>
                  <div class="btn" @click="editTrigger(c)">
                    <i class="material-icons-round">cancel</i>
                  </div>
                </div>
                <div v-else class="feedbackBtnBox2" :class="{'hidden' : !isAdmin}">
                  <!-- https://vuetifyjs.com/en/components/ratings#usage -->
                  <div class="btn" @click="cancelFeedback(c)">
                    <i class="material-icons-round">check</i>
                  </div>
                  <div class="btn" @click="editTrigger(c)">
                    <i class="material-icons-round">edit</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
                
        <div class="message botMessage"
          v-if="idx == conversations.length - 1 && c.unread == false"
        >
          <div class="profImg">
            <img src="@/assets/slack-icon.png" @click.stop="profileDialog = true">
          </div>
          <v-btn text fab x-small id="thinking" class="elevation-0" :loading="true"></v-btn>
          <div class="msgTime">
            <div
              :title="full_date(c)"
            >
              {{get_time(c)}}
              <span class="unread" :class="{'display': c.unread}">1</span>
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
    cancelFeedback(doc) {
      firestore.collection('conversations').doc(doc.id).update({
        feedback: true
      })
      doc.feedback = true
    },
    async report(doc) {
      const q_doc = await firestore.collection('conversations').doc(doc.question_id).get()
        firestore.collection('feedback')
          .add({
            question_id: q_doc.id,
            question_message: q_doc.data().message,
            origin_message: doc.message,
            feedback_message: doc.editMessage,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
          })
      firestore.collection('conversations').doc(doc.id).update({
        feedback: true
      })
      doc.message = doc.editMessage
      doc.feedback = true
      this.editTrigger(doc)
    },
    editTrigger(doc) {
      doc.isEdit = !doc.isEdit
    },
    exitKakaoTalk() {
      this.$router.replace('/home');
    },
    sendMsgAdmin() {
      if (this.isAdmin) {
        const trimmedMsg = this.message.replace(/\s+/g, '');
        if (trimmedMsg) {
          firestore.collection('conversations')
            .add({
              created_at: firebase.firestore.FieldValue.serverTimestamp(),
              slackbot: false,
              message: this.message,
              username: "Admin",
              unread: true,
              new: true
            })
            .then(new_doc => {
              firestore.collection('conversations').doc(new_doc.id).get()
                .then(doc => {
                  firestore.collection('questions')
                    .add({
                      question_id: doc.id,
                      question: doc.data().message
                    });
                })
            })
          this.message = "";
        }
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
        let changes = snapshot.docChanges();
        changes.forEach(change => {
          if (change.type === "added") {
            let data = change.doc.data()
            data.id = change.doc.id
            data.isEdit = false
            data.editMessage = data.message
            if (data.slackbot) {
              this.conversations.forEach(doc => {
                firestore.collection('conversations').doc(doc.id).update({
                  unread: false,
                  new: false
                })
                doc.unread = false;
                doc.new = false;
              })
            }
            if (data.created_at !== null) {
              data.created_at = Number(String(data.created_at.seconds) + String(data.created_at.nanoseconds).slice(0,3))
            }
            if (data.new === false) {
              this.conversations.push(data);
            } else {
              if (data.slackbot) {
                setTimeout(() => {
                  this.conversations.push(data);
                  firestore.collection('conversations').doc(data.id).update({
                    new: false
                  })
                  this.scrollToEnd();
                }, 2000);
              } else {
                this.conversations.push(data);
              }
            }
            this.scrollToEnd();
          }
        })
      });
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