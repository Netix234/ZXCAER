/* ============================================================
   ZXCAER — PRODUCT PAGE
============================================================ */


/* ============================================================
   SUPABASE
============================================================ */

const SUPABASE_URL =
    "https://gxkmnkphocqvlhnerkix.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_B3hq0yrXvptyr4KT7dCczg_5VVVeup_";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* ============================================================
   CART STORAGE
============================================================ */

const CART_KEY = "zxcaerCart";


/* ============================================================
   ELEMENTS
============================================================ */

const loading =
    document.getElementById("loading");

const productError =
    document.getElementById("productError");

const productContent =
    document.getElementById("productContent");

const mainProductImage =
    document.getElementById("mainProductImage");

const thumbnails =
    document.getElementById("thumbnails");

const productName =
    document.getElementById("productName");

const productPrice =
    document.getElementById("productPrice");

const imageStatus =
    document.getElementById("imageStatus");

const imageStatusText =
    document.getElementById("imageStatusText");

const priceStatus =
    document.getElementById("priceStatus");

const priceStatusText =
    document.getElementById("priceStatusText");

const sizeBlock =
    document.getElementById("sizeBlock");

const sizesContainer =
    document.getElementById("sizes");

const description =
    document.getElementById("description");

const quantityElement =
    document.getElementById("quantity");

const minusButton =
    document.getElementById("minusButton");

const plusButton =
    document.getElementById("plusButton");

const addButton =
    document.getElementById("addButton");

const buyButton =
    document.getElementById("buyButton");

const toast =
    document.getElementById("toast");


/* ============================================================
   GALLERY ARROWS
============================================================ */

const galleryPrev =
    document.getElementById("galleryPrev");

const galleryNext =
    document.getElementById("galleryNext");


/* ============================================================
   CART ELEMENTS
============================================================ */

const cartButton =
    document.getElementById("cartButton");

const cartCount =
    document.getElementById("cartCount");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartClose =
    document.getElementById("cartClose");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const cartCheckoutButton =
    document.getElementById(
        "cartCheckoutButton"
    );


/* ============================================================
   ORDER MODAL ELEMENTS — SAME AS INDEX.HTML
============================================================ */

const orderModal = document.getElementById("orderModal");
const orderModalOverlay = document.getElementById("orderModalOverlay");
const orderModalClose = document.getElementById("orderModalClose");
const orderForm = document.getElementById("orderForm");
const orderSummaryItems = document.getElementById("orderSummaryItems");
const orderSummaryTotal = document.getElementById("orderSummaryTotal");


/* ============================================================
   DELIVERY — SAME AS INDEX.HTML
============================================================ */

const deliveryMethod = document.getElementById("deliveryMethod");
const novaPoshtaField = document.getElementById("novaPoshtaField");
const ukrPoshtaField = document.getElementById("ukrPoshtaField");
const novaPoshtaType = document.getElementById("novaPoshtaType");
const novaPoshtaLockerField = document.getElementById("novaPoshtaLockerField");
const novaPoshtaBranchField = document.getElementById("novaPoshtaBranchField");
const novaPoshtaLockerNumber = document.getElementById("novaPoshtaLockerNumber");
const novaPoshtaLockerAddress = document.getElementById("novaPoshtaLockerAddress");
const novaPoshtaBranchNumber = document.getElementById("novaPoshtaBranchNumber");
const novaPoshtaBranchAddress = document.getElementById("novaPoshtaBranchAddress");
const ukrPoshtaIndex = document.getElementById("ukrPoshtaIndex");


/* ============================================================
   STATE
============================================================ */

let currentProduct = null;

let quantity = 1;

let selectedSize = null;

let gallery = [];

let currentGalleryIndex = 0;

let cart = loadCart();


/* ============================================================
   STATUS
============================================================ */

const STATUS_CONFIG = {

    available: {
        text: "В НАЯВНОСТІ",
        className: "available"
    },

    sold_out: {
        text: "РОЗПРОДАНО",
        className: "sold-out"
    },

    sale: {
        text: "РОЗПРОДАЖ",
        className: "sale"
    },

    coming_soon: {
        text: "СКОРО",
        className: "coming-soon"
    }

};


/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /[&<>"']/g,
            character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            })[character]
        );

}


/* ============================================================
   IMAGE URL
============================================================ */

