/* =========================================================
   JANJUA TRADERS
   ORDER FORM SCRIPT
   Firebase Product ID Auto Loader
   ========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyA8_4ArKXAdfKWZ5mi5DaT9qiayL3h_Yzw",
    authDomain: "janjua-traders.firebaseapp.com",
    projectId: "janjua-traders",
    storageBucket: "janjua-traders.firebasestorage.app",
    messagingSenderId: "154904774188",
    appId: "1:154904774188:web:1830f9d533e77dae6a7389"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* =========================================================
   FORM SUBMIT
   ========================================================= */

const FORM_URL =
    "https://formsubmit.co/ajax/thanksyou0339@gmail.com";


/* =========================================================
   URL PARAMETERS
   ========================================================= */

const params = new URLSearchParams(window.location.search);

let productName =
    params.get("Product") || "";

let productDescription =
    params.get("Product_Description") || "";

let productPrice =
    params.get("Product_Price") || "";

let oldPrice =
    params.get("Old_Price") || "";

let productId =
    params.get("Product_ID") || "";

let productImage =
    params.get("Product_Image") || "";

let deliveryType =
    params.get("Delivery_Type") || "Free Delivery";

let deliveryCharges =
    params.get("Delivery_Charges") || "0";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const productImageEl =
    document.getElementById("productImage");

const productNameEl =
    document.getElementById("productName");

const productPriceEl =
    document.getElementById("productPrice");

const oldPriceEl =
    document.getElementById("oldPrice");

const productDescriptionEl =
    document.getElementById("productDescription");

const deliveryBadgeEl =
    document.getElementById("deliveryBadge");

const deliveryNoteEl =
    document.getElementById("deliveryNote");

const productTotalEl =
    document.getElementById("productTotal");

const deliveryTotalEl =
    document.getElementById("deliveryTotal");

const totalAmountEl =
    document.getElementById("totalAmount");

const orderForm =
    document.getElementById("orderForm");

const orderSection =
    document.getElementById("orderSection");

const receiptSection =
    document.getElementById("receiptSection");


/* =========================================================
   SAFE NUMBER
   ========================================================= */

function numberValue(value) {

    const n =
        parseFloat(
            String(value || "")
                .replace(/,/g, "")
                .replace(/[^\d.]/g, "")
        );

    return isNaN(n) ? 0 : n;
}


/* =========================================================
   FORMAT RUPEES
   ========================================================= */

function rupees(value) {

    return "Rs. " +
        Number(value || 0)
            .toLocaleString("en-PK");
}


/* =========================================================
   FIREBASE PRODUCT LOADER
   ========================================================= */

async function loadProductFromFirebase() {

    if (!productId) {
        return;
    }

    try {

        console.log(
            "Loading Product ID:",
            productId
        );

        const productRef =
            doc(
                db,
                "products",
                productId
            );

        const snapshot =
            await getDoc(productRef);

        if (!snapshot.exists()) {

            console.warn(
                "Product not found:",
                productId
            );

            return;
        }

        const data =
            snapshot.data();

        /* -----------------------------------------
           Firebase values overwrite URL defaults
           ----------------------------------------- */

        productName =
            data.name || productName;

        productDescription =
            data.description || productDescription;

        productPrice =
            data.price ?? productPrice;

        oldPrice =
            data.oldPrice ?? oldPrice;

        productImage =
            data.image || productImage;

        deliveryType =
            data.deliveryType ||
            deliveryType ||
            "Free Delivery";

        deliveryCharges =
            data.deliveryCharges ??
            deliveryCharges ??
            0;

        /* -----------------------------------------
           Update screen
           ----------------------------------------- */

        displayProduct();

        calculateTotals();

        console.log(
            "Product loaded successfully:",
            data
        );

    } catch (error) {

        console.error(
            "Firebase product loading error:",
            error
        );

        /*
           If Firebase loading fails, URL data
           will still be used if available.
        */

        displayProduct();

        calculateTotals();
    }
}


/* =========================================================
   DISPLAY PRODUCT
   ========================================================= */

