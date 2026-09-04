import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   FIREBASE
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyA8_4ArKXAdfKWZ5mi5DaT9qiayL3h_Yzw",
    authDomain: "janjua-traders.firebaseapp.com",
    projectId: "janjua-traders",
    storageBucket: "janjua-traders.firebasestorage.app",
    messagingSenderId: "154904774188",
    appId: "1:154904774188:web:1830f9d533e77dae6a7389"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* =========================================================
   ELEMENTS
========================================================= */

const productGrid = document.getElementById("productGrid");
const categoryBar = document.getElementById("categoryBar");
const searchInput = document.getElementById("searchInput");


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   URL ENCODE
========================================================= */

function enc(value) {
    return encodeURIComponent(
        value === null || value === undefined ? "" : String(value)
    );
}


/* =========================================================
   PRODUCTS
========================================================= */

let allProducts = [];
let activeCategory = "ALL";


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts() {

    try {

        const snapshot = await getDocs(
            collection(db, "products")
        );

        allProducts = [];

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            allProducts.push({
                firestoreId: docSnap.id,
                ...data
            });

        });


        /* Sort by Product ID */

        allProducts.sort((a, b) => {

            const aId = String(a.Product_ID || "");
            const bId = String(b.Product_ID || "");

            return aId.localeCompare(
                bId,
                undefined,
                {
                    numeric: true,
                    sensitivity: "base"
                }
            );

        });


        buildCategories();
        renderProducts(allProducts);

    } catch (error) {

        console.error("Products loading error:", error);

        if (productGrid) {

            productGrid.innerHTML = `
                <div style="
                    width:100%;
                    padding:30px 15px;
                    text-align:center;
                    color:#b00020;
                    font-weight:bold;
                ">
                    Products load نہیں ہو سکے۔
                </div>
            `;

        }

    }

}


/* =========================================================
   CATEGORIES
========================================================= */

function buildCategories() {

    if (!categoryBar) return;

    const categories = [];

    allProducts.forEach(product => {

        const category = String(
            product.Category || "Other"
        ).trim();

        if (
            category &&
            !categories.includes(category)
        ) {
            categories.push(category);
        }

    });


    categoryBar.innerHTML = "";


    /* ALL button */

    const allButton = document.createElement("button");

    allButton.type = "button";
    allButton.className = "category-btn active";
    allButton.textContent = "ALL";

    allButton.addEventListener("click", () => {

        activeCategory = "ALL";

        updateCategoryButtons();

        renderProducts(
            filteredProducts()
        );

    });

    categoryBar.appendChild(allButton);


    /* Category buttons */

    categories.forEach(category => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "category-btn";
        button.textContent = category;

        button.addEventListener("click", () => {

            activeCategory = category;

            updateCategoryButtons();

            renderProducts(
                filteredProducts()
            );

        });

        categoryBar.appendChild(button);

    });

}


/* =========================================================
   CATEGORY ACTIVE STATE
========================================================= */

