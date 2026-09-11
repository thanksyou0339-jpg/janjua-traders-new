/* =========================================================
   JANJUA TRADERS — WEBSITE SHOP SCRIPT
   Firebase + Products + Categories + Featured Slider
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyC8_4ArKXAdfKWZ5mi5DaT9qiayL3h_Yzw",

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


/* =========================================================
   FIREBASE
========================================================= */

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


/* =========================================================
   DOM
========================================================= */

const pageStatus =
    document.getElementById(
        "pageStatus"
    );

const slider =
    document.getElementById(
        "slider"
    );

const sliderTrack =
    document.getElementById(
        "sliderTrack"
    );

const sliderLoading =
    document.getElementById(
        "sliderLoading"
    );

const productsGrid =
    document.getElementById(
        "productsGrid"
    );

const productsLoading =
    document.getElementById(
        "productsLoading"
    );

const productCount =
    document.getElementById(
        "productCount"
    );

const productListDropdown =
    document.getElementById(
        "productListDropdown"
    );

const productListToggle =
    document.getElementById(
        "productListToggle"
    );

const productListMenu =
    document.getElementById(
        "productListMenu"
    );


/* =========================================================
   DATA
========================================================= */

let allProducts = [];

let allCategories = [];

let currentCategory = "All";

let sliderAnimationFrame = null;

let sliderPosition = 0;

let sliderPaused = false;

let sliderCardWidth = 0;

let sliderOriginalCount = 0;


/* =========================================================
   STATUS
========================================================= */

function showStatus(
    message,
    type = "info"
) {

    if (!pageStatus) {
        return;
    }

    pageStatus.textContent =
        message;

    pageStatus.className =
        "status show " + type;

}


function hideStatus() {

    if (!pageStatus) {
        return;
    }

    pageStatus.textContent = "";

    pageStatus.className =
        "status";

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
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


/* =========================================================
   IMAGE
========================================================= */

function optimizeImage(url) {

    if (!url) {
        return "";
    }

    url =
        String(url).trim();

    if (
        url.includes(
            "res.cloudinary.com"
        ) &&
        url.includes(
            "/image/upload/"
        )
    ) {

        if (
            !url.includes(
                "f_auto"
            )
        ) {

            return url.replace(
                "/image/upload/",
                "/image/upload/f_auto,q_auto,w_600/"
            );

        }

    }

    return url;

}


function getImage(product) {

    return (

        product.Product_Image ||

        product.product_Image ||

        product.Image_URL ||

        product.imageUrl ||

        product.image ||

        product.Image ||

        ""

    );

}


/* =========================================================
   PRODUCT FIELDS
========================================================= */

function getProductId(product) {

    return String(

        product.Product_ID ||

        product.productId ||

        product.product_id ||

        product.id ||

        ""

    ).trim();

}


function getProductName(product) {

    return String(

        product.Product_Name ||

        product.Product ||

        product.productName ||

        product.name ||

        product.title ||

        "Product"

    ).trim();

}


function getDescription(product) {

    return String(

        product.Product_Description ||

        product.productDescription ||

        product.Description ||

        product.description ||

        ""

    ).trim();

}


function getPrice(product) {

    const value =

        product.Product_Price ??
        product.Price ??
        product.price ??
        0;

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;

}


function getOldPrice(product) {

    const value =

        product.Old_Price ??
        product.oldPrice ??
        product.OldPrice ??
        0;

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;

}


function getCategory(product) {

    return String(

        product.Category ||

        product.category ||

        "All"

    ).trim() || "All";

}


function getDeliveryCharges(product) {

    const value =

        product.Delivery_Charges ??
        product.deliveryCharges ??
        0;

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;

}


function getDeliveryType(product) {

    return String(

        product.Delivery_Type ||

        product.deliveryType ||

        "Free Delivery"

    ).trim();

}


function getSupplierLink(product) {

    return String(

        product.supplierLink ||

        product.Supplier_Link ||

        product.Original_Supplier_Link ||

        product.originalSupplierLink ||

        ""

    ).trim();

}


/* =========================================================
   NORMALIZE PRODUCT
========================================================= */

function normalizeProduct(
    raw,
    docId
) {

    const product = {

        docId,

        raw,

        Product_ID:
            getProductId(raw),

        Product_Name:
            getProductName(raw),

        Product_Description:
            getDescription(raw),

        Product_Price:
            getPrice(raw),

        Old_Price:
            getOldPrice(raw),

        Category:
            getCategory(raw),

        Product_Image:
            getImage(raw),

        Delivery_Type:
            getDeliveryType(raw),

        Delivery_Charges:
            getDeliveryCharges(raw),

        supplierLink:
            getSupplierLink(raw),

        Janjua_Link:
            String(
                raw.Janjua_Link || ""
            ).trim()

    };


    product.Image =
        optimizeImage(
            product.Product_Image
        );


    return product;

}


/* =========================================================
   PRODUCT SORT
========================================================= */

function productNumber(id) {

    const match =
        String(id).match(
            /(\d+)$/
        );

    if (match) {

        return Number(
            match[1]
        );

    }

    return 999999999;

}


/* =========================================================
   CATEGORY NAME
========================================================= */

function getCategoryName(raw) {

    return String(

        raw.name ||

        raw.Name ||

        raw.category ||

        raw.Category ||

        ""

    ).trim();

}


/* =========================================================
   BUILD CATEGORIES FROM PRODUCTS
========================================================= */

function buildCategoriesFromProducts() {

    const categoryMap =
        new Map();


    allProducts.forEach(
        product => {

            const name =
                getCategory(
                    product
                );


            if (!name) {
                return;
            }


            if (
                name.toLowerCase() ===
                "all"
            ) {

                return;

            }


            const key =
                name.toLowerCase();


            if (
                !categoryMap.has(key)
            ) {

                categoryMap.set(
                    key,
                    name
                );

            }

        }
    );


    allCategories =
        Array.from(
            categoryMap.values()
        ).sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    undefined,
                    {
                        sensitivity:
                            "base"
                    }
                )
        );

}


