import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfueyJezm1MkQj6A2awKhB_q6fSI0K0PA",
  authDomain: "ecoeducate-882f9.firebaseapp.com",
  projectId: "ecoeducate-882f9",
  storageBucket: "ecoeducate-882f9.firebasestorage.app",
  messagingSenderId: "193997053051",
  appId: "1:193997053051:web:1e2b00e93d4f64ccce96de",
  measurementId: "G-JPDZTRHWFN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);