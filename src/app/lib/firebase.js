import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB5mdmXhlaaS6w-Oh_p0eho0JoL7c5vdrg",
    authDomain: "campus-loop-f269f.firebaseapp.com",
    projectId: "campus-loop-f269f",
    storageBucket: "campus-loop-f269f.firebasestorage.app",
    messagingSenderId: "30624839263",
    appId: "1:30624839263:web:c8cf4322a5e6a0a9d44dea",
    measurementId: "G-KXHCQ0JCJY"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage };
