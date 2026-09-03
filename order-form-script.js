/* =========================================
   JANJUA DIGITAL MARKETING
   ORDER FORM SCRIPT
========================================= */


/* =========================================
   GET URL PARAMETERS
========================================= */

const params =
    new URLSearchParams(
        window.location.search
    );


const productName =
    params.get("Product") || "Product";


const productDescription =
    params.get("Product_Description") || "";


const productPrice =
    Number(
        params.get("Product_Price") || 0
    );


const oldPrice =
    Number(
        params.get("Old_Price") || 0
    );


const productId =
    params.get("Product_ID") || "";


const productImage =
    params.get("Product_Image") || "";


const deliveryType =
    params.get("Delivery_Type") || "free";


const deliveryCharges =
    Number(
        params.get("Delivery_Charges") || 0
    );


/* =========================================
   ELEMENTS
========================================= */

const orderForm =
    document.getElementById(
        "orderForm"
    );


const quantityInput =
    document.getElementById(
        "quantity"
    );


const productNameElement =
    document.getElementById(
        "productName"
    );


const productDescriptionElement =
    document.getElementById(
        "productDescription"
    );


const productPriceElement =
    document.getElementById(
        "productPrice"
    );


const oldPriceElement =
    document.getElementById(
        "oldPrice"
    );


const productImageElement =
    document.getElementById(
        "productImage"
    );


const deliveryElement =
    document.getElementById(
        "delivery"
    );


const totalElement =
    document.getElementById(
        "total"
    );


/* =========================================
   HIDDEN FORM FIELDS
========================================= */

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


const hiddenOrderId =
    document.getElementById(
        "hiddenOrderId"
    );


const formUrl =
    document.getElementById(
        "formUrl"
    );


/* =========================================
   RUPEES
========================================= */

function rupees(value){

    return "Rs. " +
        Number(value || 0)
        .toLocaleString("en-PK");

}


/* =========================================
   DELIVERY TEXT
========================================= */

function getDeliveryText(){

    if(
        deliveryType.toLowerCase() ===
        "free"
    ){

        return "FREE DELIVERY";

    }


    if(
        deliveryCharges > 0
    ){

        return (
            "Delivery Charges: " +
            rupees(deliveryCharges)
        );

    }


    return "Delivery charges will be confirmed.";

}


/* =========================================
   TOTAL
========================================= */

function calculateTotal(){

    const quantity =
        Math.max(
            1,
            Number(
                quantityInput?.value || 1
            )
        );


    const productTotal =
        productPrice *
        quantity;


    const deliveryTotal =
        deliveryType.toLowerCase() ===
        "free"

        ?

        0

        :

        deliveryCharges;


    return (
        productTotal +
        deliveryTotal
    );

}


/* =========================================
   UPDATE TOTAL
========================================= */

function updateTotal(){

    const total =
        calculateTotal();


    if(totalElement){

        totalElement.textContent =
            rupees(total);

    }


    if(hiddenTotal){

        hiddenTotal.value =
            total;

    }

}


/* =========================================
   SHOW PRODUCT
========================================= */

function showProduct(){

    if(productNameElement){

        productNameElement.textContent =
            productName;

    }


    if(productDescriptionElement){

        productDescriptionElement.textContent =
            productDescription;

    }


    if(productPriceElement){

        productPriceElement.textContent =
            rupees(productPrice);

    }


    if(oldPriceElement){

        if(oldPrice > 0){

            oldPriceElement.textContent =
                rupees(oldPrice);

            oldPriceElement.style.display =
                "inline";

        }else{

            oldPriceElement.style.display =
                "none";

        }

    }


    if(productImageElement){

        productImageElement.src =
            productImage ||

            "https://via.placeholder.com/500x500?text=Product";


        productImageElement.onerror =
            function(){

                this.src =
                    "https://via.placeholder.com/500x500?text=Product";

            };

    }


    if(deliveryElement){

        deliveryElement.textContent =
            getDeliveryText();

    }


    /* =====================================
       HIDDEN FIELDS
    ===================================== */

    if(hiddenProduct){

        hiddenProduct.value =
            productName;

    }


    if(hiddenDescription){

        hiddenDescription.value =
            productDescription;

    }


    if(hiddenPrice){

        hiddenPrice.value =
            productPrice;

    }


    if(hiddenOldPrice){

        hiddenOldPrice.value =
            oldPrice;

    }


    if(hiddenProductId){

        hiddenProductId.value =
            productId;

    }


    if(hiddenProductImage){

        hiddenProductImage.value =
            productImage;

    }


    if(hiddenDeliveryStatus){

        hiddenDeliveryStatus.value =
            getDeliveryText();

    }


    if(hiddenDeliveryCharges){

        hiddenDeliveryCharges.value =
            deliveryType.toLowerCase() ===
            "free"

            ?

            0

            :

            deliveryCharges;

    }


    if(formUrl){

        formUrl.value =
            window.location.href;

    }


    updateTotal();

}


