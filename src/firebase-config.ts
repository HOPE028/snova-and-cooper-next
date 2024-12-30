// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAyj8HuYRwahDvk56hnvvoulkQopEXMlSw',
  authDomain: 'snova-and-cooper.firebaseapp.com',
  projectId: 'snova-and-cooper',
  storageBucket: 'snova-and-cooper.appspot.com',
  messagingSenderId: '776299367736',
  appId: '1:776299367736:web:6bf3a6392db6a2ff6f05cd',
  measurementId: 'G-9M0DBYYSEW',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