function getImageUrl(path) {

    if (!path) {
        return "";
    }

    if (
        path.startsWith("http://") ||
        path.startsWith("https://")
    ) {
        return path;
    }

    if (
        path.startsWith("images/")
    ) {
        return path;
    }

    return supabaseClient
        .storage
        .from("product-images")
        .getPublicUrl(path)
        .data
        .publicUrl;

}


/* ============================================================
   PRICE
============================================================ */

function formatPrice(value) {

    return "₴" +
        Number(value || 0)
            .toLocaleString(
                "uk-UA",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

}


/* ============================================================
   PRODUCT ID
============================================================ */

function getProductId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");

}


/* ============================================================
   LOAD PRODUCT
============================================================ */

async function loadProduct() {

    const productId =
        getProductId();

    if (!productId) {

        showError(
            "Товар не знайдено."
        );

        return;
    }

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("products")
            .select("*")
            .eq("id", productId)
            .maybeSingle();

        if (error) {

            console.error(error);

            throw error;
        }

        if (!data) {

            showError(
                "Товар не знайдено."
            );

            return;
        }

        currentProduct = data;

        renderProduct(data);

    }

    catch (error) {

        console.error(
            "Product error:",
            error
        );

        showError(
            "Не вдалося завантажити товар."
        );

    }

}


/* ============================================================
   RENDER PRODUCT
============================================================ */

function renderProduct(product) {

    const status =
        product.status || "available";

    const statusConfig =
        STATUS_CONFIG[status] ||
        STATUS_CONFIG.available;


    productName.textContent =
        product.name || "Товар";


    document.title =
        `${product.name || "Товар"} — ZXCAER`;


    productPrice.textContent =
        formatPrice(product.price);


    applyStatus(
        imageStatus,
        imageStatusText,
        statusConfig
    );


    applyStatus(
        priceStatus,
        priceStatusText,
        statusConfig
    );


    /* ========================================================
       GALLERY
    ======================================================== */

    gallery = [];

    currentGalleryIndex = 0;


    if (product.front_image) {

        gallery.push(
            product.front_image
        );

    }


    if (product.back_image) {

        gallery.push(
            product.back_image
        );

    }


    let extraGallery =
        product.gallery_images;


    if (
        typeof extraGallery === "string"
    ) {

        try {

            extraGallery =
                JSON.parse(
                    extraGallery
                );

        }

        catch {

            extraGallery = [];

        }

    }


    if (
        Array.isArray(extraGallery)
    ) {

        extraGallery.forEach(
            image => {

                if (
                    image &&
                    !gallery.includes(image)
                ) {

                    gallery.push(image);

                }

            }
        );

    }


    renderGallery();


    /* ========================================================
       SIZES
    ======================================================== */

    let sizes =
        product.sizes;


    if (
        typeof sizes === "string"
    ) {

        try {

            sizes =
                JSON.parse(sizes);

        }

        catch {

            sizes =
                sizes
                    .split(",")
                    .map(
                        item =>
                            item.trim()
                    );

        }

    }


    if (
        !Array.isArray(sizes)
    ) {

        sizes = [];

    }


    renderSizes(sizes);


    /* ========================================================
       DESCRIPTION
    ======================================================== */

    renderDescription(
        product.description
    );


    const soldOut =
        status === "sold_out";

    const comingSoon =
        status === "coming_soon";


    addButton.disabled =
        soldOut ||
        comingSoon;


    buyButton.disabled =
        soldOut ||
        comingSoon;


    loading.style.display =
        "none";


    productContent.style.display =
        "grid";


    updateQuantity();

}


/* ============================================================
   STATUS
============================================================ */

function applyStatus(
    element,
    textElement,
    config
) {

    if (!element || !textElement) {
        return;
    }


    element.classList.remove(
        "available",
        "sold-out",
        "sale",
        "coming-soon"
    );


    element.classList.add(
        config.className
    );


    textElement.textContent =
        config.text;

}


/* ============================================================
   GALLERY
============================================================ */

