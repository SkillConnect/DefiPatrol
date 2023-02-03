import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
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
let allowPasswordUpdate = false;

const profileForm = document.getElementById("profileForm");
profileForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name?.trim() || !phone?.trim()) {
    failMessage("Name and Phone can't be empty!");
    return;
  }

  try {
    await updateProfile(auth.currentUser, {
      displayName: name,
    });

    // phone number is remaining!

    await set(ref(db, `profile/${auth.currentUser.uid}/name`), name);
    // await set(ref(db, `profile/${auth.currentUser.uid}/phone`), phone);
    successMessage("Profile Updated!");
  } catch (error) {
    failMessage(error.message);
    console.log(error);
  }
});

const passwordForm = document.getElementById("updatePasswordForm");
passwordForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!allowPasswordUpdate) return;

  const user = auth.currentUser;
  const oldPassword = document.getElementById("old-password").value;
  const credentials = EmailAuthProvider.credential(user.email, oldPassword);

  try {
    await reauthenticateWithCredential(user, credentials);
  } catch (error) {
    failMessage("Wrong password!");
    console.log(error);
    return;
  }

  const password = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  if (password !== confirmPassword) {
    failMessage("Both passwords should match!");
    return;
  }

  try {
    await updatePassword(user, password);
    successMessage("Password updated!");
  } catch (error) {
    failMessage(error.message);
    console.log(error);
  }
});

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
    decidePasswordUpdate(user);
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

function decidePasswordUpdate(user) {
  user.providerData.forEach((profile) => {
    if (profile.providerId === "password") {
      allowPasswordUpdate = true;
      document.getElementById("new-password").disabled = false;
      document.getElementById("confirm-password").disabled = false;
      document.getElementById("updatePasswordBtn").disabled = false;
    }
  });
}
