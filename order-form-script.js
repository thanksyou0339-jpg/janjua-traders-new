// =====================================================
// JANJUA TRADERS - ORDER FORM
// Firebase Free Version
// FormSubmit Gmail System
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );


const productImage =
    document.getElementById("productImage");

const productName =
    document.getElementById("productName");

const productDescription =
    document.getElementById("productDescription");

const productPrice =
    document.getElementById("productPrice");

const oldPrice =
    document.getElementById("oldPrice");

const deliveryBadge =
    document.getElementById("deliveryBadge");

const deliveryNote =
    document.getElementById("deliveryNote");

const orderForm =
    document.getElementById("orderForm");

const submitBtn =
    document.getElementById("submitBtn");


// =====================================================
// PRODUCT DATA FROM URL
// =====================================================

const product = {

    id:
        params.get("Product_ID") || "",

    name:
        params.get("Product") || "JANJUA Product",

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

    image:
        params.get("Product_Image") || "",

    category:
        params.get("Category") || "",

    deliveryType:
        params.get("Delivery_Type") ||
        "FREE",

    deliveryCharges:
        Number(
            params.get("Delivery_Charges") || 0
        )
};


// =====================================================
// FORMAT PRICE
// =====================================================

function formatPrice(value) {

    return (
        Number(value) || 0
    ).toLocaleString("en-PK");
}


// =====================================================
// SET TEXT SAFELY
// =====================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;
    }
}


// =====================================================
// SHOW PRODUCT
// =====================================================

function showProduct() {

    if (productImage) {

        productImage.src =
            product.image;

        productImage.alt =
            product.name;

        productImage.onerror =
            function () {

                this.src =
                    "https://via.placeholder.com/600x600.png?text=JANJUA";

            };
    }


    if (productName) {

        productName.textContent =
            product.name;
    }


    if (productDescription) {

        productDescription.textContent =
            product.description;
    }


    if (productPrice) {

        productPrice.textContent =
            "Rs. " +
            formatPrice(product.price);
    }


    if (oldPrice) {

        if (
            product.oldPrice >
            product.price
        ) {

            oldPrice.textContent =
                "Rs. " +
                formatPrice(
                    product.oldPrice
                );

            oldPrice.style.display =
                "inline";

        } else {

            oldPrice.style.display =
                "none";
        }
    }


    if (deliveryBadge) {

        if (
            product.deliveryType ===
                "FREE" ||
            product.deliveryCharges === 0
        ) {

            deliveryBadge.textContent =
                "🚚 FREE DELIVERY";

        } else {

            deliveryBadge.textContent =
                "🚚 Delivery Rs. " +
                formatPrice(
                    product.deliveryCharges
                );
        }
    }


    if (deliveryNote) {

        if (
            product.deliveryType ===
                "FREE" ||
            product.deliveryCharges === 0
        ) {

            deliveryNote.textContent =
                "Free Delivery Available";

        } else {

            deliveryNote.textContent =
                "Delivery Charges: Rs. " +
                formatPrice(
                    product.deliveryCharges
                );
        }
    }
}


// =====================================================
// HIDDEN FIELDS
// =====================================================

function setHiddenField(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value =
            value ?? "";
    }
}


// =====================================================
// ORDER ID
// =====================================================

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


// =====================================================
// INITIALIZE HIDDEN FIELDS
// =====================================================

function initializeForm() {

    const orderId =
        generateOrderId();


    setHiddenField(
        "hiddenOrderId",
        orderId
    );


    setHiddenField(
        "hiddenProduct",
        product.name
    );


    setHiddenField(
        "hiddenDescription",
        product.description
    );


    setHiddenField(
        "hiddenPrice",
        "Rs. " +
        formatPrice(
            product.price
        )
    );


    setHiddenField(
        "hiddenOldPrice",
        product.oldPrice > product.price
            ? "Rs. " +
              formatPrice(
                  product.oldPrice
              )
            : ""
    );


    setHiddenField(
        "hiddenProductId",
        product.id
    );


    setHiddenField(
        "hiddenProductImage",
        product.image
    );


    setHiddenField(
        "hiddenDeliveryStatus",
        product.deliveryType === "FREE" ||
        product.deliveryCharges === 0
            ? "FREE DELIVERY"
            : "PAID DELIVERY"
    );


    setHiddenField(
        "hiddenDeliveryCharges",
        "Rs. " +
        formatPrice(
            product.deliveryCharges
        )
    );


    // =================================================
    // CURRENT JANJUA PRODUCT LINK
    // =================================================

    setHiddenField(
        "formUrl",
        window.location.href
    );


    // =================================================
    // TOTAL CALCULATION
    // =================================================

    const quantity =
        document.getElementById(
            "quantity"
        );


    function updateTotal() {

        const qty =
            Number(
                quantity?.value || 1
            );


        const subtotal =
            product.price * qty;


        const delivery =
            product.deliveryCharges;


        const total =
            subtotal + delivery;


        setHiddenField(
            "hiddenTotal",
            "Rs. " +
            formatPrice(total)
        );
    }


    if (quantity) {

        quantity.addEventListener(
            "change",
            updateTotal
        );

        quantity.addEventListener(
            "input",
            updateTotal
        );
    }


    updateTotal();
}


