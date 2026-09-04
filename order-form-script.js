/* =========================================================
   JANJUA ORDER FORM
   FIREBASE PRODUCT LOADER + FORMSUBMIT
========================================================= */


/* =========================================================
   FIREBASE
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";


import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyA8_4ArKXAdfKWZ5mi5DaT9qiayL3h_Yzw",

    authDomain:
        "janjua-traders.firebaseapp.com",

    projectId:
        "janjua-traders",

    storageBucket:
        "janjua-traders.firebasestorage.app",

    messagingSenderId:
        "154904774188",

    appId:
        "1:154904774188:web:1830f9d533e77dae6a7389"

};


const app =
    initializeApp(
        firebaseConfig
    );


const db =
    getFirestore(
        app
    );


/* =========================================================
   HELPERS
========================================================= */

function getParam(name) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get(name) || ""
    );

}


function safeText(value) {

    return (
        value === null ||
        value === undefined
    )
        ? ""
        : String(value);

}


/* =========================================================
   CLOUDINARY IMAGE OPTIMIZATION
========================================================= */

function optimizeImage(url) {

    if (!url) {

        return "";

    }


    url =
        String(url).trim();


    if (
        url.includes(
            "res.cloudinary.com"
        ) &&
        url.includes(
            "/image/upload/"
        )
    ) {

        if (
            !url.includes(
                "f_auto"
            )
        ) {

            return url.replace(
                "/image/upload/",
                "/image/upload/f_auto,q_auto,w_600/"
            );

        }

    }


    return url;

}


/* =========================================================
   URL PARAMETERS
========================================================= */

let product =
    getParam(
        "Product"
    );


let description =
    getParam(
        "Product_Description"
    );


let price =
    getParam(
        "Product_Price"
    );


let oldPrice =
    getParam(
        "Old_Price"
    );


const productId =
    getParam(
        "Product_ID"
    );


let productImage =
    getParam(
        "Product_Image"
    );


let category =
    getParam(
        "Category"
    );


let deliveryType =
    getParam(
        "Delivery_Type"
    );


let deliveryCharges =
    getParam(
        "Delivery_Charges"
    );


/* =========================================================
   SUPPLIER LINK
========================================================= */

const supplierLink =
    getParam(
        "Supplier_Link"
    );


/* =========================================================
   ELEMENTS
========================================================= */

const productImageEl =
    document.getElementById(
        "productImage"
    );


const productNameEl =
    document.getElementById(
        "productName"
    );


const productDescriptionEl =
    document.getElementById(
        "productDescription"
    );


const productPriceEl =
    document.getElementById(
        "productPrice"
    );


const oldPriceEl =
    document.getElementById(
        "oldPrice"
    );


const deliveryBadgeEl =
    document.getElementById(
        "deliveryBadge"
    );


const deliveryNoteEl =
    document.getElementById(
        "deliveryNote"
    );


const orderForm =
    document.getElementById(
        "orderForm"
    );


/* =========================================================
   DELIVERY AMOUNT
========================================================= */

let deliveryAmount =
    0;


/* =========================================================
   FIRESTORE PRODUCT LOADER
========================================================= */

