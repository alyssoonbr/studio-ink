import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASmfK_0mCnHKUYNIVrxT-Y5jtv4RwCguA",
  authDomain: "ink-estudiol.firebaseapp.com",
  projectId: "ink-estudiol",
  storageBucket: "ink-estudiol.firebasestorage.app",
  messagingSenderId: "325586771064",
  appId: "1:325586771064:web:975352af55f4b0f8a5e18d",
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Autenticação
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();