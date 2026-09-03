/* =========================================
   JANJUA TRADERS
   FIREBASE SHOP SCRIPT
========================================= */


/* =========================================
   FIREBASE IMPORT
========================================= */

import {
    initializeApp
}
from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";


import {
    getFirestore,
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================
   FIREBASE CONFIG
========================================= */

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


/* =========================================
   INITIALIZE FIREBASE
========================================= */

const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


/* =========================================
   ELEMENTS
========================================= */

const productGrid =
    document.getElementById(
        "productGrid"
    );


const searchBox =
    document.getElementById(
        "searchBox"
    );


const loadingMessage =
    document.getElementById(
        "loadingMessage"
    );


/* =========================================
   PRODUCTS ARRAY
========================================= */

let products = [];


/* =========================================
   RUPEES
========================================= */

function rupees(value) {

    return "Rs. " +
        Number(value || 0)
        .toLocaleString("en-PK");

}


/* =========================================
   LOAD PRODUCTS FROM FIREBASE
========================================= */

async function loadProducts() {

    try {

        if (loadingMessage) {

            loadingMessage.style.display =
                "block";

            loadingMessage.textContent =
                "Products loading...";

        }


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        products = [];


        snapshot.forEach(
            function (document) {

                const product =
                    document.data();


                products.push({

                    firestoreId:
                        document.id,

                    id:
                        product.id || document.id,

                    name:
                        product.name || "Product",

                    category:
                        product.category || "Other",

                    price:
                        Number(product.price || 0),

                    oldPrice:
                        Number(product.oldPrice || 0),

                    description:
                        product.description || "",

                    image:
                        product.image || "",

                    /*
                       یہ fields ابھی Admin
                       کے لیے محفوظ ہیں۔
                    */

                    supplier:
                        product.supplier || "",

                    supplierLink:
                        product.supplierLink || "",

                    socialLink:
                        product.socialLink || ""

                });

            }
        );


        if (loadingMessage) {

            loadingMessage.style.display =
                "none";

        }


        showProducts(products);

    }

    catch (error) {

        console.error(
            "FIREBASE PRODUCTS ERROR:",
            error
        );


        if (loadingMessage) {

            loadingMessage.style.display =
                "block";

            loadingMessage.textContent =
                "Products load نہیں ہو سکے۔ براہِ کرم دوبارہ کوشش کریں۔";

        }

    }

}


/* =========================================
   SHOW PRODUCTS
========================================= */

function showProducts(productList) {

    if (!productGrid) {
        return;
    }


    if (!productList.length) {

        productGrid.innerHTML = `

            <div
                style="
                grid-column:1/-1;
                text-align:center;
                padding:40px;
                "
            >

                <h3>
                    Product نہیں ملا
                </h3>

            </div>

        `;

        return;

    }


    productGrid.innerHTML =

        productList
        .map(function (product) {


            const image =
                product.image ||
                "https://via.placeholder.com/500x500?text=Product";


            return `

                <div class="product-card">


                    <img
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(product.name)}"
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/500x500?text=Product'"
                    >


                    <div class="product-info">


                        <h3>
                            ${escapeHtml(
                                product.name
                            )}
                        </h3>


                        <p>
                            ${escapeHtml(
                                product.description || ""
                            )}
                        </p>


                        <div class="price-row">


                            <strong>
                                ${rupees(
                                    product.price
                                )}
                            </strong>


                            ${
                                product.oldPrice > 0
                                ?
                                `
                                <del>
                                    ${rupees(
                                        product.oldPrice
                                    )}
                                </del>
                                `
                                :
                                ""
                            }


                        </div>


                        <button
                            class="order-btn"
                            type="button"
                            data-product-id="${escapeHtml(
                                product.id
                            )}"
                        >

                            ORDER NOW

                        </button>


                    </div>


                </div>

            `;

        })
        .join("");


    /* =====================================
       ORDER BUTTONS
    ===================================== */

    document
        .querySelectorAll(
            ".order-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const productId =
                            this.getAttribute(
                                "data-product-id"
                            );


                        orderProduct(
                            productId
                        );

                    }
                );

            }
        );

}


/* =========================================
   ORDER PRODUCT
========================================= */

function orderProduct(productId) {

    const product =
        products.find(
            function (p) {

                return String(p.id) ===
                       String(productId);

            }
        );


    if (!product) {

        alert(
            "Product نہیں ملا"
        );

        return;

    }


    /*
       Customer order page کو صرف
       ضروری product information بھیج رہے ہیں۔
    */

    const params =
        new URLSearchParams();


    params.set(
        "Product",
        product.name || ""
    );


    params.set(
        "Product_Description",
        product.description || ""
    );


    params.set(
        "Product_Price",
        product.price || 0
    );


    params.set(
        "Old_Price",
        product.oldPrice || ""
    );


    params.set(
        "Product_ID",
        product.id || ""
    );


    params.set(
        "Product_Image",
        product.image || ""
    );


    /*
       فی الحال Supplier information
       customer URL میں نہیں بھیجی جا رہی۔
    */


    window.location.href =
        "order-form.html?" +
        params.toString();

}


/* =========================================
   CATEGORY
========================================= */

window.showCategory =
    function (category) {


        if (
            !category ||
            category === "All"
        ) {

            showProducts(
                products
            );

            return;

        }


        const filtered =
            products.filter(
                function (product) {

                    return String(
                        product.category || ""
                    )
                    .toLowerCase() ===
                    String(
                        category
                    )
                    .toLowerCase();

                }
            );


        showProducts(
            filtered
        );

    };


/* =========================================
   SEARCH
========================================= */

if (searchBox) {

    searchBox.addEventListener(
        "input",
        function () {


            const text =
                this.value
                .trim()
                .toLowerCase();


            if (!text) {

                showProducts(
                    products
                );

                return;

            }


            const filtered =
                products.filter(
                    function (product) {


                        const name =
                            String(
                                product.name || ""
                            )
                            .toLowerCase();


                        const description =
                            String(
                                product.description || ""
                            )
                            .toLowerCase();


                        const category =
                            String(
                                product.category || ""
                            )
                            .toLowerCase();


                        return (

                            name.includes(text)

                            ||

                            description.includes(text)

                            ||

                            category.includes(text)

                        );

                    }
                );


            showProducts(
                filtered
            );

        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

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


/* =========================================
   START
========================================= */

loadProducts();
