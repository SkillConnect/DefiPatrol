import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
  
import { failMessage, PAGES } from "./index.js";
import { getToken } from "./totp.js";

const auth = getAuth();
const dbRef = ref(getDatabase());
const ADMIN = "LH82LNF1vocIgADDlemRIORH4c72"

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formProps = new FormData(event.target);
    const formData = Object.fromEntries(formProps);

    const { email, password } = formData;
    if (!email?.trim() || !password) {
      failMessage("Please provide email and password!");
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user)
      if (user !== null) {
        const { uid, emailVerified } = user;
        if (!emailVerified) {
          failMessage("Please verify your email first!");
          return;
        }
        handleTwoFactor(uid);
      }
    } catch (error) {
      console.log(error);
      failMessage("Login failed!");
    }
  });
}

const totpForm = document.getElementById("totp-form");
if (totpForm) {
  totpForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formProps = new FormData(event.target);
    const formData = Object.fromEntries(formProps);

    const { totp } = formData;
    if (!totp) {
      failMessage("Please provide T-OTP!");
    }

    try {
      const uid = auth.currentUser.uid;
      const token = getToken(base32.encode(uid).split("=")[0])
      if (token == totp) {
        localStorage.setItem("isLoggedIn", true);
        location.pathname = PAGES.HOME_PAGE;
      } else {
        failMessage("Incorrect Token!");
      }
    } catch (error) {
      console.log(error);
      failMessage("Login failed!");
    }
  });
}
