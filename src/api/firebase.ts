// src/api/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// ⚠️ COLE AQUI AS CHAVES QUE VOCÊ COPIOU DO PASSO 2
const firebaseConfig = {
  apiKey: "AIzaSyBLyJiYu-TPHTDxJSKxYbAlug9t1gRuM_Y", 
  authDomain: "app-inspecao-de-trabalho.firebaseapp.com",
  projectId: "app-inspecao-de-trabalho",
  storageBucket: "app-inspecao-de-trabalho.firebasestorage.app",
  messagingSenderId: "108784822308",
  appId: "1:108784822308:web:f4a142a61ef61c767090b1"
};

// Inicializa a conexão
const app = initializeApp(firebaseConfig);

// Exporta as ferramentas para usarmos no resto do app
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);