async function loadProductFromFirestore() {

    /*
       Product_ID لازمی ہے۔
    */

    if (!productId) {

        console.warn(
            "Product_ID not found in URL."
        );

        return false;

    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        let foundProduct =
            null;


        snapshot.forEach(
            function(doc) {

                const data =
                    doc.data();


                const firestoreId =
                    safeText(
                        data.Product_ID
                    ).trim();


                if (
                    firestoreId ===
                    productId.trim()
                ) {

                    foundProduct =
                        data;

                }

            }
        );


        if (!foundProduct) {

            console.warn(
                "Product not found:",
                productId
            );


            return false;

        }


        /* =================================================
           PRODUCT NAME
        ================================================= */

        product =
            safeText(
                foundProduct.Product ||
                foundProduct.Product_Name
            );


        /* =================================================
           DESCRIPTION
        ================================================= */

        description =
            safeText(
                foundProduct.Product_Description
            );


        /* =================================================
           PRICE
        ================================================= */

        price =
            safeText(
                foundProduct.Product_Price
            );


        /* =================================================
           OLD PRICE
        ================================================= */

        oldPrice =
            safeText(
                foundProduct.Old_Price
            );


        /* =================================================
           CATEGORY
        ================================================= */

        category =
            safeText(
                foundProduct.Category
            );


        /* =================================================
           DELIVERY TYPE
        ================================================= */

        deliveryType =
            safeText(
                foundProduct.Delivery_Type
            );


        /* =================================================
           DELIVERY CHARGES
        ================================================= */

        deliveryCharges =
            safeText(
                foundProduct.Delivery_Charges
            );


        /* =================================================
           IMPORTANT PRODUCT IMAGE
        ================================================= */

        productImage =
            safeText(
                foundProduct.Product_Image ||
                foundProduct.productImage ||
                foundProduct.Image ||
                foundProduct.image
            );


        console.log(
            "JANJUA Product loaded:",
            foundProduct
        );


        console.log(
            "JANJUA Product Image:",
            productImage
        );


        return true;

    }
    catch(error) {

        console.error(
            "Firestore product loading error:",
            error
        );


        return false;

    }

}


/* =========================================================
   UPDATE DELIVERY AMOUNT
========================================================= */

function updateDeliveryAmount() {

    const parsedDelivery =
        parseFloat(
            String(
                deliveryCharges
            )
            .replace(
                /[^0-9.]/g,
                ""
            )
        );


    if (
        !isNaN(
            parsedDelivery
        )
    ) {

        deliveryAmount =
            parsedDelivery;

    }
    else {

        deliveryAmount =
            0;

    }

}


/* =========================================================
   DISPLAY PRODUCT
========================================================= */

function displayProduct() {


    /* =================================================
       PRODUCT IMAGE
    ================================================= */

    if (productImageEl) {

        const imageUrl =
            optimizeImage(
                productImage
            );


        if (imageUrl) {

            productImageEl.src =
                imageUrl;


            productImageEl.style.display =
                "block";


            productImageEl.onerror =
                function() {

                    console.error(
                        "Product image failed:",
                        imageUrl
                    );


                    /*
                       Original URL پر دوبارہ کوشش
                       کریں اگر Cloudinary
                       optimized URL fail ہو۔
                    */

                    if (
                        productImage &&
                        this.src !== productImage
                    ) {

                        this.src =
                            productImage;

                    }
                    else {

                        this.style.display =
                            "none";

                    }

                };

        }
        else {

            productImageEl.removeAttribute(
                "src"
            );

        }

    }


    /* =================================================
       PRODUCT NAME
    ================================================= */

    if (productNameEl) {

        productNameEl.textContent =
            product ||
            "Product";

    }


    /* =================================================
       DESCRIPTION
    ================================================= */

    if (productDescriptionEl) {

        productDescriptionEl.textContent =
            description;

    }


    /* =================================================
       PRICE
    ================================================= */

    if (productPriceEl) {

        productPriceEl.textContent =
            price
                ? "Rs. " +
                  price
                : "";

    }


    /* =================================================
       OLD PRICE
    ================================================= */

    if (oldPriceEl) {

        oldPriceEl.textContent =
            oldPrice
                ? "Rs. " +
                  oldPrice
                : "";

    }


    /* =================================================
       DELIVERY BADGE
    ================================================= */

    if (deliveryBadgeEl) {

        if (deliveryType) {

            deliveryBadgeEl.textContent =
                deliveryType;


            deliveryBadgeEl.style.display =
                "inline-block";

        }
        else {

            deliveryBadgeEl.style.display =
                "none";

        }

    }


    /* =================================================
       DELIVERY NOTE
    ================================================= */

    if (deliveryNoteEl) {

        if (deliveryCharges) {

            deliveryNoteEl.textContent =
                "Delivery Charges: Rs. " +
                deliveryCharges;

        }
        else {

            deliveryNoteEl.textContent =
                "";

        }

    }

}