/* =========================================
   ORDER ID
========================================= */

function generateOrderId(){

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2,"0");


    const day =
        String(
            now.getDate()
        ).padStart(2,"0");


    const random =
        Math.floor(
            1000 +
            Math.random() *
            9000
        );


    return (
        "JT-" +
        year +
        month +
        day +
        "-" +
        random
    );

}


/* =========================================
   QUANTITY
========================================= */

if(quantityInput){

    quantityInput.addEventListener(
        "input",
        updateTotal
    );

}


/* =========================================
   LOCAL ORDER SAVE
========================================= */

function saveLocalOrder(
    order
){

    try{

        const orders =
            JSON.parse(
                localStorage.getItem(
                    "janjua_orders"
                ) || "[]"
            );


        orders.push(order);


        localStorage.setItem(
            "janjua_orders",
            JSON.stringify(
                orders
            )
        );

    }catch(error){

        console.error(
            "LOCAL ORDER SAVE ERROR:",
            error
        );

    }

}


/* =========================================
   RECEIPT
========================================= */

function showReceipt(
    order
){

    const receipt =
        document.getElementById(
            "receipt"
        );


    if(!receipt){

        return;

    }


    receipt.innerHTML = `

        <div
            class="receipt-card"
            id="printReceipt"
            style="
                background:#fff;
                padding:20px;
                border-radius:16px;
            "
        >

            <div
                style="
                    text-align:center;
                    margin-bottom:15px;
                "
            >

                <h2>
                    JANJUA
                </h2>

                <p>
                    Order Receipt
                </p>

            </div>


            <div
                style="
                    text-align:center;
                    margin-bottom:15px;
                "
            >

                <img
                    src="${escapeAttribute(
                        productImage ||
                        "https://via.placeholder.com/300x300?text=Product"
                    )}"
                    alt="Product"
                    style="
                        width:180px;
                        max-width:100%;
                        border-radius:12px;
                    "
                >

            </div>


            <h3 dir="auto">

                ${escapeHtml(
                    productName
                )}

            </h3>


            <p dir="auto">

                ${escapeHtml(
                    productDescription
                )}

            </p>


            <hr>


            <p>
                <b>Date:</b>
                ${escapeHtml(
                    order.date
                )}
            </p>


            <p>
                <b>Order ID:</b>
                ${escapeHtml(
                    order.orderId
                )}
            </p>


            <p>
                <b>Customer:</b>
                ${escapeHtml(
                    order.customerName
                )}
            </p>


            <p>
                <b>Mobile / WhatsApp:</b>
                ${escapeHtml(
                    order.mobile
                )}
            </p>


            <p>
                <b>Address:</b>
                ${escapeHtml(
                    order.address
                )}
            </p>


            <p>
                <b>Quantity:</b>
                ${escapeHtml(
                    order.quantity
                )}
            </p>


            ${
                order.color

                ?

                `
                <p>
                    <b>Color:</b>
                    ${escapeHtml(
                        order.color
                    )}
                </p>
                `

                :

                ""
            }


            ${
                order.size

                ?

                `
                <p>
                    <b>Size:</b>
                    ${escapeHtml(
                        order.size
                    )}
                </p>
                `

                :

                ""
            }


            <p>
                <b>Product Price:</b>
                ${rupees(
                    order.productPrice
                )}
            </p>


            <p>
                <b>Delivery:</b>
                ${escapeHtml(
                    order.delivery
                )}
            </p>


            <hr>


            <h3>

                Total:
                ${rupees(
                    order.total
                )}

            </h3>


            <div
                style="
                    margin-top:15px;
                    padding:12px;
                    background:#f3f4f6;
                    border-radius:10px;
                "
            >

                <b>
                    Delivery Instruction
                </b>

                <p>
                    آپ کا آرڈر 3 سے 4 دن کے اندر
                    آپ کو ڈیلیور کر دیا جائے گا۔
                </p>

            </div>


            <div
                style="
                    margin-top:12px;
                    padding:12px;
                    background:#f3f4f6;
                    border-radius:10px;
                "
            >

                <b>
                    Cash on Delivery
                </b>

                <p>
                    ادائیگی آرڈر کی ڈیلیوری کے وقت کی جائے گی۔
                </p>

            </div>


            <!--
                IMPORTANT:

                Product ID
                Supplier
                Markaz Link
                Daraz Link
                Supplier Link
                Social Link

                are intentionally NOT displayed
                on customer receipt.
            -->

        </div>


        <div
            style="
                display:flex;
                gap:8px;
                flex-wrap:wrap;
                margin-top:15px;
            "
        >

            <button
                type="button"
                id="downloadReceiptBtn"
            >
                Download
            </button>


            <button
                type="button"
                id="shareReceiptBtn"
            >
                Share
            </button>


            <button
                type="button"
                id="printReceiptBtn"
            >
                Print
            </button>

        </div>

    `;


    const downloadButton =
        document.getElementById(
            "downloadReceiptBtn"
        );


    const shareButton =
        document.getElementById(
            "shareReceiptBtn"
        );


    const printButton =
        document.getElementById(
            "printReceiptBtn"
        );


    if(printButton){

        printButton.addEventListener(
            "click",
            function(){

                printReceipt();

            }
        );

    }


    if(shareButton){

        shareButton.addEventListener(
            "click",
            function(){

                shareReceipt(
                    order
                );

            }
        );

    }


    if(downloadButton){

        downloadButton.addEventListener(
            "click",
            function(){

                downloadReceipt();

            }
        );

    }


    receipt.scrollIntoView({
        behavior:"smooth"
    });

}


