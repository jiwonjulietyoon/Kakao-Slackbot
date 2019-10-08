import firebase from 'firebase'
import 'firebase/firestore'
import firebaseConfig from './config'

const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp.firestore()