import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

import * as Swal from '../vendors/swal.js'

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

export const PAGES = {
  HOME_PAGE: 'index.html',
  LOGIN_PAGE: '/auth/login.html',
  CONFIRM_PAGE: '/auth/confirm-mail.html',
  AUTH_PAGES_PREFIX: '/auth',
}


// ------------------------
// OnAuthStateChange
// ------------------------
onAuthStateChanged(auth, async (user) => {
  const currentPage = location.pathname;
  const isAuthPage = currentPage.includes(PAGES.AUTH_PAGES_PREFIX)
  const isLoggedIn = localStorage.getItem("isLoggedIn") || false;
  
  // If logged in, load profile config and redirect to home page
  if (user && isLoggedIn) {
    const theme = localStorage.getItem('darkMode');
    if (theme == "true") document.getElementById("themeControlToggle").click();
  } 
  // Otherwise redirect to Auth Pages
  else if (!isAuthPage) { location.pathname = PAGES.LOGIN_PAGE; }
});


// ------------------------
// Two Factor & Email Verification
// ------------------------
async function isEmailVerified() {
  const user = auth.currentUser;
  const emailVerified = user.emailVerified;
  if (!emailVerified) {
    await failMessage("Please verify your email first!");
    location.pathname = 'confirm-mail.html';
  }  
}

function isTwoFactorEnabled() {

}

// Assuming we're in Auth Pages
async function handleLoginFlow() {
  // Check if User Email is Verified
  isEmailVerified()
  // Check if User has opted for Two Factor
  // Redirect to Home Page
  location.pathname = PAGES.HOME_PAGE;
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


// ------------------------
// Log out function
// ------------------------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    await logOut()
  });
}
async function logOut() {
  await signOut(auth);
  localStorage.setItem("isLoggedIn", false);
  location.pathname = PAGES.LOGIN_PAGE;
}
window.logOut = logOut

// ------------------------
// Swal Messages
// ------------------------
window.failMessage = (err) => {
  return Sweetalert2.fire({
    icon: "error",
    title: "Oops...",
    text: err || "Something went wrong!",
  });
}

window.successMessage = (msg) => {
  return Sweetalert2.fire({
    icon: "success",
    title: "Success!",
    text: msg || "Thank you for reaching out to us!",
  });
}

window.processingMessage = (msg) => {
  return Sweetalert2.fire({
    iconHtml: '<div class="spinner-border text-primary"></div>',
    customClass: { icon: 'no-border' },
    title: "Processing",
    text: msg || "Please wait, processing...",
    allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
    showConfirmButton: false,
    backdrop: 'rgba(0,0,0,.65)'
  });
}
