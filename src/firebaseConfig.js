import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC7H1ELWrRKwX72DlBiPyph55OXu63icqo",
  authDomain: "autenticacao-mega.firebaseapp.com",
  projectId: "autenticacao-mega",
  storageBucket: "autenticacao-mega.firebasestorage.app",
  messagingSenderId: "190657188583",
  appId: "1:190657188583:web:741cdbe171b8925db14842",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

export {
  signInWithPopup,
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  updateProfile,
};
