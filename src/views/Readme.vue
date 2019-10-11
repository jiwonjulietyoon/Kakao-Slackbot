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

      <div class="ContentOuter scrollable">
        <div class="Content">
          <h1>Kakao Slackbot - 카카오톡 클론 챗봇</h1>
          <p>안녕하세요, SSAFY 1기 서울 2반 10조 (강창모 박현빈 윤지원 이주원 이철민) 입니다.
본 웹사이트는 AI 특화 프로젝트의 일환으로 구현한 슬랙 챗봇에 <b>웹 요소를 추가한 사이드 프로젝트</b>로, 챗봇 학습 모델 등 AI/머신러닝 부분은 포함되어 있지 않습니다.
자세한 내용은 <a href="http://github.com/jiwonjulietyoon/Kakao-Slackbot" target="_blank">GitHub 저장소</a>를 방문해주세요 :)</p>
          <br>
          <br>
          
          <h2>본 사이트 체험 주의사항</h2>
          <ul>
            <li>'데스크톱 + Chrome' 조합에서 접속해주시기 바랍니다. (특히 iOS 기기는 아직 지원이 안 되어요 ㅠㅠ)</li>
            <li>권장 브라우저 사이즈는 400px*550px 이상입니다.</li>
            <li>카카오톡 연동이 아닙니다! 카카오톡 Mac 버전의 UI만 클론 코딩하였습니다.</li>
            <li>카카오톡 아이콘을 더블클릭한 후 <b>[이메일] visitor@visitor.com | [비번] visitor</b> 로 로그인할 수 있습니다. 다만 챗봇은 관리자 계정에만 연동되어 있기 때문에, 위 방문자 계정으로는 직접 챗봇 체험을 하실 수 없습니다. &#128549;</li>
          </ul>
          <br>
          <br>
          
          <h2>챗봇 시연</h2>
          <img src="@/assets/kakao.gif" alt="" width=400 style="border: 1px solid rgb(210, 208, 207);">
          <br>
          <br>
          <br>


          <h2>주요 페이지 소개</h2>

          <h3>로그인</h3>
          <div class="quote">
            <img src="https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2FLoginPage.png?alt=media&token=b7a5f4ca-fbaa-4e50-b60b-767474a35191" alt="Login Page" width=250>
            <p>나머지 페이지들은 로그인을 해야 접근할 수 있습니다.
<b>[이메일] visitor@visitor.com | [비번] visitor</b> 로 로그인 해주세요.</p>
          </div>
          <br>

          <h3>친구 목록</h3>
          <div class="quote">
            <div>
              <img src="https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2FFriendsList.png?alt=media&token=d8a94bf9-1a16-409c-a063-4b435f419a2b" alt="Friends List" width=250 style="marginRight: 20px;">
              <img src="https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2FProfile.png?alt=media&token=7d4b1827-e643-4806-a008-50055112398d" alt="Friends List" width=250 style="marginRight: 20px;">
              <img src="https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/readme_contents%2FfullSizeImg.png?alt=media&token=954114bc-2391-4bef-a04e-1e0973c9ebc5" alt="Full Size Image" width=250>
            </div>
            <p>현재 로그인된 사용자는 내 프로필, 슬랙봇은 플러스 친구로 등록되어 있습니다. 그 외의 일반 친구 5명은 저희 팀원들로 구성하였습니다.</p>
            <ul>
              <li>Search Friends 검색창을 통해 일반 친구를 검색할 수 있습니다.</li>
              <li>프로필 이미지를 클릭하면 상세 프로필 정보를 확인할 수 있습니다.<ul style="listStyle: circle;">
                  <li>상세 프로필 하단의 버튼을 통해 채팅방 페이지, 팀원의 GitHub 사이트, 그리고 팀원의 웹사이트/블로그로 이동할 수 있습니다.</li>
                  <li>프로필 또는 배경 이미지를 클릭하면 더 확대된 창에서 확인할 수 있으며, 하단의 '확대', '축소', '회전' 버튼을 사용할 수 있습니다.</li>
                </ul>
              </li>
              <li>프로필 이미지를 제외한 나머지 프로필 영역을 더블클릭하면 해당 상대와의 채팅방 페이지로 넘어갑니다.</li>
            </ul>
            <p>하단의 Enter a Keyword 검색창은 구글 검색으로 연결됩니다.</p>
            <p>로그아웃은 왼쪽 아래의 설정 버튼을 클릭한 후 Logout 메뉴를 클릭하면 됩니다.</p>
          </div>
          <br>

          <h3>채팅방</h3>
          <div class="quote">
            <div>
              <img src="https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2FChatroom.png?alt=media&token=b8452ace-1c97-4a20-8801-7f7601ca7cb3" alt="Chatroom" width=250 style="marginRight: 20px;">
              <img src="https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/team_profile%2FProfileFromChatroom.png?alt=media&token=061682ac-32fc-4b4a-ab8c-36d0400887f6" alt="Profile from Chatroom" width=250>
            </div>
            <ul>
              <li>챗봇과의 채팅은 관리자 계정으로 로그인했을 때만 가능합니다.</li>
              <li>방문자 계정으로 로그인했을 때나 슬랙봇 이외의 상대와 채팅방은 실제 채팅 기능이 반영되어 있지 않습니다.</li>
              <li>메시지 입력을 할 수는 있으나 상대방의 자동 응답 메시지만 확인할 수 있습니다.</li>
              <li>프로필 사진을 클릭하면 해당 상대의 상세 프로필을 확인할 수 있습니다.</li>
            </ul>
          </div>
          <br>

          
        <!-- <div class="quote">Block Quote
BlockQUote</div>
        <pre class="snippet">clearKeyword() {
  this.keyword = "";
  this.$refs.keywordFocus.focus();
},</pre> -->

        </div> <!-- .Content -->
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

.ContentOuter {
  width: 100%;
  height: calc(100% - 20px);
  overflow-y: auto;
}

.Content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  height: auto;
  padding: 30px 15px 15px;
  div, pre, h1, h2, p {
    margin: 5px 0;
    color: rgb(51, 51, 51);
  }
  h1 {
    font-size: 2.5em;
    font-weight: bold;
    margin: 0 0 20px 0;
    border-bottom: 1px solid rgb(225, 225, 225);
  }
  h2 {
    font-size: 1.8em;
    font-weight: bold;
    margin: 0 0 10px 0;
    border-bottom: 1px solid rgb(225, 225, 225);
  }
  h3 {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0;
  }
  p {
    font-size: 1em;
    white-space: pre-wrap;
    line-height: 1.5em;
  }
  ul {
    list-style: disc;
  }
  li {
    line-height: 1.8em;
  }
  .quote {
    padding-left: 15px;
    border-left: 4px solid rgb(225, 225, 225);
    color: rgb(140, 140, 140);
    white-space: pre-wrap;
    p {color: rgb(140, 140, 140);}
  }
  .snippet {
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
  a {
    color: rgb(80, 140, 200);
    text-decoration: underline;
  }
}

</style>