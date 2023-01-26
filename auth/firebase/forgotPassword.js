import {
  getAuth,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

import { successMessage, failMessage } from "./index.js";

const auth = getAuth();

const form = document.getElementById("forgotPasswordForm");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formProps = new FormData(event.target);
    const formData = Object.fromEntries(formProps);

    const { email } = formData;
    if (!email?.trim()) {
      failMessage("Please provide an email!");
    }

    const origin = "http://127.0.0.1:5500";
    const actionCodeSettings = {
      url: `${origin}/auth/login.html`,
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      successMessage("Email sent!");
    } catch (error) {
      console.log(error);
      failMessage(error.message);
    }
  });
}
