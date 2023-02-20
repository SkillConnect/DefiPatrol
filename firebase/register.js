import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } 
  from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
import { app, PAGES } from "./index.js";

const db = getDatabase(app);
const auth = getAuth();

const registerForm = document.getElementById("registerForm");
const submitBtn = document.getElementById("submitBtn");
if (registerForm && submitBtn) {
  submitBtn.addEventListener("click", async function (event) {
    processingMessage()
    const formProps = new FormData(registerForm);
    const formData = Object.fromEntries(formProps);
    if (validateFormData(formData)) {
      try {
        const { name, email, password } = formData;
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userId = result.user.uid;
        await sendEmailVerification(auth.currentUser);
        await addProfile(userId, name, email);
        await successMessage("Registered Successfully! Check your email to verify.");
        location.pathname = PAGES.CONFIRM_PAGE
      } catch (error) {
        failMessage(error.message);
        console.log(error);
      }
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

export async function addProfile(userId, name, email) {
  // TODO: Update Referal Code
  try {
    await set(ref(db, `${userId}`), {
      profile: { name, email, referralCode: userId },
      settings: { dualFactorAuth: false, theme: 'light', currency: "USD" },
      invites: { sent: 0, successful: 0, earned: 0, withdrawn: 0 },
      card: { number: '', type: '', name: '', expiryDate: '' }
    });
  } catch (error) {
    failMessage(error.message);
  }
}