/* =====================================================
   JANJUA ORDER FORM
===================================================== */

const params =
    new URLSearchParams(
        window.location.search
    );


/* =====================================================
   GET PRODUCT DATA
===================================================== */

const product = {

    name:
        params.get("Product") ||
        "Product",

    description:
        params.get(
            "Product_Description"
        ) ||
        "",

    price:
        Number(
            params.get(
                "Product_Price"
            ) || 0
        ),

    oldPrice:
        Number(
            params.get(
                "Old_Price"
            ) || 0
        ),

    productId:
        params.get(
            "Product_ID"
        ) ||
        "",

    image:
        params.get(
            "Product_Image"
        ) ||
        "",

    deliveryType:
        params.get(
            "Delivery_Type"
        ) ||
        "Free Delivery",

    deliveryCharges:
        Number(
            params.get(
                "Delivery_Charges"
            ) || 0
        )

};


/* =====================================================
   DOM
===================================================== */

const productImage =
    document.getElementById(
        "productImage"
    );

const productName =
    document.getElementById(
        "productName"
    );

const productDescription =
    document.getElementById(
        "productDescription"
    );

const productPrice =
    document.getElementById(
        "productPrice"
    );

const oldPrice =
    document.getElementById(
        "oldPrice"
    );

const deliveryBadge =
    document.getElementById(
        "deliveryBadge"
    );

const deliveryNote =
    document.getElementById(
        "deliveryNote"
    );

const orderForm =
    document.getElementById(
        "orderForm"
    );

const submitBtn =
    document.getElementById(
        "submitBtn"
    );

const quantity =
    document.getElementById(
        "quantity"
    );

const formMessage =
    document.getElementById(
        "formMessage"
    );


/* =====================================================
   SHOW PRODUCT
===================================================== */

productImage.src =
    product.image;


productImage.alt =
    product.name;


productName.textContent =
    product.name;


productDescription.textContent =
    product.description;


productPrice.textContent =
    "Rs. " +
    product.price.toLocaleString();


if(
    product.oldPrice > product.price
){

    oldPrice.textContent =
        "Rs. " +
        product.oldPrice.toLocaleString();

}
else{

    oldPrice.textContent =
        "";

}


if(
    product.deliveryType ===
    "Free Delivery"
){

    deliveryBadge.textContent =
        "🚚 Free Delivery";

    deliveryNote.textContent =
        "Delivery charges: Rs. 0";

}
else{

    deliveryBadge.textContent =
        "🚚 Paid Delivery";

    deliveryNote.textContent =
        "Delivery charges: Rs. " +
        product.deliveryCharges.toLocaleString();

}


/* =====================================================
   TOTAL CALCULATION
===================================================== */

function calculateTotal(){

    const qty =
        Number(
            quantity.value || 1
        );

    const delivery =
        product.deliveryType ===
        "Free Delivery"
        ?
        0
        :
        product.deliveryCharges;


    return (
        product.price * qty
        +
        delivery
    );

}


/* =====================================================
   ORDER ID
===================================================== */

function generateOrderId(){

    const now =
        new Date();


    const date =
        now.getFullYear() +
        String(
            now.getMonth()+1
        ).padStart(2,"0") +
        String(
            now.getDate()
        ).padStart(2,"0");


    const time =
        String(
            now.getHours()
        ).padStart(2,"0") +
        String(
            now.getMinutes()
        ).padStart(2,"0") +
        String(
            now.getSeconds()
        ).padStart(2,"0");


    return (
        "JT-" +
        date +
        "-" +
        time
    );

}


/* =====================================================
   FORM MESSAGE
===================================================== */

function showMessage(
    text,
    type
){

    formMessage.textContent =
        text;

    formMessage.className =
        "message show " +
        type;

}


/* =====================================================
   SUBMIT
===================================================== */

orderForm.addEventListener(
    "submit",
    async(event)=>{

        event.preventDefault();


        const customerName =
            document
                .getElementById(
                    "customerName"
                )
                .value
                .trim();


        const mobile =
            document
                .getElementById(
                    "mobile"
                )
                .value
                .trim();


        const address =
            document
                .getElementById(
                    "address"
                )
                .value
                .trim();


        if(
            !customerName ||
            !mobile ||
            !address
        ){

            showMessage(
                "براہِ کرم Name، Mobile اور Address مکمل کریں۔",
                "error"
            );

            return;

        }


        const orderId =
            generateOrderId();


        const qty =
            Number(
                quantity.value || 1
            );


        const delivery =
            product.deliveryType ===
            "Free Delivery"
            ?
            0
            :
            product.deliveryCharges;


        const total =
            calculateTotal();


        /* =================================================
           HIDDEN FIELDS
        ================================================= */

        document.getElementById(
            "hiddenOrderId"
        ).value =
            orderId;


        document.getElementById(
            "hiddenProduct"
        ).value =
            product.name;


        document.getElementById(
            "hiddenDescription"
        ).value =
            product.description;


        document.getElementById(
            "hiddenPrice"
        ).value =
            "Rs. " +
            product.price;


        document.getElementById(
            "hiddenOldPrice"
        ).value =
            "Rs. " +
            product.oldPrice;


        document.getElementById(
            "hiddenProductId"
        ).value =
            product.productId;


        document.getElementById(
            "hiddenProductImage"
        ).value =
            product.image;


        document.getElementById(
            "hiddenDeliveryStatus"
        ).value =
            product.deliveryType;


        document.getElementById(
            "hiddenDeliveryCharges"
        ).value =
            "Rs. " +
            delivery;


        document.getElementById(
            "hiddenTotal"
        ).value =
            "Rs. " +
            total;


        document.getElementById(
            "formUrl"
        ).value =
            window.location.href;


        /* =================================================
           SEND
        ================================================= */

        submitBtn.disabled =
            true;

        submitBtn.textContent =
            "ORDER SENDING...";


        try{

            const formData =
                new FormData(
                    orderForm
                );


            const response =
                await fetch(
                    orderForm.action,
                    {
                        method:"POST",
                        body:formData,
                        headers:{
                            "Accept":
                                "application/json"
                        }
                    }
                );


            const result =
                await response.json()
                    .catch(
                        ()=>({})
                    );


            if(
                !response.ok
            ){

                throw new Error(
                    result.message ||
                    "Order submission failed."
                );

            }


            /* =================================================
               SAVE LAST ORDER
            ================================================= */

            const orderData = {

                orderId,

                date:
                    new Date()
                        .toLocaleString(
                            "en-PK"
                        ),

                productName:
                    product.name,

                productImage:
                    product.image,

                customerName,

                mobile,

                quantity:
                    qty,

                price:
                    product.price,

                delivery,

                total,

                productId:
                    product.productId

            };


            localStorage.setItem(
                "janjua_last_order",
                JSON.stringify(
                    orderData
                )
            );


            showReceipt(
                orderData
            );


        }
        catch(error){

            console.error(
                error
            );


            showMessage(
                "Order send نہیں ہو سکا۔ Internet اور Gmail/FormSubmit connection چیک کریں۔",
                "error"
            );

        }
        finally{

            submitBtn.disabled =
                false;

            submitBtn.textContent =
                "PLACE ORDER";

        }

    }
);