function renderGallery() {

    thumbnails.innerHTML =
        "";


    if (
        gallery.length === 0
    ) {

        mainProductImage.style.display =
            "none";

        updateGalleryArrows();

        return;

    }


    mainProductImage.style.display =
        "block";


    gallery.forEach(
        (image, index) => {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "thumbnail";


            if (
                index === 0
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.innerHTML = `
                <img
                    src="${escapeHTML(
                        getImageUrl(image)
                    )}"
                    alt=""
                >
            `;


            button.addEventListener(
                "click",
                () => {

                    setMainImage(
                        image,
                        index
                    );

                }
            );


            thumbnails.appendChild(
                button
            );

        }
    );


    setMainImage(
        gallery[0],
        0
    );


    updateGalleryArrows();

}


/* ============================================================
   MAIN IMAGE
============================================================ */

function setMainImage(
    image,
    index
) {

    if (!image) {
        return;
    }


    currentGalleryIndex =
        index;


    mainProductImage.style.opacity =
        "0";


    setTimeout(
        () => {

            mainProductImage.src =
                getImageUrl(image);

            mainProductImage.alt =
                currentProduct?.name ||
                "ZXCAER";

            mainProductImage.style.opacity =
                "1";

        },
        100
    );


    thumbnails
        .querySelectorAll(".thumbnail")
        .forEach(
            (item, itemIndex) => {

                item.classList.toggle(
                    "active",
                    itemIndex === index
                );

            }
        );

}


/* ============================================================
   GALLERY — PREVIOUS IMAGE
============================================================ */

function showPreviousImage() {

    if (
        gallery.length <= 1
    ) {
        return;
    }


    currentGalleryIndex =
        (
            currentGalleryIndex -
            1 +
            gallery.length
        ) %
        gallery.length;


    setMainImage(
        gallery[currentGalleryIndex],
        currentGalleryIndex
    );

}


/* ============================================================
   GALLERY — NEXT IMAGE
============================================================ */

function showNextImage() {

    if (
        gallery.length <= 1
    ) {
        return;
    }


    currentGalleryIndex =
        (
            currentGalleryIndex +
            1
        ) %
        gallery.length;


    setMainImage(
        gallery[currentGalleryIndex],
        currentGalleryIndex
    );

}


/* ============================================================
   GALLERY — ARROWS VISIBILITY
============================================================ */

function updateGalleryArrows() {

    const hasMultipleImages =
        gallery.length > 1;


    if (galleryPrev) {

        galleryPrev.style.display =
            hasMultipleImages
                ? "flex"
                : "none";

    }


    if (galleryNext) {

        galleryNext.style.display =
            hasMultipleImages
                ? "flex"
                : "none";

    }

}


/* ============================================================
   GALLERY — ARROW BUTTONS
============================================================ */

if (galleryPrev) {

    galleryPrev.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            showPreviousImage();

        }
    );

}


if (galleryNext) {

    galleryNext.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            showNextImage();

        }
    );

}


/* ============================================================
   GALLERY — KEYBOARD
============================================================ */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "ArrowLeft"
        ) {

            showPreviousImage();

        }


        if (
            event.key === "ArrowRight"
        ) {

            showNextImage();

        }

    }
);


/* ============================================================
   SIZES
============================================================ */

