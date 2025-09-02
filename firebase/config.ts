// FIX: Update Firebase imports to v8 syntax.
// Fix: Corrected Firebase imports to use the v9 compatibility layer. This resolves initialization errors with `firebase.initializeApp` and service access errors for `auth` and `firestore`.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Firebase configuration.
const firebaseConfig = {
  apiKey: "AIzaSyCMnDRJZSljPB7pDcMkpCLmynTgXIg5pss",
  authDomain: "targetdsa2025.firebaseapp.com",
  projectId: "targetdsa2025",
  storageBucket: "targetdsa2025.firebasestorage.app",
  messagingSenderId: "701937305345",
  appId: "1:701937305345:web:c49f87e7b94f75605b7d00",
  measurementId: "G-SD5NF6BTX2"
};

// Initialize Firebase, preventing re-initialization.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Set auth persistence to 'none' (in-memory) to work around web storage restrictions.
// This will require the user to sign in every time the app is opened or refreshed,
// but it is necessary for environments where web storage is disabled.
auth.setPersistence(firebase.auth.Auth.Persistence.NONE)
  .catch((error) => {
    console.error("Firebase: Could not set auth persistence to 'none'.", error);
  });

export { auth, db, googleProvider };