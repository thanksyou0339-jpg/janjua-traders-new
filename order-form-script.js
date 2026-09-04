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

const productImageEl =
    document.getElementById("productImage");

const productNameEl =
    document.getElementById("productName");

const productDescriptionEl =
    document.getElementById("productDescription");

const productPriceEl =
    document.getElementById("productPrice");

const oldPriceEl =
    document.getElementById("oldPrice");

const deliveryBadgeEl =
    document.getElementById("deliveryBadge");

const deliveryNoteEl =
    document.getElementById("deliveryNote");

const form =
    document.getElementById("orderForm");

const customerName =
    document.getElementById("customerName");

const mobile =
    document.getElementById("mobile");

const address =
    document.getElementById("address");

const quantity =
    document.getElementById("quantity");

const platform =
    document.getElementById("platform");

const color =
    document.getElementById("color");

const size =
    document.getElementById("size");

const receiptSection =
    document.getElementById("receiptSection");


// =====================================================
// HIDDEN FIELDS
// =====================================================

const hiddenOrderId =
    document.getElementById("hiddenOrderId");

const hiddenProduct =
    document.getElementById("hiddenProduct");

const hiddenDescription =
    document.getElementById("hiddenDescription");

const hiddenPrice =
    document.getElementById("hiddenPrice");

const hiddenOldPrice =
    document.getElementById("hiddenOldPrice");

const hiddenProductId =
    document.getElementById("hiddenProductId");

const hiddenProductImage =
    document.getElementById("hiddenProductImage");

const hiddenDeliveryStatus =
    document.getElementById("hiddenDeliveryStatus");

const hiddenDeliveryCharges =
    document.getElementById("hiddenDeliveryCharges");

const hiddenTotal =
    document.getElementById("hiddenTotal");

const hiddenJanjuaLink =
    document.getElementById("hiddenJanjuaLink");

const hiddenSupplierLink =
    document.getElementById("hiddenSupplierLink");


// =====================================================
// URL PARAMETERS
// =====================================================

const params =
    new URLSearchParams(window.location.search);

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

    name:
        params.get("Product") || "",

    description:
        params.get("Product_Description") || "",

    price:
        Number(
            params.get("Product_Price") || 0
        ),

    oldPrice:
        Number(
            params.get("Old_Price") || 0
        ),

    category:
        params.get("Category") || "",

    image:
        params.get("Product_Image") || "",

    deliveryType:
        params.get("Delivery_Type") || "",

    deliveryCharges:
        Number(
            params.get("Delivery_Charges") || 0
        ),

    supplierLink:
        supplierLinkFromURL || ""

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
                "/image/upload/f_auto,q_auto,w_800/"
            );

        }

    }

    return url;
}


// =====================================================
// MONEY
// =====================================================

function money(value) {

    const number =
        Number(value || 0);

    return (
        "Rs. " +
        number.toLocaleString("en-PK")
    );

}


// =====================================================
// ORDER ID
// =====================================================

function generateOrderId() {

    const now =
        new Date();

    const datePart =
        now.getFullYear().toString() +
        String(
            now.getMonth() + 1
        ).padStart(2, "0") +
        String(
            now.getDate()
        ).padStart(2, "0");

    const timePart =
        String(
            now.getHours()
        ).padStart(2, "0") +
        String(
            now.getMinutes()
        ).padStart(2, "0") +
        String(
            now.getSeconds()
        ).padStart(2, "0");

    const randomPart =
        Math.floor(
            1000 +
            Math.random() * 9000
        );

    return (
        "JT-" +
        datePart +
        "-" +
        timePart +
        "-" +
        randomPart
    );

}


// =====================================================
// JANJUA LINK
// =====================================================

function getJanjuaOrderLink() {

    return window.location.href;

}


// =====================================================
// LOAD PRODUCT
// =====================================================

async function loadProductFromFirestore() {

    if (!productIdFromURL) {
        return;
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
            (doc) => {

                const data =
                    doc.data();

                const id =
                    data.Product_ID ||
                    data.productId ||
                    data.id ||
                    "";

                if (
                    String(id) ===
                    String(productIdFromURL)
                ) {

                    foundProduct = {
                        firestoreId:
                            doc.id,
                        ...data
                    };

                }

            }
        );


        if (!foundProduct) {

            console.log(
                "Product not found."
            );

            return;

        }


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


        // SUPPLIER LINK — DO NOT REMOVE

        productData.supplierLink =
            foundProduct.supplierLink ||
            foundProduct.Supplier_Link ||
            foundProduct.Original_Supplier_Link ||
            productData.supplierLink ||
            "";


    } catch (error) {

        console.error(
            "Firestore error:",
            error
        );

    }

}


