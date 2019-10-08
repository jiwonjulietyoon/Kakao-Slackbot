import Vue from 'vue';
import Vuex from 'vuex';
import getters from "./getters";
import actions from "./actions";

Vue.use(Vuex)

const state = {
  user: null,
  adminProfImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fadmin_prof.png?alt=media&token=8bd8a771-3efb-4e87-a4fd-8dc1ae2f6a91",
  visitorProfImg: "https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2Fvisitor_prof.png?alt=media&token=271e5224-6c3a-49b3-a980-2410e1db7146"
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
