// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// ← your real config (fixed storageBucket, no analytics)
const firebaseConfig = {
  apiKey: "AIzaSyBcJJtEzRo4_Xmyq_MVZwAmjZO0Lzs1J8E",
  authDomain: "fyp-af96f.firebaseapp.com",
  projectId: "fyp-af96f",
  storageBucket: "fyp-af96f.appspot.com",   
  messagingSenderId: "454428055759",
  appId: "1:454428055759:web:33624e26273d36ee143fba",
};

const app = initializeApp(firebaseConfig);

// Auth (platform-aware persistence)
let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence);
} else {
  // only require these on native to avoid web bundler issues
  const { getReactNativePersistence } = require("firebase/auth");
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;

  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }
}

const db = getFirestore(app);

// Debug: confirm you’re on the right project
console.log("Firebase project:", app.options.projectId);

export { auth, db };
