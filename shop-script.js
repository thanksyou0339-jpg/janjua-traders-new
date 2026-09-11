/* =========================================================
   JANJUA TRADERS — CUSTOMER SHOP
   Firebase + Products + Product List
   Search Removed
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
    document.getElementById("pageStatus");

const slider =
    document.getElementById("slider");

const sliderTrack =
    document.getElementById("sliderTrack");

const sliderLoading =
    document.getElementById("sliderLoading");

const productsGrid =
    document.getElementById("productsGrid");

const productsLoading =
    document.getElementById("productsLoading");

const productCount =
    document.getElementById("productCount");

const productListDropdown =
    document.getElementById("productListDropdown");

const productListToggle =
    document.getElementById("productListToggle");

const productListMenu =
    document.getElementById("productListMenu");


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

function showStatus(message,type="info"){

    if(!pageStatus){
        return;
    }

    pageStatus.textContent =
        message;

    pageStatus.className =
        "status show " + type;

}


function hideStatus(){

    if(!pageStatus){
        return;
    }

    pageStatus.textContent =
        "";

    pageStatus.className =
        "status";

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value){

    return String(value ?? "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


/* =========================================================
   IMAGE
========================================================= */

function optimizeImage(url){

    if(!url){
        return "";
    }

    url =
        String(url).trim();

    if(
        url.includes("res.cloudinary.com") &&
        url.includes("/image/upload/")
    ){

        if(!url.includes("f_auto")){

            return url.replace(
                "/image/upload/",
                "/image/upload/f_auto,q_auto,w_600/"
            );

        }

    }

    return url;

}


function getImage(product){

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

function getProductId(product){

    return String(
        product.Product_ID ||
        product.productId ||
        product.product_id ||
        product.id ||
        ""
    ).trim();

}


function getProductName(product){

    return String(
        product.Product_Name ||
        product.Product ||
        product.productName ||
        product.name ||
        product.title ||
        "Product"
    ).trim();

}


function getDescription(product){

    return String(
        product.Product_Description ||
        product.productDescription ||
        product.Description ||
        product.description ||
        ""
    ).trim();

}


function getPrice(product){

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


function getOldPrice(product){

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


function getCategory(product){

    return String(
        product.Category ||
        product.category ||
        "All"
    ).trim() || "All";

}


function getDeliveryCharges(product){

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


function getDeliveryType(product){

    return String(
        product.Delivery_Type ||
        product.deliveryType ||
        "Free Delivery"
    ).trim();

}


function getSupplierLink(product){

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

function normalizeProduct(raw,docId){

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

function productNumber(id){

    const match =
        String(id).match(/(\d+)$/);

    if(match){
        return Number(match[1]);
    }

    return 999999999;

}


/* =========================================================
   CATEGORY NAME
========================================================= */

function getCategoryName(raw){

    return String(
        raw.name ||
        raw.Name ||
        raw.category ||
        raw.Category ||
        ""
    ).trim();

}


/* =========================================================
   LOAD CATEGORIES
========================================================= */

async function loadCategories(){

    try{

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "categories"
                )
            );

        const categoryMap =
            new Map();

        snapshot.forEach(item => {

            const raw =
                item.data();

            const name =
                getCategoryName(raw);

            if(!name){
                return;
            }

            if(
                name.toLowerCase() === "all"
            ){
                return;
            }

            const key =
                name.toLowerCase();

            if(
                !categoryMap.has(key)
            ){

                categoryMap.set(
                    key,
                    name
                );

            }

        });

        allCategories =
            Array.from(
                categoryMap.values()
            ).sort(
                (a,b)=>
                    a.localeCompare(
                        b,
                        undefined,
                        {
                            sensitivity:"base"
                        }
                    )
            );

        renderProductList();

    }
    catch(error){

        console.error(
            "CATEGORY LOAD ERROR:",
            error
        );

        /*
         Fallback:
         اگر categories collection نہ ملے
         تو Products کی categories استعمال ہوں گی۔
        */

        const fallback =
            new Map();

        allProducts.forEach(product => {

            const name =
                getCategory(product);

            if(
                !name ||
                name.toLowerCase() === "all"
            ){
                return;
            }

            const key =
                name.toLowerCase();

            if(
                !fallback.has(key)
            ){

                fallback.set(
                    key,
                    name
                );

            }

        });

        allCategories =
            Array.from(
                fallback.values()
            ).sort(
                (a,b)=>
                    a.localeCompare(
                        b,
                        undefined,
                        {
                            sensitivity:"base"
                        }
                    )
            );

        renderProductList();

    }

}


/* =========================================================
   RENDER PRODUCT LIST
========================================================= */

function renderProductList(){

    if(!productListMenu){
        return;
    }

    productListMenu.innerHTML = `

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

        ${
            allCategories
                .map(category => `

                    <button
                        type="button"
                        class="product-list-item ${
                            currentCategory
                                .toLowerCase() ===
                            category.toLowerCase()
                                ? "active"
                                : ""
                        }"
                        data-category="${escapeHtml(category)}"
                    >
                        📦 ${escapeHtml(category)}
                    </button>

                `)
                .join("")
        }

    `;


    productListMenu
        .querySelectorAll(
            ".product-list-item"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    currentCategory =
                        button.dataset.category ||
                        "All";

                    productListMenu
                        .querySelectorAll(
                            ".product-list-item"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });

                    button.classList.add(
                        "active"
                    );

                    closeProductList();

                    renderProducts();

                    /*
                     Product grid تک scroll
                    */

                    setTimeout(() => {

                        productsGrid?.scrollIntoView({
                            behavior:"smooth",
                            block:"start"
                        });

                    },100);

                }
            );

        });

}


