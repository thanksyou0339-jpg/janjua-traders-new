/* =========================================
   JANJUA DIGITAL MARKETING
   ORDER FORM SCRIPT
========================================= */


/* =========================
   URL PARAMETERS
========================= */

const params =
new URLSearchParams(
    window.location.search
);


const productName =
params.get("Product") ||
"Product";


const productDescription =
params.get("Product_Description") ||
"";


const productPrice =
Number(
    params.get("Product_Price") ||
    0
);


const oldPrice =
Number(
    params.get("Old_Price") ||
    0
);


const productId =
params.get("Product_ID") ||
"";


const productImage =
params.get("Product_Image") ||
"https://via.placeholder.com/500x500?text=Product";


const deliveryType =
params.get("Delivery_Type") ||
"free";


const deliveryCharges =
Number(
    params.get("Delivery_Charges") ||
    0
);


/* =========================
   ELEMENTS
========================= */

const orderForm =
document.getElementById(
    "orderForm"
);


const submitBtn =
document.getElementById(
    "submitBtn"
);


const quantityInput =
document.getElementById(
    "quantity"
);


const orderSection =
document.getElementById(
    "orderSection"
);


const receiptSection =
document.getElementById(
    "receiptSection"
);


const formMessage =
document.getElementById(
    "formMessage"
);


/* =========================
   RUPEES
========================= */

function rupees(value){

    return "Rs. " +
    Number(value || 0)
    .toLocaleString(
        "en-PK"
    );

}


/* =========================
   DATE
========================= */

function getPakistanDate(){

    return new Intl.DateTimeFormat(
        "en-PK",
        {
            timeZone:
                "Asia/Karachi",

            year:
                "numeric",

            month:
                "2-digit",

            day:
                "2-digit",

            hour:
                "2-digit",

            minute:
                "2-digit",

            second:
                "2-digit",

            hour12:
                true

        }
    )
    .format(
        new Date()
    );

}


/* =========================
   ORDER ID
========================= */

function createOrderId(){

    const now =
        new Date();


    const parts =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone:
                    "Asia/Karachi",

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hourCycle:
                    "h23"

            }
        )
        .formatToParts(now);


    const get =
        function(type){

            const item =
                parts.find(
                    function(p){

                        return(
                            p.type ===
                            type
                        );

                    }
                );


            return item
                ? item.value
                : "";

        };


    return(
        "JT-" +

        get("year") +

        get("month") +

        get("day") +

        "-" +

        get("hour") +

        get("minute") +

        get("second")

    );

}


/* =========================
   SET PRODUCT
========================= */

function setupProduct(){

    const image =
        document.getElementById(
            "productImage"
        );


    image.src =
        productImage;


    image.onerror =
        function(){

            this.src =
                "https://via.placeholder.com/500x500?text=Product";

        };


    document.getElementById(
        "productName"
    )
    .textContent =
        productName;


    document.getElementById(
        "productDescription"
    )
    .textContent =
        productDescription;


    document.getElementById(
        "productPrice"
    )
    .textContent =
        rupees(
            productPrice
        );


    const oldPriceElement =
        document.getElementById(
            "oldPrice"
        );


    if(oldPrice > 0){

        oldPriceElement.textContent =
            rupees(
                oldPrice
            );

        oldPriceElement.style.display =
            "inline";

    }else{

        oldPriceElement.style.display =
            "none";

    }


    const deliveryBadge =
        document.getElementById(
            "deliveryBadge"
        );


    const deliveryNote =
        document.getElementById(
            "deliveryNote"
        );


    if(
        deliveryType ===
        "paid"
    ){

        deliveryBadge.textContent =
            "🚚 Paid Delivery";


        deliveryNote.textContent =
            "Delivery Charges: " +
            rupees(
                deliveryCharges
            ) +
            " — آپ کا آرڈر 3 سے 4 دن کے اندر ڈیلیور کر دیا جائے گا۔";

    }else{

        deliveryBadge.textContent =
            "🚚 FREE DELIVERY";


        deliveryNote.textContent =
            "آپ کا آرڈر 3 سے 4 دن کے اندر آپ کو ڈیلیور کر دیا جائے گا۔";

    }


    /* =========================
       HIDDEN DATA
    ========================= */

    document.getElementById(
        "hiddenProduct"
    ).value =
        productName;


    document.getElementById(
        "hiddenDescription"
    ).value =
        productDescription;


    document.getElementById(
        "hiddenPrice"
    ).value =
        productPrice;


    document.getElementById(
        "hiddenOldPrice"
    ).value =
        oldPrice;


    /*
     * Product ID remains internal.
     * It is NOT displayed on receipt.
     */

    document.getElementById(
        "hiddenProductId"
    ).value =
        productId;


    document.getElementById(
        "hiddenProductImage"
    ).value =
        productImage;


    document.getElementById(
        "hiddenDeliveryStatus"
    ).value =
        deliveryType === "paid"
        ? "Paid Delivery"
        : "Free Delivery";


    document.getElementById(
        "hiddenDeliveryCharges"
    ).value =
        deliveryCharges;


    document.getElementById(
        "formUrl"
    ).value =
        window.location.href;

}