/* =========================================================
   HIDDEN ELEMENTS
========================================================= */

const formUrl =
    document.getElementById(
        "formUrl"
    );


const hiddenOrderId =
    document.getElementById(
        "hiddenOrderId"
    );


const hiddenProduct =
    document.getElementById(
        "hiddenProduct"
    );


const hiddenDescription =
    document.getElementById(
        "hiddenDescription"
    );


const hiddenPrice =
    document.getElementById(
        "hiddenPrice"
    );


const hiddenOldPrice =
    document.getElementById(
        "hiddenOldPrice"
    );


const hiddenProductId =
    document.getElementById(
        "hiddenProductId"
    );


const hiddenProductImage =
    document.getElementById(
        "hiddenProductImage"
    );


const hiddenDeliveryStatus =
    document.getElementById(
        "hiddenDeliveryStatus"
    );


const hiddenDeliveryCharges =
    document.getElementById(
        "hiddenDeliveryCharges"
    );


const hiddenTotal =
    document.getElementById(
        "hiddenTotal"
    );


const hiddenJanjuaLink =
    document.getElementById(
        "hiddenJanjuaLink"
    );


const hiddenSupplierLink =
    document.getElementById(
        "hiddenSupplierLink"
    );


/* =========================================================
   JANJUA ORDER LINK
========================================================= */

const janjuaOrderLink =
    window.location.href;


/* =========================================================
   UPDATE HIDDEN FIELDS
========================================================= */

function updateHiddenFields() {


    if (formUrl) {

        formUrl.value =
            window.location.href;

    }


    if (hiddenProduct) {

        hiddenProduct.value =
            product;

    }


    if (hiddenDescription) {

        hiddenDescription.value =
            description;

    }


    if (hiddenPrice) {

        hiddenPrice.value =
            price;

    }


    if (hiddenOldPrice) {

        hiddenOldPrice.value =
            oldPrice;

    }


    if (hiddenProductId) {

        hiddenProductId.value =
            productId;

    }


    /*
       IMPORTANT:
       Firestore سے حاصل کیا ہوا
       اصل Product_Image URL
    */

    if (hiddenProductImage) {

        hiddenProductImage.value =
            productImage;

    }


    if (hiddenDeliveryStatus) {

        hiddenDeliveryStatus.value =
            deliveryType;

    }


    if (hiddenDeliveryCharges) {

        hiddenDeliveryCharges.value =
            deliveryCharges;

    }


    if (hiddenJanjuaLink) {

        hiddenJanjuaLink.value =
            janjuaOrderLink;

    }


    if (hiddenSupplierLink) {

        hiddenSupplierLink.value =
            supplierLink;

    }

}


/* =========================================================
   TOTAL CALCULATION
========================================================= */

function calculateTotal() {


    const quantityEl =
        document.getElementById(
            "quantity"
        );


    const quantity =
        parseInt(
            quantityEl
                ? quantityEl.value
                : "1",
            10
        ) || 1;


    const productAmount =
        parseFloat(
            String(
                price
            )
            .replace(
                /[^0-9.]/g,
                ""
            )
        ) || 0;


    const total =
        (
            productAmount *
            quantity
        ) +
        deliveryAmount;


    return {

        quantity,

        total

    };

}


/* =========================================================
   ORDER ID
========================================================= */

function generateOrderId() {


    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        )
        .padStart(
            2,
            "0"
        );


    const hours =
        String(
            now.getHours()
        )
        .padStart(
            2,
            "0"
        );


    const minutes =
        String(
            now.getMinutes()
        )
        .padStart(
            2,
            "0"
        );


    const seconds =
        String(
            now.getSeconds()
        )
        .padStart(
            2,
            "0"
        );


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
   RECEIPT
========================================================= */

