/* =========================================================
   JANJUA TRADERS
   WEBSITE DYNAMIC PRODUCT SCRIPT

   یہ website صرف introduction + dynamic product display ہے۔
   اصل shopping کے لیے ../shop.html کھولا جائے گا۔

   IMAGE SYSTEM:
   Admin/Firebase میں product کے ساتھ مختلف ممکنہ
   image fields میں سے image خود detect کی جائے گی۔
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
   IMAGE VALUE HELPER
   ========================================================= */

function getImageValue(value) {

    /*
       اگر image field سیدھا string ہو۔
    */

    if (
        typeof value === "string" ||
        typeof value === "number"
    ) {

        return cleanValue(value);

    }


    /*
       اگر Firebase میں image array ہو
       تو پہلی usable image لی جائے۔
    */

    if (Array.isArray(value)) {

        for (const item of value) {

            const result =
                getImageValue(item);

            if (result) {
                return result;
            }

        }

        return "";

    }


    /*
       اگر image ایک object کی شکل میں ہو
       تو عام URL fields check کی جائیں۔
    */

    if (
        value &&
        typeof value === "object"
    ) {

        const possibleUrl =
            value.url ??
            value.URL ??
            value.downloadURL ??
            value.downloadUrl ??
            value.imageUrl ??
            value.imageURL ??
            value.src ??
            value.href ??
            value.path ??
            "";

        return cleanValue(
            possibleUrl
        );

    }


    return "";

}


/* =========================================================
   IMAGE URL
   ========================================================= */

function getProductImage(data) {

    const possibleImages = [

        data.Image_URL,
        data.imageUrl,
        data.imageURL,
        data.image,
        data.Image,

        data.Product_Image,
        data.Product_Image_URL,
        data.productImage,
        data.productImageUrl,

        data.photo,
        data.Photo,

        data.thumbnail,
        data.Thumbnail,

        data.imagePath,
        data.Image_Path,

        data.productPhoto,
        data.productPhotoUrl

    ];


    for (
        const value of possibleImages
    ) {

        const image =
            getImageValue(value);


        if (image) {

            return image;

        }

    }


    return "";

}


/* =========================================================
   IMAGE URL SAFETY
   ========================================================= */

function isUsableImageUrl(url) {

    const value =
        cleanValue(url);


    if (!value) {
        return false;
    }


    /*
       Firebase Storage / normal web images
    */

    if (
        value.startsWith("https://") ||
        value.startsWith("http://")
    ) {

        return true;

    }


    /*
       Local/data images بھی allow
       کیے جا سکتے ہیں۔
    */

    if (
        value.startsWith("data:image/")
    ) {

        return true;

    }


    if (
        value.startsWith("blob:")
    ) {

        return true;

    }


    return false;

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

function normalizeProduct(
    data,
    documentId
) {

    return {

        id:
            getProductId(
                data,
                documentId
            ),

        name:
            getProductName(data),

        category:
            getProductCategory(data),

        image:
            getProductImage(data)

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


        snapshot.forEach(
            (doc) => {

                const data =
                    doc.data();


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
                    product.name !==
                    "Unnamed Product"
                ) {

                    loadedProducts.push(
                        product
                    );

                }

            }
        );


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


    const result = [];


    for (
        let i = 0;
        i < PRODUCTS_PER_PAGE;
        i++
    ) {

        if (
            allProducts.length === 0
        ) {

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


            /*
               محفوظ image URL
            */

            const imageUrl =
                isUsableImageUrl(
                    product.image
                )
                    ? product.image
                    : "";


            /*
               اگر image موجود ہے تو image card میں آئے گی۔
               اگر image موجود نہیں تو placeholder رہے گا۔
            */

            const imageHtml =
                imageUrl
                    ? `
                        <div class="product-image-frame">

                            <img
                                class="product-image"
                                src="${escapeHtml(imageUrl)}"
                                alt="${escapeHtml(product.name)}"
                                loading="lazy"
                                decoding="async"
                            >

                            <div
                                class="product-image-placeholder"
                                aria-hidden="true"
                            >
                                تصویر دستیاب نہیں
                            </div>

                        </div>
                      `
                    : `
                        <div class="product-image-frame">

                            <div
                                class="product-image-placeholder"
                            >
                                تصویر دستیاب نہیں
                            </div>

                        </div>
                      `;


            card.innerHTML = `

                <div class="card-light"></div>

                <div class="product-shine"></div>

                ${imageHtml}

                <div class="product-card-content">

                    <div class="product-number">
                        ${String(index + 1).padStart(2, "0")}
                    </div>

                    <div class="product-name">
                        ${escapeHtml(product.name)}
                    </div>

                    <div class="product-category">
                        ${escapeHtml(product.category)}
                    </div>

                </div>

            `;


            /*
               Image load ہونے میں مسئلہ ہو تو
               placeholder دکھایا جائے۔
            */

            const image =
                card.querySelector(
                    ".product-image"
                );


            const placeholder =
                card.querySelector(
                    ".product-image-placeholder"
                );


            if (image) {

                image.addEventListener(
                    "load",
                    () => {

                        image.classList.add(
                            "loaded"
                        );

                        if (placeholder) {

                            placeholder.style.display =
                                "none";

                        }

                    }
                );


                image.addEventListener(
                    "error",
                    () => {

                        image.style.display =
                            "none";


                        if (placeholder) {

                            placeholder.style.display =
                                "flex";

                        }

                    }
                );

            }


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
