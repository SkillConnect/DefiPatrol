import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5I8ORlh2shbajxqP3nTwgSM5TnH5UAEs",
  authDomain: "defi-patrol.firebaseapp.com",
  databaseURL: "https://defi-patrol-default-rtdb.firebaseio.com",
  projectId: "defi-patrol",
  storageBucket: "defi-patrol.appspot.com",
  messagingSenderId: "928898888286",
  appId: "1:928898888286:web:9c4fbbe93b0a35f65bfacf",
};

export const app = initializeApp(firebaseConfig);

const auth = getAuth();

onAuthStateChanged(auth, async (user) => {
  if (!user || user.uid != "LH82LNF1vocIgADDlemRIORH4c72") {
    await signOut(auth);
    location.path = "../../auth/login.html";
  }
});

export function failMessage(err) {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: err || "Something went wrong!",
  }).then(() => location.reload());
}

export function successMessage(msg) {
  Swal.fire({
    icon: "success",
    title: "Submitted!",
    text: msg || "Thank you for reaching out to us!",
  }).then(() => location.reload());
}
