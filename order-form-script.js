/* =========================================================
   JANJUA ORDER FORM
========================================================= */


/* =========================================================
   HELPERS
========================================================= */

function getParam(name) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get(name) || "";

}


function safeText(value) {

    return value === null ||
           value === undefined
        ? ""
        : String(value);

}


/* =========================================================
   PRODUCT DATA
========================================================= */

const product = getParam("Product");

const description =
    getParam("Product_Description");

const price =
    getParam("Product_Price");

const oldPrice =
    getParam("Old_Price");

const productId =
    getParam("Product_ID");

const productImage =
    getParam("Product_Image");

const category =
    getParam("Category");

const deliveryType =
    getParam("Delivery_Type");

const deliveryCharges =
    getParam("Delivery_Charges");


/* =========================================================
   NEW: ORIGINAL SUPPLIER LINK
========================================================= */

const supplierLink =
    getParam("Supplier_Link");


/* =========================================================
   ELEMENTS
========================================================= */

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

const orderForm =
    document.getElementById("orderForm");


/* =========================================================
   DISPLAY PRODUCT
========================================================= */

if (productImageEl) {

    productImageEl.src = productImage;

}


if (productNameEl) {

    productNameEl.textContent =
        product || "Product";

}


if (productDescriptionEl) {

    productDescriptionEl.textContent =
        description;

}


if (productPriceEl) {

    productPriceEl.textContent =
        price
            ? "Rs. " + price
            : "";

}


if (oldPriceEl) {

    oldPriceEl.textContent =
        oldPrice
            ? "Rs. " + oldPrice
            : "";

}


/* =========================================================
   DELIVERY
========================================================= */

let deliveryAmount = 0;

const parsedDelivery =
    parseFloat(
        String(deliveryCharges)
            .replace(/[^0-9.]/g, "")
    );


if (!isNaN(parsedDelivery)) {

    deliveryAmount = parsedDelivery;

}


if (deliveryBadgeEl) {

    if (deliveryType) {

        deliveryBadgeEl.textContent =
            deliveryType;

    } else {

        deliveryBadgeEl.style.display =
            "none";

    }

}


if (deliveryNoteEl) {

    if (deliveryCharges) {

        deliveryNoteEl.textContent =
            "Delivery Charges: Rs. " +
            deliveryCharges;

    } else {

        deliveryNoteEl.textContent =
            "";

    }

}


/* =========================================================
   JANJUA ORDER LINK
========================================================= */

const currentUrl =
    window.location.href;


const janjuaOrderLink =
    currentUrl;


/* =========================================================
   HIDDEN FIELDS
========================================================= */

const formUrl =
    document.getElementById("formUrl");

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

const hiddenJanjuaLink =
    document.getElementById("hiddenJanjuaLink");

const hiddenSupplierLink =
    document.getElementById("hiddenSupplierLink");


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


/* =========================================================
   NEW: JANJUA LINK TO GMAIL
========================================================= */

if (hiddenJanjuaLink) {

    hiddenJanjuaLink.value =
        janjuaOrderLink;

}


/* =========================================================
   NEW: ORIGINAL SUPPLIER LINK TO GMAIL
========================================================= */

if (hiddenSupplierLink) {

    hiddenSupplierLink.value =
        supplierLink;

}


/* =========================================================
   TOTAL CALCULATION
========================================================= */

function calculateTotal() {

    const quantityEl =
        document.getElementById("quantity");

    const quantity =
        parseInt(
            quantityEl
                ? quantityEl.value
                : "1",
            10
        ) || 1;


    const productAmount =
        parseFloat(
            String(price)
                .replace(/[^0-9.]/g, "")
        ) || 0;


    const total =
        (productAmount * quantity) +
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
   RECEIPT
========================================================= */

function showReceipt(orderData) {

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


    if (receiptImage) {

        receiptImage.src =
            orderData.productImage;

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
            behavior: "smooth",
            block: "start"
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


            const quantityEl =
                document.getElementById(
                    "quantity"
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
            } = calculateTotal();


            /* Basic validation */

            if (!customerName) {

                alert("براہ کرم نام درج کریں۔");
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


            /* Order ID */

            const orderId =
                generateOrderId();


            /* Hidden Order ID */

            const hiddenOrderId =
                document.getElementById(
                    "hiddenOrderId"
                );


            if (hiddenOrderId) {

                hiddenOrderId.value =
                    orderId;

            }


            /* Hidden Total */

            const hiddenTotal =
                document.getElementById(
                    "hiddenTotal"
                );


            if (hiddenTotal) {

                hiddenTotal.value =
                    total;

            }


            /* Re-confirm links */

            if (hiddenJanjuaLink) {

                hiddenJanjuaLink.value =
                    janjuaOrderLink;

            }


            if (hiddenSupplierLink) {

                hiddenSupplierLink.value =
                    supplierLink;

            }


            /* FormData */

            const formData =
                new FormData(
                    orderForm
                );


            /* Submit button */

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
                            method: "POST",
                            body: formData,
                            headers: {
                                "Accept":
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


                /* Show receipt */

                showReceipt(
                    orderData
                );


                /* Hide form */

                const formBox =
                    orderForm.closest(
                        ".form-box"
                    );


                if (formBox) {

                    formBox.style.display =
                        "none";

                }


            } catch (error) {

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


            const order =
                JSON.parse(
                    lastOrder
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
    max-width:100%;
    max-height:300px;
    object-fit:contain;
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
    src="${order.productImage || ""}"
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
                    [receiptHtml],
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


            a.href = url;

            a.download =
                "JANJUA-" +
                (order.orderId || "Receipt") +
                ".html";


            document.body.appendChild(a);

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

                return;

            }


            const order =
                JSON.parse(
                    lastOrder
                );


            const shareText =

                "JANJUA Order Receipt\n\n" +

                "Order ID: " +
                order.orderId +
                "\n" +

                "Product: " +
                order.product +
                "\n" +

                "Quantity: " +
                order.quantity +
                "\n" +

                "Total: Rs. " +
                order.total;


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

                } catch (error) {

                    console.log(
                        "Share cancelled"
                    );

                }

            } else {

                try {

                    await navigator.clipboard.writeText(
                        shareText
                    );

                    alert(
                        "Receipt details copy ہو گئے ہیں۔"
                    );

                } catch (error) {

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
