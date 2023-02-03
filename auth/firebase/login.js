import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  // signInWithPopup,
  // GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

import {
  getDatabase,
  set,
  ref,
  get,
  child,
  remove,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

import { successMessage, failMessage, app } from "./index.js";

// import { addProfile } from "./register.js"

const db = getDatabase(app);
const dbRef = ref(getDatabase());

const loginForm = document.getElementById("login-form");
// const googleSignUp = document.getElementById("googleSignUp");
const logoutBtn = document.getElementById("logoutBtn");

const auth = getAuth();

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formProps = new FormData(event.target);
    const formData = Object.fromEntries(formProps);

    const { email, password } = formData;

    if (!email?.trim() || !password?.trim()) {
      failMessage("Please provide email and password!");
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user !== null) {
        const { uid, email, emailVerified } = user;
        if (!emailVerified) {
          failMessage("Please verify your email first!");
          return;
        }
        await handleTwoFactor(uid, email);
      }
    } catch (error) {
      console.log(error);
      failMessage("Login failed!");
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    await signOut(auth);
    location.pathname = "/auth/login.html";
  });
}

async function handleTwoFactor(userId, email) {
  console.log(userId, email);
  const userData = await get(child(dbRef, `profile/${userId}`));
  if (userData.exists()) {
    const data = userData.val();
    if (data.twoFactor === true) {
      await signOut(auth);
      const actionCodeSettings = {
        url: "http://127.0.0.1:5500/",
        handleCodeInApp: true,
      };
      try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        successMessage("Email sent for verification");
      } catch (error) {
        console.log(error);
        failMessage("Failed to send login link!");
      }
    } else {
      successMessage("Logged in!");
      location.pathname = "/";
    }
  } else {
    failMessage("Failed to load user data!");
  }
}

// onAuthStateChanged(auth, async (user) => {
//   const indexPage = "/";
//   const loginPage = "/auth/login";
//   const currentPage = location.pathname;

//   if (user) {
//     const user = auth.currentUser;
//     const emailVerified = user.emailVerified;
//     if (!emailVerified) {
//       failMessage("Please verify your email first!");
//       await signOut(auth);
//       return;
//     }
//     if (currentPage.startsWith(loginPage)) {
//       location.pathname = indexPage;
//     }
//   }

//   else {
//     if (!currentPage.startsWith(loginPage)) {
//       location.pathname = loginPage + ".html";
//     }
//   }
// });

// if (googleSignUp) {
//   googleSignUp.addEventListener("click", async function (event) {
//     event.preventDefault();
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       const { displayName, uid, email } = user;
//       await addProfile(uid, displayName, email);
//     } catch (error) {
//       failMessage(error.message);
//       console.log(error);
//     }
//   });
// }
