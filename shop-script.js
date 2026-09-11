/* =========================================================
   JANJUA TRADERS — CUSTOMER SHOP
   Firebase + Products + Product List
   Smooth Continuous Featured Product Slider

   PRODUCT LIST:
   - Categories loaded from Firestore
   - Search removed
   - Product List dropdown created in header
   - All Products shown once
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

const categoriesBox =
    document.getElementById("categories");

const productsGrid =
    document.getElementById("productsGrid");

const productsLoading =
    document.getElementById("productsLoading");

const searchInput =
    document.getElementById("searchInput");

const productCount =
    document.getElementById("productCount");


/* =========================================================
   DATA
========================================================= */

let allProducts = [];

let allCategories = [];

let currentCategory = "All";

let sliderTimer = null;

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
){

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
   HTML ESCAPE
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
   IMAGE OPTIMIZATION
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

        if(
            !url.includes("f_auto")
        ){

            return url.replace(
                "/image/upload/",
                "/image/upload/f_auto,q_auto,w_600/"
            );

        }

    }


    return url;

}


/* =========================================================
   GET IMAGE
========================================================= */

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
   GET PRODUCT ID
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


/* =========================================================
   GET NAME
========================================================= */

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


/* =========================================================
   GET DESCRIPTION
========================================================= */

function getDescription(product){

    return String(
        product.Product_Description ||
        product.productDescription ||
        product.Description ||
        product.description ||
        ""
    ).trim();

}


/* =========================================================
   GET PRICE
========================================================= */

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


/* =========================================================
   GET OLD PRICE
========================================================= */

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


/* =========================================================
   GET CATEGORY
========================================================= */

function getCategory(product){

    return String(
        product.Category ||
        product.category ||
        "All"
    ).trim() || "All";

}


/* =========================================================
   GET DELIVERY CHARGES
========================================================= */

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


/* =========================================================
   GET DELIVERY TYPE
========================================================= */

function getDeliveryType(product){

    return String(
        product.Delivery_Type ||
        product.deliveryType ||
        "Free Delivery"
    ).trim();

}


/* =========================================================
   GET SUPPLIER LINK
========================================================= */

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

function normalizeProduct(
    raw,
    docId
){

    const product = {

        docId: docId,

        raw: raw,

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
                raw.Janjua_Link ||
                ""
            ).trim()

    };


    product.Image =
        optimizeImage(
            product.Product_Image
        );


    return product;

}


/* =========================================================
   SORT PRODUCT IDs
========================================================= */

function productNumber(id){

    const match =
        String(id)
            .match(/(\d+)$/);


    if(match){

        return Number(
            match[1]
        );

    }


    return 999999999;

}


/* =========================================================
   CATEGORY NAME FROM FIRESTORE
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


        snapshot.forEach(
            item => {

                const raw =
                    item.data();


                const name =
                    getCategoryName(
                        raw
                    );


                if(!name){
                    return;
                }


                if(
                    name.toLowerCase() ===
                    "all"
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

            }
        );


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
           If categories collection is unavailable,
           create categories from existing products
           as a safe fallback.
        */

        const fallback =
            new Map();


        allProducts.forEach(
            product => {

                const name =
                    getCategory(
                        product
                    );


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

            }
        );


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
   CREATE PRODUCT LIST DROPDOWN
========================================================= */

