import Vue from "vue";
import router from "@/router";
import firebase from "firebase/app";
import firebaseAuth from "@/firebase/firebaseAuth";
import firestore from "@/firebase/firebase";


export default {
  setUser({ commit }, payload) {
    // 로컬 로그인 후 유저 정보 세팅
    console.log('actions.js setuser', payload);
    console.log(payload.user.uid, payload.user.email);
    commit("setUser", {
      id: payload.user.uid,
      email: payload.user.email
    });
  },
  setUserAutoSignin({commit}, payload) {
    commit("setUser", {
      id: payload.uid,
      email: payload.email
    })
    console.log('setuserautosignin')
  },
  setUserNull({commit}, payload) {
    commit("setUser", null);
  }
}