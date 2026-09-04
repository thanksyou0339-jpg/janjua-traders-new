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


const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


/* =========================================================
   ELEMENTS
========================================================= */

const productGrid =
    document.getElementById("productGrid");

const categoryBar =
    document.getElementById("categoryBar");

const searchInput =
    document.getElementById("searchInput");

const productCount =
    document.getElementById("productCount");

const sliderTrack =
    document.getElementById("sliderTrack");


/* =========================================================
   DATA
========================================================= */

let allProducts = [];

let activeCategory = "ALL";

let sliderTimer = null;

let sliderPosition = 0;


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value){

    if(
        value === null ||
        value === undefined
    ){
        return "";
    }

    return String(value)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}


/* =========================================================
   URL ENCODE
========================================================= */

function enc(value){

    return encodeURIComponent(
        value === null ||
        value === undefined
            ? ""
            : String(value)
    );

}


/* =========================================================
   CLOUDINARY IMAGE OPTIMIZER
========================================================= */

function optimizeImage(url){

    if(!url){
        return "";
    }


    /*
     * اگر تصویر Cloudinary کی ہے تو
     * automatic format + quality + width
     * استعمال کریں۔
     */

    if(
        url.includes(
            "res.cloudinary.com"
        ) &&
        url.includes(
            "/image/upload/"
        )
    ){

        return url.replace(
            "/image/upload/",
            "/image/upload/f_auto,q_auto,w_600/"
        );

    }


    return url;

}


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts(){

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
            docSnap => {

                const data =
                    docSnap.data();


                allProducts.push({

                    firestoreId:
                        docSnap.id,

                    ...data

                });

            }
        );


        /* Sort Product IDs */

        allProducts.sort(
            (a,b) => {

                const aId =
                    String(
                        a.Product_ID || ""
                    );

                const bId =
                    String(
                        b.Product_ID || ""
                    );


                return aId.localeCompare(
                    bId,
                    undefined,
                    {
                        numeric:true,
                        sensitivity:"base"
                    }
                );

            }
        );


        updateCount(
            allProducts.length
        );


        buildCategories();

        renderProducts(
            allProducts
        );


        buildSlider();


    }catch(error){

        console.error(
            "Product loading error:",
            error
        );


        if(productGrid){

            productGrid.innerHTML = `

                <div class="loading-box">

                    Products load نہیں ہو سکے۔

                    <br><br>

                    براہ کرم دوبارہ کوشش کریں۔

                </div>

            `;

        }


        if(productCount){

            productCount.textContent =
                "Error";

        }

    }

}


/* =========================================================
   COUNT
========================================================= */

function updateCount(count){

    if(!productCount){
        return;
    }


    productCount.textContent =
        count +
        " Products";

}


/* =========================================================
   CATEGORIES
========================================================= */

