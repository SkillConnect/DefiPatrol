import { app, successMessage, failMessage } from "./index.js";
import {
  getDatabase,
  child,
  get,
  ref,
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";

const dbRef = ref(getDatabase());
const dataTable = document.getElementById("data-table");

async function fetchUserList() {
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      displayData(data);
    } else {
      displayMessage("No data available!");
    }
  } catch (error) {
    displayMessage(error);
  }
}

fetchUserList();

function displayData(data) {
  let tableValues = "";
  const ids = Object.keys(data);
  ids.forEach((id, ctr) => {
    const row = data[id]["profile"];
    tableValues += `
      <tr class="text-center">
        <td>${ctr + 1}</td>
        <td>${row.name}</td>
        <td>${row.email}</td>
        <td>${row?.phone || "-"}</td>
        <td>${row.referralCode}</td>
        <td data-bs-toggle="modal" data-bs-target="#userModal"><a class="btn btn-primary viewBtn" role="button" data-id="${
          row.referralCode
        }">View Details</a></td>
      </tr>`;
  });

  dataTable.innerHTML = tableValues;

  const buttons = window.document.getElementsByClassName("viewBtn");
  for (let button of buttons) {
    button.addEventListener("click", async function (event) {
      const userId = event.currentTarget.getAttribute("data-id");
      console.log(userId);
      const snapshot = await get(child(dbRef, `${userId}`));
      if (snapshot.exists()) {
        const user = snapshot.val();
        const { profile, settings, invites } = user;
        const { name } = profile;
        document.getElementById("userName").textContent = name;
        const { earned, sent, successful, withdrawn } = invites;
        const inviteInfo = `<h5>Invites Info:</h5><ul><li>Sent: ${sent}</li><li>Successful: ${successful}</li><li>Earned: ${earned}</li><li>Withdrawn: ${withdrawn}</li></ul>`;
        document.getElementById("inviteInfo").innerHTML = inviteInfo;
      }
    });
  }
}

function displayMessage(msg) {
  dataTable.innerHTML = `
    <tr>
      <td colspan="5" class="text-center">
        ${msg}
      </td>
    </tr>`;
}
