import {
  getAuth,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

const auth = getAuth();

const submitBtn = document.getElementById("submitBtn");
if (submitBtn) {
  submitBtn.addEventListener("click", submit);
}

async function submit() {
  const email = document.getElementById("email").value;
  if (!email?.trim()) {
    failMessage("Please provide an email!");
  }

  const origin = "https://skillconnect.github.io/DefiPatrol";
  const actionCodeSettings = {
    url: `${origin}/auth/login.html`,
  };
  console.log("Submitted, sending email")
  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    successMessage("Email sent!").then(() => location.reload());
  } catch (error) {
    console.log(error);
    failMessage(error.message).then(() => location.reload());
  }  
}
