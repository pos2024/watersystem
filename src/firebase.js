import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEUvvWEaiH4YDYebYzzWZrqogIks8W55k",
  authDomain: "watersystem-4c4cd.firebaseapp.com",
  projectId: "watersystem-4c4cd",
  storageBucket: "watersystem-4c4cd.appspot.com",
  messagingSenderId: "627856623736",
  appId: "1:627856623736:web:b69ccce82473f4e627c58d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Storage
const storage = getStorage(app); // Correctly initialize storage

export { auth, storage }; // Export `auth` and `storage`
export default db;
