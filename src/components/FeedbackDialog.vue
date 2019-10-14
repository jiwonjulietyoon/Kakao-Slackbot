<template>
  <div class="dialogOuter">
    <!-- Mac Window Buttons -->
    <div class="btnBoxMac">
      <div class="btn close" @click.prevent="closeDialog" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
        <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
        <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
      </div>
      <div class="btn minimize" @click.prevent="closeDialog" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
        <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
      </div>
      <div class="btn expand" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
        <div class="rectangle" :class="{'hidden': !windowBtnHover}"></div>
        <div class="diagonal" :class="{'hidden': !windowBtnHover}"></div>
      </div>
    </div>
    
    <div class="Container scrollable">
      <div class="feedbackBox" v-for="(f, idx) in feedback" :key="idx">
        <p>Q: {{f.question_message}}</p>
        <p>A: {{f.origin_message}}</p>
        <p>F: {{f.feedback_message}}</p>
      </div>
    </div>

    
  </div>
</template>


<script>
import firestore from "@/firebase/firebase";

export default {
  name: "FeedbackDialog",
  props: {
    feedback: {type: Array, required: true}
  },
  data: () => ({
    windowBtnHover: false,
  }),
  methods: {
    closeDialog() {
      return this.$emit("child", false);
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/css/style.scss";

.dialogOuter {
  width: 100%;
  height: 550px;
  background: white;
  overflow: hidden;
}
.btnBoxMac {
  height: 22px;
  background: $kakao-brown;
}

.Container {
  height: calc(100% - 22px);
  padding: 10px;
  overflow-y: auto;
}

.feedbackBox {
  border-bottom: 1px solid $btn-gray-hover;
  margin-bottom: 10px;
  p {
    margin: 0; padding: 0;
    font-size: 0.9em;
  }
}


</style>
