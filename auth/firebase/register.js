import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

import { successMessage, failMessage } from "./index.js";

const registerForm = document.getElementById("registerForm");
const googleSignUp = document.getElementById("googleSignUp");

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formProps = new FormData(event.target);
    const formData = Object.fromEntries(formProps);
    console.log(formData);
    if (validateFormData(formData)) {
      const auth = getAuth();
      try {
        const { email, password } = formData;
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userId = result.user.uid;
        console.log(userId);
        await sendEmailVerification(auth.currentUser);
        successMessage("Registered Successfully! Check your email to verify.");
      } catch (error) {
        failMessage(error.message);
        console.log(error);
      }
    }
  });
}

if (googleSignUp) {
  googleSignUp.addEventListener("click", async function (event) {
    event.preventDefault();
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      const userId = result.user.uid;
      console.log(userId);
      successMessage("Google Auth Successful!");
    } catch (error) {
      failMessage(error.message);
      console.log(error);
    }
  });
}

function validateFormData(formData) {
  const { name, email, password, confirmPassword, checkbox } = formData;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !password?.trim() ||
    !confirmPassword?.trim() ||
    !checkbox
  ) {
    failMessage("Please fill all the details correctly!");
    return false;
  }

  if (password !== confirmPassword) {
    failMessage("Password & Confirm password don't match!");
    return false;
  }

  return true;
}
