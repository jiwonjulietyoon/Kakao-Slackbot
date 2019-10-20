<template>
  <div class="kakaoContainer">
    <div class="botInfo">
      <!-- Mac Window Buttons -->
      <MacWindowBtns :onExit="'toHome'" />

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
            <i class="material-icons-round left document" @click="openFeedbackDialog">description</i>
            <div class="feedbackToggle left" v-if="isAdmin">
              <i class="material-icons-round" @click="feedbackMode=true" v-show="!feedbackMode">toggle_off</i>
              <i class="material-icons-round" @click="feedbackMode=false" v-show="feedbackMode">toggle_on</i>
            </div>
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
      <div class="messageItem" v-for="(c,idx) in conversations" :key="idx">
        
        <!-- Regular Messages (both bot and user) -->
        <div class="message" :class="c.slackbot ? 'botMessage' : 'userMessage'">
          <!-- 1. Profile Image -->
          <div class="profImg">
            <img src="@/assets/slack-icon.png" @click.stop="profileDialog = true">
          </div>

          <!-- 2. Message Content (chat bubble) -->
          <div v-if="!c.isEdit" class="msgContent">
            <div>{{c.message}}</div>
          </div>
          <div v-else class="msgContent">
            <div>{{c.message}}</div>
            <v-divider></v-divider>
            <v-sheet>
              <v-textarea
                class="feedbackTextarea"
                v-model="c.editMessage"
                :auto-grow="true"
                :outlined="true"
                :clearable="true"
                :rows="2"
              >
              </v-textarea>
            </v-sheet>
          </div>

          <!-- 3. Message Info (time, unread, feedback edit) -->
          <div class="msgInfo">
            
            <!-- [Bot Only] Msg Edit Box for Feedback -->
            <div class="msgEdit">
              <div v-if='c.slackbot && !c.feedback && feedbackMode'>
                <div v-if="c.isEdit" class="feedbackBtnBox edit" :class="{'hidden' : !isAdmin}">
                  <div class="btn" @click="report(c)">
                    <i class="material-icons-round">check</i>
                  </div>
                  <div class="btn" @click="editTrigger(c)">
                    <i class="material-icons-round">cancel</i>
                  </div>
                </div>
                <div v-else class="feedbackBtnBox notEdit" :class="{'hidden' : !isAdmin}">
                  <div class="btn" @click="cancelFeedback(c)">
                    <i class="material-icons-round">check</i>
                  </div>
                  <div class="btn" @click="editTrigger(c)">
                    <i class="material-icons-round">edit</i>
                  </div>
                </div>
              </div>
            </div>

            <!-- [User Only] Unread '1' -->
            <div class="msgUnread">
              <span v-if="c.unread">1</span>
            </div>

            <!-- [Both Bot and User messages] -->
            <div class="msgTime">
              <div :title="full_date(c)">{{get_time(c)}}</div>
            </div>
          
          </div> <!-- .msgInfo -->
          
        </div> <!-- .message -->


        <!-- Bot Message with Loading Spinner -->
        <div class="message botMessage" v-if="idx == conversations.length - 1 && c.unread == false">
          <div class="profImg">
            <img src="@/assets/slack-icon.png" @click.stop="profileDialog = true">
          </div>
          <v-btn text fab x-small id="thinking" class="elevation-0" :loading="true"></v-btn>
          <div class="msgInfo">
            <div class="msgEdit"></div>
            <div class="msgTime">
              <div :title="full_date(c)">{{get_time(c)}}</div>
            </div>
          </div>
        </div> <!-- .message | Bot Message with Loading Spinner -->

      </div> <!-- .messageItem -->
    </div> <!-- .messageContainer -->
    

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

    <!-- Feedback Dialog -->
    <v-dialog v-model="feedbackDialog" width="400">
      <FeedbackDialog @child="parentsFeedback" :feedback="feedback" />
    </v-dialog>



  </div>