function renderSizes(sizes) {

    sizesContainer.innerHTML =
        "";


    if (
        sizes.length === 0
    ) {

        sizeBlock.style.display =
            "none";

        selectedSize =
            null;

        return;

    }


    sizeBlock.style.display =
        "block";


    sizes.forEach(
        (size, index) => {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "size-button";


            button.textContent =
                size;


            button.addEventListener(
                "click",
                () => {

                    selectedSize =
                        size;


                    sizesContainer
                        .querySelectorAll(
                            ".size-button"
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

                }
            );


            sizesContainer.appendChild(
                button
            );


            if (
                index === 0
            ) {

                selectedSize =
                    size;

                button.classList.add(
                    "active"
                );

            }

        }
    );

}


/* ============================================================
   DESCRIPTION
============================================================ */

function renderDescription(value) {

    if (!description) {
        return;
    }


    if (!value) {

        description.innerHTML =
            "";

        return;

    }


    const lines =
        String(value)
            .split("\n")
            .map(
                item =>
                    item.trim()
            )
            .filter(Boolean);


    if (
        lines.length > 1
    ) {

        description.innerHTML = `
            <ul>
                ${lines.map(
                    line =>
                        `<li>${escapeHTML(line)}</li>`
                ).join("")}
            </ul>
        `;

    }

    else {

        description.innerHTML = `
            <p>
                ${escapeHTML(value)}
            </p>
        `;

    }

}


/* ============================================================
   QUANTITY
============================================================ */

function updateQuantity() {

    if (!quantityElement) {
        return;
    }


    quantityElement.textContent =
        quantity;


    if (minusButton) {

        minusButton.disabled =
            quantity <= 1;

    }


    const stock =
        Number(
            currentProduct?.stock
        );


    if (plusButton) {

        if (
            Number.isFinite(stock) &&
            stock > 0
        ) {

            plusButton.disabled =
                quantity >= stock;

        }

        else {

            plusButton.disabled =
                false;

        }

    }

}


/* ============================================================
   MINUS
============================================================ */

if (minusButton) {

    minusButton.addEventListener(
        "click",
        () => {

            if (
                quantity <= 1
            ) {

                return;

            }


            quantity--;

            updateQuantity();

        }
    );

}


/* ============================================================
   PLUS
============================================================ */

if (plusButton) {

    plusButton.addEventListener(
        "click",
        () => {

            const stock =
                Number(
                    currentProduct?.stock
                );


            if (
                Number.isFinite(stock) &&
                stock > 0 &&
                quantity >= stock
            ) {

                return;

            }


            quantity++;

            updateQuantity();

        }
    );

}


/* ============================================================
   CART — LOAD
============================================================ */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                CART_KEY
            );


        if (!saved) {
            return [];
        }


        const parsed =
            JSON.parse(saved);


        if (!Array.isArray(parsed)) {
            return [];
        }


        return parsed
            .map(item => ({

                productId:
                    item.productId !== undefined &&
                    item.productId !== null
                        ? String(item.productId)
                        : null,

                name:
                    item.name || "",

                price:
                    Number(item.price || 0),

                image:
                    item.image || "",

                size:
                    item.size || null,

                quantity:
                    Number(item.quantity || 0)

            }))
            .filter(
                item =>
                    item.quantity > 0
            );

    }

    catch (error) {

        console.error(
            "Не вдалося завантажити кошик:",
            error
        );

        return [];

    }

}


/* ============================================================
   CART — SAVE
============================================================ */

function saveCart() {

    try {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

    }

    catch (error) {

        console.error(
            "Не вдалося зберегти кошик:",
            error
        );

    }

}


/* ============================================================
   CART — ADD
============================================================ */

function addToCart(
    product,
    amount = 1
) {

    const productId =
        product.productId ??
        product.id ??
        null;


    const productSize =
        product.size || null;


    const image =
        getImageUrl(
            product.image
        );


    const normalizedProductId =
        productId !== null
            ? String(productId)
            : null;


    const existing =
        cart.find(
            item => {

                const sameProduct =
                    normalizedProductId !== null &&
                    item.productId !== null &&
                    String(item.productId) ===
                        normalizedProductId;


                const sameSize =
                    (item.size || null) ===
                    productSize;


                if (sameProduct) {
                    return sameSize;
                }


                if (
                    normalizedProductId === null &&
                    item.productId === null
                ) {

                    return (
                        item.image === image &&
                        sameSize
                    );

                }


                return false;

            }
        );


    if (existing) {

        existing.quantity =
            Number(existing.quantity || 0) +
            Number(amount || 1);

    }

    else {

        cart.push({

            productId:
                normalizedProductId,

            name:
                product.name || "",

            price:
                Number(product.price || 0),

            image:
                image,

            size:
                productSize,

            quantity:
                Number(amount || 1)

        });

    }


    saveCart();

    renderCart();

    updateCartCount();

}


/* ============================================================
   CART — REMOVE
============================================================ */

function removeFromCart(index) {

    if (
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }


    cart.splice(
        index,
        1
    );


    saveCart();

    renderCart();

    updateCartCount();

}


/* ============================================================
   CART — CHANGE QUANTITY
============================================================ */

function changeCartQuantity(
    index,
    change
) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity =
        Number(cart[index].quantity || 0) +
        change;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(
            index,
            1
        );

    }


    saveCart();

    renderCart();

    updateCartCount();

}


/* ============================================================
   CART COUNT
============================================================ */

function updateCartCount() {

    const count =
        cart.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.quantity || 0
                ),
            0
        );


    if (cartCount) {

        cartCount.textContent =
            count;


        cartCount.classList.toggle(
            "active",
            count > 0
        );

    }

}


/* ============================================================
   CART TOTAL
============================================================ */

