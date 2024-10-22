import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAgvf0zrePEvcU4wGj5YJkNu_pPrIx0r08",
  authDomain: "react-web-1c47e.firebaseapp.com",
  projectId: "react-web-1c47e",
  storageBucket: "react-web-1c47e.appspot.com",
  messagingSenderId: "780037394441",
  appId: "1:780037394441:web:b5e21a8e913e28ecd4e8d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//  google auth
const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authwithGoogle = async () => {
    let user = null;
    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user;
    })
    .catch((err) => {
        console.log(err)
    })

    return user;
}