import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDx77QWiFjSbZUuI7-wUfMRbGL_ts0IwsE",
  authDomain: "finance-tracker-80fed.firebaseapp.com",
  projectId: "finance-tracker-80fed",
  storageBucket: "finance-tracker-80fed.firebasestorage.app",
  messagingSenderId: "618808178276",
  appId: "1:618808178276:web:53f4c7cf61e3d532081171",
  measurementId: "G-ZWCF5N28NP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};