function getCartTotal() {

    return cart.reduce(
        (sum, item) =>
            sum +
            (
                Number(item.price || 0) *
                Number(item.quantity || 0)
            ),
        0
    );

}


/* ============================================================
   RENDER CART
============================================================ */

function renderCart() {

    if (!cartItems) {
        return;
    }


    cartItems.innerHTML =
        "";


    /* ========================================================
       EMPTY CART
    ======================================================== */

    if (
        cart.length === 0
    ) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                YOUR CART IS EMPTY
            </div>
        `;


        if (cartTotal) {

            cartTotal.textContent =
                formatPrice(0);

        }


        if (cartCheckoutButton) {

            cartCheckoutButton.disabled =
                true;

        }


        return;

    }


    /* ========================================================
       CART HAS ITEMS
    ======================================================== */

    if (cartCheckoutButton) {

        cartCheckoutButton.disabled =
            false;

    }


    cart.forEach(
        (item, index) => {

            const element =
                document.createElement("div");


            element.className =
                "cart-item";


            element.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.name)}"
                    >

                </div>


                <div class="cart-item-info">

                    <div>

                        <div class="cart-item-name">
                            ${escapeHTML(item.name)}
                        </div>


                        ${
                            item.size
                                ? `
                                    <div class="cart-item-price">
                                        Розмір: ${escapeHTML(item.size)}
                                    </div>
                                `
                                : ""
                        }


                        <div class="cart-item-price">
                            ${formatPrice(item.price)}
                        </div>

                    </div>


                    <div class="cart-item-bottom">

                        <div class="cart-quantity">

                            <button
                                type="button"
                                data-cart-minus="${index}"
                                aria-label="Зменшити кількість"
                            >
                                −
                            </button>


                            <span>
                                ${item.quantity}
                            </span>


                            <button
                                type="button"
                                data-cart-plus="${index}"
                                aria-label="Збільшити кількість"
                            >
                                +
                            </button>

                        </div>


                        <button
                            type="button"
                            class="remove-item"
                            data-cart-remove="${index}"
                        >
                            ВИДАЛИТИ
                        </button>

                    </div>

                </div>

            `;


            cartItems.appendChild(
                element
            );

        }
    );


    /* ========================================================
       TOTAL
    ======================================================== */

    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(
                getCartTotal()
            );

    }


    /* ========================================================
       MINUS BUTTONS
    ======================================================== */

    cartItems
        .querySelectorAll(
            "[data-cart-minus]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        changeCartQuantity(
                            Number(
                                button.dataset.cartMinus
                            ),
                            -1
                        );

                    }
                );

            }
        );


    /* ========================================================
       PLUS BUTTONS
    ======================================================== */

    cartItems
        .querySelectorAll(
            "[data-cart-plus]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        changeCartQuantity(
                            Number(
                                button.dataset.cartPlus
                            ),
                            1
                        );

                    }
                );

            }
        );


    /* ========================================================
       REMOVE BUTTONS
    ======================================================== */

    cartItems
        .querySelectorAll(
            "[data-cart-remove]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        removeFromCart(
                            Number(
                                button.dataset.cartRemove
                            )
                        );

                    }
                );

            }
        );

}


/* ============================================================
   OPEN CART
   Same animation logic as index.html
============================================================ */

function openCart() {

    if (!cartDrawer) {
        return;
    }


    /*
       Add both classes in the same frame.
       CSS handles the actual slide/fade animation.
    */

    cartDrawer.classList.add(
        "open"
    );


    if (cartOverlay) {

        cartOverlay.classList.add(
            "open"
        );

    }


    document.body.classList.add(
        "modal-open"
    );

}


/* ============================================================
   CLOSE CART
   Same animation logic as index.html
============================================================ */

function closeCart() {

    if (cartDrawer) {

        cartDrawer.classList.remove(
            "open"
        );

    }


    if (cartOverlay) {

        cartOverlay.classList.remove(
            "open"
        );

    }


    if (
        !orderModal ||
        !orderModal.classList.contains(
            "open"
        )
    ) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}


/* ============================================================
   CART BUTTON
============================================================ */

if (cartButton) {

    cartButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            openCart();

        }
    );

}


/* ============================================================
   CART CLOSE
============================================================ */

if (cartClose) {

    cartClose.addEventListener(
        "click",
        event => {

            event.preventDefault();

            closeCart();

        }
    );

}