/* =========================================================
   RENDER PRODUCT LIST
========================================================= */

function renderProductList() {

    if (!productListMenu) {
        return;
    }


    let html = `

        <button
            type="button"
            class="product-list-item ${
                currentCategory === "All"
                    ? "active"
                    : ""
            }"
            data-category="All"
        >
            🛍 All Products
        </button>

    `;


    allCategories.forEach(
        category => {

            const isActive =

                currentCategory
                    .toLowerCase() ===
                category
                    .toLowerCase();


            html += `

                <button
                    type="button"
                    class="product-list-item ${
                        isActive
                            ? "active"
                            : ""
                    }"
                    data-category="${escapeHtml(
                        category
                    )}"
                >
                    📦 ${escapeHtml(
                        category
                    )}
                </button>

            `;

        }
    );


    productListMenu.innerHTML =
        html;


    productListMenu
        .querySelectorAll(
            ".product-list-item"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();


                        currentCategory =
                            this.dataset.category ||
                            "All";


                        productListMenu
                            .querySelectorAll(
                                ".product-list-item"
                            )
                            .forEach(
                                item => {

                                    item.classList
                                        .remove(
                                            "active"
                                        );

                                }
                            );


                        this.classList.add(
                            "active"
                        );


                        closeProductList();


                        renderProducts();


                        setTimeout(
                            () => {

                                if (
                                    productsGrid
                                ) {

                                    productsGrid
                                        .scrollIntoView({
                                            behavior:
                                                "smooth",
                                            block:
                                                "start"
                                        });

                                }

                            },
                            100
                        );

                    }
                );

            }
        );

}


/* =========================================================
   CLOSE PRODUCT LIST
========================================================= */

