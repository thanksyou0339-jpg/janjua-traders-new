import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8_4KXKAdfKWZ5mi5DaT9qiayL3h_Yzw",
  authDomain: "janjua-traders.firebaseapp.com",
  projectId: "janjua-traders",
  storageBucket: "janjua-traders.firebasestorage.app",
  messagingSenderId: "154904774188",
  appId: "1:154904774188:web:1830f9d533e77dae6a7389"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const supportSection = document.getElementById("customerSupport");
const whatsappCard = document.getElementById("supportWhatsApp");
const whatsappNumber = document.getElementById("supportWhatsAppNumber");

const mobileCard = document.getElementById("supportMobile");
const mobileNumber = document.getElementById("supportMobileNumber");

function cleanPhone(value) {
  return String(value || "").trim();
}

function makeWhatsAppLink(value) {
  let number = cleanPhone(value);

  number = number.replace(/[^\d+]/g, "");

  if (number.startsWith("+")) {
    number = number.substring(1);
  }

  if (number.startsWith("00")) {
    number = number.substring(2);
  }

  if (!number) {
    return "";
  }

  return "https://wa.me/" + number;
}

async function loadCustomerSupport() {
  try {
    const supportRef = doc(db, "settings", "customerSupport");
    const snap = await getDoc(supportRef);

    if (!snap.exists()) {
      return;
    }

    const data = snap.data();

    const mobile = cleanPhone(data.mobile);
    const whatsapp = cleanPhone(data.whatsapp);

    let hasSupport = false;

    if (mobile) {
      mobileNumber.textContent = mobile;
      mobileCard.href = "tel:" + mobile;
      mobileCard.classList.remove("hidden");
      hasSupport = true;
    } else {
      mobileCard.classList.add("hidden");
    }

    if (whatsapp) {
      whatsappNumber.textContent = whatsapp;

      const whatsappLink = makeWhatsAppLink(whatsapp);

      if (whatsappLink) {
        whatsappCard.href = whatsappLink;
        whatsappCard.target = "_blank";
        whatsappCard.rel = "noopener noreferrer";
        whatsappCard.classList.remove("hidden");
        hasSupport = true;
      } else {
        whatsappCard.classList.add("hidden");
      }
    } else {
      whatsappCard.classList.add("hidden");
    }

    if (hasSupport) {
      supportSection.classList.remove("hidden");
    }

  } catch (error) {
    console.log("Customer Support not available:", error);
  }
}

loadCustomerSupport();
