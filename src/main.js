import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/store';
import vuetify from './plugins/vuetify';
import firebaseAuth from "@/firebase/firebaseAuth";

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  created() {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        // this.$store.dispatch("autoSignIn", user);
        console.log('autosignin user!');
        console.log(user.email, user.uid)
        this.$store.dispatch("setUserAutoSignin", {
          id: user.uid,
          email: user.email
        })
      }
    });
  },
  render: h => h(App)
}).$mount('#app')