// =====================================================
// DISPLAY PRODUCT
// =====================================================

function displayProduct() {

    const imageUrl =
        optimizeImage(
            productData.image
        );


    if (productImageEl) {

        if (imageUrl) {

            productImageEl.src =
                imageUrl;

            productImageEl.style.display =
                "block";

        } else {

            productImageEl.removeAttribute(
                "src"
            );

        }

    }


    if (productNameEl) {

        productNameEl.textContent =
            productData.name ||
            "Product";

    }


    if (productDescriptionEl) {

        productDescriptionEl.textContent =
            productData.description ||
            "";

    }


    if (productPriceEl) {

        productPriceEl.textContent =
            money(
                productData.price
            );

    }


    if (oldPriceEl) {

        if (
            productData.oldPrice > 0
        ) {

            oldPriceEl.textContent =
                money(
                    productData.oldPrice
                );

            oldPriceEl.style.display =
                "inline";

        } else {

            oldPriceEl.style.display =
                "none";

        }

    }


    if (deliveryBadgeEl) {

        if (
            String(
                productData.deliveryType
            )
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

        if (
            productData.deliveryCharges > 0
        ) {

            deliveryNoteEl.textContent =
                "Delivery Charges: " +
                money(
                    productData.deliveryCharges
                );

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

    let orderId =
        hiddenOrderId?.value ||
        generateOrderId();


    const janjuaLink =
        getJanjuaOrderLink();


    const supplierLink =
        productData.supplierLink ||
        supplierLinkFromURL ||
        "";


    if (hiddenOrderId) {

        hiddenOrderId.value =
            orderId;

    }


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


    if (hiddenDeliveryStatus) {

        hiddenDeliveryStatus.value =
            productData.deliveryType ||
            "";

    }


    if (hiddenDeliveryCharges) {

        hiddenDeliveryCharges.value =
            productData.deliveryCharges ||
            0;

    }


    const qty =
        Number(
            quantity?.value || 1
        );


    const total =
        (
            Number(
                productData.price || 0
            ) * qty
        ) +
        Number(
            productData.deliveryCharges ||
            0
        );


    if (hiddenTotal) {

        hiddenTotal.value =
            total;

    }


    if (hiddenJanjuaLink) {

        hiddenJanjuaLink.value =
            janjuaLink;

    }


    if (hiddenSupplierLink) {

        hiddenSupplierLink.value =
            supplierLink;

    }


    const formUrl =
        document.getElementById(
            "formUrl"
        );

    if (formUrl) {

        formUrl.value =
            window.location.href;

    }

}


// =====================================================
// QUANTITY CHANGE
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
// INITIALIZE
// =====================================================

async function initializeProduct() {

    displayProduct();

    await loadProductFromFirestore();

    displayProduct();

    updateHiddenFields();

}


initializeProduct();


// =====================================================
// WAIT FOR IMAGE
// =====================================================

function waitForImage(image) {

    return new Promise(
        (resolve) => {

            if (!image) {

                resolve();

                return;

            }


            if (image.complete) {

                resolve();

                return;

            }


            image.onload =
                () => resolve();

            image.onerror =
                () => resolve();

        }
    );

}


// =====================================================
// SHOW RECEIPT
// =====================================================

async function showReceipt(orderId) {

    if (!receiptSection) {
        return;
    }


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

    const receiptAddress =
        document.getElementById(
            "receiptAddress"
        );

    const receiptProduct =
        document.getElementById(
            "receiptProductName"
        );

    const receiptDate =
        document.getElementById(
            "receiptDate"
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

    const receiptPlatform =
        document.getElementById(
            "receiptPlatform"
        );

    const receiptColor =
        document.getElementById(
            "receiptColor"
        );

    const receiptSize =
        document.getElementById(
            "receiptSize"
        );

    const receiptTotal =
        document.getElementById(
            "receiptTotal"
        );

    const receiptImage =
        document.getElementById(
            "receiptImage"
        );


    // BASIC DATA

    if (receiptOrderId) {

        receiptOrderId.textContent =
            orderId;

    }


    if (receiptCustomer) {

        receiptCustomer.textContent =
            customerName?.value ||
            "";

    }


    if (receiptMobile) {

        receiptMobile.textContent =
            mobile?.value ||
            "";

    }


    if (receiptAddress) {

        receiptAddress.textContent =
            address?.value ||
            "";

    }


    if (receiptProduct) {

        receiptProduct.textContent =
            productData.name ||
            "";

    }


    if (receiptDate) {

        receiptDate.textContent =
            new Date()
            .toLocaleString(
                "en-PK",
                {
                    dateStyle:
                        "medium",
                    timeStyle:
                        "short"
                }
            );

    }


    const qty =
        Number(
            quantity?.value || 1
        );


    if (receiptQuantity) {

        receiptQuantity.textContent =
            qty;

    }


    if (receiptPrice) {

        receiptPrice.textContent =
            money(
                productData.price
            );

    }


    const deliveryText =
        productData.deliveryCharges > 0
            ? money(
                productData.deliveryCharges
              )
            : "Free Delivery";


    if (receiptDelivery) {

        receiptDelivery.textContent =
            deliveryText;

    }


    if (receiptPlatform) {

        receiptPlatform.textContent =
            platform?.value ||
            "";

    }


    if (receiptColor) {

        receiptColor.textContent =
            color?.value ||
            "-";

    }


    if (receiptSize) {

        receiptSize.textContent =
            size?.value ||
            "-";

    }


    const total =
        (
            Number(
                productData.price || 0
            ) * qty
        ) +
        Number(
            productData.deliveryCharges ||
            0
        );


    if (receiptTotal) {

        receiptTotal.textContent =
            money(total);

    }


    // RECEIPT IMAGE

    const imageUrl =
        optimizeImage(
            productData.image
        );


    if (receiptImage) {

        if (imageUrl) {

            receiptImage.crossOrigin =
                "anonymous";

            receiptImage.src =
                imageUrl;

            receiptImage.style.display =
                "block";

            await waitForImage(
                receiptImage
            );

        } else {

            receiptImage.style.display =
                "none";

        }

    }


    // SHOW RECEIPT

    receiptSection.style.display =
        "block";


    // HIDE FORM

    if (form) {

        form.style.display =
            "none";

    }


    // MOVE USER TO RECEIPT

    setTimeout(
        () => {

            receiptSection.scrollIntoView({
                behavior:
                    "smooth",
                block:
                    "start"
            });

        },
        100
    );

}


// =====================================================
// FORM SUBMISSION
// =====================================================

if (form) {

    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            updateHiddenFields();


            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Processing...";

            }


            const orderId =
                hiddenOrderId?.value ||
                generateOrderId();


            try {

                const formData =
                    new FormData(form);


                const response =
                    await fetch(
                        "https://formsubmit.co/ajax/thanksyou0339@gmail.com",
                        {
                            method:
                                "POST",

                            body:
                                formData,

                            headers:{
                                Accept:
                                    "application/json"
                            }
                        }
                    );


                let result = {};

                try {

                    result =
                        await response.json();

                } catch(error) {

                    console.log(
                        "Response was not JSON."
                    );

                }


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Order submission failed."
                    );

                }


                // SHOW RECEIPT

                await showReceipt(
                    orderId
                );


            } catch(error) {

                console.error(
                    "Order submission error:",
                    error
                );


                alert(
                    "Order submit نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔"
                );


                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "ORDER CONFIRM کریں";

                }

            }

        }
    );

}


