import "./firebase"; // default App import
import firebase from "firebase/app";
import "firebase/auth";

const firebaseAuth = firebase.auth(); // default App 의 auth 객체

export default firebaseAuth;