/* =====================================================
   RECEIPT
===================================================== */

function showReceipt(order){

    document.getElementById(
        "receiptImage"
    ).src =
        order.productImage;


    document.getElementById(
        "receiptProductName"
    ).textContent =
        order.productName;


    document.getElementById(
        "receiptDate"
    ).textContent =
        "Date: " +
        order.date;


    document.getElementById(
        "receiptOrderId"
    ).textContent =
        "TRACKING / ORDER ID: " +
        order.orderId;


    document.getElementById(
        "receiptCustomer"
    ).textContent =
        order.customerName;


    document.getElementById(
        "receiptMobile"
    ).textContent =
        order.mobile;


    document.getElementById(
        "receiptQuantity"
    ).textContent =
        order.quantity;


    document.getElementById(
        "receiptPrice"
    ).textContent =
        "Rs. " +
        order.price.toLocaleString();


    document.getElementById(
        "receiptDelivery"
    ).textContent =
        order.delivery === 0
        ?
        "Free Delivery"
        :
        "Rs. " +
        order.delivery.toLocaleString();


    document.getElementById(
        "receiptTotal"
    ).textContent =
        "Rs. " +
        order.total.toLocaleString();


    document.getElementById(
        "receiptDeliveryInstruction"
    ).textContent =
        "آپ کا آرڈر موصول ہو گیا ہے۔ " +
        "براہِ کرم اپنا Tracking / Order ID محفوظ رکھیں: " +
        order.orderId;


    document.getElementById(
        "receiptSection"
    ).style.display =
        "block";


    document.getElementById(
        "orderCard"
    ).style.display =
        "none";


    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}


/* =====================================================
   DOWNLOAD RECEIPT
===================================================== */

document.getElementById(
    "downloadReceiptBtn"
).addEventListener(
    "click",
    ()=>{

        const receipt =
            document.getElementById(
                "receiptSection"
            );


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
                padding:30px;
                color:#111;
            }

            h1{
                text-align:center;
            }

            .tracking{
                text-align:center;
                padding:12px;
                background:#eee;
                margin:20px 0;
                font-weight:bold;
            }

            img{
                width:100px;
                height:100px;
                object-fit:cover;
            }

            table{
                width:100%;
                border-collapse:collapse;
            }

            td{
                border-bottom:1px solid #ddd;
                padding:10px;
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
                    type:
                        "text/html;charset=utf-8"
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


        link.click();


        URL.revokeObjectURL(
            url
        );

    }
);


/* =====================================================
   SHARE
===================================================== */

document.getElementById(
    "shareReceiptBtn"
).addEventListener(
    "click",
    async()=>{

        const orderId =
            document.getElementById(
                "receiptOrderId"
            ).textContent;


        const name =
            document.getElementById(
                "receiptProductName"
            ).textContent;


        const total =
            document.getElementById(
                "receiptTotal"
            ).textContent;


        const text =
            "JANJUA Order Receipt\n\n" +
            name +
            "\n" +
            orderId +
            "\n" +
            "Total: " +
            total;


        if(
            navigator.share
        ){

            try{

                await navigator.share({

                    title:
                        "JANJUA Order Receipt",

                    text

                });

            }
            catch(error){

                console.log(
                    error
                );

            }

        }
        else{

            try{

                await navigator.clipboard.writeText(
                    text
                );

                alert(
                    "Receipt details copy ہو گئے ہیں۔"
                );

            }
            catch(error){

                alert(
                    text
                );

            }

        }

    }
);


/* =====================================================
   PRINT / PDF
===================================================== */

document.getElementById(
    "printReceiptBtn"
).addEventListener(
    "click",
    ()=>{

        window.print();

    }
);


/* =====================================================
   NEW ORDER
===================================================== */

document.getElementById(
    "newOrderBtn"
).addEventListener(
    "click",
    ()=>{

        window.location.href =
            "shop.html";

    }
);