/* =========================
   TOTAL
========================= */

function calculateTotal(){

    const quantity =
        Math.max(
            1,
            Number(
                quantityInput.value ||
                1
            )
        );


    quantityInput.value =
        quantity;


    const productTotal =
        productPrice *
        quantity;


    const deliveryTotal =
        deliveryCharges;


    const total =
        productTotal +
        deliveryTotal;


    document.getElementById(
        "hiddenTotal"
    ).value =
        total;


    return{

        quantity:
            quantity,

        productTotal:
            productTotal,

        deliveryTotal:
            deliveryTotal,

        total:
            total

    };

}


/* =========================
   QUANTITY CHANGE
========================= */

if(quantityInput){

    quantityInput.addEventListener(
        "input",
        calculateTotal
    );

}


/* =========================
   SHOW MESSAGE
========================= */

function showFormError(
    text
){

    formMessage.textContent =
        text;

    formMessage.className =
        "message error";

}


/* =========================
   SUBMIT ORDER
========================= */

if(orderForm){

    orderForm.addEventListener(
        "submit",
        async function(event){

            event.preventDefault();


            const name =
                document.getElementById(
                    "customerName"
                )
                .value
                .trim();


            const mobile =
                document.getElementById(
                    "mobile"
                )
                .value
                .trim();


            const address =
                document.getElementById(
                    "address"
                )
                .value
                .trim();


            if(!name){

                showFormError(
                    "براہِ کرم اپنا نام درج کریں۔"
                );

                return;

            }


            if(!mobile){

                showFormError(
                    "براہِ کرم موبائل / WhatsApp نمبر درج کریں۔"
                );

                return;

            }


            if(!address){

                showFormError(
                    "براہِ کرم مکمل Delivery Address درج کریں۔"
                );

                return;

            }


            const totals =
                calculateTotal();


            const orderId =
                createOrderId();


            document.getElementById(
                "hiddenOrderId"
            ).value =
                orderId;


            submitBtn.disabled =
                true;

            submitBtn.textContent =
                "ORDER SUBMIT ہو رہا ہے...";


            try{

                const formData =
                    new FormData(
                        orderForm
                    );


                const response =
                    await fetch(
                        orderForm.action,
                        {
                            method:
                                "POST",

                            body:
                                formData,

                            headers:
                            {
                                Accept:
                                    "application/json"
                            }

                        }
                    );


                if(!response.ok){

                    throw new Error(
                        "Order submission failed."
                    );

                }


                /*
                 * Save order locally
                 * for this device.
                 */

                saveLocalOrder(
                    {
                        orderId:
                            orderId,

                        product:
                            productName,

                        image:
                            productImage,

                        customer:
                            name,

                        mobile:
                            mobile,

                        address:
                            address,

                        quantity:
                            totals.quantity,

                        price:
                            productPrice,

                        delivery:
                            totals.deliveryTotal,

                        total:
                            totals.total,

                        date:
                            getPakistanDate()

                    }
                );


                showReceipt(
                    {
                        orderId:
                            orderId,

                        customer:
                            name,

                        mobile:
                            mobile,

                        quantity:
                            totals.quantity,

                        productTotal:
                            totals.productTotal,

                        deliveryTotal:
                            totals.deliveryTotal,

                        total:
                            totals.total,

                        date:
                            getPakistanDate()

                    }
                );


            }catch(error){

                console.error(
                    "ORDER ERROR:",
                    error
                );


                showFormError(
                    "Order submit نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔"
                );


            }finally{

                submitBtn.disabled =
                    false;

                submitBtn.textContent =
                    "🛒 PLACE ORDER";

            }

        }
    );

}


