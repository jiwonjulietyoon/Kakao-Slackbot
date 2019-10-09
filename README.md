# Kakao Slackbot (카카오톡 클론 챗봇 프로젝트)

데모: <https://kakao-slackbot.web.app/> | <https://kakao-slackbot.firebaseapp.com/>

본 웹사이트는 AI 프로젝트의 일환으로 구현한 슬랙 챗봇을 **웹 상에서도 표현하기 위한 사이트 프로젝트**로, 챗봇 학습 모델 등 AI/머신러닝 부분은 포함되어 있지 않습니다.

프론트엔드는 Vue CLI로 카카오톡의 UI만 클론 코딩하였으며, 백엔드 및 배포는 Firebase를 사용하였습니다.

(프로젝트 시연 gif 삽입할 것)

<br>

## 프로젝트 개요

- 팀원: [강창모](<https://github.com/ChangmoKang>), [박현빈](<https://github.com/sksms17456>), [윤지원](<https://github.com/jiwonjulietyoon>), [이주원](<https://github.com/zooo1>), [이철민](<https://github.com/AutumnSky92>)

- 기간: 2019. 8. 19 ~ 2019. 10. 11
- 기술 스택:
  - [챗봇] Python, Flask, Slack API, AWS EC2
  - [카카오톡 클론 웹사이트] Vue CLI, Sass (SCSS), Firebase (Authentication, Firestore, Hosting, Functions)

<br>

## 프로젝트 도식화

![Project Overview](https://firebasestorage.googleapis.com/v0/b/slackbot-test-4130a.appspot.com/o/readme_contents%2Fproject_overview.png?alt=media&token=8b72c5af-9596-4415-9b7a-017a1b1cc0b6)

- Slack과 Firebase 연동에 대한 상세 안내는 [이 포스트](<https://github.com/jiwonjulietyoon/FrontEnd_Notes/blob/master/Vue_Slack_Firestore_Integration.md>)를 참고해주세요.

<br>

## 주요 페이지 및 기능

웹사이트 클릭 후 [Readme.md](https://kakao-slackbot.web.app/readme) 파일 내용을 확인해주세요.

<br>

============================================

<br>

<br>

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