function updateCategoryButtons() {

    if (!categoryBar) return;

    const buttons =
        categoryBar.querySelectorAll(".category-btn");

    buttons.forEach(button => {

        if (
            button.textContent.trim() === activeCategory
        ) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }

    });

}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function filteredProducts() {

    let products = [...allProducts];


    /* Category */

    if (activeCategory !== "ALL") {

        products = products.filter(product => {

            return String(
                product.Category || "Other"
            ).trim() === activeCategory;

        });

    }


    /* Search */

    const search = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";


    if (search) {

        products = products.filter(product => {

            const name =
                String(product.Product_Name || "")
                    .toLowerCase();

            const description =
                String(product.Description || "")
                    .toLowerCase();

            const category =
                String(product.Category || "")
                    .toLowerCase();

            const productId =
                String(product.Product_ID || "")
                    .toLowerCase();

            return (
                name.includes(search) ||
                description.includes(search) ||
                category.includes(search) ||
                productId.includes(search)
            );

        });

    }


    return products;

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(products) {

    if (!productGrid) return;

    productGrid.innerHTML = "";


    if (!products.length) {

        productGrid.innerHTML = `
            <div style="
                width:100%;
                padding:40px 15px;
                text-align:center;
                font-size:18px;
                font-weight:bold;
            ">
                کوئی Product نہیں ملا۔
            </div>
        `;

        return;

    }


    const fragment =
        document.createDocumentFragment();


    products.forEach(product => {

        const productId =
            product.Product_ID || "";

        const name =
            product.Product_Name || "Product";

        const description =
            product.Description || "";

        const price =
            product.Price || "";

        const oldPrice =
            product.Old_Price || "";

        const category =
            product.Category || "";

        const image =
            product.Image_URL ||
            product.Image ||
            "";

        const deliveryType =
            product.Delivery_Type || "";

        const deliveryCharges =
            product.Delivery_Charges || "";

        /*
         * ORIGINAL SUPPLIER LINK
         * Admin میں یہی field save ہوتی ہے۔
         */

        const supplierLink =
            product.Supplier_Link ||
            product.supplierLink ||
            product.Original_Supplier_Link ||
            "";


        /* =================================================
           JANJUA ORDER LINK
        ================================================= */

        const orderFormPath =
            window.location.pathname
                .replace(
                    /shop\.html$/i,
                    "order-form.html"
                );

        const janjuaOrderLink =
            window.location.origin +
            orderFormPath +
            "?Product_ID=" +
            enc(productId);


        /* =================================================
           FULL ORDER URL
        ================================================= */

        const orderUrl =
            window.location.origin +
            orderFormPath +
            "?Product=" + enc(name) +
            "&Product_Description=" + enc(description) +
            "&Product_Price=" + enc(price) +
            "&Old_Price=" + enc(oldPrice) +
            "&Product_ID=" + enc(productId) +
            "&Product_Image=" + enc(image) +
            "&Category=" + enc(category) +
            "&Delivery_Type=" + enc(deliveryType) +
            "&Delivery_Charges=" + enc(deliveryCharges) +

            /*
             * ORIGINAL SUPPLIER LINK
             * Gmail کے لیے آگے بھیجا جائے گا۔
             */

            "&Supplier_Link=" + enc(supplierLink);


        /* =================================================
           CARD
        ================================================= */

        const card =
            document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image-wrap">

                <img
                    src="${escapeHtml(image)}"
                    alt="${escapeHtml(name)}"
                    loading="lazy"
                    decoding="async"
                    width="500"
                    height="500"
                >

            </div>


            <div class="product-info">

                <div class="product-category">
                    ${escapeHtml(category)}
                </div>


                <h3 class="product-name">
                    ${escapeHtml(name)}
                </h3>


                ${
                    description
                    ? `
                        <p class="product-description">
                            ${escapeHtml(description)}
                        </p>
                      `
                    : ""
                }


                <div class="product-price-row">

                    <span class="product-price">
                        Rs. ${escapeHtml(price)}
                    </span>


                    ${
                        oldPrice
                        ? `
                            <span class="product-old-price">
                                Rs. ${escapeHtml(oldPrice)}
                            </span>
                          `
                        : ""
                    }

                </div>


                ${
                    deliveryType
                    ? `
                        <div class="delivery-info">
                            ${escapeHtml(deliveryType)}
                            ${
                                deliveryCharges
                                ? `
                                    — Rs. ${escapeHtml(
                                        deliveryCharges
                                    )}
                                  `
                                : ""
                            }
                        </div>
                      `
                    : ""
                }


                <a
                    class="order-btn"
                    href="${escapeHtml(orderUrl)}"
                >
                    ORDER NOW
                </a>

            </div>

        `;


        fragment.appendChild(card);

    });


    productGrid.appendChild(fragment);

}


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            renderProducts(
                filteredProducts()
            );

        }
    );

}


/* =========================================================
   START
========================================================= */

loadProducts();
