<template>
  <div class="wrap">
    <div class="kakaoContainer">
      
      <!-- Mac Window Buttons -->
      <MacWindowBtns :onExit="'toRoot'" />

      <!-- Logo & Login Form -->
      <div class="main">
        <div class="kakaoLogo">TALK</div>
        <v-form
          ref="form"
          class="loginForm"
        >
          <div class="inputBox" :class="{'loginError': loginError}">
            <input type="text" v-model="email" @keydown.enter.prevent="login" class="input email" placeholder="Email or Phone Number">
            <input type="password" v-model="password" @keydown.enter.prevent="login" class="input password" placeholder="Password (4-32 characters)">
          </div>

          <v-btn @click.prevent="login" class="loginBtn" :class="{'loginError': loginError}" :disabled="!valid" :loading="spinner">Log in</v-btn>
        </v-form>
        <div class="rememberMe">
          <div class="checkBox">
            <i class="material-icons-round">check</i>
          </div>
          <div class="text">Keep me logged in</div>
          <div class="help">?</div>
        </div>
        <div class="loginErrorMsg" :class="{'hide': !loginError}">{{loginErrorMsg}}</div>

      </div>

      <!-- Footer Text -->
      <div class="footerText">
        Find My Kakao Account | Reset Password
      </div>

    </div>
  </div>
</template>




<script>
import firebaseAuth from "@/firebase/firebaseAuth";
import MacWindowBtns from "@/components/MacWindowBtns.vue";

export default {
  components: {
    MacWindowBtns
  },
  data() {
    return {
      email: "",
      password: "",
      loginErrorMsg: "",
      loginError: false,
      spinner: false
    }
  },
  computed: {
    valid() {
      if (!this.email & !this.password) {
        return true
      }
      else if (this.password.length < 4) {
        return false
      }
      else {
        return true
      }
    }
  },
  watch: {
    email() {
      this.loginError = false;
    },
    password() {
      this.loginError = false;
    }
  },
  methods: {
    login() {
      this.loginClick()
      firebaseAuth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(credential => {
          const user = credential.user;
          this.$store.dispatch("setUser", {user});
        })
        .then(() => {
          this.reset();
          this.$router.replace('/home');
          this.loginClick()
        })
        .catch(error => {
          this.loginErrorMsg = error.message;
          this.loginError = true
          this.loginClick()
        });
    },
    reset() {
      this.email = "";
      this.password = "";
    },
    loginClick() {
      this.spinner = !this.spinner
    }
  }
}
</script>



<style lang="scss" scoped>
@import "@/css/style.scss";

.wrap {
  overflow-y: auto;
}

.kakaoContainer {
  background: $kakao-yellow;
  position: relative;
  min-height: 550px;
}

.main {
  width: 60%;
  height: 470px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.kakaoLogo {
  width: 160px;
  height: 130px;
  line-height: 130px;
  background: $kakao-brown;
  border-radius: 50%;
  color: $kakao-yellow;
  font-size: 3em;
  font-family: $font-kakao-round;
  text-align: center;
  margin: 0 auto;
  position: relative;
  @include disable-user-select;
  &::after {
    position: absolute;
    width: 0; height: 0;
    border-left: 32px solid transparent;
    border-right: 32px solid transparent;
    border-top: 30px solid $kakao-brown;
    border-radius: 5px;
    top: 83%;
    right: 50%;
    transform: rotate(-70deg);
  }
}
.loginForm {
  margin-top: 60px;
  .inputBox {
    height: 110px;
    background: white;
    border-radius: 5px;
    overflow: hidden;
    border: 2px solid $kakao-yellow-outline;
    &.loginError {
      border-color: $mac-red;
    }
  }
  .input {
    &:focus {
      outline: none;
    }
    width: 100%;
    height: 50%;
    padding: 0 20px;
    &.email {
      border-bottom: 1px solid $btn-disabled;
    }
  }
  .loginBtn {
    margin-top: 10px !important;
    width: 100% !important;
    height: 60px !important;
    line-height: 60px !important;
    text-align: center !important;
    background: $kakao-brown !important;
    border-radius: 5px !important;
    border: 1px solid $kakao-yellow-outline !important;
    cursor: pointer !important;
    color: rgb(205, 201, 200) !important;
    box-shadow: none !important;
    text-transform: initial !important;
    font-size: 1em !important;
    letter-spacing: 0px !important;
    &:disabled {
      background: $btn-disabled !important;
      color: rgb(192, 192, 192) !important;
      cursor: initial !important;
    }
    &:focus {
      outline: none !important;
    }
    &.loginError {
      background: $btn-disabled !important;
    }
  }
}

.v-btn--disabled {
  background: $btn-disabled !important;
  color: rgb(192, 192, 192) !important;
  cursor: initial !important;
}
.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background: $btn-disabled !important;
}

.rememberMe {
  width: 100%;
  margin-top: 15px;
  height: 30px;
  .checkBox {
    display: inline-block;
    width: 25px; height: 25px;
    background: white;
    border-radius: 5px;
    border: 2px solid $kakao-yellow-outline;
    @include disable-user-select;
    i {
      font-size: 1.3em;
      color: $kakao-brown;
      font-weight: bold;
    }
  }
  .text {
    display: inline-block;
    height: 100%;
    position: relative;
    top: -5px;
    font-size: 0.9em;
    margin: 0 5px;
    color: rgb(159, 146, 35);
  }
  .help {
    display: inline-block;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: $kakao-yellow-outline;
    color: white;
    font-weight: bold;
    text-align: center;
    line-height: 20px;
    position: relative;
    top: -5px;
    @include disable-user-select;
  }
}

.loginErrorMsg {
  margin-top: 30px;
  color: $mac-red;
  font-size: 0.9em;
  &.hide {
    display: none;
  }
}

.footerText {
  width: 100%;
  position: absolute;
  bottom: 50px;
  text-align: center;
  color: rgb(159, 146, 35);
  font-size: 0.8em;
  letter-spacing: 0.5px;
}

</style>