// =====================================================
// CREATE EXTRA GMAIL FIELDS
// =====================================================

function createExtraField(
    name,
    value
) {

    let field =
        orderForm.querySelector(
            `input[name="${name}"]`
        );


    if (!field) {

        field =
            document.createElement(
                "input"
            );

        field.type =
            "hidden";

        field.name =
            name;

        orderForm.appendChild(
            field
        );
    }


    field.value =
        value ?? "";
}


// =====================================================
// FORM SUBMISSION
// =====================================================

if (orderForm) {

    orderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (submitBtn) {

                submitBtn.disabled =
                    true;

                submitBtn.textContent =
                    "ORDER PROCESSING...";
            }


            // =========================================
            // CUSTOMER DATA
            // =========================================

            const customerName =
                document.getElementById(
                    "customerName"
                )?.value || "";


            const mobile =
                document.getElementById(
                    "mobile"
                )?.value || "";


            const address =
                document.getElementById(
                    "address"
                )?.value || "";


            const quantity =
                Number(
                    document.getElementById(
                        "quantity"
                    )?.value || 1
                );


            const platform =
                document.getElementById(
                    "platform"
                )?.value || "";


            const color =
                document.getElementById(
                    "color"
                )?.value || "";


            const size =
                document.getElementById(
                    "size"
                )?.value || "";


            const orderId =
                document.getElementById(
                    "hiddenOrderId"
                )?.value ||
                generateOrderId();


            const subtotal =
                product.price *
                quantity;


            const delivery =
                product.deliveryCharges;


            const total =
                subtotal +
                delivery;


            // =========================================
            // EXTRA GMAIL INFORMATION
            // =========================================

            createExtraField(
                "Janjua_Product_Link",
                window.location.href
            );


            createExtraField(
                "Order_ID",
                orderId
            );


            createExtraField(
                "Product_ID",
                product.id
            );


            createExtraField(
                "Customer_Name",
                customerName
            );


            createExtraField(
                "Mobile_WhatsApp",
                mobile
            );


            createExtraField(
                "Delivery_Address",
                address
            );


            createExtraField(
                "Quantity",
                quantity
            );


            createExtraField(
                "Platform",
                platform
            );


            createExtraField(
                "Color",
                color
            );


            createExtraField(
                "Size",
                size
            );


            createExtraField(
                "Product_Price",
                "Rs. " +
                formatPrice(
                    product.price
                )
            );


            createExtraField(
                "Delivery_Charges",
                "Rs. " +
                formatPrice(
                    delivery
                )
            );


            createExtraField(
                "Total_Amount",
                "Rs. " +
                formatPrice(
                    total
                )
            );


            // =========================================
            // FORM DATA
            // =========================================

            const formData =
                new FormData(
                    orderForm
                );


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


                const result =
                    await response.json();


                if (
                    !response.ok ||
                    result.success === false
                ) {

                    throw new Error(
                        "Order submission failed"
                    );
                }


                showReceipt({

                    orderId,

                    customerName,

                    mobile,

                    address,

                    quantity,

                    platform,

                    color,

                    size,

                    subtotal,

                    delivery,

                    total

                });


                saveLastOrder({

                    orderId,

                    customerName,

                    mobile,

                    address,

                    quantity,

                    platform,

                    color,

                    size,

                    product,

                    subtotal,

                    delivery,

                    total

                });


            } catch (error) {

                console.error(
                    error
                );


                alert(
                    "❌ Order submit نہیں ہو سکا۔\n\nبراہِ کرم دوبارہ کوشش کریں۔"
                );


                if (submitBtn) {

                    submitBtn.disabled =
                        false;

                    submitBtn.textContent =
                        "PLACE ORDER";
                }
            }
        }
    );
}


