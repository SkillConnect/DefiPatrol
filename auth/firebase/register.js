import {
  getAuth,
  createUserWithEmailAndPassword,
  // signInWithPopup,
  // GoogleAuthProvider,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

import { successMessage, failMessage, app } from "./index.js";

import {
  getDatabase,
  set,
  ref,
  get,
  child,
  remove,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

const db = getDatabase(app);
const dbRef = ref(getDatabase());

const registerForm = document.getElementById("registerForm");
// const googleSignUp = document.getElementById("googleSignUp");

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formProps = new FormData(event.target);
    const formData = Object.fromEntries(formProps);
    if (validateFormData(formData)) {
      const auth = getAuth();
      try {
        const { name, email, password } = formData;
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userId = result.user.uid;
        await addProfile(userId, name, email, password);
        await sendEmailVerification(auth.currentUser);
        successMessage("Registered Successfully! Check your email to verify.");
      } catch (error) {
        failMessage(error.message);
        console.log(error);
      }
    }
  });
}

export async function addProfile(userId, name, email, password) {

  const shaObj = new jsSHA("SHA3-512", "TEXT", { encoding: "UTF8" });
  shaObj.update(password);
  const hashedPassword = shaObj.getHash("HEX");
  try {
    await set(ref(db, `profile/${userId}/name`), name);
    await set(ref(db, `profile/${userId}/email`), email);
    await set(ref(db, `profile/${userId}/referalCode`), userId);
    await set(ref(db, `profile/${userId}/password`), hashedPassword);
    await set(ref(db, `profile/${userId}/twoFactor`), false);
  } catch (error) {
    failMessage(error.message);
  }
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

// if (googleSignUp) {
//   googleSignUp.addEventListener("click", async function (event) {
//     event.preventDefault();
//     const provider = new GoogleAuthProvider();
//     const auth = getAuth();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       const { displayName, uid, email } = user;
//       await addProfile(uid, displayName, email);
//       successMessage("Google Auth Successful!");
//     } catch (error) {
//       failMessage(error.message);
//       console.log(error);
//     }
//   });
// }