/* ============================================================
   CART OVERLAY
============================================================ */

if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCart
    );

}


/* ============================================================
   ADD TO CART BUTTON
============================================================ */

if (addButton) {

    addButton.addEventListener(
        "click",
        () => {

            if (!currentProduct) {
                return;
            }


            if (
                currentProduct.status ===
                "sold_out"
            ) {

                return;

            }


            if (
                currentProduct.status ===
                "coming_soon"
            ) {

                return;

            }


            addToCart({

                productId:
                    currentProduct.id,

                name:
                    currentProduct.name,

                price:
                    currentProduct.price,

                image:
                    currentProduct.front_image,

                size:
                    selectedSize

            }, quantity);


            showToast(
                "Товар додано до кошика"
            );


            /*
               Same behaviour as index:
               after adding a product, open the cart.
            */

            openCart();

        }
    );

}


/* ============================================================
   BUY NOW — ADD PRODUCT THEN OPEN THE SAME ORDER MODAL
============================================================ */

if (buyButton) {
    buyButton.addEventListener("click", () => {
        if (!currentProduct) return;

        if (currentProduct.status === "sold_out" || currentProduct.status === "coming_soon") {
            return;
        }

        addToCart({
            productId: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.front_image,
            size: selectedSize
        }, quantity);

        openOrderModal();
    });
}


/* ============================================================
   OPEN ORDER MODAL — SAME AS INDEX.HTML
============================================================ */

function openOrderModal() {
    if (cart.length === 0) {
        showToast("Кошик порожній");
        return;
    }

    renderOrderSummary();

    if (orderModal) orderModal.classList.add("active");
    if (orderModalOverlay) orderModalOverlay.classList.add("active");
    document.body.classList.add("modal-open");
}

window.zxcaerOpenOrderModal = openOrderModal;


/* ============================================================
   CLOSE ORDER MODAL
============================================================ */

function closeOrderModal() {
    if (orderModal) orderModal.classList.remove("active");
    if (orderModalOverlay) orderModalOverlay.classList.remove("active");
    if (!cartDrawer || !cartDrawer.classList.contains("open")) {
        document.body.classList.remove("modal-open");
    }
}

if (orderModalClose) orderModalClose.addEventListener("click", closeOrderModal);
if (orderModalOverlay) orderModalOverlay.addEventListener("click", closeOrderModal);


/* ============================================================
   CART CHECKOUT — SAME ORDER MODAL
============================================================ */

if (cartCheckoutButton) {
    cartCheckoutButton.addEventListener("click", () => {
        if (cart.length === 0) return;
        closeCart();
        openOrderModal();
    });
}


/* ============================================================
   ORDER SUMMARY — SAME AS INDEX.HTML
============================================================ */

function renderOrderSummary() {
    if (!orderSummaryItems) return;

    orderSummaryItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const itemTotal = Number(item.price || 0) * Number(item.quantity || 0);
        total += itemTotal;

        const row = document.createElement("div");
        row.className = "order-summary-item";
        row.innerHTML = `
            <span class="order-summary-item-name">
                ${escapeHTML(item.name)} ×${item.quantity}${item.size ? ` / розмір ${escapeHTML(item.size)}` : ""}
            </span>
            <span class="order-summary-item-price">
                ${formatPrice(itemTotal)}
            </span>
        `;
        orderSummaryItems.appendChild(row);
    });

    if (orderSummaryTotal) orderSummaryTotal.textContent = formatPrice(total);
}


/* ============================================================
   NOVA POSHTA TYPE — SAME AS INDEX.HTML
============================================================ */

function updateNovaPoshtaType() {
    const isNovaPoshta = deliveryMethod?.value === "Новая Почта";
    const isLocker = isNovaPoshta && novaPoshtaType?.value === "Поштомат";
    const isBranch = isNovaPoshta && novaPoshtaType?.value === "Відділення";

    if (novaPoshtaLockerField) novaPoshtaLockerField.classList.toggle("active", !!isLocker);
    if (novaPoshtaBranchField) novaPoshtaBranchField.classList.toggle("active", !!isBranch);

    [novaPoshtaLockerNumber, novaPoshtaLockerAddress, novaPoshtaBranchNumber, novaPoshtaBranchAddress].forEach(field => {
        if (field) field.required = false;
    });

    if (novaPoshtaType) novaPoshtaType.required = !!isNovaPoshta;

    if (isLocker) {
        if (novaPoshtaLockerNumber) novaPoshtaLockerNumber.required = true;
        if (novaPoshtaLockerAddress) novaPoshtaLockerAddress.required = true;
    }

    if (isBranch) {
        if (novaPoshtaBranchNumber) novaPoshtaBranchNumber.required = true;
        if (novaPoshtaBranchAddress) novaPoshtaBranchAddress.required = true;
    }
}

