// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKBcJZMj5hPmdg9depMzBXQn6-XZKJZHs",
  authDomain: "relatiqr.firebaseapp.com",
  databaseURL: "https://relatiqr-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "relatiqr",
  storageBucket: "relatiqr.firebasestorage.app",
  messagingSenderId: "753558443546",
  appId: "1:753558443546:web:c0d2edf7224caebb6663a3",
  measurementId: "G-TVL81S6QKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);