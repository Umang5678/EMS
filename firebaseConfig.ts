// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPykWa1lV7oXbkLSRaajBfny03sJlqb0M",
  authDomain: "infocorptus-ems.firebaseapp.com",
  projectId: "infocorptus-ems",
  appId: "1:1025872154290:web:7a8048f6fd42e91e1143ab",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