function showReceipt(
    orderData
) {


    const receiptSection =
        document.getElementById(
            "receiptSection"
        );


    const receiptImage =
        document.getElementById(
            "receiptImage"
        );


    const receiptProductName =
        document.getElementById(
            "receiptProductName"
        );


    const receiptDate =
        document.getElementById(
            "receiptDate"
        );


    const receiptOrderId =
        document.getElementById(
            "receiptOrderId"
        );


    const receiptCustomer =
        document.getElementById(
            "receiptCustomer"
        );


    const receiptMobile =
        document.getElementById(
            "receiptMobile"
        );


    const receiptQuantity =
        document.getElementById(
            "receiptQuantity"
        );


    const receiptPrice =
        document.getElementById(
            "receiptPrice"
        );


    const receiptDelivery =
        document.getElementById(
            "receiptDelivery"
        );


    const receiptTotal =
        document.getElementById(
            "receiptTotal"
        );


    const receiptInstruction =
        document.getElementById(
            "receiptDeliveryInstruction"
        );


    /* =================================================
       RECEIPT IMAGE
    ================================================= */

    if (receiptImage) {

        const imageUrl =
            optimizeImage(
                orderData.productImage
            );


        if (imageUrl) {

            receiptImage.src =
                imageUrl;


            receiptImage.style.display =
                "block";

        }

    }


    if (receiptProductName) {

        receiptProductName.textContent =
            orderData.product;

    }


    if (receiptDate) {

        receiptDate.textContent =
            orderData.date;

    }


    if (receiptOrderId) {

        receiptOrderId.textContent =
            orderData.orderId;

    }


    if (receiptCustomer) {

        receiptCustomer.textContent =
            orderData.customer;

    }


    if (receiptMobile) {

        receiptMobile.textContent =
            orderData.mobile;

    }


    if (receiptQuantity) {

        receiptQuantity.textContent =
            orderData.quantity;

    }


    if (receiptPrice) {

        receiptPrice.textContent =
            "Rs. " +
            orderData.price;

    }


    if (receiptDelivery) {

        receiptDelivery.textContent =
            orderData.deliveryCharges
                ? "Rs. " +
                  orderData.deliveryCharges
                : "FREE";

    }


    if (receiptTotal) {

        receiptTotal.textContent =
            "Rs. " +
            orderData.total;

    }


    if (receiptInstruction) {

        receiptInstruction.textContent =
            "آپ کا Order کامیابی سے موصول ہو گیا ہے۔ Order ID محفوظ کر لیں۔";

    }


    if (receiptSection) {

        receiptSection.style.display =
            "block";


        receiptSection.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }

}


/* =========================================================
   FORM SUBMIT
========================================================= */