// =====================================================
// RECEIPT
// =====================================================

function showReceipt(data) {

    const receiptSection =
        document.getElementById(
            "receiptSection"
        );


    if (!receiptSection) {
        return;
    }


    // =========================================
    // PRODUCT
    // =========================================

    setReceiptText(
        "receiptProductName",
        product.name
    );


    setReceiptText(
        "receiptDate",
        new Date().toLocaleString(
            "en-PK"
        )
    );


    setReceiptText(
        "receiptOrderId",
        data.orderId
    );


    setReceiptText(
        "receiptCustomer",
        data.customerName
    );


    setReceiptText(
        "receiptMobile",
        data.mobile
    );


    setReceiptText(
        "receiptQuantity",
        data.quantity
    );


    setReceiptText(
        "receiptPrice",
        "Rs. " +
        formatPrice(
            data.subtotal
        )
    );


    setReceiptText(
        "receiptDelivery",
        product.deliveryCharges === 0
            ? "FREE"
            : "Rs. " +
              formatPrice(
                  data.delivery
              )
    );


    setReceiptText(
        "receiptTotal",
        "Rs. " +
        formatPrice(
            data.total
        )
    );


    // =========================================
    // RECEIPT IMAGE
    // =========================================

    const receiptImage =
        document.getElementById(
            "receiptImage"
        );


    if (receiptImage) {

        receiptImage.src =
            product.image;

        receiptImage.alt =
            product.name;
    }


    // =========================================
    // DELIVERY MESSAGE
    // =========================================

    setReceiptText(
        "receiptDeliveryInstruction",
        "آپ کا آرڈر موصول ہو گیا ہے۔ ہماری ٹیم آپ سے رابطہ کرے گی۔"
    );


    // =========================================
    // HIDE FORM
    // =========================================

    orderForm.style.display =
        "none";


    receiptSection.style.display =
        "block";


    receiptSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// =====================================================
// RECEIPT TEXT
// =====================================================

function setReceiptText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value ?? "";
    }
}


// =====================================================
// SAVE LAST ORDER
// =====================================================

function saveLastOrder(data) {

    try {

        localStorage.setItem(
            "janjua_last_order",
            JSON.stringify(data)
        );

    } catch (error) {

        console.warn(
            "Could not save order locally",
            error
        );
    }
}


// =====================================================
// DOWNLOAD RECEIPT
// =====================================================

const downloadReceiptBtn =
    document.getElementById(
        "downloadReceiptBtn"
    );


if (downloadReceiptBtn) {

    downloadReceiptBtn.addEventListener(
        "click",
        () => {

            window.print();

        }
    );
}


// =====================================================
// SHARE RECEIPT
// =====================================================

const shareReceiptBtn =
    document.getElementById(
        "shareReceiptBtn"
    );


if (shareReceiptBtn) {

    shareReceiptBtn.addEventListener(
        "click",
        async () => {

            const orderId =
                document.getElementById(
                    "receiptOrderId"
                )?.textContent || "";


            const total =
                document.getElementById(
                    "receiptTotal"
                )?.textContent || "";


            const text =
                `JANJUA ORDER\n\n` +
                `Order ID: ${orderId}\n` +
                `Product: ${product.name}\n` +
                `Total: ${total}`;


            if (
                navigator.share
            ) {

                try {

                    await navigator.share({
                        title:
                            "JANJUA Order",
                        text
                    });

                } catch (error) {

                    console.log(
                        "Share cancelled"
                    );
                }

            } else {

                try {

                    await navigator.clipboard.writeText(
                        text
                    );

                    alert(
                        "Order information copy ہو گئی ہے۔"
                    );

                } catch (error) {

                    alert(
                        text
                    );
                }
            }
        }
    );
}


// =====================================================
// PRINT RECEIPT
// =====================================================

const printReceiptBtn =
    document.getElementById(
        "printReceiptBtn"
    );


if (printReceiptBtn) {

    printReceiptBtn.addEventListener(
        "click",
        () => {

            window.print();

        }
    );
}


// =====================================================
// NEW ORDER
// =====================================================

const newOrderBtn =
    document.getElementById(
        "newOrderBtn"
    );


if (newOrderBtn) {

    newOrderBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "shop.html";

        }
    );
}


// =====================================================
// START
// =====================================================

showProduct();

initializeForm();