function buildCategories(){

    if(!categoryBar){
        return;
    }


    const categories = [];


    allProducts.forEach(
        product => {

            const category =
                String(
                    product.Category ||
                    "Other"
                ).trim();


            if(
                category &&
                !categories.includes(
                    category
                )
            ){

                categories.push(
                    category
                );

            }

        }
    );


    categoryBar.innerHTML = "";


    /* ALL */

    const allButton =
        document.createElement(
            "button"
        );


    allButton.type =
        "button";

    allButton.className =
        "category-btn active";

    allButton.textContent =
        "ALL";


    allButton.addEventListener(
        "click",
        () => {

            activeCategory =
                "ALL";

            updateCategoryButtons();

            renderProducts(
                filteredProducts()
            );

        }
    );


    categoryBar.appendChild(
        allButton
    );


    /* Categories */

    categories.forEach(
        category => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "category-btn";

            button.textContent =
                category;


            button.addEventListener(
                "click",
                () => {

                    activeCategory =
                        category;

                    updateCategoryButtons();

                    renderProducts(
                        filteredProducts()
                    );

                }
            );


            categoryBar.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   CATEGORY BUTTON STATE
========================================================= */

function updateCategoryButtons(){

    if(!categoryBar){
        return;
    }


    const buttons =
        categoryBar.querySelectorAll(
            ".category-btn"
        );


    buttons.forEach(
        button => {

            if(
                button.textContent.trim()
                ===
                activeCategory
            ){

                button.classList.add(
                    "active"
                );

            }else{

                button.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   FILTER
========================================================= */

function filteredProducts(){

    let products =
        [...allProducts];


    /* Category */

    if(
        activeCategory !== "ALL"
    ){

        products =
            products.filter(
                product => {

                    return String(
                        product.Category ||
                        "Other"
                    ).trim()
                    ===
                    activeCategory;

                }
            );

    }


    /* Search */

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    if(search){

        products =
            products.filter(
                product => {

                    const name =
                        String(
                            product.Product_Name ||
                            ""
                        ).toLowerCase();


                    const description =
                        String(
                            product.Description ||
                            ""
                        ).toLowerCase();


                    const category =
                        String(
                            product.Category ||
                            ""
                        ).toLowerCase();


                    const id =
                        String(
                            product.Product_ID ||
                            ""
                        ).toLowerCase();


                    return (

                        name.includes(search) ||

                        description.includes(search) ||

                        category.includes(search) ||

                        id.includes(search)

                    );

                }
            );

    }


    return products;

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(
    products
){

    if(!productGrid){
        return;
    }


    productGrid.innerHTML = "";


    updateCount(
        products.length
    );


    if(!products.length){

        productGrid.innerHTML = `

            <div
                class="loading-box"
                style="grid-column:1/-1;"
            >

                کوئی Product نہیں ملا۔

            </div>

        `;

        return;

    }


    const fragment =
        document.createDocumentFragment();


    products.forEach(
        product => {


            const productId =
                product.Product_ID ||
                "";


            const name =
                product.Product_Name ||
                "Product";


            const description =
                product.Description ||
                "";


            const price =
                product.Price ||
                "";


            const oldPrice =
                product.Old_Price ||
                "";


            const category =
                product.Category ||
                "";


            const rawImage =
                product.Image_URL ||
                product.Image ||
                "";


            const image =
                optimizeImage(
                    rawImage
                );


            const deliveryType =
                product.Delivery_Type ||
                "";


            const deliveryCharges =
                product.Delivery_Charges ||
                "";


            /*
             * Original supplier link
             */

            const supplierLink =
                product.Supplier_Link ||
                product.supplierLink ||
                product.Original_Supplier_Link ||
                "";


            /* =================================================
               ORDER FORM
            ================================================= */

            const orderFormPath =
                window.location.pathname
                    .replace(
                        /shop\.html$/i,
                        "order-form.html"
                    );


            const orderUrl =

                window.location.origin +

                orderFormPath +

                "?Product=" +
                enc(name) +

                "&Product_Description=" +
                enc(description) +

                "&Product_Price=" +
                enc(price) +

                "&Old_Price=" +
                enc(oldPrice) +

                "&Product_ID=" +
                enc(productId) +

                "&Product_Image=" +
                enc(image) +

                "&Category=" +
                enc(category) +

                "&Delivery_Type=" +
                enc(deliveryType) +

                "&Delivery_Charges=" +
                enc(deliveryCharges) +

                "&Supplier_Link=" +
                enc(supplierLink);


            /* =================================================
               CARD
            ================================================= */

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product-card";


            card.innerHTML = `

                <div
                    class="product-image-wrap"
                >

                    <img
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(name)}"
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="600"
                    >

                </div>


                <div
                    class="product-info"
                >

                    <div
                        class="product-category"
                    >
                        ${escapeHtml(category)}
                    </div>


                    <h3
                        class="product-name"
                    >
                        ${escapeHtml(name)}
                    </h3>


                    ${
                        description
                        ?
                        `
                        <p
                            class="product-description"
                        >
                            ${escapeHtml(
                                description
                            )}
                        </p>
                        `
                        :
                        ""
                    }


                    <div
                        class="product-price-row"
                    >

                        <span
                            class="product-price"
                        >
                            Rs.
                            ${escapeHtml(
                                price
                            )}
                        </span>


                        ${
                            oldPrice
                            ?
                            `
                            <span
                                class="product-old-price"
                            >
                                Rs.
                                ${escapeHtml(
                                    oldPrice
                                )}
                            </span>
                            `
                            :
                            ""
                        }

                    </div>


                    ${
                        deliveryType
                        ?
                        `
                        <div
                            class="delivery-info"
                        >
                            ${escapeHtml(
                                deliveryType
                            )}

                            ${
                                deliveryCharges
                                ?
                                `
                                —
                                Rs.
                                ${escapeHtml(
                                    deliveryCharges
                                )}
                                `
                                :
                                ""
                            }

                        </div>
                        `
                        :
                        ""
                    }


                    <a
                        class="order-btn"
                        href="${escapeHtml(
                            orderUrl
                        )}"
                    >
                        ORDER NOW
                    </a>

                </div>

            `;


            fragment.appendChild(
                card
            );

        }
    );


    productGrid.appendChild(
        fragment
    );

}


/* =========================================================
   SEARCH
========================================================= */

if(searchInput){

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
   SLIDER
========================================================= */

function buildSlider(){

    if(!sliderTrack){
        return;
    }


    sliderTrack.innerHTML = "";


    if(!allProducts.length){
        return;
    }


    /*
     * پہلے 10 products
     */

    const sliderProducts =
        allProducts.slice(
            0,
            Math.min(
                10,
                allProducts.length
            )
        );


    /*
     * دو مرتبہ cards بناتے ہیں
     * تاکہ continuous movement لگے۔
     */

    const displayProducts =
        [
            ...sliderProducts,
            ...sliderProducts
        ];


    const fragment =
        document.createDocumentFragment();


    displayProducts.forEach(
        product => {


            const name =
                product.Product_Name ||
                "Product";


            const price =
                product.Price ||
                "";


            const image =
                optimizeImage(
                    product.Image_URL ||
                    product.Image ||
                    ""
                );


            const productId =
                product.Product_ID ||
                "";


            const description =
                product.Description ||
                "";


            const category =
                product.Category ||
                "";


            const deliveryType =
                product.Delivery_Type ||
                "";


            const deliveryCharges =
                product.Delivery_Charges ||
                "";


            const supplierLink =
                product.Supplier_Link ||
                product.supplierLink ||
                product.Original_Supplier_Link ||
                "";


            const orderFormPath =
                window.location.pathname
                    .replace(
                        /shop\.html$/i,
                        "order-form.html"
                    );


            const orderUrl =

                window.location.origin +

                orderFormPath +

                "?Product=" +
                enc(name) +

                "&Product_Description=" +
                enc(description) +

                "&Product_Price=" +
                enc(price) +

                "&Product_ID=" +
                enc(productId) +

                "&Product_Image=" +
                enc(image) +

                "&Category=" +
                enc(category) +

                "&Delivery_Type=" +
                enc(deliveryType) +

                "&Delivery_Charges=" +
                enc(deliveryCharges) +

                "&Supplier_Link=" +
                enc(supplierLink);


            const card =
                document.createElement(
                    "a"
                );


            card.className =
                "slider-card";


            card.href =
                orderUrl;


            card.innerHTML = `

                <div
                    class="slider-card-image"
                >

                    <img
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(name)}"
                        loading="eager"
                        decoding="async"
                        width="120"
                        height="90"
                    >

                </div>


                <div
                    class="slider-card-name"
                >
                    ${escapeHtml(name)}
                </div>


                <div
                    class="slider-card-price"
                >
                    Rs.
                    ${escapeHtml(price)}
                </div>

            `;


            fragment.appendChild(
                card
            );

        }
    );


    sliderTrack.appendChild(
        fragment
    );


    startSlider();

}


/* =========================================================
   AUTO SLIDER
========================================================= */

function startSlider(){

    if(!sliderTrack){
        return;
    }


    if(sliderTimer){

        clearInterval(
            sliderTimer
        );

    }


    sliderPosition = 0;


    sliderTrack.style.transform =
        "translateX(0px)";


    /*
     * ہر 2.5 سیکنڈ میں
     * تقریباً ایک card آگے۔
     */

    sliderTimer =
        setInterval(
            () => {

                const cards =
                    sliderTrack.querySelectorAll(
                        ".slider-card"
                    );


                if(
                    !cards.length
                ){
                    return;
                }


                const firstCard =
                    cards[0];


                const cardWidth =
                    firstCard.offsetWidth +
                    10;


                sliderPosition +=
                    cardWidth;


                const halfWidth =
                    sliderTrack.scrollWidth / 2;


                if(
                    sliderPosition >=
                    halfWidth
                ){

                    sliderPosition =
                        0;

                }


                sliderTrack.style.transform =
                    "translateX(-" +
                    sliderPosition +
                    "px)";


            },
            2500
        );

}


/* =========================================================
   STOP SLIDER WHEN USER INTERACTS
========================================================= */

if(sliderTrack){

    sliderTrack.addEventListener(
        "mouseenter",
        () => {

            if(sliderTimer){

                clearInterval(
                    sliderTimer
                );

                sliderTimer =
                    null;

            }

        }
    );


    sliderTrack.addEventListener(
        "mouseleave",
        () => {

            startSlider();

        }
    );

}


/* =========================================================
   START SHOP
========================================================= */

loadProducts();
