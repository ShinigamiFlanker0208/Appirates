import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiyNHRDui8j5fAjjBwCo9XvDLkhnF1xXM",
  authDomain: "appirates-a89ed.firebaseapp.com",
  projectId: "appirates-a89ed",
  storageBucket: "appirates-a89ed.firebasestorage.app",
  messagingSenderId: "1046925628148",
  appId: "1:1046925628148:web:a1612c349d71b567f444a1",
  measurementId: "G-PC273WTEH0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);