import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

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


// =====================================================
// ELEMENTS
// =====================================================

const productImageEl = document.getElementById("productImage");
const productNameEl = document.getElementById("productName");
const productDescriptionEl = document.getElementById("productDescription");
const productPriceEl = document.getElementById("productPrice");
const oldPriceEl = document.getElementById("oldPrice");

const deliveryBadgeEl = document.getElementById("deliveryBadge");
const deliveryNoteEl = document.getElementById("deliveryNote");

const form = document.getElementById("orderForm");

const customerName = document.getElementById("customerName");
const mobileWhatsApp = document.getElementById("mobileWhatsApp");
const deliveryAddress = document.getElementById("deliveryAddress");
const quantity = document.getElementById("quantity");
const platform = document.getElementById("platform");
const color = document.getElementById("color");
const size = document.getElementById("size");

const receiptSection = document.getElementById("receiptSection");


// =====================================================
// HIDDEN FIELDS
// =====================================================

const hiddenOrderId = document.getElementById("hiddenOrderId");
const hiddenProduct = document.getElementById("hiddenProduct");
const hiddenDescription = document.getElementById("hiddenDescription");
const hiddenPrice = document.getElementById("hiddenPrice");
const hiddenOldPrice = document.getElementById("hiddenOldPrice");
const hiddenProductId = document.getElementById("hiddenProductId");
const hiddenProductImage = document.getElementById("hiddenProductImage");
const hiddenDeliveryStatus = document.getElementById("hiddenDeliveryStatus");
const hiddenDeliveryCharges = document.getElementById("hiddenDeliveryCharges");
const hiddenTotalAmount = document.getElementById("hiddenTotalAmount");
const hiddenJanjuaLink = document.getElementById("hiddenJanjuaLink");
const hiddenSupplierLink = document.getElementById("hiddenSupplierLink");


// =====================================================
// URL PARAMETERS
// =====================================================

const params = new URLSearchParams(window.location.search);

const productIdFromURL =
    params.get("Product_ID") ||
    params.get("productId") ||
    "";

const supplierLinkFromURL =
    params.get("Supplier_Link") ||
    params.get("supplierLink") ||
    "";


// =====================================================
// PRODUCT DATA
// =====================================================

let productData = {
    id: productIdFromURL,
    name: params.get("Product") || "",
    description: params.get("Product_Description") || "",
    price: Number(params.get("Product_Price") || 0),
    oldPrice: Number(params.get("Old_Price") || 0),
    category: params.get("Category") || "",
    image: params.get("Product_Image") || "",
    deliveryType: params.get("Delivery_Type") || "",
    deliveryCharges: Number(params.get("Delivery_Charges") || 0),

    // IMPORTANT
    supplierLink: supplierLinkFromURL || ""
};


// =====================================================
// IMAGE OPTIMIZATION
// =====================================================

function optimizeImage(url) {

    if (!url) {
        return "";
    }

    url = String(url).trim();

    if (
        url.includes("res.cloudinary.com") &&
        url.includes("/image/upload/")
    ) {

        if (!url.includes("f_auto")) {

            return url.replace(
                "/image/upload/",
                "/image/upload/f_auto,q_auto,w_600/"
            );

        }

    }

    return url;
}


// =====================================================
// MONEY FORMAT
// =====================================================

function money(value) {

    const number = Number(value || 0);

    return "Rs. " + number.toLocaleString("en-PK");
}


// =====================================================
// GENERATE ORDER ID
// =====================================================

function generateOrderId() {

    const now = new Date();

    const datePart =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0");

    const timePart =
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0");

    const randomPart =
        Math.floor(1000 + Math.random() * 9000);

    return "JT-" + datePart + "-" + timePart + "-" + randomPart;
}


// =====================================================
// JANJUA ORDER LINK
// =====================================================

function getJanjuaOrderLink() {

    return window.location.href;
}


// =====================================================
// LOAD PRODUCT FROM FIRESTORE
// =====================================================

async function loadProductFromFirestore() {

    if (!productIdFromURL) {
        return;
    }

    try {

        const snapshot = await getDocs(
            collection(db, "products")
        );

        let foundProduct = null;

        snapshot.forEach((doc) => {

            const data = doc.data();

            const id =
                data.Product_ID ||
                data.productId ||
                data.id ||
                "";

            if (String(id) === String(productIdFromURL)) {

                foundProduct = {
                    firestoreId: doc.id,
                    ...data
                };

            }

        });


        if (!foundProduct) {
            console.log("Product not found in Firestore.");
            return;
        }


        // =================================================
        // GET ALL PRODUCT DATA
        // =================================================

        productData.name =
            foundProduct.Product ||
            foundProduct.Product_Name ||
            productData.name ||
            "";

        productData.description =
            foundProduct.Product_Description ||
            productData.description ||
            "";

        productData.price =
            Number(
                foundProduct.Product_Price ||
                productData.price ||
                0
            );

        productData.oldPrice =
            Number(
                foundProduct.Old_Price ||
                productData.oldPrice ||
                0
            );

        productData.category =
            foundProduct.Category ||
            productData.category ||
            "";

        productData.image =
            foundProduct.Product_Image ||
            foundProduct.Image ||
            foundProduct.image ||
            productData.image ||
            "";

        productData.deliveryType =
            foundProduct.Delivery_Type ||
            productData.deliveryType ||
            "";

        productData.deliveryCharges =
            Number(
                foundProduct.Delivery_Charges ||
                productData.deliveryCharges ||
                0
            );


        // =================================================
        // VERY IMPORTANT:
        // ORIGINAL SUPPLIER LINK
        // =================================================

        productData.supplierLink =
            foundProduct.supplierLink ||
            foundProduct.Supplier_Link ||
            foundProduct.Original_Supplier_Link ||
            productData.supplierLink ||
            "";


        console.log(
            "Original Supplier Link:",
            productData.supplierLink
        );


    } catch (error) {

        console.error(
            "Firestore product loading error:",
            error
        );

    }
}


