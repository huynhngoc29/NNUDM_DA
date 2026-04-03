import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTqvYpeVWby7qWr3vzSGsEpltWx3h8efo",
  authDomain: "ecommerce-b09fb.firebaseapp.com",
  projectId: "ecommerce-b09fb",
  storageBucket: "ecommerce-b09fb.firebasestorage.app",
  messagingSenderId: "965009377010",
  appId: "1:965009377010:web:1e3d2de70890ee04bf726b",
  measurementId: "G-1N8Q5P2N8D",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