</template>
<script>
import firestore from "@/firebase/firebase";
import firebase from "firebase/app";
import { mapGetters } from "vuex";
import MacWindowBtns from "@/components/MacWindowBtns.vue";
import ProfileDialogSlackbot from "@/components/ProfileDialogSlackbot.vue";
import FeedbackDialog from "@/components/FeedbackDialog.vue";

export default {
  name: "Chat_Slackbot",
  components: {
    MacWindowBtns,
    ProfileDialogSlackbot,
    FeedbackDialog
  },
  data() {
    return {
      message: "",
      conversations: [],
      feedback: [],
      profileDialog: false,
      feedbackDialog: false,
      feedbackMode: false
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
    getFeedback() {
      this.feedback = []
      firestore.collection('feedback').orderBy('created_at', 'desc').get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          this.feedback.push({
            ...doc.data()
          });
        });
      })
      .catch(err => console.log(err));
    },
    editTrigger(doc) {
      doc.isEdit = !doc.isEdit
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
        this.conversations.forEach(doc => {
          if(doc.unread) {
            doc.unread = false
          }  
        })
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
          username: "Slackbot",
          unread: true,
          new: true
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
    openFeedbackDialog() {
      if (this.isAdmin) {
        this.getFeedback();
        this.feedbackDialog = true;
      }
    },
    parentsFeedback(dialog) {
      this.feedbackDialog = dialog;
    },
    getFirestoreAsOnSnapshot() {  // TODO: 추후에 모듈화할 것
      firestore.collection('conversations').orderBy("created_at")
        .onSnapshot(snapshot => {
          let changes = snapshot.docChanges();
          changes.forEach(change => {
            if (change.type === "added") {  // Firestore에 새로운 문서가 추가됐을 때, 자동으로 뷰에 업데이트되는 onSnapshot 메소드.
              let data = change.doc.data()
              data.id = change.doc.id
              data.isEdit = false
              data.editMessage = data.message
              if (data.slackbot) {   // 만약 새로운 문서(메시지)가 슬랙봇의 답장이라면
                this.conversations.forEach(doc => {
                  if (this.isAdmin) {  // 사용자가 방문자 계정일 때 자동 생성되는 슬랙봇 메시지에는 Firestore의 doc.id 가 없으므로, 이 과정을 생략한다.
                    firestore.collection('conversations').doc(doc.id).update({  // (새로 온 슬랙봇 메시지) 이전의 모든 메시지를 Firestore 상에서 읽음 처리한다.
                      unread: false,
                      new: false
                    })
                  }
                  doc.unread = false;  // 뷰 프로젝트 안의 로컬 메시지들도 읽음 처리한다.
                  doc.new = false;
                })
              }
              if (data.created_at !== null) {
                data.created_at = Number(String(data.created_at.seconds) + String(data.created_at.nanoseconds).slice(0,3))
              }
              if (data.new === false) {
                this.conversations.push(data);  // 채팅방에 바로 렌더링된다.
              } else {
                if (data.slackbot) {
                  setTimeout(() => {  // 새로 온 슬랙봇 메시지에 로딩 스피너를 걸기 위해 타임아웃을 건다 (채팅방에 바로 렌더링되지 않음).
                    this.conversations.push(data);
                    if (this.isAdmin) {
                      firestore.collection('conversations').doc(data.id).update({
                        new: false
                      })
                    }
                    this.scrollToEnd();
                  }, 2000);
                } else {
                  this.conversations.push(data);  // 채팅방에 바로 렌더링된다.
                }
              }
              this.scrollToEnd();
            }
          })
        });
    }
  },
  created() {  
    this.getFirestoreAsOnSnapshot();
  },
  mounted() {
    this.scrollToEnd();
  },
};
</script>
<style lang="scss" scoped>
@import "@/css/style.scss";
@import "@/css/chat.scss";
</style>