// =====================================================
// DISPLAY PRODUCT
// =====================================================

function displayProduct() {

    const imageUrl =
        optimizeImage(productData.image);


    // IMAGE
    if (productImageEl) {

        if (imageUrl) {

            productImageEl.src = imageUrl;
            productImageEl.style.display = "block";

        } else {

            productImageEl.removeAttribute("src");

        }

    }


    // NAME
    if (productNameEl) {

        productNameEl.textContent =
            productData.name || "Product";

    }


    // DESCRIPTION
    if (productDescriptionEl) {

        productDescriptionEl.textContent =
            productData.description || "";

    }


    // PRICE
    if (productPriceEl) {

        productPriceEl.textContent =
            money(productData.price);

    }


    // OLD PRICE
    if (oldPriceEl) {

        if (productData.oldPrice > 0) {

            oldPriceEl.textContent =
                money(productData.oldPrice);

            oldPriceEl.style.display = "inline";

        } else {

            oldPriceEl.style.display = "none";

        }

    }


    // DELIVERY
    if (deliveryBadgeEl) {

        if (
            String(productData.deliveryType)
                .toLowerCase()
                .includes("free")
        ) {

            deliveryBadgeEl.textContent =
                "FREE DELIVERY";

        } else {

            deliveryBadgeEl.textContent =
                "DELIVERY AVAILABLE";

        }

    }


    if (deliveryNoteEl) {

        if (productData.deliveryCharges > 0) {

            deliveryNoteEl.textContent =
                "Delivery Charges: " +
                money(productData.deliveryCharges);

        } else {

            deliveryNoteEl.textContent =
                "Free Delivery";

        }

    }

}


// =====================================================
// UPDATE HIDDEN FIELDS
// =====================================================

function updateHiddenFields() {

    const orderId = generateOrderId();

    const janjuaLink =
        getJanjuaOrderLink();

    const supplierLink =
        productData.supplierLink ||
        supplierLinkFromURL ||
        "";


    // ================================================
    // ORDER ID
    // ================================================

    if (hiddenOrderId) {
        hiddenOrderId.value = orderId;
    }


    // ================================================
    // PRODUCT
    // ================================================

    if (hiddenProduct) {
        hiddenProduct.value =
            productData.name;
    }


    if (hiddenDescription) {
        hiddenDescription.value =
            productData.description;
    }


    if (hiddenPrice) {
        hiddenPrice.value =
            productData.price;
    }


    if (hiddenOldPrice) {
        hiddenOldPrice.value =
            productData.oldPrice;
    }


    if (hiddenProductId) {
        hiddenProductId.value =
            productData.id;
    }


    if (hiddenProductImage) {
        hiddenProductImage.value =
            productData.image;
    }


    // ================================================
    // DELIVERY
    // ================================================

    if (hiddenDeliveryStatus) {

        hiddenDeliveryStatus.value =
            productData.deliveryType ||
            "";

    }


    if (hiddenDeliveryCharges) {

        hiddenDeliveryCharges.value =
            productData.deliveryCharges || 0;

    }


    // ================================================
    // TOTAL
    // ================================================

    const qty =
        Number(quantity?.value || 1);

    const total =
        (
            Number(productData.price || 0) *
            qty
        ) +
        Number(productData.deliveryCharges || 0);


    if (hiddenTotalAmount) {

        hiddenTotalAmount.value =
            total;

    }


    // ================================================
    // JANJUA LINK
    // ================================================

    if (hiddenJanjuaLink) {

        hiddenJanjuaLink.value =
            janjuaLink;

    }


    // ================================================
    // ORIGINAL SUPPLIER LINK
    // ================================================

    if (hiddenSupplierLink) {

        hiddenSupplierLink.value =
            supplierLink;

    }


    console.log(
        "JANJUA Link:",
        janjuaLink
    );

    console.log(
        "Original Supplier Link:",
        supplierLink
    );

}


// =====================================================
// UPDATE TOTAL WHEN QUANTITY CHANGES
// =====================================================

if (quantity) {

    quantity.addEventListener(
        "change",
        updateHiddenFields
    );

    quantity.addEventListener(
        "input",
        updateHiddenFields
    );

}


// =====================================================
// INITIALIZE PRODUCT
// =====================================================