if (novaPoshtaType) novaPoshtaType.addEventListener("change", updateNovaPoshtaType);


/* ============================================================
   DELIVERY METHOD — SAME AS INDEX.HTML
============================================================ */

function updateDeliveryMethod() {
    const method = deliveryMethod?.value || "";

    if (novaPoshtaField) novaPoshtaField.classList.toggle("active", method === "Новая Почта");
    if (ukrPoshtaField) ukrPoshtaField.classList.toggle("active", method === "Укрпочта");
    if (ukrPoshtaIndex) ukrPoshtaIndex.required = method === "Укрпочта";

    if (method !== "Новая Почта") {
        if (novaPoshtaType) novaPoshtaType.required = false;
        [novaPoshtaLockerNumber, novaPoshtaLockerAddress, novaPoshtaBranchNumber, novaPoshtaBranchAddress].forEach(field => { if (field) field.required = false; });
        if (novaPoshtaLockerField) novaPoshtaLockerField.classList.remove("active");
        if (novaPoshtaBranchField) novaPoshtaBranchField.classList.remove("active");
    } else {
        updateNovaPoshtaType();
    }
}

if (deliveryMethod) deliveryMethod.addEventListener("change", updateDeliveryMethod);
updateDeliveryMethod();


/* ============================================================
   ORDER SUBMIT — SAME DATA / DELIVERY LOGIC AS INDEX.HTML
============================================================ */

