// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbfIZgMZVAtzJuB4pcQXaF-jjh7xGF4IE",
  authDomain: "ali-thehifdhjournal.firebaseapp.com",
  projectId: "ali-thehifdhjournal",
  storageBucket: "ali-thehifdhjournal.firebasestorage.app",
  messagingSenderId: "36490972987",
  appId: "1:36490972987:web:d769b030c3cacc3ba0711e"
};



const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