async function initializeProduct() {

    // First display URL data
    displayProduct();

    // Then get latest product data from Firestore
    await loadProductFromFirestore();

    // Display Firestore data
    displayProduct();

    // Update all hidden fields
    updateHiddenFields();

}


initializeProduct();


// =====================================================
// FORM SUBMISSION
// =====================================================

if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Make sure hidden fields contain latest values
            updateHiddenFields();


            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Processing...";

            }


            const orderId =
                hiddenOrderId?.value ||
                generateOrderId();


            const formData =
                new FormData(form);


            try {

                const response =
                    await fetch(
                        "https://formsubmit.co/ajax/thanksyou0339@gmail.com",
                        {
                            method: "POST",
                            body: formData,
                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Order submission failed."
                    );

                }


                // =====================================
                // SHOW RECEIPT
                // =====================================

                showReceipt(
                    orderId
                );


            } catch (error) {

                console.error(
                    "Order submission error:",
                    error
                );

                alert(
                    "Order submit نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔"
                );


                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "ORDER NOW";

                }

            }

        }
    );

}


// =====================================================
// SHOW RECEIPT
// =====================================================

function showReceipt(orderId) {

    if (!receiptSection) {
        return;
    }


    // Customer details
    const receiptOrderId =
        document.getElementById("receiptOrderId");

    const receiptCustomer =
        document.getElementById("receiptCustomer");

    const receiptMobile =
        document.getElementById("receiptMobile");

    const receiptAddress =
        document.getElementById("receiptAddress");

    const receiptProduct =
        document.getElementById("receiptProduct");

    const receiptQuantity =
        document.getElementById("receiptQuantity");

    const receiptTotal =
        document.getElementById("receiptTotal");


    if (receiptOrderId) {
        receiptOrderId.textContent =
            orderId;
    }


    if (receiptCustomer) {
        receiptCustomer.textContent =
            customerName?.value || "";
    }


    if (receiptMobile) {
        receiptMobile.textContent =
            mobileWhatsApp?.value || "";
    }


    if (receiptAddress) {
        receiptAddress.textContent =
            deliveryAddress?.value || "";
    }


    if (receiptProduct) {
        receiptProduct.textContent =
            productData.name || "";
    }


    if (receiptQuantity) {
        receiptQuantity.textContent =
            quantity?.value || "1";
    }


    const qty =
        Number(quantity?.value || 1);

    const total =
        (
            Number(productData.price || 0) *
            qty
        ) +
        Number(productData.deliveryCharges || 0);


    if (receiptTotal) {

        receiptTotal.textContent =
            money(total);

    }


    receiptSection.style.display =
        "block";


    if (form) {

        form.style.display =
            "none";

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// =====================================================
// DOWNLOAD RECEIPT
// =====================================================

const downloadButton =
    document.getElementById("downloadReceipt");


if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        function () {

            const receipt =
                document.getElementById(
                    "receiptSection"
                );

            if (!receipt) {
                return;
            }


            const html =
                `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>JANJUA Order Receipt</title>

<style>

body{
    font-family:Arial,sans-serif;
    padding:20px;
}

.receipt{
    max-width:500px;
    margin:auto;
}

h1{
    text-align:center;
}

.row{
    padding:8px 0;
    border-bottom:1px solid #ddd;
}

</style>

</head>

<body>

<div class="receipt">

${receipt.innerHTML}

</div>

</body>

</html>
                `;


            const blob =
                new Blob(
                    [html],
                    {
                        type:
                            "text/html;charset=utf-8"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const a =
                document.createElement("a");


            a.href = url;

            a.download =
                "JANJUA-Order-Receipt-" +
                (hiddenOrderId?.value || "Order") +
                ".html";


            document.body.appendChild(a);

            a.click();

            a.remove();

            URL.revokeObjectURL(url);

        }
    );

}


// =====================================================
// SHARE
// =====================================================

const shareButton =
    document.getElementById("shareReceipt");


if (shareButton) {

    shareButton.addEventListener(
        "click",
        async function () {

            const orderId =
                hiddenOrderId?.value || "";


            const text =
                "JANJUA TRADERS Order\n" +
                "Order ID: " +
                orderId +
                "\nProduct: " +
                productData.name;


            if (
                navigator.share
            ) {

                try {

                    await navigator.share({
                        title:
                            "JANJUA Order",
                        text:
                            text
                    });

                } catch (error) {

                    console.log(
                        "Share cancelled."
                    );

                }

            } else {

                try {

                    await navigator.clipboard.writeText(
                        text
                    );

                    alert(
                        "Order details copied."
                    );

                } catch (error) {

                    alert(text);

                }

            }

        }
    );

}


// =====================================================
// PRINT / PDF
// =====================================================

const printButton =
    document.getElementById("printReceipt");


if (printButton) {

    printButton.addEventListener(
        "click",
        function () {

            window.print();

        }
    );

}


// =====================================================
// NEW ORDER
// =====================================================

const newOrderButton =
    document.getElementById("newOrder");


if (newOrderButton) {

    newOrderButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "shop.html";

        }
    );

}
