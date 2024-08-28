import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
 
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBS3mnC6gljDUO4CWVtzAGwD6-C9ozrkLk",
    authDomain: "bank-cb453.firebaseapp.com",
    projectId: "bank-cb453",
    storageBucket: "bank-cb453.appspot.com",
    messagingSenderId: "130745285778",
    appId: "1:130745285778:web:4a2affe55f6f3ec7d47a4b"
  };


  const FirebaseApp = initializeApp(firebaseConfig)

  const auth = getAuth(FirebaseApp)
  
  const db = getFirestore(FirebaseApp)

  export {db, auth}