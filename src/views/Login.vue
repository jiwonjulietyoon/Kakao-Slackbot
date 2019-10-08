<template>
  <div class="wrap">
    <div class="kakaoContainer">
      
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

          <button @click.prevent="login" class="loginBtn" :class="{'loginError': loginError}" :disabled="!valid">Log in</button>
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
import Vue from "vue";
import firebaseAuth from "@/firebase/firebaseAuth";

export default {
  data() {
    return {
      windowBtnHover: false,
      email: "",
      password: "",
      loginErrorMsg: "",
      loginError: false
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
    exitKakaoTalk() {
      this.$router.replace('/');
    },
    login() {
      firebaseAuth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(credential => {
          const user = credential.user;
          console.log(user);
          this.$store.dispatch("setUser", {user});
        })
        .then(() => {
          this.reset();
          this.$router.replace('/home');
        })
        .catch(error => {
          console.log(error);
          console.log('!!!!');
          // this.password = "";
          this.loginErrorMsg = error.message;
          this.loginError = true
        });
    },
    reset() {
      this.email = "";
      this.password = "";
    }
  }
}
</script>



<style lang="scss" scoped>
@import "@/css/style.scss";

.kakaoContainer {
  background: $kakao-yellow;
  position: relative;
}

.main {
  width: 60%;
  height: 470px;
  // border: 1px solid;
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
    margin-top: 10px;
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: $kakao-brown;
    border-radius: 5px;
    border: 1px solid $kakao-yellow-outline;
    cursor: pointer;
    color: rgb(205, 201, 200);
    &:disabled {
      background: $btn-disabled;
      color: rgb(192, 192, 192);
      cursor: initial;
    }
    &:focus {
      outline: none;
    }
    &.loginError {
      background: $btn-disabled;
    }
  }
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