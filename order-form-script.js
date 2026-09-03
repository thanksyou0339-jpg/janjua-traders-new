/* =========================================
   DIGITAL JANJUA TRADING
   ORDER FORM SCRIPT
========================================= */


document.addEventListener(
    "DOMContentLoaded",
    function(){

        /* =========================
           URL PARAMETERS
        ========================== */

        const params =
        new URLSearchParams(
            window.location.search
        );


        const productName =
        params.get("Product") ||
        "Product";


        const description =
        params.get("Product_Description") ||
        "";


        const price =
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
        "";



        /* =========================
           ELEMENTS
        ========================== */

        const productNameEl =
        document.getElementById(
            "productName"
        );


        const productPriceEl =
        document.getElementById(
            "productPrice"
        );


        const oldPriceEl =
        document.getElementById(
            "oldPrice"
        );


        const productImageEl =
        document.getElementById(
            "productImage"
        );



        /* =========================
           PRODUCT DISPLAY
        ========================== */

        if(productNameEl){

            productNameEl.textContent =
            productName;

        }


        if(productPriceEl){

            productPriceEl.textContent =
            rupees(price);

        }


        if(oldPriceEl){

            if(oldPrice > 0){

                oldPriceEl.textContent =
                "Old Price: " +
                rupees(oldPrice);

            }else{

                oldPriceEl.textContent =
                "";

            }

        }


        if(
            productImageEl &&
            productImage
        ){

            productImageEl.src =
            productImage;

        }



        /* =========================
           HIDDEN PRODUCT DATA
        ========================== */

        setValue(
            "formProduct",
            productName
        );


        setValue(
            "formDescription",
            description
        );


        setValue(
            "formProductPrice",
            price
        );


        setValue(
            "formOldPrice",
            oldPrice
        );


        setValue(
            "formProductId",
            productId
        );


        setValue(
            "formProductImage",
            productImage
        );


        /*
         * Delivery currently 0
         */

        const deliveryCharges =
        0;


        setValue(
            "formDeliveryPrice",
            deliveryCharges
        );


        setValue(
            "formUrl",
            window.location.href
        );



        /* =========================
           ORDER ID
        ========================== */

        const orderId =
        createOrderId();


        setValue(
            "orderId",
            orderId
        );


        setValue(
            "emailSubject",
            "New Janjua Traders Order - " +
            orderId
        );



        /* =========================
           INITIAL TOTAL
        ========================== */

        updateTotal(
            price,
            deliveryCharges
        );



        /* =========================
           QUANTITY
        ========================== */

        const quantityInput =
        document.getElementById(
            "quantity"
        );


        if(quantityInput){

            quantityInput.addEventListener(
                "change",
                function(){

                    updateTotal(
                        price,
                        deliveryCharges
                    );

                }
            );

        }



        /* =========================
           FORM SUBMIT
        ========================== */

        const orderForm =
        document.getElementById(
            "orderForm"
        );


        if(orderForm){

            orderForm.addEventListener(
                "submit",
                async function(event){

                    event.preventDefault();


                    const submitBtn =
                    document.getElementById(
                        "submitBtn"
                    );


                    const successMessage =
                    document.getElementById(
                        "successMessage"
                    );


                    const errorMessage =
                    document.getElementById(
                        "errorMessage"
                    );


                    if(successMessage){

                        successMessage.style.display =
                        "none";

                    }


                    if(errorMessage){

                        errorMessage.style.display =
                        "none";

                    }



                    /* =========================
                       CUSTOMER VALIDATION
                    ========================== */

                    const customerName =
                    document.getElementById(
                        "customerName"
                    );


                    const mobile =
                    document.getElementById(
                        "mobile"
                    );


                    const address =
                    document.getElementById(
                        "address"
                    );


                    if(

                        !customerName ||
                        !customerName.value.trim() ||

                        !mobile ||
                        !mobile.value.trim() ||

                        !address ||
                        !address.value.trim()

                    ){

                        if(errorMessage){

                            errorMessage.textContent =
                            "براہِ کرم نام، موبائل اور مکمل Delivery Address درج کریں۔";

                            errorMessage.style.display =
                            "block";

                        }

                        return;

                    }



                    /* =========================
                       UPDATE TOTAL
                    ========================== */

                    updateTotal(
                        price,
                        deliveryCharges
                    );



                    /* =========================
                       BUTTON
                    ========================== */

                    if(submitBtn){

                        submitBtn.disabled =
                        true;

                        submitBtn.textContent =
                        "Order Submit ہو رہا ہے...";

                    }



                    try{

                        /* =========================
                           FORM DATA
                        ========================== */

                        const formData =
                        new FormData(
                            orderForm
                        );



                        /* =========================
                           FORMSUBMIT
                        ========================== */

                        const response =
                        await fetch(

                            "https://formsubmit.co/ajax/thanksyou0339@gmail.com",

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
                        await response.json();



                        /* =========================
                           SUCCESS
                        ========================== */

                        if(response.ok){

                            if(successMessage){

                                successMessage.textContent =
                                "آپ کا Order کامیابی سے submit ہو گیا ہے۔ شکریہ!";

                                successMessage.style.display =
                                "block";

                            }


                            orderForm.reset();



                            /* =========================
                               RESTORE PRODUCT DATA
                            ========================== */

                            setValue(
                                "formProduct",
                                productName
                            );


                            setValue(
                                "formDescription",
                                description
                            );


                            setValue(
                                "formProductPrice",
                                price
                            );


                            setValue(
                                "formOldPrice",
                                oldPrice
                            );


                            setValue(
                                "formProductId",
                                productId
                            );


                            setValue(
                                "formProductImage",
                                productImage
                            );


                            setValue(
                                "formDeliveryPrice",
                                deliveryCharges
                            );


                            setValue(
                                "formUrl",
                                window.location.href
                            );



                            /* =========================
                               NEW ORDER ID
                            ========================== */

                            const newOrderId =
                            createOrderId();


                            setValue(
                                "orderId",
                                newOrderId
                            );


                            setValue(
                                "emailSubject",
                                "New Janjua Traders Order - " +
                                newOrderId
                            );


                            /* =========================
                               RESET QUANTITY
                            ========================== */

                            if(quantityInput){

                                quantityInput.value =
                                "1";

                            }


                            /* =========================
                               RESET TOTAL
                            ========================== */

                            updateTotal(
                                price,
                                deliveryCharges
                            );


                        }else{

                            throw new Error(
                                result.message ||
                                "FormSubmit error"
                            );

                        }


                    }catch(error){

                        console.error(
                            "ORDER ERROR:",
                            error
                        );


                        if(errorMessage){

                            errorMessage.textContent =
                            "Order submit نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔";

                            errorMessage.style.display =
                            "block";

                        }


                    }finally{

                        if(submitBtn){

                            submitBtn.disabled =
                            false;

                            submitBtn.textContent =
                            "ORDER CONFIRM کریں";

                        }

                    }

                }
            );

        }

    }
);


/* =========================================
   SET VALUE
========================================= */

function setValue(
    id,
    value
){

    const element =
    document.getElementById(id);


    if(element){

        element.value =
        value == null
        ? ""
        : value;

    }

}


/* =========================================
   RUPEES
========================================= */

function rupees(
    value
){

    return "Rs. " +
    Number(
        value || 0
    )
    .toLocaleString(
        "en-PK"
    );

}


/* =========================================
   ORDER ID
========================================= */

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

            hour12:
            false

        }

    ).formatToParts(
        now
    );


    function get(
        type
    ){

        const item =
        parts.find(
            p =>
            p.type === type
        );


        return item
        ? item.value
        : "00";

    }


    return (

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


/* =========================================
   UPDATE TOTAL
========================================= */

function updateTotal(
    price,
    deliveryCharges
){

    const quantityInput =
    document.getElementById(
        "quantity"
    );


    let quantity =
    1;


    if(quantityInput){

        quantity =
        parseInt(
            quantityInput.value,
            10
        ) || 1;


        if(quantity < 1){

            quantity =
            1;

        }


        if(quantity > 10){

            quantity =
            10;

        }


        quantityInput.value =
        String(quantity);

    }


    const productTotal =
    Number(price || 0) *
    quantity;


    const delivery =
    Number(
        deliveryCharges || 0
    );


    const total =
    productTotal +
    delivery;



    /* =========================
       VISIBLE TOTALS
    ========================== */

    const productTotalEl =
    document.getElementById(
        "visibleProductTotal"
    );


    const deliveryEl =
    document.getElementById(
        "visibleDelivery"
    );


    const visibleTotalEl =
    document.getElementById(
        "visibleTotal"
    );


    if(productTotalEl){

        productTotalEl.textContent =
        rupees(productTotal);

    }


    if(deliveryEl){

        deliveryEl.textContent =
        rupees(delivery);

    }


    if(visibleTotalEl){

        visibleTotalEl.textContent =
        rupees(total);

    }



    /* =========================
       HIDDEN TOTAL
    ========================== */

    setValue(
        "formTotalPrice",
        total
    );

}
