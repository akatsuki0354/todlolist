// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWt1uExrh1y03bo8Kt-89vNbGQ8j-ITHc",
  authDomain: "firetest-67b89.firebaseapp.com",
  databaseURL: "https://firetest-67b89-default-rtdb.firebaseio.com",
  projectId: "firetest-67b89",
  storageBucket: "firetest-67b89.appspot.com",
  messagingSenderId: "880825586749",
  appId: "1:880825586749:web:43b209e3de7e1c9f028654",
  measurementId: "G-Y4PQZ4LHCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore