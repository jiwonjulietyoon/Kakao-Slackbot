# Building a Chatbot with Slack, Firestore, and Vue.js

September 2019, Jiwon Juliet Yoon

Related Project: [KakaoTalk-Clone Slackbot](<https://github.com/jiwonjulietyoon/Kakao-Slackbot>)

### Intro

This post mostly focuses on the **front-end web** aspect of building a KakaoTalk clone chatbot, as well as the overall process of **integrating Slack, Firestore, and Vue.js**. (This post does NOT discuss the chatbot training process, i.e the core AI & machine learning algorithm that constructs a relevant chatbot response based on the user input.)

The initial goal of this chatbot project was to enable conversations between users and bots via Slack, but I wanted to build a separate chatting platform so that I could have more flexibility with the UI/UX. Hence the Kakao chatroom clone was built as a side project.

In summary, this post will primarily demonstrate how to:

- integrate Slack and Firestore via Slack incoming webhooks and Cloud Functions (Firestore triggers)
- render realtime Firestore data via the onSnapshot method
- write data to Firestore via Python and JavaScript (Vue.js)
- create a KakaoTalk chatroom clone UI/UX with Vue.js and CSS (SCSS)

<br>

### Process Overview

> Conversations between the user and the chatbot will be visually rendered on a Vue CLI project (the Kakao chatroom clone), but the actual conversation logic will be running via Slack API, Python, and Flask.
>
> You will need:
>
> - **Vue CLI project**: Firestore trigger function, Kakao chatroom clone
>
> - **Python `app.py`**: Slack bot mentions/response handler, machine learning trained chatbot model
>
> - **Firestore**: user-chatbot conversation data
>
>   - `questions` collection: user input only
>
>   - `conversations` collection: user input *and* slackbot responses



![Process Overview](./img/slack_firestore_integration_process_overview.png)

1. User enters a message, which is stored into both Firestore `questions` and `conversations` collections.
2. This message appears in the Kakao-clone chatroom, which renders Firestore `conversations` collection data in realtime.
3. The same message is also stored in Firestore `questions` collection, which is linked to the Firestore trigger function. Whenever a new document is added to this collection, Firestore will trigger the Slack incoming webhook.
4. The message is posted to a pre-designated Slack channel, mentioning a pre-designated Slack bot.
5. Slack chatbot makes a response according to the trained model. This response is also stored in the Firestore `conversations` collection.
6. Chatbot response is synced realtime into the Kakao-clone chatroom.

<br>

### Step 1) Create new Vue CLI project

In terminal:

1. `npm i -g @vue/cli`
2. `vue create slackbot-chats` (where 'slackbot-chats' is the project name)

	> As for project features, I usually include Router, Vuex, CSS Pre-processors, and Linter/Formatter. Note that this project will use **Node SCSS** as CSS Pre-processors.

3. `vue add vuetify`

	> Optional step. This project *does* use Vuetify, although it's not a fundamental component.

<br>

### Step 2) Set up Slack incoming webhook

1. Create a new Slack app (Slack chatbot) at <https://api.slack.com/apps>
2. Activate Incoming Webhooks
3. Add new webhook to workspace. Select specific Slack channel. When a new document is added to the Firestore `questions` collection, Slack will post a notification message in this channel.
4. Copy and save the webhook url somewhere, preferably as an environment variable. This url will be used to write Cloud Functions (Firestore trigger).

<br>

### Step 3) Deploy Firestore trigger cloud function

> Note that Firestore triggers are still in Beta, as of September 2019.
>
> Also, Firestore triggers are NOT supported on the free spark plan, so the Firebase project billing plan needs to be upgraded. I upgraded mine to Blaze plan (start free, pay as you go).

1. Create new Firebase project

   - Set Google Cloud Platform (GCP) resource location 
     - `asia-northeast2` (Osaka, Japan) is closest for Seoul
   - Create Firestore Database (start in test mode)

2. In the Vue project terminal:

   - `npm install -g firebase-tools --save`
     - yarn global add firebase-tools
   - `firebase login`
   - `firebase init`
   - `firebase deploy`

   > I mostly went by the default feature settings.

3. A `functions/index.js` file will have been created in the Vue project directory. Add the following [Firestore trigger background function](<https://firebase.google.com/docs/functions/firestore-events>):

   ```javascript
   const request = require("request");
   ...
   exports.notifyNewQuestion = functions.firestore
       .document('/questions/{questionID}')
       .onCreate((snap, context) => {
           const newValue = snap.data();
           const question = newValue.question;
           return request.post(
               "[Slack Webhook URL]",
               {json: {text: `<@SlackBotID> ${question}`}}
           );
       });
   ```

   This function detects any new document in the Firestore `questions` collection, and accordingly posts a notification message in Slack.

   - `notifyNewQuestion` => name of this function (arbitrary)
   - `questions` => name of the Firestore collection that we want to watch.
     - `'/questions/{questionID}'` => wildcard pattern to detect any new document in the collection. `questionID` was arbitrary.
   - Insert the Slack webhook URL copied from Step 2
   - To include Slackbot mentions as part of the message to post in Slack via webhook, use the following format: `<@SlackBotID>`, e.g) `<@UM61N25K9>`. Refer to Step 4-2 to find out how to retrieve your bot's unique ID.

4. In the Vue project terminal, move to the `functions/` directory and then run `npm i request --save`

5. Run `firebase deploy --only functions` in the Vue project terminal to deploy the above background function.

   - The function will have been added to Firebase Functions.
   - If you need to modify the trigger function, run `firebase deploy --only functions` again after making changes to the `functions/index.js` file.

<br>

### Step 4) Set up `app.py` to handle Slackbot mentions

> This `app.py` should preferably be separate from the Vue CLI project, as both need to be simultaneously run on different servers. I used Ngrok to run `app.py`. 

1. In Firebase project settings, click on the 'Service accounts' tab. Select 'Python' for the Admin SDK configuration snippet, then click 'Generate new private key'. Save this file as `key.json` into the same directory level as `app.py`.

2. In `app.py`:

   ```python
   # Import Modules
   import os
   from threading import Thread
   import time
   
   from flask import Flask
   from slack import WebClient
   from slackeventsapi import SlackEventAdapter
   
   import firebase_admin
   from firebase_admin import credentials
   from firebase_admin import firestore
   
   
   # Initialize Firestore
   cred = credentials.Certificate('key.json')
   firebase_admin.initialize_app(cred)
   db = firestore.client()
   
   
   # Slack API App Credentials
   SLACK_TOKEN = os.getenv("SLACK_TOKEN")  # Client Secret
   SLACK_SIGNING_SECRET = os.getenv("SLACK_SIGNING_SECRET")  # Signing Secret
   
   app = Flask(__name__)
   
   slack_events_adaptor = SlackEventAdapter(SLACK_SIGNING_SECRET, "/listening", app)
   slack_web_client = WebClient(token=SLACK_TOKEN)
   
   
   ##############################################################################
   
   def getChatbotResponse(question):
       response = trained_model(question)  # AI / machine learning part goes here
       
       ref = db.collection('conversations')  # store chatbot answer in Firestore
       ref.document().set({
           'created_at': time.time()*1000,
           'slackbot': True,
           'message': response,
           'username': 'SlackBotName',
           'unread': True,
           'new': True
       })
       return response
       
   
   # Triggered when Slackbot is mentioned in any Slack channel
   @slack_events_adaptor.on("app_mention")
   def app_mentioned(event_data):
       # Prevent Slackbot from making multiple responses to a single HTTP request
       # due to the 3-second server timeout rule
       if request.headers.get('X-Slack-Retry-Num') != None:
           return make_response("Ignoring retries", 200)
   
       channel = event_data["event"]["channel"]
       bot_name = event_data['authed_users'][0]
       text = event_data["event"]["text"].replace(f"<@{bot_name}>", "")
       
       slack_web_client.chat_postMessage(  # post response to the same channel
           channel=channel,
           text=getChatbotResponse(text)
       )
   
       
   @app.route("/", methods=["GET"])
   def index():
    return "<h1>Server is ready.</h1>"
   
   
   if __name__ == '__main__':
       app.run()
   ```
   
   - Store chatbot's response in Firestore `conversations` collection. Data modeling is as follows:
     - `created_at` : Number (unix epoch time in milliseconds, e.g 1569396265806)
     - `slackbot` : Boolean (`True` if message sender is Slackbot, otherwise `False`)
     - `message` : String
     - `username` : String
     - `unread`, `new` : Boolean (used to replicate KakaoTalk's unread message sign - the little '1')
   - `bot_name` will give you the unique ID of the particular Slackbot, e.g) UM61N25K9

> How to run `app.py` via Ngrok (Windows version):
>
> 1. In terminal, run `python app.py`
> 2. Run ngrok.exe, and in the ngrok terminal run `ngrok http 5000`. Copy the http address.
> 3. Visit [Slack API](https://api.slack.com) and click on your app's Event Subscriptions feature.  Activate 'Enable Events', and enter the http address + `/listening` as the Request URL, e.g) `http://522f337b.ngrok.io/listening`. In the 'Subscribe to Bot Events' section, add the `app_mention` event. Save changes.

<br>

### Step 5) Clone KakaoTalk on the Vue project

Please refer to <https://github.com/jiwonjulietyoon/Kakao-Slackbot/> for the most recent version.

`src/views/Chat_Slackbot.vue`

```vue
<template>
  <div class="kakaoContainer">
    <div class="botInfo">
      <!-- Mac Window Buttons -->
      <div class="btnBoxMac">
        ...
      </div>

      <div class="infoBox">
        ...
      </div>
    </div>
    
    <div class="messageContainer scrollable" id="scroll">
      <div v-for="c in conversations" :key="c.id">
        <div class="message" 
          :class="c.slackbot ? 'botMessage' : 'userMessage'"
        >
          <div class="profImg">
            <img src="@/assets/slack-icon.png">
          </div>
          <div class="msgContent">
            <div>{{c.message}}</div>
          </div>
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
            username: "Admin",
            unread: true,
            new: true
          })
        firestore.collection('questions')
          .add({
            question: this.message
          });
        this.message = "";
      }
    },
    sendMsgVisitor() {
      ...
    },
    handler(e) {
      ...
    },
    full_date(c) {
      ...
      return String(date).split("GMT")[0];
    },
    get_time(c) {
      ...
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
```

- The `div.messageContainer` section renders Firestore `conversations` data in realtime. Refer to the `onSnapshot` method used in the `created()` lifecycle.
- When the "Send" button is clicked, user input is stored in both Firestore `questions` and `conversations` collections. Refer to the `sendMsg()` method.

<br>

<br>

### Finito!

<br>

<br>

#### (Deploying Vue Project to Firebase)

`firebase init`

- What do you want to use as your public directory? => `dist`
- Configure as a single-page app (rewrite all urls to /index.html)? => `y`

`npm run build`

`firebase deploy --only hosting`