function closeProductList() {

    if (!productListDropdown) {
        return;
    }


    productListDropdown.classList
        .remove("open");


    if (productListToggle) {

        productListToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}


/* =========================================================
   DROPDOWN
========================================================= */

if (productListToggle) {

    productListToggle.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            const isOpen =
                productListDropdown.classList
                    .toggle("open");


            productListToggle.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );

        }
    );

}


document.addEventListener(
    "click",
    function(event) {

        if (
            productListDropdown &&
            !productListDropdown.contains(
                event.target
            )
        ) {

            closeProductList();

        }

    }
);


/* =========================================================
   LOAD CATEGORIES
========================================================= */

async function loadCategories() {

    buildCategoriesFromProducts();

    renderProductList();


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "categories"
                )
            );


        const categoryMap =
            new Map();


        snapshot.forEach(
            item => {

                const raw =
                    item.data();


                const name =
                    getCategoryName(
                        raw
                    );


                if (!name) {
                    return;
                }


                if (
                    name.toLowerCase() ===
                    "all"
                ) {

                    return;

                }


                const key =
                    name.toLowerCase();


                if (
                    !categoryMap.has(
                        key
                    )
                ) {

                    categoryMap.set(
                        key,
                        name
                    );

                }

            }
        );


        if (
            categoryMap.size > 0
        ) {

            allCategories =
                Array.from(
                    categoryMap.values()
                ).sort(
                    (a, b) =>
                        a.localeCompare(
                            b,
                            undefined,
                            {
                                sensitivity:
                                    "base"
                            }
                        )
                );

        }


        renderProductList();

    }
    catch (error) {

        console.error(
            "CATEGORY LOAD ERROR:",
            error
        );


        buildCategoriesFromProducts();

        renderProductList();

    }

}


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts() {

    if (productsLoading) {

        productsLoading.style.display =
            "flex";

    }


    if (sliderLoading) {

        sliderLoading.style.display =
            "flex";

    }


    if (slider) {

        slider.style.display =
            "none";

    }


    if (productsGrid) {

        productsGrid.innerHTML =
            "";

    }


    allCategories = [];

    renderProductList();


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        allProducts = [];


        snapshot.forEach(
            item => {

                allProducts.push(
                    normalizeProduct(
                        item.data(),
                        item.id
                    )
                );

            }
        );


        allProducts.sort(
            (a, b) =>

                productNumber(
                    a.Product_ID
                ) -

                productNumber(
                    b.Product_ID
                )

        );


        if (productCount) {

            productCount.textContent =

                allProducts.length +
                " Products";

        }


        if (productsLoading) {

            productsLoading.style.display =
                "none";

        }


        if (
            allProducts.length > 0
        ) {

            buildCategoriesFromProducts();

            renderProductList();

            renderSlider();

            renderProducts();

            hideStatus();

        }
        else {

            if (sliderLoading) {

                sliderLoading.style.display =
                    "none";

            }


            if (slider) {

                slider.style.display =
                    "none";

            }


            renderProducts();


            showStatus(
                "Firestore میں ابھی کوئی Product موجود نہیں ہے۔",
                "info"
            );

        }


        loadCategories();

    }
    catch (error) {

        console.error(
            "SHOP FIREBASE ERROR:",
            error
        );


        if (productsLoading) {

            productsLoading.style.display =
                "none";

        }


        if (sliderLoading) {

            sliderLoading.style.display =
                "none";

        }


        if (slider) {

            slider.style.display =
                "none";

        }


        if (productCount) {

            productCount.textContent =
                "Error";

        }


        let message =
            "Products load نہیں ہو سکے۔";


        if (
            error?.code ===
            "permission-denied"
        ) {

            message =
                "Firestore Permission Denied ہے۔ products collection کی public read permission چیک کریں۔";

        }
        else if (
            error?.message
        ) {

            message +=
                " " +
                error.message;

        }


        showStatus(
            message,
            "error"
        );


        if (productsGrid) {

            productsGrid.innerHTML = `

                <div
                    class="empty-box"
                    style="grid-column:1/-1;"
                >

                    <strong>
                        Products load نہیں ہو سکے۔
                    </strong>

                    <br><br>

                    Firebase / Firestore Rules چیک کریں۔

                </div>

            `;

        }


        renderProductList();

    }

}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function getFilteredProducts() {

    if (
        currentCategory ===
        "All"
    ) {

        return allProducts;

    }


    return allProducts.filter(
        product => {

            return (

                getCategory(
                    product
                ).toLowerCase()

                ===

                currentCategory
                    .toLowerCase()

            );

        }
    );

}