function displayProduct() {

    if (productNameEl) {

        productNameEl.textContent =
            productName ||
            "Product";
    }


    if (productDescriptionEl) {

        productDescriptionEl.textContent =
            productDescription ||
            "";
    }


    if (productPriceEl) {

        productPriceEl.textContent =
            rupees(
                numberValue(productPrice)
            );
    }


    if (oldPriceEl) {

        const old =
            numberValue(oldPrice);

        if (old > 0) {

            oldPriceEl.textContent =
                rupees(old);

            oldPriceEl.style.display =
                "inline";
        }

        else {

            oldPriceEl.textContent =
                "";

            oldPriceEl.style.display =
                "none";
        }
    }


    if (productImageEl) {

        if (productImage) {

            productImageEl.src =
                productImage;

            productImageEl.alt =
                productName ||
                "JANJUA Product";

            productImageEl.style.display =
                "block";
        }

        else {

            productImageEl.style.display =
                "none";
        }
    }


    /* -----------------------------------------
       Delivery
       ----------------------------------------- */

    const charge =
        numberValue(deliveryCharges);

    const isPaid =
        String(deliveryType)
            .toLowerCase()
            .includes("paid");


    if (deliveryBadgeEl) {

        if (isPaid && charge > 0) {

            deliveryBadgeEl.textContent =
                "Paid Delivery — " +
                rupees(charge);

        }

        else {

            deliveryBadgeEl.textContent =
                "Free Delivery";
        }
    }


    if (deliveryNoteEl) {

        if (isPaid && charge > 0) {

            deliveryNoteEl.textContent =
                "📦 Delivery Charges: " +
                rupees(charge) +
                " — Total amount delivery کے وقت ادا کرنا ہوگا۔";
        }

        else {

            deliveryNoteEl.textContent =
                "📦 Free Delivery — Delivery Charges: Rs. 0";
        }
    }
}


/* =========================================================
   QUANTITY
   ========================================================= */

function getQuantity() {

    const quantityEl =
        document.getElementById("quantity");

    if (!quantityEl) {
        return 1;
    }

    const q =
        parseInt(quantityEl.value);

    return isNaN(q) || q < 1
        ? 1
        : q;
}


/* =========================================================
   CALCULATE TOTALS
   ========================================================= */

function calculateTotals() {

    const price =
        numberValue(productPrice);

    const quantity =
        getQuantity();

    const delivery =
        numberValue(deliveryCharges);

    const productTotal =
        price * quantity;

    const totalAmount =
        productTotal + delivery;


    if (productTotalEl) {

        productTotalEl.textContent =
            rupees(productTotal);
    }


    if (deliveryTotalEl) {

        deliveryTotalEl.textContent =
            rupees(delivery);
    }


    if (totalAmountEl) {

        totalAmountEl.textContent =
            rupees(totalAmount);
    }


    /* -----------------------------------------
       Hidden fields
       ----------------------------------------- */

    setValue(
        "Product_Total",
        productTotal
    );

    setValue(
        "Delivery_Charges",
        delivery
    );

    setValue(
        "Total_Amount",
        totalAmount
    );

    setValue(
        "Product_Price",
        price
    );

    setValue(
        "Product",
        productName
    );

    setValue(
        "Product_Description",
        productDescription
    );

    setValue(
        "Product_ID",
        productId
    );

    setValue(
        "Product_Image",
        productImage
    );

    setValue(
        "Delivery_Status",
        deliveryType
    );
}


/* =========================================================
   SET INPUT VALUE
   ========================================================= */

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value =
            value ?? "";
    }
}


/* =========================================================
   ORDER ID
   ========================================================= */

function createOrderId() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");

    const seconds =
        String(
            now.getSeconds()
        ).padStart(2, "0");

    return (
        "JT-" +
        year +
        month +
        day +
        "-" +
        hours +
        minutes +
        seconds
    );
}


/* =========================================================
   QUANTITY CHANGE
   ========================================================= */

const quantityEl =
    document.getElementById("quantity");

if (quantityEl) {

    quantityEl.addEventListener(
        "change",
        calculateTotals
    );

    quantityEl.addEventListener(
        "input",
        calculateTotals
    );
}


/* =========================================================
   FORM SUBMIT
   ========================================================= */