if (orderForm) {


    orderForm.addEventListener(

        "submit",

        async function(event) {


            event.preventDefault();


            const customerNameEl =
                document.getElementById(
                    "customerName"
                );


            const mobileEl =
                document.getElementById(
                    "mobile"
                );


            const addressEl =
                document.getElementById(
                    "address"
                );


            const platformEl =
                document.getElementById(
                    "platform"
                );


            const colorEl =
                document.getElementById(
                    "color"
                );


            const sizeEl =
                document.getElementById(
                    "size"
                );


            const customerName =
                customerNameEl
                    ? customerNameEl.value.trim()
                    : "";


            const mobile =
                mobileEl
                    ? mobileEl.value.trim()
                    : "";


            const address =
                addressEl
                    ? addressEl.value.trim()
                    : "";


            const platform =
                platformEl
                    ? platformEl.value
                    : "";


            const color =
                colorEl
                    ? colorEl.value.trim()
                    : "";


            const size =
                sizeEl
                    ? sizeEl.value.trim()
                    : "";


            const {
                quantity,
                total
            } =
                calculateTotal();


            /* =================================================
               VALIDATION
            ================================================= */

            if (!customerName) {

                alert(
                    "براہ کرم نام درج کریں۔"
                );

                return;

            }


            if (!mobile) {

                alert(
                    "براہ کرم موبائل / WhatsApp نمبر درج کریں۔"
                );

                return;

            }


            if (!address) {

                alert(
                    "براہ کرم مکمل پتہ درج کریں۔"
                );

                return;

            }


            /* =================================================
               ORDER ID
            ================================================= */

            const orderId =
                generateOrderId();


            if (hiddenOrderId) {

                hiddenOrderId.value =
                    orderId;

            }


            if (hiddenTotal) {

                hiddenTotal.value =
                    total;

            }


            /*
               دوبارہ hidden fields update
               کریں تاکہ Firestore کی
               تازہ product image بھی موجود ہو۔
            */

            updateHiddenFields();


            if (hiddenOrderId) {

                hiddenOrderId.value =
                    orderId;

            }


            if (hiddenTotal) {

                hiddenTotal.value =
                    total;

            }


            /* =================================================
               FORM DATA
            ================================================= */

            const formData =
                new FormData(
                    orderForm
                );


            /* =================================================
               SUBMIT BUTTON
            ================================================= */

            const submitBtn =
                orderForm.querySelector(
                    ".submit-btn"
                );


            const oldButtonText =
                submitBtn
                    ? submitBtn.textContent
                    : "";


            if (submitBtn) {

                submitBtn.disabled =
                    true;


                submitBtn.textContent =
                    "Order Sending...";

            }


            try {


                const response =
                    await fetch(

                        orderForm.action,

                        {

                            method:
                                "POST",

                            body:
                                formData,

                            headers: {

                                Accept:
                                    "application/json"

                            }

                        }

                    );


                if (!response.ok) {

                    throw new Error(
                        "Order submission failed"
                    );

                }


                /* =================================================
                   SAVE LAST ORDER
                ================================================= */

                const orderData = {

                    orderId,

                    date:
                        new Date()
                            .toLocaleString(),

                    product,

                    description,

                    price,

                    oldPrice,

                    productId,

                    productImage,

                    category,

                    deliveryType,

                    deliveryCharges,

                    customer:
                        customerName,

                    mobile,

                    address,

                    quantity,

                    platform,

                    color,

                    size,

                    total,

                    janjuaOrderLink,

                    supplierLink

                };


                localStorage.setItem(

                    "janjua_last_order",

                    JSON.stringify(
                        orderData
                    )

                );


                /* =================================================
                   SHOW RECEIPT
                ================================================= */

                showReceipt(
                    orderData
                );


                /* =================================================
                   HIDE FORM
                ================================================= */

                const formBox =
                    orderForm.closest(
                        ".form-box"
                    );


                if (formBox) {

                    formBox.style.display =
                        "none";

                }


            }
            catch(error) {


                console.error(
                    error
                );


                alert(
                    "Order send نہیں ہو سکا۔ براہ کرم دوبارہ کوشش کریں۔"
                );


                if (submitBtn) {

                    submitBtn.disabled =
                        false;


                    submitBtn.textContent =
                        oldButtonText;

                }

            }

        }

    );

}


/* =========================================================
   DOWNLOAD RECEIPT
========================================================= */

const downloadReceiptBtn =
    document.getElementById(
        "downloadReceiptBtn"
    );