/* =========================
   RECEIPT
========================= */

let lastReceipt =
null;


function showReceipt(
    data
){

    lastReceipt =
        data;


    const receiptImage =
        document.getElementById(
            "receiptImage"
        );


    receiptImage.src =
        productImage;


    receiptImage.onerror =
        function(){

            this.src =
                "https://via.placeholder.com/500x500?text=Product";

        };


    document.getElementById(
        "receiptProductName"
    ).textContent =
        productName;


    document.getElementById(
        "receiptDate"
    ).textContent =
        data.date;


    document.getElementById(
        "receiptOrderId"
    ).textContent =
        "Order ID: " +
        data.orderId;


    document.getElementById(
        "receiptCustomer"
    ).textContent =
        data.customer;


    document.getElementById(
        "receiptMobile"
    ).textContent =
        data.mobile;


    document.getElementById(
        "receiptQuantity"
    ).textContent =
        data.quantity;


    document.getElementById(
        "receiptPrice"
    ).textContent =
        rupees(
            data.productTotal
        );


    document.getElementById(
        "receiptDelivery"
    ).textContent =
        data.deliveryTotal > 0
        ?
        rupees(
            data.deliveryTotal
        )
        :
        "FREE";


    document.getElementById(
        "receiptTotal"
    ).textContent =
        rupees(
            data.total
        );


    /*
     * IMPORTANT:
     * No Product ID is added here.
     */


    orderSection.style.display =
        "none";


    receiptSection.style.display =
        "block";


    window.scrollTo(
        {
            top:0,
            behavior:"smooth"
        }
    );

}


/* =========================
   LOCAL STORAGE
========================= */

function saveLocalOrder(
    data
){

    try{

        const oldOrders =
            JSON.parse(
                localStorage.getItem(
                    "janjua_orders"
                ) ||
                "[]"
            );


        oldOrders.unshift(
            data
        );


        localStorage.setItem(
            "janjua_orders",
            JSON.stringify(
                oldOrders.slice(
                    0,
                    20
                )
            )
        );


    }catch(error){

        console.error(
            "LOCAL STORAGE ERROR:",
            error
        );

    }

}


/* =========================
   DOWNLOAD RECEIPT
========================= */