// =====================================================
// DOWNLOAD PDF
// =====================================================

const downloadButton =
    document.getElementById(
        "downloadReceiptBtn"
    );


if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        async function() {

            const receipt =
                document.getElementById(
                    "receiptSection"
                );


            if (!receipt) {
                return;
            }


            if (
                typeof html2pdf ===
                "undefined"
            ) {

                alert(
                    "PDF system load نہیں ہوا۔ براہِ کرم internet check کرکے دوبارہ کوشش کریں۔"
                );

                return;

            }


            downloadButton.disabled =
                true;

            downloadButton.textContent =
                "PDF بن رہی ہے...";


            try {

                const image =
                    document.getElementById(
                        "receiptImage"
                    );


                await waitForImage(
                    image
                );


                const options = {

                    margin: 5,

                    filename:
                        "JANJUA-Order-" +
                        (
                            hiddenOrderId?.value ||
                            "Receipt"
                        ) +
                        ".pdf",

                    image: {
                        type:
                            "jpeg",
                        quality:
                            0.95
                    },

                    html2canvas: {

                        scale:
                            2,

                        useCORS:
                            true,

                        allowTaint:
                            false,

                        backgroundColor:
                            "#ffffff"

                    },

                    jsPDF: {

                        unit:
                            "mm",

                        format:
                            "a4",

                        orientation:
                            "portrait"

                    }

                };


                await html2pdf()
                    .set(options)
                    .from(receipt)
                    .save();


            } catch(error) {

                console.error(
                    "PDF error:",
                    error
                );


                alert(
                    "PDF download نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔"
                );

            }


            downloadButton.disabled =
                false;

            downloadButton.textContent =
                "📥 Download PDF";

        }
    );

}


