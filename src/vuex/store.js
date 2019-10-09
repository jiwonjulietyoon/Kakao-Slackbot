import Vue from 'vue';
import Vuex from 'vuex';
import getters from "./getters";
import actions from "./actions";

Vue.use(Vuex)

const state = {
  user: null,
  adminProfImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fadmin_prof.png?alt=media&token=8bd8a771-3efb-4e87-a4fd-8dc1ae2f6a91",
  visitorProfImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fvisitor_prof.png?alt=media&token=271e5224-6c3a-49b3-a980-2410e1db7146",
  members: [
    {
      id: "changmo",
      name: "Changmo Kang",
      msg: "1일 1혼나기",
      img: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fchangmo_prof_img.png?alt=media&token=9f883679-efa4-475b-9dfe-471569fa9ca9",
      bgImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fchangmo_bg_img.png?alt=media&token=fa69c858-cabb-47d0-ba94-658caa11c213",
      github: "ChangmoKang",
      website: "github.com/ChangmoKang",
      initialMsg: "안녕하세요. SSAFY 1기 강창모입니다.",
      replyMsg: "🐩🐾",
    },
    {
      id: "hyeonbin",
      name: "Hyeonbin Park",
      msg: "현빈정점",
      img: "https://avatars0.githubusercontent.com/u/19828721?s=460&v=4",
      bgImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fhyeonbin_bg_img.png?alt=media&token=03b95d00-1590-45b3-ab02-b39808614251",
      github: "sksms17456",
      website: "sksms17456.github.io",
      initialMsg: "안녕하세요 제가 바로 현빈정점입니다.",
      replyMsg: "😎",
    },
    {
      id: "jiwon",
      name: "Jiwon Yoon",
      msg: "Juliet",
      img: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fjiwon_profile_img.png?alt=media&token=89419f1a-fb15-49c2-ac52-08d7cafe84f9",
      bgImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fcheolmin_prof_img.png?alt=media&token=290273d5-6e28-4110-8cca-1b0176b5908b",
      github: "jiwonjulietyoon",
      website: "www.jiwonjulietyoon.com",
      initialMsg: "안녕하세요? jiwonjulietyoon@gmail.com으로 연락주세요 :)",
      replyMsg: "❤️💛💚💙💜",
    },
    {
      id: "joowon",
      name: "Joowon Lee",
      msg: "고양이 만세 🙆‍",
      img: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fjoowon_prof_img.jpg?alt=media&token=f8538452-733c-48fc-a392-d5830716c5b2",
      bgImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fjoowon_bg_img.png?alt=media&token=435f7eae-39f4-4d08-be6f-188bfd0f9d1b",
      github: "zooo1",
      website: "github.com/zooo1",
      initialMsg: "안녕하세요. 궁금한 것이 있으면 marulover7@gmail.com 으로 문의 주세요. 😘",
      replyMsg: "🐱😻",
    },
    {
      id: "cheolmin",
      name: "Cheolmin Lee",
      msg: "autumn sky",
      img: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fcheolmin_bd_img.png?alt=media&token=3bb1dde6-e44d-411b-9f67-bee5675029e8",
      bgImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fcheolmin_bg_img.png?alt=media&token=235ce705-fd56-4a13-adb4-32d93b2a0ca2",
      github: "AutumnSky92",
      website: "github.com/AutumnSky92",
      initialMsg: "안녕하세요, 저는 마음속에 고양이를 키우고 있습니다.",
      replyMsg: "🐈",
    },
  ]

}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    }
  },
})