document.getElementById(
    "downloadReceiptBtn"
)
.addEventListener(
    "click",
    function(){

        if(!lastReceipt){

            return;

        }


        const receiptHtml = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>JANJUA Order Receipt</title>

<style>

body{
    font-family:Arial,sans-serif;
    background:#f3f5f8;
    padding:20px;
}

.receipt{
    max-width:650px;
    margin:auto;
    background:white;
    padding:25px;
    border:2px solid #111827;
    border-radius:15px;
}

.header{
    text-align:center;
    border-bottom:1px dashed #aaa;
    padding-bottom:15px;
}

.logo{
    font-size:35px;
    font-weight:bold;
    letter-spacing:5px;
}

.product{
    display:flex;
    gap:15px;
    align-items:center;
    padding:15px 0;
    border-bottom:1px dashed #ddd;
}

.product img{
    width:100px;
    height:100px;
    object-fit:cover;
    border-radius:10px;
}

.row{
    display:flex;
    justify-content:space-between;
    padding:9px 0;
    border-bottom:1px solid #eee;
}

.total{
    font-size:20px;
    font-weight:bold;
    border-top:2px solid #111827;
    margin-top:8px;
    padding-top:12px;
}

.delivery{
    margin-top:15px;
    padding:13px;
    background:#ecfdf5;
    color:#065f46;
    border-radius:9px;
    line-height:1.7;
    font-weight:bold;
}

</style>

</head>

<body>

<div class="receipt">

<div class="header">

<div class="logo">
JANJUA
</div>

<div>
DIGITAL MARKETING ONLINE SHOPPING PLATFORM
</div>

<div style="margin-top:8px;">
ORDER RECEIPT
</div>

</div>


<div class="product">

<img
src="${escapeAttribute(productImage)}"
alt="Product"
>

<div>

<strong>
${escapeHtml(productName)}
</strong>

<div style="margin-top:7px;">
${escapeHtml(lastReceipt.date)}
</div>

<div style="margin-top:5px;">
Order ID:
${escapeHtml(lastReceipt.orderId)}
</div>

</div>

</div>


<div class="row">

<span>
Customer Name
</span>

<strong>
${escapeHtml(lastReceipt.customer)}
</strong>

</div>


<div class="row">

<span>
Mobile / WhatsApp
</span>

<strong>
${escapeHtml(lastReceipt.mobile)}
</strong>

</div>


<div class="row">

<span>
Quantity
</span>

<strong>
${lastReceipt.quantity}
</strong>

</div>


<div class="row">

<span>
Product Price
</span>

<strong>
${rupees(lastReceipt.productTotal)}
</strong>

</div>


<div class="row">

<span>
Delivery Charges
</span>

<strong>
${
    lastReceipt.deliveryTotal > 0
    ?
    rupees(
        lastReceipt.deliveryTotal
    )
    :
    "FREE"
}
</strong>

</div>


<div class="row total">

<span>
Total Amount
</span>

<strong>
${rupees(lastReceipt.total)}
</strong>

</div>


<div class="delivery">

آپ کا آرڈر 3 سے 4 دن کے اندر آپ کو ڈیلیور کر دیا جائے گا۔

</div>


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


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "JANJUA-Order-Receipt-" +
            lastReceipt.orderId +
            ".html";


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


/* =========================
   SHARE
========================= */

document.getElementById(
    "shareReceiptBtn"
)
.addEventListener(
    "click",
    async function(){

        if(!lastReceipt){

            return;

        }


        const shareText =

`JANJUA ORDER RECEIPT

Product: ${productName}

Order ID: ${lastReceipt.orderId}

Customer: ${lastReceipt.customer}

Quantity: ${lastReceipt.quantity}

Product Price: ${rupees(lastReceipt.productTotal)}

Delivery: ${
    lastReceipt.deliveryTotal > 0
    ?
    rupees(lastReceipt.deliveryTotal)
    :
    "FREE"
}

Total Amount: ${rupees(lastReceipt.total)}

Delivery:
آپ کا آرڈر 3 سے 4 دن کے اندر آپ کو ڈیلیور کر دیا جائے گا۔

Thank you for shopping with JANJUA.`;



        try{

            if(
                navigator.share
            ){

                await navigator.share(
                    {
                        title:
                            "JANJUA Order Receipt",

                        text:
                            shareText
                    }
                );

            }else{

                await navigator.clipboard.writeText(
                    shareText
                );


                alert(
                    "Receipt text copy ہوگیا ہے۔"
                );

            }

        }catch(error){

            console.log(
                error
            );

        }

    }
);


/* =========================
   PRINT
========================= */

document.getElementById(
    "printReceiptBtn"
)
.addEventListener(
    "click",
    function(){

        window.print();

    }
);


/* =========================
   NEW ORDER
========================= */

document.getElementById(
    "newOrderBtn"
)
.addEventListener(
    "click",
    function(){

        window.location.href =
            "shop.html";

    }
);


/* =========================
   ESCAPE
========================= */

function escapeHtml(value){

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value){

    return escapeHtml(
        value
    );

}


/* =========================
   START
========================= */

setupProduct();

calculateTotal();
