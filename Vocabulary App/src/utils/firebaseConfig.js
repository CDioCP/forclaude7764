import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC4s6U1SehpML3IBZxmpXlmyNDV7kfNM1I",
    authDomain: "vocapp7764.firebaseapp.com",
    projectId: "vocapp7764",
    storageBucket: "vocapp7764.firebasestorage.app",
    messagingSenderId: "981546987679",
    appId: "1:981546987679:web:105e04704c1c320b40f2aa",
    measurementId: "G-6PTTB1JKNG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
