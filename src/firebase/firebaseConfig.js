// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDezFGqxPFdmKbHFFvrkP91kYaN1Rd23Kg",
  authDomain: "farmxpress-965bb.firebaseapp.com",
  projectId: "farmxpress-965bb",
  storageBucket: "farmxpress-965bb.appspot.com",
  messagingSenderId: "582538539273",
  appId: "1:582538539273:web:026b38548654cfbc6ee3d8",
  measurementId: "G-9RBDFJNTPP"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };
