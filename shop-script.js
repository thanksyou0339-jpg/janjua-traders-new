/* =========================================
   JANJUA DIGITAL MARKETING
   PUBLIC SHOP SCRIPT
========================================= */

import {
    initializeApp
}
from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";


import {
    getFirestore,
    collection,
    getDocs
}
from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {

    apiKey:
    "AIzaSyA8_4ArKXAdfKWZ5miDa5T9qiayL3h_Yzw",

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
document.getElementById("productGrid");


const searchBox =
document.getElementById("searchBox");


const loadingMessage =
document.getElementById("loadingMessage");


const categoryBar =
document.getElementById("categoryBar");


let products = [];


/* =========================================
   NEW ITEM
========================================= */

const NEW_ITEM_DAYS = 7;


function rupees(value){

    return "Rs. " +
    Number(value || 0)
    .toLocaleString("en-PK");

}


function isNewProduct(product){

    if(!product.createdAt){

        return false;

    }


    const created =
    new Date(
        product.createdAt
    ).getTime();


    if(Number.isNaN(created)){

        return false;

    }


    const age =
    Date.now() - created;


    return(

        age >= 0 &&

        age <=
        NEW_ITEM_DAYS *
        24 *
        60 *
        60 *
        1000

    );

}


/* =========================================
   LOAD PRODUCTS
========================================= */

async function loadProducts(){

    try{

        if(loadingMessage){

            loadingMessage.style.display =
            "flex";

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
            function(document){

                const product =
                document.data();


                products.push({

                    firestoreId:
                    document.id,

                    id:
                    product.id ||
                    document.id,

                    name:
                    product.name ||
                    "Product",

                    category:
                    product.category ||
                    "Other",

                    price:
                    Number(
                        product.price ||
                        0
                    ),

                    oldPrice:
                    Number(
                        product.oldPrice ||
                        0
                    ),

                    description:
                    product.description ||
                    "",

                    image:
                    product.image ||
                    "",

                    createdAt:
                    product.createdAt ||
                    null

                });

            }
        );


        /*
         * Latest products first
         */

        products.sort(
            function(a,b){

                return(
                    new Date(
                        b.createdAt || 0
                    ) -

                    new Date(
                        a.createdAt || 0
                    )
                );

            }
        );


        buildCategories();


        if(loadingMessage){

            loadingMessage.style.display =
            "none";

        }


        showProducts(
            products
        );


    }catch(error){

        console.error(
            "FIREBASE PRODUCTS ERROR:",
            error
        );


        if(loadingMessage){

            loadingMessage.style.display =
            "flex";

            loadingMessage.innerHTML = `

                <span>
                    Products load نہیں ہو سکے۔
                    براہِ کرم دوبارہ کوشش کریں۔
                </span>

            `;

        }

    }

}


/* =========================================
   CATEGORIES
========================================= */

function buildCategories(){

    if(!categoryBar){

        return;

    }


    const categories = [

        {
            name:"All",
            icon:"✨"
        },

        {
            name:"Shoes",
            icon:"👟"
        },

        {
            name:"Clothes",
            icon:"👕"
        },

        {
            name:"Beauty",
            icon:"💄"
        },

        {
            name:"Electronics",
            icon:"📱"
        },

        {
            name:"Other",
            icon:"🛍️"
        }

    ];


    const existingCategories =
    new Set(

        products

        .map(
            function(product){

                return String(
                    product.category ||
                    ""
                ).trim();

            }
        )

        .filter(Boolean)

    );


    existingCategories.forEach(
        function(category){

            const exists =
            categories.some(
                function(item){

                    return(
                        item.name.toLowerCase() ===
                        category.toLowerCase()
                    );

                }
            );


            if(!exists){

                categories.push({

                    name:category,

                    icon:"🏷️"

                });

            }

        }
    );


    categoryBar.innerHTML =

    categories
    .map(
        function(item){

            return `

                <button
                    type="button"
                    class="category-btn ${
                        item.name === "All"
                        ? "active"
                        : ""
                    }"
                    data-category="${
                        escapeAttribute(
                            item.name
                        )
                    }"
                >

                    ${item.icon}

                    ${escapeHtml(
                        item.name
                    )}

                </button>

            `;

        }
    )
    .join("");


    categoryBar
    .querySelectorAll(
        ".category-btn"
    )
    .forEach(
        function(button){

            button.addEventListener(
                "click",
                function(){

                    categoryBar
                    .querySelectorAll(
                        ".category-btn"
                    )
                    .forEach(
                        function(btn){

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    showCategory(
                        this.dataset.category
                    );

                }
            );

        }
    );

}


/* =========================================
   SHOW PRODUCTS
========================================= */

function showProducts(
    productList
){

    if(!productGrid){

        return;

    }


    if(!productList.length){

        productGrid.innerHTML = `

            <div
                style="
                grid-column:1/-1;
                text-align:center;
                padding:50px 20px;
                background:white;
                border-radius:18px;
                "
            >

                <h3>
                    Product نہیں ملا
                </h3>

                <p
                    style="
                    color:#6b7280;
                    "
                >
                    دوسری category یا search استعمال کریں۔
                </p>

            </div>

        `;

        return;

    }


    productGrid.innerHTML =

    productList
    .map(
        function(product){

            const image =
            product.image ||

            "https://via.placeholder.com/500x500?text=Product";


            const newBadge =
            isNewProduct(product)

            ?

            `

                <div
                    class="new-badge"
                >
                    ✨ NEW ITEM
                </div>

            `

            :

            "";


            return `

                <article
                    class="product-card"
                >

                    <div
                        class="product-image-wrap"
                    >

                        ${newBadge}


                        <img

                            src="${
                                escapeAttribute(
                                    image
                                )
                            }"

                            alt="${
                                escapeAttribute(
                                    product.name
                                )
                            }"

                            loading="lazy"

                            onerror="
                            this.src='https://via.placeholder.com/500x500?text=Product'
                            "

                        >

                    </div>


                    <div
                        class="product-info"
                    >

                        <h3 dir="auto">

                            ${escapeHtml(
                                product.name
                            )}

                        </h3>


                        <p dir="auto">

                            ${escapeHtml(
                                product.description ||
                                ""
                            )}

                        </p>


                        <div
                            class="price-row"
                        >

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

                            data-product-id="${
                                escapeAttribute(
                                    product.id
                                )
                            }"

                        >

                            ORDER NOW

                        </button>

                    </div>

                </article>

            `;

        }
    )
    .join("");


    productGrid
    .querySelectorAll(
        ".order-btn"
    )
    .forEach(
        function(button){

            button.addEventListener(
                "click",
                function(){

                    orderProduct(
                        this.getAttribute(
                            "data-product-id"
                        )
                    );

                }
            );

        }
    );

}


/* =========================================
   ORDER
========================================= */

function orderProduct(
    productId
){

    const product =
    products.find(
        function(p){

            return(
                String(p.id) ===
                String(productId)
            );

        }
    );


    if(!product){

        alert(
            "Product نہیں ملا"
        );

        return;

    }


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
     * Supplier / Markaz / Daraz
     * information is NOT sent
     * to customer.
     */


    window.location.href =
        "order-form.html?" +
        params.toString();

}


/* =========================================
   CATEGORY FILTER
========================================= */

window.showCategory =
function(category){

    if(
        !category ||
        category === "All"
    ){

        showProducts(
            products
        );

        return;

    }


    const filtered =
    products.filter(
        function(product){

            return(

                String(
                    product.category ||
                    ""
                )
                .toLowerCase()

                ===

                String(
                    category
                )
                .toLowerCase()

            );

        }
    );


    showProducts(
        filtered
    );

};


/* =========================================
   SEARCH
========================================= */

if(searchBox){

    searchBox.addEventListener(
        "input",
        function(){

            const text =
            this.value
            .trim()
            .toLowerCase();


            if(!text){

                showProducts(
                    products
                );

                return;

            }


            const filtered =
            products.filter(
                function(product){

                    const name =
                    String(
                        product.name ||
                        ""
                    )
                    .toLowerCase();


                    const description =
                    String(
                        product.description ||
                        ""
                    )
                    .toLowerCase();


                    const category =
                    String(
                        product.category ||
                        ""
                    )
                    .toLowerCase();


                    return(

                        name.includes(text) ||

                        description.includes(text) ||

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
   ESCAPE
========================================= */

function escapeHtml(value){

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


function escapeAttribute(value){

    return escapeHtml(
        value
    );

}


/* =========================================
   START
========================================= */

loadProducts();
