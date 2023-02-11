import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
import { app, PAGES } from "./index.js";
import { getEncodedKey, getToken } from "./totp.js";

const db = getDatabase(app);
const dbRef = ref(getDatabase());

// Check if email is verified
window.isEmailVerified = async () => {
  const user = auth.currentUser;
  const emailVerified = user.emailVerified;
  if (!emailVerified) {
    await failMessage("Please verify your email first!");
  } else {
    document.getElementById("verifyEmail").classList.add("d-none");
    document.getElementById("OptInTwoFactor").classList.remove("d-none");
  }
}

// Show QR Code
window.generateQRCode = () => {
  document.getElementById("OptInTwoFactor").classList.add("d-none");
  document.getElementById("QRCode").classList.remove("d-none");

  const userId = auth.currentUser.uid;
  const base32Encoded = getEncodedKey(userId);
  const prefix = 'otpauth://totp/defi_patrol?secret='

  document.getElementById("qrCode").src = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${prefix}${base32Encoded}`
}

// Confirm Two Factor OTP
const verifyTOTP = document.getElementById("verifyTOTP");
if (verifyTOTP) {
  verifyTOTP.addEventListener("submit", confirmTwoFactor)
}
async function confirmTwoFactor(event) {
  event.preventDefault();
  processingMessage()
  const formProps = new FormData(event.target);
  const formData = Object.fromEntries(formProps);
  const { totp } = formData;

  const userId = auth.currentUser.uid;
  const base32Encoded = getEncodedKey(userId);
  const token = getToken(base32Encoded);

  if (token === totp) {
    await set(ref(db, `${userId}/settings`), { dualFactorAuth: true })
    localStorage.setItem("isLoggedIn", true)
    location.pathname = PAGES.HOME_PAGE
  } else {
    failMessage("Incorrect T-OTP")
  }
}

// Click on Back Button
const elements = document.getElementsByClassName("backBtn")
console.log(elements)
for(let i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", async (event) => {
    console.log(event)
    await logOut();
    location.pathname = PAGES.LOGIN_PAGE
  })
}