/* =========================================
   PRINT
========================================= */

function printReceipt(){

    const receipt =
        document.getElementById(
            "printReceipt"
        );


    if(!receipt){

        return;

    }


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if(!printWindow){

        alert(
            "براہِ کرم Print کے لیے popup allow کریں۔"
        );

        return;

    }


    printWindow.document.write(`

        <html>

        <head>

            <title>
                JANJUA Order Receipt
            </title>

            <style>

                body{
                    font-family:Arial,sans-serif;
                    padding:20px;
                    color:#111;
                }

                img{
                    max-width:250px;
                }

            </style>

        </head>

        <body>

            ${receipt.innerHTML}

        </body>

        </html>

    `);


    printWindow.document.close();


    printWindow.focus();


    setTimeout(
        function(){

            printWindow.print();

            printWindow.close();

        },
        500
    );

}


/* =========================================
   DOWNLOAD
========================================= */

function downloadReceipt(){

    const receipt =
        document.getElementById(
            "printReceipt"
        );


    if(!receipt){

        return;

    }


    const html =
        `

        <html>

        <head>

            <meta charset="UTF-8">

            <title>
                JANJUA Order Receipt
            </title>

            <style>

                body{
                    font-family:Arial,sans-serif;
                    padding:20px;
                }

                img{
                    max-width:250px;
                }

            </style>

        </head>

        <body>

            ${receipt.innerHTML}

        </body>

        </html>

        `;


    const blob =
        new Blob(
            [html],
            {
                type:"text/html"
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


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


/* =========================================
   SHARE
========================================= */

async function shareReceipt(
    order
){

    const text =

        "JANJUA ORDER RECEIPT\n\n" +

        "Order ID: " +
        order.orderId +

        "\nCustomer: " +
        order.customerName +

        "\nProduct: " +
        productName +

        "\nQuantity: " +
        order.quantity +

        "\nTotal: " +
        rupees(order.total) +

        "\nDelivery: " +
        order.delivery +

        "\n\nآپ کا آرڈر 3 سے 4 دن کے اندر ڈیلیور کر دیا جائے گا۔";


    try{

        if(
            navigator.share
        ){

            await navigator.share({

                title:
                    "JANJUA Order Receipt",

                text:
                    text

            });

        }else{

            await navigator.clipboard.writeText(
                text
            );


            alert(
                "Receipt details copy ہو گئے ہیں۔"
            );

        }

    }catch(error){

        console.log(
            "Share cancelled"
        );

    }

}


/* =========================================
   SUBMIT ORDER
========================================= */

if(orderForm){

    orderForm.addEventListener(
        "submit",
        async function(event){

            event.preventDefault();


            const submitButton =
                orderForm.querySelector(
                    'button[type="submit"]'
                );


            if(submitButton){

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Submitting...";

            }


            try{

                const formData =
                    new FormData(
                        orderForm
                    );


                const orderId =
                    generateOrderId();


                if(hiddenOrderId){

                    hiddenOrderId.value =
                        orderId;

                }


                formData.set(
                    "Order_ID",
                    orderId
                );


                const quantity =
                    Math.max(
                        1,
                        Number(
                            formData.get(
                                "Quantity"
                            ) || 1
                        )
                    );


                const customerName =
                    formData.get(
                        "Customer_Name"
                    ) || "";


                const mobile =
                    formData.get(
                        "Mobile_WhatsApp"
                    ) || "";


                const address =
                    formData.get(
                        "Delivery_Address"
                    ) || "";


                const platform =
                    formData.get(
                        "Platform"
                    ) || "";


                const color =
                    formData.get(
                        "Color"
                    ) || "";


                const size =
                    formData.get(
                        "Size"
                    ) || "";


                const total =
                    calculateTotal();


                formData.set(
                    "Total_Amount",
                    total
                );


                formData.set(
                    "Delivery_Charges",
                    deliveryType.toLowerCase() ===
                    "free"

                    ?

                    0

                    :

                    deliveryCharges
                );


                /* =====================================
                   FORM SUBMIT
                   ONLY TO:
                   thanksyou0339@gmail.com
                ===================================== */

                const response =
                    await fetch(
                        orderForm.action,
                        {
                            method:"POST",

                            body:formData,

                            headers:{
                                Accept:
                                "application/json"
                            }
                        }
                    );


                const result =
                    await response.json();


                if(
                    !response.ok ||
                    result.success === false
                ){

                    throw new Error(
                        "Order submission failed"
                    );

                }


                const order = {

                    orderId:
                        orderId,

                    date:
                        new Date()
                        .toLocaleString(
                            "en-PK"
                        ),

                    customerName:
                        customerName,

                    mobile:
                        mobile,

                    address:
                        address,

                    platform:
                        platform,

                    color:
                        color,

                    size:
                        size,

                    quantity:
                        quantity,

                    product:
                        productName,

                    productPrice:
                        productPrice,

                    delivery:
                        getDeliveryText(),

                    deliveryCharges:
                        deliveryCharges,

                    total:
                        total

                };


                saveLocalOrder(
                    order
                );


                /* =================================
                   HIDE ORDER FORM
                ================================= */

                orderForm.style.display =
                    "none";


                /* =================================
                   SHOW RECEIPT
                ================================= */

                showReceipt(
                    order
                );


            }catch(error){

                console.error(
                    "ORDER ERROR:",
                    error
                );


                alert(
                    "آرڈر submit نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔"
                );


                if(submitButton){

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "PLACE ORDER";

                }

            }

        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value){

    return String(
        value ?? ""
    )

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


/* =========================================
   START
========================================= */

showProduct();
