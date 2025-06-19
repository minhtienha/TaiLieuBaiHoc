import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier , signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEcKadngPmSn-LEpp7U0Z7vnbtyuiAWjI",
  authDomain: "smsverify-211d0.firebaseapp.com",
  projectId: "smsverify-211d0",
  storageBucket: "smsverify-211d0.firebasestorage.app",
  messagingSenderId: "737569023571",
  appId: "1:737569023571:web:5c0c13d58cf631368988a6",
  measurementId: "G-BCKRE94LT0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'it';

export { auth, RecaptchaVerifier, signInWithPhoneNumber };