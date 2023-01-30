import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";

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
