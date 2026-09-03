/* =========================================
   JANJUA DIGITAL MARKETING
   PUBLIC SHOP SCRIPT
   FIREBASE FREE VERSION
========================================= */

import {
    JANJUA_PRODUCTS
} from "./products.js";


const productGrid =
    document.getElementById("productGrid");

const searchBox =
    document.getElementById("searchBox");

const loadingMessage =
    document.getElementById("loadingMessage");

const categoryBar =
    document.getElementById("categoryBar");


let products = [];


const NEW_ITEM_DAYS = 7;


/* =========================================
   RUPEES
========================================= */

function rupees(value){

    return "Rs. " +
        Number(value || 0)
        .toLocaleString("en-PK");

}


/* =========================================
   NEW PRODUCT
========================================= */

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

function loadProducts(){

    try{

        if(loadingMessage){

            loadingMessage.style.display =
                "flex";

        }


        products =
            Array.isArray(JANJUA_PRODUCTS)
                ? JANJUA_PRODUCTS.map(
                    product => ({
                        ...product
                    })
                )
                : [];


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


        showProducts(products);


    }catch(error){

        console.error(
            "PRODUCT ERROR:",
            error
        );


        if(loadingMessage){

            loadingMessage.innerHTML = `
                <span>
                    Products load نہیں ہو سکے۔
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
                        product.category || ""
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

                    name: category,

                    icon: "🏷️"

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
                        data-category="${escapeAttribute(item.name)}"
                    >

                        ${item.icon}

                        ${escapeHtml(item.name)}

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

function showProducts(productList){

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

                <p style="color:#6b7280;">
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
                        <div class="new-badge">
                            ✨ NEW ITEM
                        </div>
                    `

                    :

                    "";


                return `

                    <article class="product-card">

                        <div class="product-image-wrap">

                            ${newBadge}

                            <img
                                src="${escapeAttribute(image)}"
                                alt="${escapeAttribute(product.name || "Product")}"
                                loading="lazy"
                                onerror="
                                    this.src='https://via.placeholder.com/500x500?text=Product'
                                "
                            >

                        </div>


                        <div class="product-info">

                            <h3 dir="auto">
                                ${escapeHtml(
                                    product.name || "Product"
                                )}
                            </h3>


                            <p dir="auto">
                                ${escapeHtml(
                                    product.description || ""
                                )}
                            </p>


                            <div class="price-row">

                                <strong>
                                    ${rupees(product.price)}
                                </strong>


                                ${
                                    Number(product.oldPrice || 0) > 0

                                    ?

                                    `
                                        <del>
                                            ${rupees(product.oldPrice)}
                                        </del>
                                    `

                                    :

                                    ""
                                }

                            </div>


                            <button
                                class="order-btn"
                                type="button"
                                data-product-id="${escapeAttribute(product.id)}"
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
        .querySelectorAll(".order-btn")
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
   ORDER PRODUCT
========================================= */

function orderProduct(productId){

    const product =
        products.find(
            function(item){

                return(
                    String(item.id) ===
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


    params.set(
        "Delivery_Type",
        product.deliveryType ||
        "Free Delivery"
    );


    params.set(
        "Delivery_Charges",
        product.deliveryCharges || 0
    );


    window.location.href =
        "order-form.html?" +
        params.toString();

}


/* =========================================
   CATEGORY
========================================= */

function showCategory(category){

    if(
        !category ||
        category === "All"
    ){

        showProducts(products);

        return;

    }


    const filtered =
        products.filter(
            function(product){

                return(
                    String(
                        product.category || ""
                    )
                    .toLowerCase()

                    ===

                    String(category)
                    .toLowerCase()
                );

            }
        );


    showProducts(filtered);

}


window.showCategory =
    showCategory;


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

                showProducts(products);

                return;

            }


            const filtered =
                products.filter(
                    function(product){

                        const name =
                            String(
                                product.name || ""
                            )
                            .toLowerCase();


                        const description =
                            String(
                                product.description || ""
                            )
                            .toLowerCase();


                        const category =
                            String(
                                product.category || ""
                            )
                            .toLowerCase();


                        return(
                            name.includes(text) ||
                            description.includes(text) ||
                            category.includes(text)
                        );

                    }
                );


            showProducts(filtered);

        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value){

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


function escapeAttribute(value){

    return escapeHtml(value);

}


/* =========================================
   START
========================================= */

loadProducts();