/* =========================================================
   DROPDOWN
========================================================= */

function closeProductList(){

    if(!productListDropdown){
        return;
    }

    productListDropdown.classList.remove(
        "open"
    );

    productListToggle?.setAttribute(
        "aria-expanded",
        "false"
    );

}


if(productListToggle){

    productListToggle.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            const open =
                productListDropdown.classList.toggle(
                    "open"
                );

            productListToggle.setAttribute(
                "aria-expanded",
                open
                    ? "true"
                    : "false"
            );

        }
    );

}


document.addEventListener(
    "click",
    event => {

        if(
            productListDropdown &&
            !productListDropdown.contains(
                event.target
            )
        ){

            closeProductList();

        }

    }
);


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts(){

    if(productsLoading){
        productsLoading.style.display =
            "flex";
    }

    if(sliderLoading){
        sliderLoading.style.display =
            "flex";
    }

    if(productsGrid){
        productsGrid.innerHTML =
            "";
    }

    try{

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );

        allProducts = [];

        snapshot.forEach(item => {

            allProducts.push(
                normalizeProduct(
                    item.data(),
                    item.id
                )
            );

        });

        allProducts.sort(
            (a,b)=>
                productNumber(
                    a.Product_ID
                ) -
                productNumber(
                    b.Product_ID
                )
        );


        if(productCount){

            productCount.textContent =
                allProducts.length +
                " Products";

        }


        if(productsLoading){
            productsLoading.style.display =
                "none";
        }

        if(sliderLoading){
            sliderLoading.style.display =
                "none";
        }


        /*
         پہلے categories load کریں
        */

        await loadCategories();


        renderSlider();

        renderProducts();


        if(allProducts.length){

            hideStatus();

        }
        else{

            showStatus(
                "Firestore میں ابھی کوئی Product موجود نہیں ہے۔",
                "info"
            );

        }

    }
    catch(error){

        console.error(
            "SHOP FIREBASE ERROR:",
            error
        );

        if(productsLoading){
            productsLoading.style.display =
                "none";
        }

        if(sliderLoading){
            sliderLoading.style.display =
                "none";
        }

        if(productCount){
            productCount.textContent =
                "Error";
        }

        let message =
            "Products load نہیں ہو سکے۔";

        if(
            error?.code ===
            "permission-denied"
        ){

            message =
                "Firestore Permission Denied ہے۔ Firestore Rules میں products کے لیے public read اجازت چیک کریں۔";

        }
        else if(error?.message){

            message +=
                " " +
                error.message;

        }

        showStatus(
            message,
            "error"
        );


        if(productsGrid){

            productsGrid.innerHTML = `

                <div
                    class="empty-box"
                    style="grid-column:1/-1;"
                >

                    <strong>
                        Products load نہیں ہو سکے۔
                    </strong>

                    <br><br>

                    براہ کرم Firebase / Firestore Rules چیک کریں۔

                </div>

            `;

        }

    }

}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function getFilteredProducts(){

    if(
        currentCategory === "All"
    ){

        return allProducts;

    }

    return allProducts.filter(product => {

        return (
            getCategory(product)
                .toLowerCase()
                ===
            currentCategory
                .toLowerCase()
        );

    });

}


/* =========================================================
   ORDER LINK
========================================================= */

