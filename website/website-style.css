/* =========================================================
   JANJUA TRADERS
   WEBSITE DYNAMIC PRODUCT SCRIPT

   یہ website صرف introduction + dynamic product display ہے۔
   اصل shopping کے لیے ../shop.html کھولا جائے گا۔
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
    apiKey: "AIzaSyC8_4ArKXAdfKWZ5mi5DaT9qiayL3h_Yzw",
    authDomain: "janjua-traders.firebaseapp.com",
    projectId: "janjua-traders",
    storageBucket: "janjua-traders.firebasestorage.app",
    messagingSenderId: "154904774188",
    appId: "1:154904774188:web:1830f9d533e77dae6a7389"
};


/* =========================================================
   FIREBASE INITIALIZE
   ========================================================= */

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* =========================================================
   DOM
   ========================================================= */

const productsTrack =
    document.getElementById("productsTrack");


/* =========================================================
   SETTINGS
   ========================================================= */

const PRODUCTS_PER_PAGE = 4;

/*
   ہر 4 products کے بعد اگلی 4 products
   کتنے milliseconds بعد آئیں گی۔
*/
const SLIDE_INTERVAL = 4200;


/* =========================================================
   STATE
   ========================================================= */

let allProducts = [];

let currentStart = 0;

let animationTimer = null;


/* =========================================================
   HELPERS
   ========================================================= */

function cleanValue(value) {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }

    return String(value).trim();
}