if (downloadReceiptBtn) {


    downloadReceiptBtn.addEventListener(

        "click",

        function() {


            const lastOrder =
                localStorage.getItem(
                    "janjua_last_order"
                );


            if (!lastOrder) {

                alert(
                    "Receipt data نہیں ملی۔"
                );

                return;

            }


            let order;


            try {

                order =
                    JSON.parse(
                        lastOrder
                    );

            }
            catch(error) {

                alert(
                    "Receipt data خراب ہے۔"
                );

                return;

            }


            const receiptImage =
                optimizeImage(
                    order.productImage
                );


            const receiptHtml = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>JANJUA Order Receipt</title>

<style>

body{
    font-family:Arial,sans-serif;
    padding:20px;
    max-width:600px;
    margin:auto;
}

img{
    width:100%;
    max-width:500px;
    max-height:300px;
    object-fit:contain;
    display:block;
    margin-bottom:20px;
}

.row{
    padding:8px 0;
    border-bottom:1px solid #ddd;
}

</style>

</head>

<body>

<h2>JANJUA Order Receipt</h2>

<img
    src="${receiptImage || ""}"
    alt="Product"
>

<div class="row">
<b>Order ID:</b>
${order.orderId || ""}
</div>

<div class="row">
<b>Date:</b>
${order.date || ""}
</div>

<div class="row">
<b>Product:</b>
${order.product || ""}
</div>

<div class="row">
<b>Customer:</b>
${order.customer || ""}
</div>

<div class="row">
<b>Mobile:</b>
${order.mobile || ""}
</div>

<div class="row">
<b>Quantity:</b>
${order.quantity || ""}
</div>

<div class="row">
<b>Price:</b>
Rs. ${order.price || ""}
</div>

<div class="row">
<b>Delivery:</b>
${order.deliveryCharges || "FREE"}
</div>

<div class="row">
<b>Total:</b>
Rs. ${order.total || ""}
</div>

</body>

</html>

`;


            const blob =
                new Blob(

                    [
                        receiptHtml
                    ],

                    {
                        type:
                            "text/html"
                    }

                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const a =
                document.createElement(
                    "a"
                );


            a.href =
                url;


            a.download =
                "JANJUA-" +
                (
                    order.orderId ||
                    "Receipt"
                ) +
                ".html";


            document.body.appendChild(
                a
            );


            a.click();


            a.remove();


            URL.revokeObjectURL(
                url
            );

        }

    );

}


/* =========================================================
   SHARE
========================================================= */

const shareReceiptBtn =
    document.getElementById(
        "shareReceiptBtn"
    );


if (shareReceiptBtn) {


    shareReceiptBtn.addEventListener(

        "click",

        async function() {


            const lastOrder =
                localStorage.getItem(
                    "janjua_last_order"
                );


            if (!lastOrder) {

                alert(
                    "Receipt data نہیں ملی۔"
                );

                return;

            }


            let order;


            try {

                order =
                    JSON.parse(
                        lastOrder
                    );

            }
            catch(error) {

                alert(
                    "Receipt data خراب ہے۔"
                );

                return;

            }


            const shareText =

                "JANJUA Order Receipt\n\n" +

                "Order ID: " +
                (
                    order.orderId ||
                    ""
                ) +

                "\n" +

                "Product: " +
                (
                    order.product ||
                    ""
                ) +

                "\n" +

                "Quantity: " +
                (
                    order.quantity ||
                    ""
                ) +

                "\n" +

                "Total: Rs. " +
                (
                    order.total ||
                    ""
                );


            if (
                navigator.share
            ) {


                try {


                    await navigator.share({

                        title:
                            "JANJUA Order Receipt",

                        text:
                            shareText

                    });


                }
                catch(error) {


                    console.log(
                        "Share cancelled"
                    );

                }


            }
            else {


                try {


                    await navigator.clipboard.writeText(
                        shareText
                    );


                    alert(
                        "Receipt details copy ہو گئے ہیں۔"
                    );


                }
                catch(error) {


                    alert(
                        shareText
                    );

                }

            }

        }

    );

}


/* =========================================================
   PRINT / PDF
========================================================= */

const printReceiptBtn =
    document.getElementById(
        "printReceiptBtn"
    );


if (printReceiptBtn) {


    printReceiptBtn.addEventListener(

        "click",

        function() {

            window.print();

        }

    );

}


/* =========================================================
   NEW ORDER
========================================================= */

const newOrderBtn =
    document.getElementById(
        "newOrderBtn"
    );


if (newOrderBtn) {


    newOrderBtn.addEventListener(

        "click",

        function() {

            window.location.href =
                "shop.html";

        }

    );

}


/* =========================================================
   START PRODUCT LOADING
========================================================= */

async function initializeProduct() {


    /*
       پہلے Firestore سے product
       load ہوگا۔
    */

    await loadProductFromFirestore();


    /*
       Delivery amount calculate
       کریں۔
    */

    updateDeliveryAmount();


    /*
       Product screen پر دکھائیں۔
    */

    displayProduct();


    /*
       Hidden fields update کریں۔
    */

    updateHiddenFields();

}


/* =========================================================
   START
========================================================= */

initializeProduct();
