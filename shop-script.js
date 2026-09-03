// =====================================================
// JANJUA TRADERS - SHOP SCRIPT
// Firebase Free Version
// =====================================================

import { JANJUA_PRODUCTS } from "./products.js";


// =====================================================
// ELEMENTS
// =====================================================

const productGrid =
    document.getElementById("productGrid");

const loadingMessage =
    document.getElementById("loadingMessage");

const searchBox =
    document.getElementById("searchBox");

const categoryBar =
    document.getElementById("categoryBar");


// =====================================================
// PRODUCTS
// =====================================================

let products = Array.isArray(JANJUA_PRODUCTS)
    ? JANJUA_PRODUCTS
    : [];


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================================
// PRICE FORMAT
// =====================================================

function formatPrice(price) {

    const number =
        Number(price) || 0;

    return number.toLocaleString("en-PK");
}


// =====================================================
// CATEGORIES
// =====================================================

function createCategories() {

    const categories = [
        "All",
        ...new Set(
            products
                .map(product => product.category)
                .filter(Boolean)
        )
    ];

    categoryBar.innerHTML = "";

    categories.forEach(category => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "category-btn";

        if (category === "All") {
            button.classList.add("active");
        }

        button.dataset.category =
            category;

        button.textContent =
            category === "All"
                ? "✨ All"
                : category;

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".category-btn")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");

                renderProducts(
                    products,
                    category,
                    searchBox.value
                );
            }
        );

        categoryBar.appendChild(button);
    });
}


// =====================================================
// PRODUCT CARD
// =====================================================

function createProductCard(product) {

    const card =
        document.createElement("article");

    card.className =
        "product-card";


    const image =
        escapeHTML(product.image);


    const name =
        escapeHTML(product.name);


    const description =
        escapeHTML(product.description);


    const category =
        escapeHTML(product.category);


    const price =
        formatPrice(product.price);


    const oldPrice =
        formatPrice(product.oldPrice);


    let deliveryHTML = "";


    if (
        product.deliveryType === "FREE" ||
        Number(product.deliveryCharges) === 0
    ) {

        deliveryHTML = `
            <div class="delivery-badge">
                🚚 FREE DELIVERY
            </div>
        `;

    } else {

        deliveryHTML = `
            <div class="delivery-badge">
                🚚 Delivery Rs. ${formatPrice(
                    product.deliveryCharges
                )}
            </div>
        `;
    }


    card.innerHTML = `

        <div class="product-image-box">

            <img
                src="${image}"
                alt="${name}"
                loading="lazy"
                onerror="
                    this.src='https://via.placeholder.com/600x600.png?text=JANJUA';
                "
            >

        </div>


        <div class="product-info">

            ${
                category
                    ? `
                        <div class="product-category">
                            ${category}
                        </div>
                    `
                    : ""
            }


            <h3 class="product-name">
                ${name}
            </h3>


            ${
                description
                    ? `
                        <p class="product-description">
                            ${description}
                        </p>
                    `
                    : ""
            }


            <div class="price-area">

                <span class="current-price">
                    Rs. ${price}
                </span>

                ${
                    Number(product.oldPrice) > Number(product.price)
                        ? `
                            <span class="old-price">
                                Rs. ${oldPrice}
                            </span>
                        `
                        : ""
                }

            </div>


            ${deliveryHTML}


            <button
                type="button"
                class="order-btn"
                data-product-id="${escapeHTML(product.id)}"
            >
                ORDER NOW
            </button>

        </div>

    `;


    const orderButton =
        card.querySelector(".order-btn");


    orderButton.addEventListener(
        "click",
        () => {

            openOrderPage(product);

        }
    );


    return card;
}


// =====================================================
// OPEN ORDER PAGE
// =====================================================

function openOrderPage(product) {

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
        product.oldPrice || 0
    );


    params.set(
        "Product_ID",
        product.id || ""
    );


    params.set(
        "Product_Image",
        product.image || ""
    );


    params.set(
        "Category",
        product.category || ""
    );


    params.set(
        "Delivery_Type",
        product.deliveryType || "FREE"
    );


    params.set(
        "Delivery_Charges",
        product.deliveryCharges || 0
    );


    /*
        Supplier link intentionally customer page
        پر show نہیں کیا جا رہا۔

        اگر بعد میں Gmail میں supplier link شامل کرنا
        ہو تو الگ secure system بنایا جا سکتا ہے۔
    */


    window.location.href =
        "order-form.html?" +
        params.toString();
}


// =====================================================
// RENDER PRODUCTS
// =====================================================

function renderProducts(
    productList,
    selectedCategory = "All",
    searchText = ""
) {

    productGrid.innerHTML = "";


    const search =
        String(searchText || "")
            .trim()
            .toLowerCase();


    const filtered =
        productList.filter(product => {

            const categoryMatch =
                selectedCategory === "All" ||
                product.category === selectedCategory;


            const searchMatch =
                !search ||
                String(product.name || "")
                    .toLowerCase()
                    .includes(search) ||

                String(product.description || "")
                    .toLowerCase()
                    .includes(search) ||

                String(product.category || "")
                    .toLowerCase()
                    .includes(search);


            return (
                categoryMatch &&
                searchMatch
            );
        });


    if (filtered.length === 0) {

        productGrid.innerHTML = `

            <div class="no-products">

                <h3>
                    😔 Product نہیں ملی
                </h3>

                <p>
                    براہِ کرم دوبارہ Search کریں۔
                </p>

            </div>

        `;

        return;
    }


    filtered.forEach(product => {

        productGrid.appendChild(
            createProductCard(product)
        );

    });
}


// =====================================================
// SEARCH
// =====================================================

if (searchBox) {

    searchBox.addEventListener(
        "input",
        () => {

            const activeButton =
                document.querySelector(
                    ".category-btn.active"
                );


            const category =
                activeButton
                    ? activeButton.dataset.category
                    : "All";


            renderProducts(
                products,
                category,
                searchBox.value
            );

        }
    );
}


// =====================================================
// START SHOP
// =====================================================

function startShop() {

    if (loadingMessage) {

        loadingMessage.style.display =
            "none";
    }


    createCategories();

    renderProducts(
        products,
        "All",
        ""
    );
}


startShop();