if (orderForm) {

    orderForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            /* -------------------------------------
               Latest totals
               ------------------------------------- */

            calculateTotals();


            /* -------------------------------------
               Generate Order ID
               ------------------------------------- */

            const orderId =
                createOrderId();


            setValue(
                "Order_ID",
                orderId
            );


            /* -------------------------------------
               Date / Time
               ------------------------------------- */

            const orderDate =
                new Date();

            setValue(
                "Order_Date",
                orderDate.toLocaleString(
                    "en-PK",
                    {
                        timeZone:
                            "Asia/Karachi"
                    }
                )
            );


            /* -------------------------------------
               Button
               ------------------------------------- */

            const submitButton =
                orderForm.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Order Sending...";
            }


            try {

                const formData =
                    new FormData(orderForm);


                const response =
                    await fetch(
                        FORM_URL,
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


                if (
                    result.success === true ||
                    result.success === "true"
                ) {

                    showReceipt(
                        orderId,
                        orderDate
                    );

                }

                else {

                    throw new Error(
                        "FormSubmit rejected the order."
                    );
                }


            } catch (error) {

                console.error(
                    "Order submit error:",
                    error
                );

                alert(
                    "آرڈر بھیجنے میں مسئلہ آیا ہے۔ براہِ کرم دوبارہ کوشش کریں۔"
                );


                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "PLACE ORDER";
                }
            }

        }
    );
}


/* =========================================================
   SHOW RECEIPT
   ========================================================= */

function showReceipt(
    orderId,
    orderDate
) {

    const name =
        getValue("customerName");

    const mobile =
        getValue("mobile");

    const address =
        getValue("address");

    const platform =
        getValue("platform");

    const color =
        getValue("color");

    const size =
        getValue("size");

    const quantity =
        getQuantity();

    const price =
        numberValue(productPrice);

    const delivery =
        numberValue(deliveryCharges);

    const productTotal =
        price * quantity;

    const total =
        productTotal + delivery;


    /* -----------------------------------------
       Receipt Product
       ----------------------------------------- */

    setText(
        "receiptProductName",
        productName
    );

    setText(
        "receiptOrderDate",
        orderDate.toLocaleString(
            "en-PK",
            {
                timeZone:
                    "Asia/Karachi"
            }
        )
    );

    setText(
        "receiptOrderId",
        orderId
    );

    setText(
        "receiptProductId",
        productId
    );

    setText(
        "receiptCustomerName",
        name
    );

    setText(
        "receiptMobile",
        mobile
    );

    setText(
        "receiptAddress",
        address
    );

    setText(
        "receiptQuantity",
        quantity
    );

    setText(
        "receiptProductTotal",
        rupees(productTotal)
    );

    setText(
        "receiptDeliveryCharges",
        rupees(delivery)
    );

    setText(
        "receiptTotalAmount",
        rupees(total)
    );


    /* -----------------------------------------
       Optional fields
       ----------------------------------------- */

    setText(
        "receiptPlatform",
        platform
    );

    setText(
        "receiptColor",
        color
    );

    setText(
        "receiptSize",
        size
    );


    /* -----------------------------------------
       Receipt Image
       ----------------------------------------- */

    const receiptImage =
        document.getElementById(
            "receiptProductImage"
        );

    if (receiptImage && productImage) {

        receiptImage.src =
            productImage;

        receiptImage.alt =
            productName;
    }


    /* -----------------------------------------
       Receipt Delivery Message
       ----------------------------------------- */

    const receiptDelivery =
        document.getElementById(
            "receiptDeliveryMessage"
        );

    if (receiptDelivery) {

        receiptDelivery.textContent =
            "📦 آپ کا آرڈر 3 سے 4 دن کے اندر آپ کو ڈیلیور کر دیا جائے گا۔ براہِ کرم اپنا موبائل نمبر آن رکھیں تاکہ Delivery کے وقت آپ سے رابطہ کیا جا سکے۔";
    }


    /* -----------------------------------------
       Payment Message
       ----------------------------------------- */

    const receiptPayment =
        document.getElementById(
            "receiptPaymentMessage"
        );

    if (receiptPayment) {

        if (delivery > 0) {

            receiptPayment.textContent =
                "💰 Delivery Charges " +
                rupees(delivery) +
                " ہیں۔ کل قابلِ ادائیگی رقم " +
                rupees(total) +
                " ہوگی۔ رقم Delivery کے وقت ادا کریں۔";
        }

        else {

            receiptPayment.textContent =
                "💰 Free Delivery ہے۔ Delivery Charges Rs. 0 ہیں۔ کل قابلِ ادائیگی رقم " +
                rupees(total) +
                " ہوگی۔ رقم Delivery کے وقت ادا کریں۔";
        }
    }


    /* -----------------------------------------
       Save Last Order
       ----------------------------------------- */

    const lastOrder = {

        orderId,

        orderDate:
            orderDate.toISOString(),

        productName,

        productId,

        productImage,

        price,

        oldPrice,

        quantity,

        deliveryType,

        deliveryCharges:
            delivery,

        productTotal,

        total,

        customerName:
            name,

        mobile,

        address,

        platform,

        color,

        size
    };


    localStorage.setItem(
        "janjua_last_order",
        JSON.stringify(lastOrder)
    );


    /* -----------------------------------------
       Hide Form / Show Receipt
       ----------------------------------------- */

    if (orderSection) {

        orderSection.style.display =
            "none";
    }

    if (receiptSection) {

        receiptSection.style.display =
            "block";

        receiptSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* =========================================================
   GET VALUE
   ========================================================= */

function getValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.value || "";
}


/* =========================================================
   SET TEXT
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value ?? "";
    }
}


/* =========================================================
   DOWNLOAD RECEIPT
   ========================================================= */

const downloadButton =
    document.getElementById(
        "downloadReceipt"
    );

if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        function() {

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
<html lang="ur" dir="rtl">

<head>

<meta charset="UTF-8">

<title>JANJUA Order Receipt</title>

<style>

body{
    font-family:Arial,sans-serif;
    background:#f5f5f5;
    padding:20px;
}

.receipt{
    max-width:700px;
    margin:auto;
    background:white;
    padding:25px;
    border-radius:15px;
}

img{
    max-width:220px;
    display:block;
    margin:auto;
}

h1,h2{
    text-align:center;
}

.row{
    display:flex;
    justify-content:space-between;
    padding:10px 0;
    border-bottom:1px solid #ddd;
}

.total{
    font-size:22px;
    font-weight:bold;
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
                            "text/html"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );

            link.href =
                url;

            link.download =
                "JANJUA-Order-Receipt.html";

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            URL.revokeObjectURL(
                url
            );

        }
    );
}


