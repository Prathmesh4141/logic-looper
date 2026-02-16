import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUGgOeF-sXCcCTiNINgxDhs5caPfAHGr0",
  authDomain: "game-app-11453.firebaseapp.com",
  projectId: "game-app-11453",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence).catch(console.error);
