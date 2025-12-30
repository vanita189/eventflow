import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey:"AIzaSyBCzoIzEBMVwDk7aylQTn5IscleCq5RHao",
    authDomain:"myapp-cd7eb.firebaseapp.com",
    projectId: "myapp-cd7eb",
    storageBucket: "myapp-cd7eb.firebasestorage.app",
    messagingSenderId:"1097387058158",
    appId:"1:1097387058158:web:e424df88c199e378fbe4ff"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);