/* =========================================================
   SHARE RECEIPT
   ========================================================= */

const shareButton =
    document.getElementById(
        "shareReceipt"
    );

if (shareButton) {

    shareButton.addEventListener(
        "click",
        async function() {

            const orderId =
                getText(
                    "receiptOrderId"
                );

            const total =
                getText(
                    "receiptTotalAmount"
                );

            const text =
                "JANJUA ORDER RECEIPT\n\n" +
                "Product: " +
                productName +
                "\nProduct ID: " +
                productId +
                "\nOrder ID: " +
                orderId +
                "\nQuantity: " +
                getQuantity() +
                "\nTotal: " +
                total +
                "\n\n" +
                "آپ کا آرڈر 3 سے 4 دن کے اندر ڈیلیور کر دیا جائے گا۔";


            try {

                if (
                    navigator.share
                ) {

                    await navigator.share({
                        title:
                            "JANJUA Order Receipt",
                        text
                    });

                }

                else {

                    await navigator.clipboard.writeText(
                        text
                    );

                    alert(
                        "Receipt details copy ہو گئے ہیں۔"
                    );
                }

            } catch (error) {

                console.log(
                    "Share cancelled."
                );
            }

        }
    );
}


/* =========================================================
   GET TEXT
   ========================================================= */

function getText(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.textContent || "";
}


/* =========================================================
   PRINT RECEIPT
   ========================================================= */

const printButton =
    document.getElementById(
        "printReceipt"
    );

if (printButton) {

    printButton.addEventListener(
        "click",
        function() {

            window.print();

        }
    );
}


/* =========================================================
   NEW ORDER
   ========================================================= */

const newOrderButton =
    document.getElementById(
        "newOrder"
    );

if (newOrderButton) {

    newOrderButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "shop.html";

        }
    );
}


/* =========================================================
   START
   ========================================================= */

displayProduct();

calculateTotals();

/*
   IMPORTANT:
   Firebase loads product information using
   Product_ID generated by Admin.html.
*/

loadProductFromFirebase();
