<template>
  <div class="wrap">
    <div class="mdEditor">
      <!-- Mac Window Buttons -->
      <div class="btnBoxMac">
        <div class="btn close" @click.prevent="exitReadme" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
          <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
          <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
        </div>
        <div class="btn minimize" @click.prevent="exitReadme" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
          <div class="cross" :class="{'hidden': !windowBtnHover}"></div>
        </div>
        <div class="btn expand" @mouseenter="windowBtnHover = true" @mouseleave="windowBtnHover = false">
          <div class="rectangle" :class="{'hidden': !windowBtnHover}"></div>
          <div class="diagonal" :class="{'hidden': !windowBtnHover}"></div>
        </div>
      </div>

      <div class="docTitle">README.md [Read Only]</div>

      <div class="Content scrollable">
        <div class="H1">큰 제목 h1</div>
        <div class="H2">부제목 h2</div>
        <div class="H3">부제목 h3</div>
        <div class="H4">부제목 h4</div>
        
        <div class="txt">일반 텍스트 일반 텍스트 일반 텍스트
일반 텍스트 일반 텍스트 일반 텍스트 <span class="code">inline code</span>
일반 텍스트 일반 텍스트일반 텍스트 일반 텍스트 일반 텍스트 일반 텍스트</div>
        
        <div class="quote">Block Quote
BlockQUote</div>

        <pre class="snippet">clearKeyword() {
  this.keyword = "";
  this.$refs.keywordFocus.focus();
},</pre>

      </div>

    </div>
  </div>
</template>




<script>
export default {
  data: () => ({
    windowBtnHover: false,
  }),
  methods: {
    exitReadme() {
      this.$router.replace('/')
    }
  }
}
</script>



<style lang="scss" scoped>
@import "@/css/style.scss";

.mdEditor {
  width: 98%;
  height: 98%;
  border-radius: 5px;
  background: white;
  margin: 1vh 1%;
  position: relative;
  overflow: hidden;
}

.docTitle {
  width: 100%;
  height: 25px;
  line-height: 25px;
  position: absolute;
  top: 0; left: 0;
  text-align: center;
  color: rgb(94, 94, 94);
  font-size: 0.85em;
  pointer-events: none;
}

.Content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  height: calc(100% - 20px);
  overflow-y: auto;
  padding: 10px;
  & > div, & > pre {
    margin: 5px 0;
    color: rgb(51, 51, 51);
  }
  & > .H1 {
    font-size: 2.7em;
    font-weight: bold;
    margin: 0 0 10px 0;
    border-bottom: 1.5px solid rgb(225, 225, 225);
  }
  & > .H2 {
    font-size: 2.3em;
    font-weight: bold;
    margin: 0 0 10px 0;
    border-bottom: 1.5px solid rgb(225, 225, 225);
  }
  & > .H3 {
    font-size: 1.9em;
    font-weight: bold;
    margin: 0;
  }
  & > .H4 {
    font-size: 1.5em;
    font-weight: bold;
    text-align: justify;
    // word-break: break-word;
  }
  & > .txt {
    font-size: 1.1em;
    white-space: pre-wrap;
  }
  & > .quote {
    padding-left: 15px;
    border-left: 4px solid rgb(225, 225, 225);
    color: rgb(140, 140, 140);
    white-space: pre-wrap;
  }
  & > .snippet {
    padding: 10px 15px;
    font-size: 0.9em;
    font-family: monospace;
    background: $btn-disabled;
    border-radius: 3px;
    border: 1px solid rgb(240, 240, 240);
  }
  span.code {
    padding: 0 5px;
    font-family: monospace;
    font-size: 0.9em;
    background: $btn-disabled;
    border-radius: 3px;
    border: 1px solid rgb(240, 240, 240);
  }
}

</style>