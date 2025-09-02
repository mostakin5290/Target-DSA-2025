// FIX: Update Firebase imports to v8 syntax.
// Fix: Corrected Firebase imports to use the v9 compatibility layer. This resolves initialization errors with `firebase.initializeApp` and service access errors for `auth` and `firestore`.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Firebase configuration.
// TODO: Replace this with your own Firebase project's configuration.
// Follow the step-by-step guide to get these values.
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

// Set auth persistence to 'local' to keep the user signed in across sessions.
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch((error) => {
    console.error("Firebase: Could not set auth persistence to 'local'.", error);
  });

export { auth, db, googleProvider };