if (orderForm) {
    orderForm.addEventListener("submit", async event => {
        event.preventDefault();

        const nameElement = document.getElementById("customerName");
        const surnameElement = document.getElementById("customerSurname");
        const phoneElement = document.getElementById("customerPhone");
        const telegramElement = document.getElementById("customerTelegram");
        const cityElement = document.getElementById("customerCity");
        const commentElement = document.getElementById("customerComment");

        const name = nameElement?.value.trim() || "";
        const surname = surnameElement?.value.trim() || "";
        const phone = phoneElement?.value.trim() || "";
        const telegram = telegramElement?.value.trim() || "";
        const city = cityElement?.value.trim() || "";
        const comment = commentElement?.value.trim() || "";

        if (!name) { alert("Введіть ім’я"); nameElement?.focus(); return; }
        if (!surname) { alert("Введіть прізвище"); surnameElement?.focus(); return; }
        if (!telegram.startsWith("@")) { alert("Вкажіть Telegram username, починаючи з @"); telegramElement?.focus(); return; }
        if (!deliveryMethod?.value) { alert("Оберіть спосіб доставки"); deliveryMethod?.focus(); return; }

        let destinationType = "";
        let destinationNumber = "";
        let destinationAddress = "";

        if (deliveryMethod.value === "Новая Почта") {
            if (!novaPoshtaType?.value) { alert("Оберіть поштомат або відділення Нової Пошти"); novaPoshtaType?.focus(); return; }
            if (novaPoshtaType.value === "Поштомат") {
                destinationType = "Поштомат";
                destinationNumber = novaPoshtaLockerNumber?.value.trim() || "";
                destinationAddress = novaPoshtaLockerAddress?.value.trim() || "";
            } else {
                destinationType = "Відділення";
                destinationNumber = novaPoshtaBranchNumber?.value.trim() || "";
                destinationAddress = novaPoshtaBranchAddress?.value.trim() || "";
            }
            if (!destinationNumber) { alert("Вкажіть номер поштомата або відділення"); return; }
            if (!destinationAddress) { alert("Вкажіть адресу поштомата або відділення"); return; }
        }

        if (deliveryMethod.value === "Укрпочта" && !ukrPoshtaIndex?.value.trim()) {
            alert("Введіть поштовий індекс");
            ukrPoshtaIndex?.focus();
            return;
        }

        if (cart.length === 0) { alert("YOUR CART IS EMPTY"); return; }

        let productsText = "";
        cart.forEach(item => {
            productsText += `\n🩸 ${escapeTelegram(item.name)} ×${item.quantity}${item.size ? ` / розмір ${escapeTelegram(item.size)}` : ""} — ${formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}`;
        });

        let deliveryText = `🚚 <b>Доставка:</b> ${escapeTelegram(deliveryMethod.value)}`;
        if (deliveryMethod.value === "Новая Почта") {
            deliveryText += `\n📦 <b>Тип:</b> ${escapeTelegram(destinationType)}`;
            deliveryText += `\n🔢 <b>Номер:</b> ${escapeTelegram(destinationNumber)}`;
            deliveryText += `\n📍 <b>Адрес:</b> ${escapeTelegram(destinationAddress)}`;
        }
        if (deliveryMethod.value === "Укрпочта") {
            deliveryText += `\n📮 <b>Индекс:</b> ${escapeTelegram(ukrPoshtaIndex.value.trim())}`;
        }

        let message =
            `🛍 <b>НОВЫЙ ЗАКАЗ ZXCAER</b>\n\n` +
            `👤 <b>Ім’я:</b> ${escapeTelegram(name)}\n` +
            `👤 <b>Прізвище:</b> ${escapeTelegram(surname)}\n` +
            `📱 <b>Телефон:</b> ${escapeTelegram(phone)}\n` +
            `💬 <b>Telegram:</b> ${escapeTelegram(telegram)}\n\n` +
            `📍 <b>Город:</b> ${escapeTelegram(city)}\n` +
            `${deliveryText}\n\n` +
            `📦 <b>ТОВАРЫ:</b>${productsText}\n\n` +
            `💰 <b>ИТОГО:</b> ${formatPrice(getCartTotal())}`;

        if (comment) message += `\n\n📝 <b>Комментарий:</b>\n${escapeTelegram(comment)}`;

        const submitButton = orderForm.querySelector('button[type="submit"]');
        if (submitButton) { submitButton.disabled = true; submitButton.textContent = "ОТПРАВКА..."; }

        try {
            const TELEGRAM_BOT_TOKEN = "8627514379:AAGgX7-Kgyzw1dbaBI0U2AEjVjMZkAWtK8I";
            const TELEGRAM_CHAT_ID = "7999613061";
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" })
            });
            const data = await response.json();
            if (!response.ok || !data.ok) throw new Error(data.description || "Ошибка отправки заказа в Telegram.");

            alert("ЗАКАЗ УСПЕШНО ОФОРМЛЕН! ❤️\n\nМы получили ваш заказ и скоро свяжемся с вами.");
            cart = [];
            saveCart();
            renderCart();
            updateCartCount();
            closeOrderModal();
            closeCart();
            orderForm.reset();
            updateDeliveryMethod();
        } catch (error) {
            console.error("Telegram request failed:", error);
            alert("Не удалось отправить заказ. Проверьте подключение и настройки Telegram.");
        } finally {
            if (submitButton) { submitButton.disabled = false; submitButton.textContent = "ОФОРМИТИ ЗАМОВЛЕННЯ"; }
        }
    });
}


/* ============================================================
   TELEGRAM ESCAPE
============================================================ */

function escapeTelegram(value) {

    return String(value ?? "")
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        );

}


/* ============================================================
   TOAST
============================================================ */

function showToast(message) {

    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        showToast.timer
    );


    showToast.timer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* ============================================================
   ERROR
============================================================ */

function showError(message) {

    if (loading) {

        loading.style.display =
            "none";

    }


    if (productContent) {

        productContent.style.display =
            "none";

    }


    if (productError) {

        productError.textContent =
            message;


        productError.classList.add(
            "show"
        );

    }

}


/* ============================================================
   ESC — CLOSE MODALS
============================================================ */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        closeCart();

        closeCheckout();

    }
);


/* ============================================================
   CART SYNC BETWEEN PAGES
============================================================ */

window.addEventListener(
    "pageshow",
    () => {

        cart = loadCart();

        renderCart();

        updateCartCount();

    }
);


window.addEventListener(
    "storage",
    event => {

        if (
            event.key !== CART_KEY
        ) {

            return;

        }


        cart = loadCart();

        renderCart();

        updateCartCount();

    }
);


/* ============================================================
   START
============================================================ */

renderCart();

updateCartCount();

loadProduct();