function renderProductList(){

    /*
       The old search box is reused.

       This means your existing HTML does not need
       another header element.
    */

    const searchBox =
        document.querySelector(
            ".search-box"
        );


    if(!searchBox){

        return;

    }


    searchBox.innerHTML = `

        <div
            class="product-list-dropdown"
            id="productListDropdown"
        >

            <button
                type="button"
                class="product-list-toggle"
                id="productListToggle"
                aria-expanded="false"
            >

                📦 Product List

                <span
                    class="product-list-arrow"
                >
                    ▾
                </span>

            </button>


            <div
                class="product-list-menu"
                id="productListMenu"
            >

                <button
                    type="button"
                    class="product-list-item active"
                    data-category="All"
                >

                    🛍 All Products

                </button>

                ${
                    allCategories
                    .map(
                        category => `

                            <button
                                type="button"
                                class="product-list-item"
                                data-category="${escapeHtml(category)}"
                            >

                                📦 ${escapeHtml(category)}

                            </button>

                        `
                    )
                    .join("")
                }

            </div>

        </div>

    `;


    addProductListStyles();


    const toggle =
        document.getElementById(
            "productListToggle"
        );


    const menu =
        document.getElementById(
            "productListMenu"
        );


    const dropdown =
        document.getElementById(
            "productListDropdown"
        );


    if(
        !toggle ||
        !menu ||
        !dropdown
    ){

        return;

    }


    toggle.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            const isOpen =
                dropdown.classList.toggle(
                    "open"
                );


            toggle.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );

        }
    );


    menu
        .querySelectorAll(
            ".product-list-item"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        currentCategory =
                            button.dataset.category ||
                            "All";


                        menu
                            .querySelectorAll(
                                ".product-list-item"
                            )
                            .forEach(
                                item => {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        button.classList.add(
                            "active"
                        );


                        dropdown.classList.remove(
                            "open"
                        );


                        toggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        renderProducts();


                        /*
                           Move user to products
                           after selecting category.
                        */

                        const productsSection =
                            productsGrid
                            ?.previousElementSibling;


                        if(productsSection){

                            setTimeout(
                                ()=>{

                                    productsSection.scrollIntoView({
                                        behavior:"smooth",
                                        block:"start"
                                    });

                                },
                                80
                            );

                        }

                    }
                );

            }
        );


    document.addEventListener(
        "click",
        event => {

            if(
                !dropdown.contains(
                    event.target
                )
            ){

                dropdown.classList.remove(
                    "open"
                );


                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   PRODUCT LIST CSS
========================================================= */

function addProductListStyles(){

    if(
        document.getElementById(
            "productListDynamicStyles"
        )
    ){

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "productListDynamicStyles";


    style.textContent = `

        .product-list-dropdown{
            position:relative;
            width:100%;
            direction:rtl;
        }


        .product-list-toggle{
            width:100%;
            border:0;
            outline:0;
            cursor:pointer;

            border-radius:25px;

            padding:12px 18px;

            background:white;

            color:#111827;

            font-size:15px;

            font-weight:800;

            text-align:right;

            display:flex;

            align-items:center;

            justify-content:space-between;

            box-shadow:
                0 2px 8px
                rgba(0,0,0,.08);

            transition:.2s;
        }


        .product-list-toggle:hover{
            background:#f9fafb;
        }


        .product-list-arrow{
            font-size:18px;
            transition:.2s;
        }


        .product-list-dropdown.open
        .product-list-arrow{
            transform:rotate(180deg);
        }


        .product-list-menu{
            position:absolute;

            top:calc(100% + 8px);

            right:0;

            width:100%;

            max-height:330px;

            overflow-y:auto;

            background:white;

            border-radius:14px;

            padding:7px;

            box-shadow:
                0 10px 35px
                rgba(0,0,0,.18);

            border:1px solid #e5e7eb;

            display:none;

            z-index:2000;
        }


        .product-list-dropdown.open
        .product-list-menu{
            display:block;
        }


        .product-list-item{
            width:100%;

            border:0;

            background:white;

            color:#374151;

            text-align:right;

            cursor:pointer;

            border-radius:10px;

            padding:11px 13px;

            font-size:14px;

            font-weight:700;

            margin:2px 0;

            transition:.15s;
        }


        .product-list-item:hover{
            background:#f3f4f6;
        }


        .product-list-item.active{
            background:#111827;

            color:white;
        }


        @media(max-width:650px){

            .product-list-menu{
                max-height:280px;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   HIDE OLD CATEGORY SECTION
========================================================= */

function hideOldCategorySection(){

    if(!categoriesBox){

        return;

    }


    categoriesBox.innerHTML =
        "";


    categoriesBox.style.display =
        "none";


    /*
       Hide the old:
       "🛍 Categories"
       heading as well.
    */

    const categoryTitle =
        categoriesBox.previousElementSibling;


    if(categoryTitle){

        categoryTitle.style.display =
            "none";

    }

}


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


        snapshot.forEach(
            item => {

                const raw =
                    item.data();


                allProducts.push(
                    normalizeProduct(
                        raw,
                        item.id
                    )
                );

            }
        );


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


        hideOldCategorySection();


        /*
           Product List is loaded separately
           from Firestore categories.
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
        else if(
            error?.message
        ){

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

    return allProducts.filter(
        product => {

            if(
                currentCategory === "All"
            ){

                return true;

            }


            return (
                product.Category
                    .trim()
                    .toLowerCase() ===

                currentCategory
                    .trim()
                    .toLowerCase()
            );

        }
    );

}


/* =========================================================
   PRODUCT ORDER LINK
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


    if(
        product.supplierLink
    ){

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
   ALL PRODUCTS — CONTINUOUS MOVEMENT
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

        slider.classList.add(
            "hidden"
        );

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


    sliderProducts.forEach(
        product => {

            const image =
                product.Image;


            const name =
                escapeHtml(
                    product.Product_Name
                );


            const price =
                Number(
                    product.Product_Price ||
                    0
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
                ()=>{

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


    slider.classList.remove(
        "hidden"
    );


    requestAnimationFrame(
        ()=>{

            requestAnimationFrame(
                ()=>{

                    startSlider();

                }
            );

        }
    );

}


/* =========================================================
   CALCULATE SLIDER CARD WIDTH
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


    slider
