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
        console.log(auth.currentUser);
        await sendEmailVerification(auth.currentUser);
        await addProfile(userId, name, email);
        successMessage("Registered Successfully! Check your email to verify.");
      } catch (error) {
        failMessage(error.message);
        console.log(error);
      }
    }
  });
}

export async function addProfile(userId, name, email) {
  try {
    await set(ref(db, `${userId}/profile`), {
      name,
      email,
      referralCode: userId,
    });

    await set(ref(db, `${userId}/settings`), {
      dualFactorAuth: false,
      darkTheme: false,
      currency: "USD",
    });

    await set(ref(db, `${userId}/invites`), {
      sent: 0, successful: 0, earned: 0, withdrawn: 0
    });

    await set(ref(db, `${userId}/card`), {
      number: "", type: "", name: "", expiryDate: ""
    });

    
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
