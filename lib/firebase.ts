// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGUySMoqmtDWXtVqjgPhUlGoxyb1ywizs",
  authDomain: "maplegoodsauth.firebaseapp.com",
  projectId: "maplegoodsauth",
  storageBucket: "maplegoodsauth.firebasestorage.app",
  messagingSenderId: "32279503309",
  appId: "1:32279503309:web:c7e503a760ac8eff95a484",
  measurementId: "G-JTYZWYTF18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getAuth } from "firebase/auth";
const auth = getAuth(app);

import { getFirestore } from "firebase/firestore";
const db = getFirestore(app);

export { app, auth, db };