function getOrderLink(product){

    const id =
        product.Product_ID;

    if(!id){
        return "#";
    }

    let link =
        "./order-form.html?Product_ID=" +
        encodeURIComponent(id);

    if(product.supplierLink){

        link +=
            "&Supplier_Link=" +
            encodeURIComponent(
                product.supplierLink
            );

    }

    return link;

}


/* =========================================================
   FEATURED SLIDER
========================================================= */

function renderSlider(){

    stopSlider();

    if(
        !slider ||
        !sliderTrack
    ){
        return;
    }

    sliderTrack.innerHTML =
        "";

    if(!allProducts.length){

        slider.style.display =
            "none";

        return;

    }

    const featured =
        allProducts.slice();

    sliderOriginalCount =
        featured.length;

    const sliderProducts =
        [
            ...featured,
            ...featured
        ];

    sliderProducts.forEach(product => {

        const image =
            product.Image;

        const name =
            escapeHtml(
                product.Product_Name
            );

        const price =
            Number(
                product.Product_Price || 0
            ).toLocaleString();

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "feature-card";

        card.innerHTML = `

            <div class="feature-image">

                ${
                    image
                    ?
                    `
                    <img
                        src="${escapeHtml(image)}"
                        alt="${name}"
                        loading="eager"
                    >
                    `
                    :
                    `
                    <div class="no-image">
                        No Image
                    </div>
                    `
                }

            </div>

            <div class="feature-name">
                ${name}
            </div>

            <div class="feature-price">
                Rs. ${price}
            </div>

        `;

        card.addEventListener(
            "click",
            () => {

                window.location.href =
                    getOrderLink(product);

            }
        );

        sliderTrack.appendChild(
            card
        );

    });

    slider.style.display =
        "block";


    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            startSlider();

        });

    });

}


/* =========================================================
   SLIDER WIDTH
========================================================= */

function calculateSliderWidth(){

    if(!sliderTrack){
        return 0;
    }

    const card =
        sliderTrack.querySelector(
            ".feature-card"
        );

    if(!card){
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
            "12"
        ) || 12;

    return (
        card.getBoundingClientRect().width +
        gap
    );

}


/* =========================================================
   START SLIDER
========================================================= */

function startSlider(){

    stopSlider();

    if(
        !sliderTrack ||
        sliderOriginalCount < 1
    ){
        return;
    }

    sliderCardWidth =
        calculateSliderWidth();

    if(
        !sliderCardWidth ||
        sliderCardWidth <= 0
    ){
        return;
    }

    sliderPosition =
        0;

    sliderPaused =
        false;

    const speed =
        60;

    let lastTime =
        performance.now();


    function moveSlider(currentTime){

        if(sliderPaused){

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

        if(
            sliderPosition >=
            totalLoopWidth
        ){

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

function pauseSlider(){
    sliderPaused = true;
}

function resumeSlider(){
    sliderPaused = false;
}

function stopSlider(){

    if(sliderAnimationFrame){

        cancelAnimationFrame(
            sliderAnimationFrame
        );

        sliderAnimationFrame =
            null;

    }

    sliderPosition =
        0;

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if(
            sliderOriginalCount >= 1
        ){

            sliderCardWidth =
                calculateSliderWidth();

        }

    }
);


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(){

    if(!productsGrid){
        return;
    }

    const products =
        getFilteredProducts();


    if(productCount){

        productCount.textContent =
            products.length +
            " Products";

    }


    if(!products.length){

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


    products.forEach(product => {

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


        if(
            oldPrice >
            product.Product_Price
        ){

            oldPriceHtml = `

                <span class="old-price">

                    Rs. ${oldPrice.toLocaleString()}

                </span>

            `;

        }


        let deliveryHtml =
            "";


        if(
            deliveryCharges > 0
        ){

            deliveryHtml = `

                <div class="delivery">

                    🚚 Delivery:
                    Rs. ${deliveryCharges.toLocaleString()}

                </div>

            `;

        }
        else{

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


        if(orderButton){

            orderButton.addEventListener(
                "click",
                () => {

                    window.location.href =
                        getOrderLink(product);

                }
            );

        }


        const imageElement =
            card.querySelector(
                "img"
            );


        if(imageElement){

            imageElement.addEventListener(
                "error",
                () => {

                    const parent =
                        imageElement.parentElement;

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

    });

}


/* =========================================================
   START
========================================================= */

console.log(
    "JANJUA Customer Shop started."
);

console.log(
    "Firebase Project:",
    firebaseConfig.projectId
);

loadProducts();
