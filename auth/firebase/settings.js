import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
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

const db = getDatabase(app);
const dbRef = ref(getDatabase());

const auth = getAuth();

onAuthStateChanged(auth, async (user) => {
  const indexPage = "/";
  const loginPage = "/auth/login";
  const currentPage = location.pathname;

  if (user) {
    const user = auth.currentUser;
    const emailVerified = user.emailVerified;
    if (!emailVerified) {
      failMessage("Please verify your email first!");
      await signOut(auth);
      return;
    }
    if (currentPage.startsWith(loginPage)) {
      successMessage("Login Successful!");
      location.pathname = indexPage;
    }

    await setProfile(user.uid);
  } else {
    if (!currentPage.startsWith(loginPage)) {
      location.pathname = loginPage + ".html";
    }
  }
});

async function setProfile(userId) {
  const userData = await get(child(dbRef, `profile/${userId}`));
  if (userData.exists()) {
    const data = userData.val();
    const { name, email } = data;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    if (data?.phone) {
      document.getElementById("phone").value = data.phone;
    }
  } else {
    failMessage("Failed to load user data!");
  }
}