/* =========================================================
   ORDER LINK
========================================================= */

function getOrderLink(product) {

    const id =
        product.Product_ID;


    if (!id) {
        return "#";
    }


    /*
       موجودہ working order-form
       کو ابھی برقرار رکھا گیا ہے۔
       اس سے آپ کی موجودہ order system
       خراب نہیں ہوگی۔
    */

    let link =
        "../order-form.html?Product_ID=" +
        encodeURIComponent(id);


    if (
        product.supplierLink
    ) {

        link +=
            "&Supplier_Link=" +
            encodeURIComponent(
                product.supplierLink
            );

    }


    return link;

}


/* =========================================================
   FEATURED THEMES
========================================================= */

const featuredThemes = [

    {
        className:
            "feature-theme-leaves",

        symbols:
            [
                "🍃",
                "🌿",
                "🍂",
                "🌱",
                "🍃"
            ]
    },

    {
        className:
            "feature-theme-birds",

        symbols:
            [
                "🐦",
                "🕊️",
                "🐦",
                "🕊️",
                "☁️"
            ]
    },

    {
        className:
            "feature-theme-roses",

        symbols:
            [
                "🌹",
                "🌸",
                "🌺",
                "🌹",
                "🌷"
            ]
    },

    {
        className:
            "feature-theme-butterflies",

        symbols:
            [
                "🦋",
                "🦋",
                "🌸",
                "🦋",
                "✨"
            ]
    },

    {
        className:
            "feature-theme-animals",

        symbols:
            [
                "🐾",
                "🐕",
                "🐾",
                "🦋",
                "🌿"
            ]
    },

    {
        className:
            "feature-theme-stars",

        symbols:
            [
                "✨",
                "⭐",
                "🌟",
                "✨",
                "💫"
            ]
    },

    {
        className:
            "feature-theme-flowers",

        symbols:
            [
                "🌸",
                "🌼",
                "🌺",
                "🌷",
                "🌸"
            ]
    },

    {
        className:
            "feature-theme-clouds",

        symbols:
            [
                "☁️",
                "☁️",
                "🌤️",
                "✨",
                "☁️"
            ]
    },

    {
        className:
            "feature-theme-leaves",

        symbols:
            [
                "🌿",
                "🍃",
                "🌱",
                "🍀",
                "🍃"
            ]
    }

];


/* =========================================================
   FEATURE DECORATION
========================================================= */

function createFeatureDecoration(
    index
) {

    const theme =
        featuredThemes[
            index %
            featuredThemes.length
        ];


    const decoration =
        document.createElement(
            "div"
        );


    decoration.className =
        "feature-decoration " +
        theme.className;


    theme.symbols.forEach(
        (
            symbol,
            symbolIndex
        ) => {

            const item =
                document.createElement(
                    "span"
                );


            item.className =
                "decor-item";


            item.textContent =
                symbol;


            const duration =

                2.2 +

                (
                    (
                        index +
                        symbolIndex
                    ) %

                    5

                ) *

                0.35;


            item.style.setProperty(
                "--duration",
                duration + "s"
            );


            item.style.animationDelay =
                (
                    symbolIndex *
                    0.18
                ) +
                "s";


            decoration.appendChild(
                item
            );

        }
    );


    return decoration;

}


/* =========================================================
   ADD FEATURED SLIDER STYLES
========================================================= */

