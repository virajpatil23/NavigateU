import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyDOaP5OsRpiO2mgZwp-aQWJQUs0RWI-lPQ",
authDomain: "navigateu-af62d.firebaseapp.com",
projectId: "navigateu-af62d",
storageBucket: "navigateu-af62d.appspot.com",
messagingSenderId: "461387110222",
appId: "1:461387110222:web:2ac605fbfb6b24e4df301f"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };