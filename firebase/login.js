import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
  
import { PAGES } from "./index.js";
import { getToken } from "./totp.js";

const auth = getAuth();
const dbRef = ref(getDatabase());
const ADMIN = "LH82LNF1vocIgADDlemRIORH4c72"

const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("loginBtn");
if (loginForm && loginBtn) {
  loginBtn.addEventListener("click", async function (event) {
    const formProps = new FormData(loginForm);
    const formData = Object.fromEntries(formProps);

    const { email, password } = formData;
    if (!email?.trim() || !password) {
      failMessage("Please provide email and password!");
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user !== null) {
        handleLoginFlow(user?.uid);
      }
    } catch (error) {
      console.log(error);
      failMessage("Login failed!");
    }
  });
}

const totpForm = document.getElementById("totp-form");
const totpBtn = document.getElementById("totpBtn");
if (totpForm && totpBtn) {
  totpBtn.addEventListener("click", async function (event) {
    const formProps = new FormData(totpForm);
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

// ------------------------
// Two Factor & Email Verification
// ------------------------
async function handleLoginFlow(userId) {
  // Check if User Email is Verified
  isEmailVerified()
  // Check if User has opted for Two Factor
  handleTwoFactor(userId)
}

async function isEmailVerified() {
  const user = auth.currentUser;
  const emailVerified = user.emailVerified;
  if (!emailVerified) {
    await failMessage("Please verify your email first!");
    location.pathname = 'confirm-mail.html';
  }  
}

async function handleTwoFactor(userId) {
  const userData = await get(child(dbRef, `${userId}/settings`));
  if (userData.exists()) {
    const data = userData.val();
    if (data.dualFactorAuth) {
      toggleTwoFactor()
      localStorage.setItem("isLoggedIn", false);
    } else {
      localStorage.setItem("isLoggedIn", true);
      location.pathname = PAGES.HOME_PAGE;
    }
  } else {
    failMessage("Failed to load user data!");
  }
}

async function toggleTwoFactor() {
  document.getElementById("email-password-card").classList.toggle("d-none")
  document.getElementById("totp-card").classList.toggle("d-none")
}