function addFeaturedSliderStyles() {

    if (
        document.getElementById(
            "janjua-featured-slider-styles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "janjua-featured-slider-styles";


    style.textContent = `

        #sliderTrack {

            direction:ltr !important;

            display:flex !important;

            flex-direction:row !important;

            align-items:stretch;

            gap:14px;

            width:max-content;

            will-change:transform;

        }


        #sliderTrack .feature-card {

            position:relative;

            flex:
                0 0 190px !important;

            width:190px !important;

            min-width:190px !important;

            height:205px;

            box-sizing:border-box;

            overflow:hidden;

            isolation:isolate;

            direction:rtl;

            background:
                linear-gradient(
                    145deg,
                    #ffffff,
                    #f8fafc
                );

            border:
                2px solid
                rgba(
                    148,
                    163,
                    184,
                    .35
                );

            border-radius:18px;

            padding:9px;

            cursor:pointer;

            box-shadow:
                0 7px 20px
                rgba(
                    15,
                    23,
                    42,
                    .10
                );

            transition:
                transform .25s ease,
                box-shadow .25s ease;

        }


        #sliderTrack
        .feature-card:hover {

            transform:
                translateY(-5px)
                scale(1.015);

            box-shadow:
                0 13px 28px
                rgba(
                    15,
                    23,
                    42,
                    .18
                );

        }


        .feature-decoration {

            position:absolute;

            inset:0;

            overflow:hidden;

            pointer-events:none;

            z-index:0;

            border-radius:16px;

            opacity:.72;

        }


        .feature-decoration::before {

            content:"";

            position:absolute;

            width:130px;

            height:130px;

            border-radius:50%;

            background:
                radial-gradient(
                    circle,
                    rgba(
                        255,
                        255,
                        255,
                        .85
                    ) 0%,
                    rgba(
                        255,
                        255,
                        255,
                        0
                    ) 70%
                );

            top:-55px;

            left:-40px;

            animation:
                featureGlow
                4s
                ease-in-out
                infinite
                alternate;

        }


        .feature-decoration
        .decor-item {

            position:absolute;

            display:block;

            font-size:22px;

            line-height:1;

            user-select:none;

            opacity:.72;

            animation:
                featureFloat
                var(--duration)
                ease-in-out
                infinite
                alternate;

        }


        .feature-decoration
        .decor-item:nth-child(1) {

            left:5%;

            top:10%;

        }


        .feature-decoration
        .decor-item:nth-child(2) {

            right:7%;

            top:20%;

        }


        .feature-decoration
        .decor-item:nth-child(3) {

            left:15%;

            bottom:18%;

        }


        .feature-decoration
        .decor-item:nth-child(4) {

            right:17%;

            bottom:8%;

        }


        .feature-decoration
        .decor-item:nth-child(5) {

            left:48%;

            top:4%;

        }


        #sliderTrack
        .feature-image {

            position:relative;

            z-index:2;

            width:100%;

            height:124px;

            overflow:hidden;

            border-radius:13px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .82
                );

            display:flex;

            align-items:center;

            justify-content:center;

        }


        #sliderTrack
        .feature-image img {

            position:relative;

            z-index:3;

            width:100%;

            height:100%;

            object-fit:contain;

            display:block;

        }


        #sliderTrack
        .feature-name {

            position:relative;

            z-index:3;

            margin-top:8px;

            min-height:19px;

            font-size:14px;

            font-weight:700;

            line-height:19px;

            color:#111827;

            white-space:nowrap;

            overflow:hidden;

            text-overflow:ellipsis;

            text-align:right;

        }


        #sliderTrack
        .feature-price {

            position:relative;

            z-index:3;

            margin-top:4px;

            font-size:14px;

            font-weight:800;

            color:#047857;

            text-align:right;

        }


        .feature-theme-leaves {

            background:
                linear-gradient(
                    135deg,
                    rgba(
                        220,
                        252,
                        231,
                        .88
                    ),
                    rgba(
                        240,
                        253,
                        244,
                        .96
                    )
                );

        }


        .feature-theme-birds {

            background:
                linear-gradient(
                    135deg,
                    rgba(
                        219,
                        234,
                        254,
                        .88
                    ),
                    rgba(
                        239,
                        246,
                        255,
                        .96
                    )
                );

        }


        .feature-theme-roses {

            background:
                linear-gradient(
                    135deg,
                    rgba(
                        252,
                        231,
                        243,
                        .90
                    ),
                    rgba(
                        255,
                        241,
                        242,
                        .96
                    )
                );

        }


        .feature-theme-butterflies {

            background:
                linear-gradient(
                    135deg,
                    rgba(
                        237,
                        233,
                        254,
                        .90
                    ),
                    rgba(
                        245,
                        243,
                        255,
                        .96
                    )
                );

        }


        .feature-theme-animals {

            background:
                linear-gradient(
                    135deg,
                    rgba(
                        254,
                        243,
                        199,
                        .90
                    ),
                    rgba(
                        255,
                        251,
                        235,
                        .96
                    )
                );

        }


        .feature-theme-stars {

            background:
                linear-gradient(
                    135deg,
                    rgba(
                        224,
                        242,
                        254,
                        .90
                    ),
                    rgba(
                        248,
                        250,
                        252,
                        .96
                    )
                );

        }


        .feature-theme-flowers {

            background:
                linear-gradient(
                    135deg,
                    rgba(
                        254,
                        226,
                        226,
                        .90
                    ),
                    rgba(
                        255,
                        247,
                        237,
                        .96
                    )
                );

        }


        .feature-theme-clouds {

            background:
                linear-gradient(
                    135deg,
                    rgba(
                        224,
                        242,
                        254,
                        .90
                    ),
                    rgba(
                        248,
                        250,
                        252,
                        .96
                    )
                );

        }


        @keyframes featureFloat {

            0% {

                transform:
                    translate3d(
                        -5px,
                        7px,
                        0
                    )
                    rotate(-8deg);

            }

            50% {

                transform:
                    translate3d(
                        5px,
                        -4px,
                        0
                    )
                    rotate(5deg);

            }

            100% {

                transform:
                    translate3d(
                        11px,
                        7px,
                        0
                    )
                    rotate(10deg);

            }

        }


        @keyframes featureGlow {

            0% {

                transform:
                    translate(
                        0,
                        0
                    )
                    scale(.85);

                opacity:.35;

            }

            100% {

                transform:
                    translate(
                        55px,
                        25px
                    )
                    scale(1.15);

                opacity:.75;

            }

        }


        @media(max-width:650px) {

            #sliderTrack
            .feature-card {

                flex-basis:
                    155px !important;

                width:
                    155px !important;

                min-width:
                    155px !important;

                height:184px;

                padding:8px;

            }


            #sliderTrack
            .feature-image {

                height:105px;

            }


            #sliderTrack
            .feature-name {

                font-size:13px;

                margin-top:7px;

            }


            #sliderTrack
            .feature-price {

                font-size:13px;

            }


            .feature-decoration
            .decor-item {

                font-size:18px;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   RENDER FEATURED SLIDER
========================================================= */

function renderSlider() {

    stopSlider();

    addFeaturedSliderStyles();


    if (
        !slider ||
        !sliderTrack
    ) {

        return;

    }


    sliderTrack.innerHTML =
        "";


    if (
        !allProducts.length
    ) {

        slider.style.display =
            "none";

        if (sliderLoading) {

            sliderLoading.style.display =
                "none";

        }

        return;

    }


    const featured =
        allProducts.slice();


    sliderOriginalCount =
        featured.length;


    const sliderProducts = [

        ...featured,

        ...featured

    ];


    sliderProducts.forEach(
        (
            product,
            index
        ) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "feature-card";


            const originalIndex =

                index %
                sliderOriginalCount;


            card.appendChild(
                createFeatureDecoration(
                    originalIndex
                )
            );


            const imageBox =
                document.createElement(
                    "div"
                );


            imageBox.className =
                "feature-image";


            if (
                product.Image
            ) {

                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    product.Image;


                image.alt =
                    product.Product_Name;


                image.loading =
                    "eager";


                imageBox.appendChild(
                    image
                );

            }
            else {

                imageBox.innerHTML = `

                    <div class="no-image">
                        No Image
                    </div>

                `;

            }


            card.appendChild(
                imageBox
            );


            const nameBox =
                document.createElement(
                    "div"
                );


            nameBox.className =
                "feature-name";


            nameBox.textContent =
                product.Product_Name;


            card.appendChild(
                nameBox
            );


            const priceBox =
                document.createElement(
                    "div"
                );


            priceBox.className =
                "feature-price";


            priceBox.textContent =
                "Rs. " +
                Number(
                    product.Product_Price || 0
                ).toLocaleString();


            card.appendChild(
                priceBox
            );


            if (
                index >=
                sliderOriginalCount
            ) {

                card.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }


            card.addEventListener(
                "click",
                () => {

                    window.location.href =
                        getOrderLink(
                            product
                        );

                }
            );


            sliderTrack.appendChild(
                card
            );

        }
    );


    slider.style.display =
        "block";


    if (sliderLoading) {

        sliderLoading.style.display =
            "none";

    }


    requestAnimationFrame(
        () => {

            requestAnimationFrame(
                () => {

                    startSlider();

                }
            );

        }
    );

}


/* =========================================================
   CALCULATE SLIDER WIDTH
========================================================= */

function calculateSliderWidth() {

    if (!sliderTrack) {
        return 0;
    }


    const card =
        sliderTrack.querySelector(
            ".feature-card"
        );


    if (!card) {
        return 0;
    }


    const style =
        window.getComputedStyle(
            sliderTrack
        );


    const gap =
        parseFloat(
            style.columnGap ||
            style.gap ||
            "14"
        ) || 14;


    return (

        card.getBoundingClientRect()
            .width +

        gap

    );

}


/* =========================================================
   START SLIDER
========================================================= */

function startSlider() {

    stopSlider();


    if (
        !sliderTrack ||
        sliderOriginalCount < 1
    ) {

        return;

    }


    sliderCardWidth =
        calculateSliderWidth();


    if (
        !sliderCardWidth ||
        sliderCardWidth <= 0
    ) {

        setTimeout(
            startSlider,
            300
        );

        return;

    }


    sliderPosition = 0;

    sliderPaused = false;


    const speed = 140;


    let lastTime =
        performance.now();


    function moveSlider(
        currentTime
    ) {

        if (sliderPaused) {

            lastTime =
                currentTime;


            sliderAnimationFrame =
                requestAnimationFrame(
                    moveSlider
                );

            return;

        }


        const delta =
            currentTime -
            lastTime;


        lastTime =
            currentTime;


        sliderPosition +=

            speed *
            delta /
            1000;


        const totalLoopWidth =

            sliderOriginalCount *
            sliderCardWidth;


        if (
            sliderPosition >=
            totalLoopWidth
        ) {

            sliderPosition -=
                totalLoopWidth;

        }


        sliderTrack.style.transform =

            "translate3d(" +
            (-sliderPosition) +
            "px,0,0)";


        sliderAnimationFrame =
            requestAnimationFrame(
                moveSlider
            );

    }


    sliderAnimationFrame =
        requestAnimationFrame(
            moveSlider
        );


    slider.onmouseenter =
        pauseSlider;


    slider.onmouseleave =
        resumeSlider;


    slider.ontouchstart =
        pauseSlider;


    slider.ontouchend =
        resumeSlider;

}


/* =========================================================
   SLIDER CONTROL
========================================================= */

function pauseSlider() {

    sliderPaused =
        true;

}


function resumeSlider() {

    sliderPaused =
        false;

}


function stopSlider() {

    if (
        sliderAnimationFrame
    ) {

        cancelAnimationFrame(
            sliderAnimationFrame
        );


        sliderAnimationFrame =
            null;

    }


    sliderPosition = 0;


    if (sliderTrack) {

        sliderTrack.style.transform =
            "translate3d(0,0,0)";

    }

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function() {

        if (
            sliderOriginalCount >= 1
        ) {

            sliderCardWidth =
                calculateSliderWidth();

        }

    }
);


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

    if (!productsGrid) {
        return;
    }


    const products =
        getFilteredProducts();


    if (productCount) {

        productCount.textContent =
            products.length +
            " Products";

    }


    if (
        !products.length
    ) {

        productsGrid.innerHTML = `

            <div
                class="empty-box"
                style="grid-column:1/-1;"
            >

                اس Category میں کوئی Product موجود نہیں ہے۔

            </div>

        `;

        return;

    }


    productsGrid.innerHTML =
        "";


    products.forEach(
        product => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product-card";


            const image =
                product.Image;


            const name =
                escapeHtml(
                    product.Product_Name
                );


            const category =
                escapeHtml(
                    product.Category
                );


            const description =
                escapeHtml(
                    product.Product_Description
                );


            const price =
                Number(
                    product.Product_Price || 0
                ).toLocaleString();


            const oldPrice =
                product.Old_Price;


            const deliveryCharges =
                product.Delivery_Charges;


            const deliveryType =
                escapeHtml(
                    product.Delivery_Type
                );


            let oldPriceHtml =
                "";


            if (
                oldPrice >
                product.Product_Price
            ) {

                oldPriceHtml = `

                    <span class="old-price">

                        Rs.
                        ${oldPrice.toLocaleString()}

                    </span>

                `;

            }


            let deliveryHtml =
                "";


            if (
                deliveryCharges > 0
            ) {

                deliveryHtml = `

                    <div class="delivery">

                        🚚 Delivery:
                        Rs.
                        ${deliveryCharges.toLocaleString()}

                    </div>

                `;

            }
            else {

                deliveryHtml = `

                    <div class="delivery">

                        🚚 ${deliveryType}

                    </div>

                `;

            }


            card.innerHTML = `

                <div class="product-image-box">

                    ${
                        image

                        ?

                        `
                        <img
                            src="${escapeHtml(image)}"
                            alt="${name}"
                            loading="lazy"
                        >
                        `

                        :

                        `
                        <div class="no-image">
                            Image Available نہیں
                        </div>
                        `

                    }

                </div>


                <div class="product-body">


                    <div class="product-category">

                        ${category}

                    </div>


                    <div class="product-name">

                        ${name}

                    </div>


                    <div class="price-row">

                        <span class="current-price">

                            Rs. ${price}

                        </span>

                        ${oldPriceHtml}

                    </div>


                    ${deliveryHtml}


                    ${
                        description

                        ?

                        `
                        <div class="product-description">

                            ${description}

                        </div>
                        `

                        :

                        ""

                    }


                    <button
                        class="order-btn"
                        type="button"
                    >

                        ORDER NOW

                    </button>


                </div>

            `;


            const orderButton =
                card.querySelector(
                    ".order-btn"
                );


            if (orderButton) {

                orderButton.addEventListener(
                    "click",
                    function() {

                        window.location.href =
                            getOrderLink(
                                product
                            );

                    }
                );

            }


            const imageElement =
                card.querySelector(
                    "img"
                );


            if (imageElement) {

                imageElement.addEventListener(
                    "error",
                    function() {

                        const parent =
                            imageElement
                                .parentElement;


                        parent.innerHTML = `

                            <div class="no-image">

                                Image load نہیں ہوئی

                            </div>

                        `;

                    }
                );

            }


            productsGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   START WEBSITE
========================================================= */

console.log(
    "================================="
);

console.log(
    "JANJUA TRADERS WEBSITE STARTED"
);

console.log(
    "Firebase Project:",
    firebaseConfig.projectId
);

console.log(
    "================================="
);


addFeaturedSliderStyles();

renderProductList();

loadProducts();
