<!DOCTYPE html>
<html lang="ur" dir="rtl">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="description"
        content="JANJUA TRADERS Online Shopping — معیاری مصنوعات اور آسان آن لائن آرڈر"
    >

    <title>
        JANJUA TRADERS — Online Shop
    </title>

    <link
        rel="stylesheet"
        href="./website-style.css"
    >

</head>


<body class="shop-page">


    <!-- =====================================================
         HEADER
    ====================================================== -->

    <header class="site-header">

        <div class="header-inner">

            <a
                href="./index.html"
                class="brand"
            >

                <span class="brand-icon">
                    JT
                </span>

                <span class="brand-text">

                    <strong>
                        JANJUA TRADERS
                    </strong>

                    <small>
                        Online Shopping & Services
                    </small>

                </span>

            </a>


            <div class="shop-header-actions">

                <a
                    href="./index.html"
                    class="header-home-btn"
                >
                    🏠 Home
                </a>

                <div
                    class="product-list-dropdown"
                    id="productListDropdown"
                >

                    <button
                        type="button"
                        id="productListToggle"
                        class="product-list-toggle"
                        aria-expanded="false"
                    >

                        📦 Product List
                        <span>⌄</span>

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

                    </div>

                </div>

            </div>

        </div>

    </header>



    <!-- =====================================================
         PAGE STATUS
    ====================================================== -->

    <div
        id="pageStatus"
        class="status"
        aria-live="polite"
    ></div>



    <!-- =====================================================
         SHOP HERO
    ====================================================== -->

    <section class="shop-hero">

        <div class="shop-hero-content">

            <span class="shop-hero-badge">
                🛍️ JANJUA TRADERS ONLINE SHOP
            </span>


            <h1>
                اپنی ضرورت کی
                <span>پروڈکٹ</span>
                تلاش کریں
            </h1>


            <p>

                معیاری مصنوعات، آسان browsing اور
                آسان online ordering — سب کچھ ایک جگہ۔

            </p>


            <a
                href="#productsSection"
                class="shop-hero-btn"
            >

                🛒 Products دیکھیں

            </a>

        </div>

    </section>



    <!-- =====================================================
         FEATURED PRODUCTS
    ====================================================== -->

    <section class="featured-section">

        <div class="section-heading featured-heading">

            <span>
                ⭐ FEATURED PRODUCTS
            </span>

            <h2>
                ہماری منتخب مصنوعات
            </h2>

            <p>
                تازہ اور دستیاب products یہاں دیکھیں۔
            </p>

        </div>


        <div
            id="sliderLoading"
            class="loading-box"
        >

            <div class="loading-spinner"></div>

            <span>
                Products load ہو رہے ہیں...
            </span>

        </div>


        <div
            id="slider"
            class="slider-box"
            style="display:none;"
        >

            <div
                class="slider"
                id="sliderViewport"
            >

                <div
                    class="slider-track"
                    id="sliderTrack"
                ></div>

            </div>

        </div>

    </section>



    <!-- =====================================================
         PRODUCTS
    ====================================================== -->

    <main
        class="products-section"
        id="productsSection"
    >

        <div class="products-heading">

            <div>

                <span class="section-small-label">
                    🛍️ ONLINE STORE
                </span>

                <h2>
                    تمام مصنوعات
                </h2>

                <p>
                    اپنی پسند کی product منتخب کریں اور آرڈر شروع کریں۔
                </p>

            </div>


            <div
                class="product-count-box"
            >

                <span>
                    Available
                </span>

                <strong id="productCount">
                    0 Products
                </strong>

            </div>

        </div>



        <!-- Products Loading -->

        <div
            id="productsLoading"
            class="loading-box"
        >

            <div class="loading-spinner"></div>

            <span>
                Products load ہو رہے ہیں...
            </span>

        </div>



        <!-- Products Grid -->

        <div
            id="productsGrid"
            class="products-grid"
        ></div>

    </main>



    <!-- =====================================================
         SELLER CTA
    ====================================================== -->

    <section class="shop-seller-cta">

        <div class="shop-seller-inner">

            <div class="shop-seller-icon">
                📦
            </div>


            <div>

                <span>
                    SELL WITH JANJUA TRADERS
                </span>

                <h2>
                    اپنی پروڈکٹ بھی آن لائن فروخت کروائیں
                </h2>

                <p>

                    اگر آپ اپنی product JANJUA TRADERS
                    کے ذریعے online فروخت کروانا چاہتے ہیں
                    تو ہم سے رابطہ کریں۔

                </p>

            </div>


            <a
                href="mailto:info24.pk@gmail.com?subject=Product%20Listing%20-%20JANJUA%20TRADERS"
                class="seller-btn"
            >

                📩 رابطہ کریں

            </a>

        </div>

    </section>



    <!-- =====================================================
         FOOTER
    ====================================================== -->

    <footer class="site-footer">

        <div class="footer-inner">


            <div class="footer-brand">

                <strong>
                    JANJUA TRADERS
                </strong>

                <p>
                    آپ کی ضرورت، ہماری ذمہ داری
                </p>

            </div>


            <div class="footer-links">

                <a href="./index.html">
                    🏠 Home
                </a>

                <a href="./website.html">
                    🛍️ Shop
                </a>

                <a href="mailto:info24.pk@gmail.com">
                    📧 Contact
                </a>

            </div>


        </div>


        <div class="footer-bottom">

            <span>
                © 2026 JANJUA TRADERS
            </span>

            <span>
                Quality Products • Easy Ordering • Better Service
            </span>

        </div>

    </footer>



    <!-- =====================================================
         FIREBASE / WEBSITE SCRIPT
    ====================================================== -->

    <script
        type="module"
        src="./website-script.js?v=20260911"
    ></script>


</body>

</html>