// =====================================================
// SHARE RECEIPT
// =====================================================

const shareButton =
    document.getElementById(
        "shareReceiptBtn"
    );


if (shareButton) {

    shareButton.addEventListener(
        "click",
        async function() {

            const orderId =
                hiddenOrderId?.value ||
                "";

            const text =
                "JANJUA TRADERS\n" +
                "Order Confirmation\n\n" +
                "Order ID: " +
                orderId +
                "\n" +
                "Product: " +
                productData.name +
                "\n" +
                "Quantity: " +
                (
                    quantity?.value ||
                    1
                ) +
                "\n" +
                "Total: " +
                money(
                    (
                        Number(
                            productData.price ||
                            0
                        ) *
                        Number(
                            quantity?.value ||
                            1
                        )
                    ) +
                    Number(
                        productData.deliveryCharges ||
                        0
                    )
                ) +
                "\n\n" +
                "Delivery: 4–6 days\n" +
                "Return Request: within 5 days\n" +
                "Payment: Cash on Delivery (COD)";


            try {

                // TRY SHARE PDF FIRST

                if (
                    typeof html2pdf !==
                    "undefined"
                ) {

                    const receipt =
                        document.getElementById(
                            "receiptSection"
                        );


                    const options = {

                        margin:5,

                        filename:
                            "JANJUA-Order-" +
                            orderId +
                            ".pdf",

                        image:{
                            type:
                                "jpeg",
                            quality:
                                0.95
                        },

                        html2canvas:{
                            scale:
                                2,
                            useCORS:
                                true,
                            allowTaint:
                                false,
                            backgroundColor:
                                "#ffffff"
                        },

                        jsPDF:{
                            unit:
                                "mm",
                            format:
                                "a4",
                            orientation:
                                "portrait"
                        }

                    };


                    const pdfBlob =
                        await html2pdf()
                            .set(options)
                            .from(receipt)
                            .outputPdf(
                                "blob"
                            );


                    const file =
                        new File(
                            [
                                pdfBlob
                            ],
                            "JANJUA-Order-" +
                            orderId +
                            ".pdf",
                            {
                                type:
                                    "application/pdf"
                            }
                        );


                    if (
                        navigator.share &&
                        navigator.canShare &&
                        navigator.canShare({
                            files:[
                                file
                            ]
                        })
                    ) {

                        await navigator.share({

                            title:
                                "JANJUA Order Receipt",

                            text:
                                text,

                            files:[
                                file
                            ]

                        });

                        return;

                    }

                }


                // NORMAL SHARE

                if (
                    navigator.share
                ) {

                    await navigator.share({

                        title:
                            "JANJUA Order Receipt",

                        text:
                            text

                    });

                    return;

                }


                // CLIPBOARD FALLBACK

                if (
                    navigator.clipboard
                ) {

                    await navigator.clipboard.writeText(
                        text
                    );

                    alert(
                        "Order details copy ہو گئے ہیں۔"
                    );

                    return;

                }


                alert(text);


            } catch(error) {

                if (
                    error &&
                    error.name ===
                    "AbortError"
                ) {

                    return;

                }

                console.error(
                    "Share error:",
                    error
                );

                alert(
                    "Share نہیں ہو سکا۔ براہِ کرم Download PDF کرکے WhatsApp پر share کریں۔"
                );

            }

        }
    );

}


// =====================================================
// PRINT
// =====================================================

const printButton =
    document.getElementById(
        "printReceiptBtn"
    );


if (printButton) {

    printButton.addEventListener(
        "click",
        async function() {

            const receipt =
                document.getElementById(
                    "receiptSection"
                );


            if (!receipt) {
                return;
            }


            // Make sure image has loaded

            const image =
                document.getElementById(
                    "receiptImage"
                );


            await waitForImage(
                image
            );


            window.print();

        }
    );

}


// =====================================================
// NEW ORDER
// =====================================================

const newOrderButton =
    document.getElementById(
        "newOrderBtn"
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