function escapeHtml(value) {

    return cleanValue(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   PRODUCT NAME
   ========================================================= */

function getProductName(data) {

    return cleanValue(
        data.Product_Name ??
        data.productName ??
        data.name ??
        data.Name ??
        data.title ??
        data.Title ??
        "Unnamed Product"
    );
}


/* =========================================================
   CATEGORY
   ========================================================= */

function getProductCategory(data) {

    return cleanValue(
        data.Category ??
        data.category ??
        data.Product_Category ??
        data.productCategory ??
        data.categoryName ??
        data.Category_Name ??
        "JANJUA TRADERS"
    );
}


/* =========================================================
   PRODUCT ID
   ========================================================= */

function getProductId(data, documentId) {

    return cleanValue(
        data.Product_ID ??
        data.productId ??
        data.ProductId ??
        data.id ??
        documentId
    );
}


/* =========================================================
   NORMALIZE PRODUCT
   ========================================================= */

function normalizeProduct(data, documentId) {

    return {

        id:
            getProductId(
                data,
                documentId
            ),

        name:
            getProductName(data),

        category:
            getProductCategory(data)

    };
}


/* =========================================================
   LOAD PRODUCTS
   ========================================================= */

async function loadProducts() {

    if (!productsTrack) {
        console.error(
            "productsTrack element not found."
        );

        return;
    }

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        const loadedProducts = [];


        snapshot.forEach((doc) => {

            const data = doc.data();

            const product =
                normalizeProduct(
                    data,
                    doc.id
                );


            /*
               خالی یا غیرضروری records
               website پر نہیں دکھانے۔
            */

            if (
                product.name &&
                product.name !== "Unnamed Product"
            ) {

                loadedProducts.push(
                    product
                );

            }

        });


        /*
           Product ID کے حساب سے
           consistent ترتیب رکھنے کی کوشش۔
        */

        loadedProducts.sort(
            (a, b) => {

                return String(a.id)
                    .localeCompare(
                        String(b.id),
                        undefined,
                        {
                            numeric: true,
                            sensitivity: "base"
                        }
                    );

            }
        );


        allProducts =
            loadedProducts;


        if (!allProducts.length) {

            showEmptyMessage();

            return;
        }


        currentStart = 0;

        renderCurrentProducts();

        startAutomaticAnimation();

    } catch (error) {

        console.error(
            "JANJUA TRADERS products loading error:",
            error
        );

        showErrorMessage();

    }

}


/* =========================================================
   GET CURRENT 4 PRODUCTS
   ========================================================= */

function getCurrentProducts() {

    if (!allProducts.length) {
        return [];
    }


    /*
       اگر products چار سے کم ہوں
       تو جتنی available ہیں وہ دکھائی جائیں گی۔
    */

    const result = [];


    for (
        let i = 0;
        i < PRODUCTS_PER_PAGE;
        i++
    ) {

        if (allProducts.length === 0) {
            break;
        }


        const index =
            (
                currentStart + i
            ) % allProducts.length;


        /*
           اگر total products چار سے کم ہیں
           تو ایک ہی product کو بار بار repeat
           نہیں کرنا۔
        */

        if (
            allProducts.length <
            PRODUCTS_PER_PAGE
        ) {

            if (
                index >=
                allProducts.length
            ) {
                break;
            }

        }


        result.push(
            allProducts[index]
        );

    }


    return result;
}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderCurrentProducts(
    animate = false
) {

    if (!productsTrack) {
        return;
    }


    const products =
        getCurrentProducts();


    if (!products.length) {

        showEmptyMessage();

        return;
    }


    if (animate) {

        productsTrack.classList.add(
            "changing"
        );


        setTimeout(
            () => {

                drawProducts(
                    products
                );

                productsTrack.classList.remove(
                    "changing"
                );

            },
            430
        );

    } else {

        drawProducts(
            products
        );

    }

}


/* =========================================================
   DRAW PRODUCT CARDS
   ========================================================= */

function drawProducts(products) {

    productsTrack.innerHTML = "";


    products.forEach(
        (product, index) => {

            const card =
                document.createElement("a");


            /*
               اصل shopping app
            */

            card.href =
                "../shop.html";


            card.className =
                "product-card";


            card.setAttribute(
                "aria-label",
                `${product.name} — Shop Now`
            );


            card.innerHTML = `

                <div class="card-light"></div>

                <div class="product-shine"></div>

                <div class="product-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <div class="product-name">
                    ${escapeHtml(product.name)}
                </div>

                <div class="product-category">
                    ${escapeHtml(product.category)}
                </div>

            `;


            productsTrack.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   AUTOMATIC PRODUCT ANIMATION
   ========================================================= */

function startAutomaticAnimation() {

    stopAutomaticAnimation();


    /*
       اگر صرف 1 سے 4 products ہیں
       تو unnecessary animation نہیں۔
    */

    if (
        allProducts.length <=
        PRODUCTS_PER_PAGE
    ) {

        return;
    }


    animationTimer =
        setInterval(
            () => {

                moveToNextProducts();

            },
            SLIDE_INTERVAL
        );

}


/* =========================================================
   NEXT PRODUCTS
   ========================================================= */

function moveToNextProducts() {

    if (
        allProducts.length <=
        PRODUCTS_PER_PAGE
    ) {

        return;
    }


    currentStart +=
        PRODUCTS_PER_PAGE;


    if (
        currentStart >=
        allProducts.length
    ) {

        currentStart = 0;

    }


    renderCurrentProducts(
        true
    );

}


/* =========================================================
   STOP TIMER
   ========================================================= */

function stopAutomaticAnimation() {

    if (animationTimer) {

        clearInterval(
            animationTimer
        );

        animationTimer = null;

    }

}


/* =========================================================
   EMPTY MESSAGE
   ========================================================= */

function showEmptyMessage() {

    stopAutomaticAnimation();


    productsTrack.innerHTML = `

        <div class="products-message">

            ابھی مصنوعات شامل نہیں کی گئیں۔

        </div>

    `;

}


/* =========================================================
   ERROR MESSAGE
   ========================================================= */

function showErrorMessage() {

    stopAutomaticAnimation();


    productsTrack.innerHTML = `

        <div class="products-message">

            مصنوعات لوڈ نہیں ہو سکیں۔

            <br><br>

            براہِ کرم کچھ دیر بعد دوبارہ کوشش کریں۔

        </div>

    `;

}


/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            stopAutomaticAnimation();

        } else {

            if (
                allProducts.length >
                PRODUCTS_PER_PAGE
            ) {

                startAutomaticAnimation();

            }

        }

    }
);


/* =========================================================
   START
   ========================================================= */

loadProducts();
