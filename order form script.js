document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);

    const productName =
        params.get("Product") || "Product";

    const description =
        params.get("Product_Description") || "";

    const price =
        Number(params.get("Product_Price") || 0);

    const oldPrice =
        Number(params.get("Old_Price") || 0);

    const supplier =
        params.get("Supplier") || "";

    const productId =
        params.get("Product_ID") || "";

    const productLink =
        params.get("Product_Link") || "";

    const productImage =
        params.get("Product_Image") || "";


    // Product Display

    const productNameEl =
        document.getElementById("productName");

    const productPriceEl =
        document.getElementById("productPrice");

    const oldPriceEl =
        document.getElementById("oldPrice");

    const productImageEl =
        document.getElementById("productImage");


    if (productNameEl) {
        productNameEl.textContent = productName;
    }

    if (productPriceEl) {
        productPriceEl.textContent = rupees(price);
    }

    if (oldPriceEl) {

        if (oldPrice > 0) {
            oldPriceEl.textContent =
                "Old Price: " + rupees(oldPrice);
        } else {
            oldPriceEl.textContent = "";
        }
    }

    if (productImageEl && productImage) {
        productImageEl.src = productImage;
    }


    // Hidden Product Information

    setValue("formProduct", productName);
    setValue("formDescription", description);
    setValue("formProductPrice", price);
    setValue("formOldPrice", oldPrice);
    setValue("formSupplier", supplier);
    setValue("formProductId", productId);
    setValue("formProductLink", productLink);
    setValue("formProductImage", productImage);
    setValue("formDeliveryPrice", 0);
    setValue("formUrl", window.location.href);


    // Order ID

    const orderId = createOrderId();

    setValue("orderId", orderId);

    setValue(
        "emailSubject",
        "New Janjua Traders Order - " + orderId
    );


    // Total

    updateTotal(price);


    // Quantity Change

    const quantityInput =
        document.getElementById("quantity");

    if (quantityInput) {

        quantityInput.addEventListener(
            "input",
            function () {
                updateTotal(price);
            }
        );

    }


    // Form Submit

    const orderForm =
        document.getElementById("orderForm");

    if (orderForm) {

        orderForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const submitBtn =
                    document.getElementById("submitBtn");

                const successMessage =
                    document.getElementById(
                        "successMessage"
                    );

                const errorMessage =
                    document.getElementById(
                        "errorMessage"
                    );


                if (successMessage) {
                    successMessage.style.display =
                        "none";
                }

                if (errorMessage) {
                    errorMessage.style.display =
                        "none";
                }


                // Customer Fields

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


                if (
                    !customerName ||
                    !customerName.value.trim() ||
                    !mobile ||
                    !mobile.value.trim() ||
                    !address ||
                    !address.value.trim()
                ) {

                    if (errorMessage) {

                        errorMessage.textContent =
                            "براہِ کرم نام، موبائل اور مکمل Delivery Address درج کریں۔";

                        errorMessage.style.display =
                            "block";
                    }

                    return;
                }


                // Update Total

                updateTotal(price);


                // Disable Button

                if (submitBtn) {

                    submitBtn.disabled = true;

                    submitBtn.textContent =
                        "Order Submit ہو رہا ہے...";
                }


                try {

                    const formData =
                        new FormData(orderForm);


                    const response =
                        await fetch(
                            "https://formsubmit.co/ajax/thanksyou0339@gmail.com",
                            {
                                method: "POST",
                                body: formData,
                                headers: {
                                    "Accept":
                                        "application/json"
                                }
                            }
                        );


                    const result =
                        await response.json();


                    if (response.ok) {

                        if (successMessage) {

                            successMessage.textContent =
                                "آپ کا Order کامیابی سے submit ہو گیا ہے۔ شکریہ!";

                            successMessage.style.display =
                                "block";
                        }


                        // Reset Customer Form

                        orderForm.reset();


                        // Restore Product Information

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
                            "formSupplier",
                            supplier
                        );

                        setValue(
                            "formProductId",
                            productId
                        );

                        setValue(
                            "formProductLink",
                            productLink
                        );

                        setValue(
                            "formProductImage",
                            productImage
                        );

                        setValue(
                            "formDeliveryPrice",
                            0
                        );


                        // New Order ID

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


                        if (quantityInput) {
                            quantityInput.value = 1;
                        }


                        updateTotal(price);

                    } else {

                        throw new Error(
                            result.message ||
                            "FormSubmit error"
                        );

                    }

                } catch (error) {

                    console.error(
                        "ORDER ERROR:",
                        error
                    );


                    if (errorMessage) {

                        errorMessage.textContent =
                            "Order submit نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔";

                        errorMessage.style.display =
                            "block";
                    }

                } finally {

                    if (submitBtn) {

                        submitBtn.disabled = false;

                        submitBtn.textContent =
                            "ORDER CONFIRM کریں";
                    }

                }

            }
        );

    }

});


// Set Hidden/Input Value

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value =
            value == null ? "" : value;
    }
}


// Rupees Format

function rupees(value) {

    return "Rs. " +
        Number(value || 0)
            .toLocaleString("en-PK");
}


// Generate Order ID

function createOrderId() {

    const now = new Date();

    const parts =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: "Asia/Karachi",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }
        ).formatToParts(now);


    function get(type) {

        const item =
            parts.find(
                p => p.type === type
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


// Update Total Amount

function updateTotal(price) {

    const quantityInput =
        document.getElementById(
            "quantity"
        );


    let quantity = 1;


    if (quantityInput) {

        quantity =
            parseInt(
                quantityInput.value,
                10
            ) || 1;


        if (quantity < 1) {
            quantity = 1;
        }


        if (quantity > 10) {
            quantity = 10;
        }


        quantityInput.value =
            quantity;
    }


    const total =
        Number(price || 0) *
        quantity;


    const productTotal =
        document.getElementById(
            "visibleProductTotal"
        );


    const visibleTotal =
        document.getElementById(
            "visibleTotal"
        );


    if (productTotal) {

        productTotal.textContent =
            rupees(total);
    }


    if (visibleTotal) {

        visibleTotal.textContent =
            rupees(total);
    }


    setValue(
        "formTotalPrice",
        total
    );
}
