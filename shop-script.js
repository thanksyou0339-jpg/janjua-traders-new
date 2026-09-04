import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


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


const productGrid =
    document.getElementById(
        "productGrid"
    );

const loadingMessage =
    document.getElementById(
        "loadingMessage"
    );

const categoryBar =
    document.getElementById(
        "categoryBar"
    );

const searchBox =
    document.getElementById(
        "searchBox"
    );


let allProducts = [];

let currentCategory = "All";


/* =====================================================
   LOAD PRODUCTS
===================================================== */

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
            item=>{

                allProducts.push({

                    id:item.id,

                    ...item.data()

                });

            }
        );


        allProducts.sort(
            (a,b)=>{

                const aId =
                    String(
                        a.Product_ID || ""
                    );

                const bId =
                    String(
                        b.Product_ID || ""
                    );

                return bId.localeCompare(
                    aId,
                    undefined,
                    {
                        numeric:true
                    }
                );

            }
        );


        loadingMessage.style.display =
            "none";


        buildCategories();

        renderProducts();


    }
    catch(error){

        console.error(
            error
        );


        loadingMessage.innerHTML =
            "Products load نہیں ہو سکے۔";


        loadingMessage.style.color =
            "#b91c1c";

    }

}


/* =====================================================
   CATEGORIES
===================================================== */

function buildCategories(){

    const categories =
        [
            "All",
            ...new Set(
                allProducts
                    .map(
                        p =>
                            p.Category
                    )
                    .filter(Boolean)
            )
        ];


    categoryBar.innerHTML = "";


    categories.forEach(
        category=>{

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "category-btn";


            if(
                category === "All"
            ){

                button.classList.add(
                    "active"
                );

            }


            button.dataset.category =
                category;


            button.textContent =
                category === "All"
                    ? "✨ All"
                    : category;


            button.addEventListener(
                "click",
                ()=>{

                    currentCategory =
                        category;


                    document
                        .querySelectorAll(
                            ".category-btn"
                        )
                        .forEach(
                            b =>
                                b.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    renderProducts();

                }
            );


            categoryBar.appendChild(
                button
            );

        }
    );

}


/* =====================================================
   RENDER
===================================================== */

function renderProducts(){

    const search =
        searchBox.value
            .trim()
            .toLowerCase();


    const filtered =
        allProducts.filter(
            product=>{

                const categoryMatch =
                    currentCategory === "All" ||
                    product.Category ===
                        currentCategory;


                const name =
                    String(
                        product.Product_Name ||
                        product.Product ||
                        ""
                    )
                    .toLowerCase();


                const description =
                    String(
                        product.Product_Description ||
                        ""
                    )
                    .toLowerCase();


                const searchMatch =
                    !search ||
                    name.includes(search) ||
                    description.includes(search);


                return (
                    categoryMatch &&
                    searchMatch
                );

            }
        );


    productGrid.innerHTML = "";


    if(!filtered.length){

        productGrid.innerHTML =
            `
            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:40px;
                    color:#777;
                "
            >
                Product نہیں ملا۔
            </div>
            `;

        return;

    }


    /*
      DocumentFragment استعمال کرنے سے
      DOM پر بار بار load نہیں پڑتا۔
    */

    const fragment =
        document.createDocumentFragment();


    filtered.forEach(
        product=>{

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product-card";


            const name =
                product.Product_Name ||
                product.Product ||
                "Product";


            const description =
                product.Product_Description ||
                "";


            const price =
                Number(
                    product.Product_Price || 0
                );


            const oldPrice =
                Number(
                    product.Old_Price || 0
                );


            const image =
                product.Product_Image ||
                "";


            const productId =
                product.Product_ID ||
                "";


            const deliveryType =
                product.Delivery_Type ||
                "Free Delivery";


            const deliveryCharges =
                Number(
                    product.Delivery_Charges || 0
                );


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


                <div class="product-content">

                    <h3>
                        ${escapeHtml(name)}
                    </h3>


                    ${
                        description
                        ?
                        `
                        <p>
                            ${escapeHtml(
                                description
                            )}
                        </p>
                        `
                        :
                        ""
                    }


                    <div class="price-row">

                        <strong>
                            Rs. ${price.toLocaleString()}
                        </strong>


                        ${
                            oldPrice > price
                            ?
                            `
                            <del>
                                Rs. ${oldPrice.toLocaleString()}
                            </del>
                            `
                            :
                            ""
                        }

                    </div>


                    <div class="delivery-row">

                        ${
                            deliveryType ===
                            "Free Delivery"
                            ?
                            "🚚 Free Delivery"
                            :
                            "🚚 Delivery: Rs. " +
                            deliveryCharges.toLocaleString()
                        }

                    </div>


                    <button
                        type="button"
                        class="order-now-btn"
                    >
                        ORDER NOW
                    </button>

                </div>

            `;


            const orderButton =
                card.querySelector(
                    ".order-now-btn"
                );


            orderButton.addEventListener(
                "click",
                ()=>{

                    openOrderForm(
                        product
                    );

                }
            );


            fragment.appendChild(
                card
            );

        }
    );


    productGrid.appendChild(
        fragment
    );

}


/* =====================================================
   ORDER LINK
===================================================== */

function openOrderForm(product){

    const params =
        new URLSearchParams();


    params.set(
        "Product",
        product.Product_Name ||
        product.Product ||
        ""
    );


    params.set(
        "Product_Description",
        product.Product_Description ||
        ""
    );


    params.set(
        "Product_Price",
        product.Product_Price ||
        0
    );


    params.set(
        "Old_Price",
        product.Old_Price ||
        0
    );


    params.set(
        "Product_ID",
        product.Product_ID ||
        ""
    );


    params.set(
        "Product_Image",
        product.Product_Image ||
        ""
    );


    params.set(
        "Category",
        product.Category ||
        ""
    );


    params.set(
        "Delivery_Type",
        product.Delivery_Type ||
        "Free Delivery"
    );


    params.set(
        "Delivery_Charges",
        product.Delivery_Charges ||
        0
    );


    window.location.href =
        "order-form.html?" +
        params.toString();

}


/* =====================================================
   SEARCH
===================================================== */

searchBox.addEventListener(
    "input",
    renderProducts
);


/* =====================================================
   ESCAPE
===================================================== */

function escapeHtml(value){

    return String(
        value ?? ""
    )
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


/* =====================================================
   START
===================================================== */

loadProducts();
