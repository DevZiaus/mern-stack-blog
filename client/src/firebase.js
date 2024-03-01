// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-2e637.firebaseapp.com",
  projectId: "mern-blog-2e637",
  storageBucket: "mern-blog-2e637.appspot.com",
  messagingSenderId: "462880654168",
  appId: "1:462880654168:web:bae32f03ebdc03ca4adb2d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);