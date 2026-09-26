document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       TELEGRAM
    ========================= */

    const TELEGRAM_BOT_TOKEN = "8627514379:AAGgX7-Kgyzw1dbaBI0U2AEjVjMZkAWtK8I";
    const TELEGRAM_CHAT_ID = "7999613061";


    /* =========================
       ELEMENTS
    ========================= */

    const cartButton = document.getElementById("cartButton");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartClose = document.getElementById("cartClose");
    const cartOverlay = document.getElementById("cartOverlay");

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");
    const buyButton = document.getElementById("buyButton");

    const productModal = document.getElementById("productModal");
    const productModalOverlay = document.getElementById("productModalOverlay");
    const productModalClose = document.getElementById("productModalClose");

    const modalProductImage = document.getElementById("modalProductImage");
    const modalProductName = document.getElementById("modalProductName");
    const modalProductPrice = document.getElementById("modalProductPrice");
    const modalAddButton = document.getElementById("modalAddButton");

    const orderModal = document.getElementById("orderModal");
    const orderModalOverlay = document.getElementById("orderModalOverlay");
    const orderModalClose = document.getElementById("orderModalClose");
    const orderForm = document.getElementById("orderForm");

    const deliveryMethod = document.getElementById("deliveryMethod");

    const novaPoshtaField = document.getElementById("novaPoshtaField");
    const ukrPoshtaField = document.getElementById("ukrPoshtaField");

    const novaPoshtaNumber = document.getElementById("novaPoshtaNumber");
    const ukrPoshtaIndex = document.getElementById("ukrPoshtaIndex");

    const orderSummaryItems =
        document.getElementById("orderSummaryItems");

    const orderSummaryTotal =
        document.getElementById("orderSummaryTotal");


    /* =========================
       CART DATA
    ========================= */

    let cart = [];
    let currentProduct = null;


    /* =========================
       PRICE
    ========================= */

    function formatPrice(value) {

        return "₴" + Number(value).toLocaleString("uk-UA", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    }


    /* =========================
       OPEN CART
    ========================= */

    function openCart() {

        if (cartDrawer) {
            cartDrawer.classList.add("open");
        }

        if (cartOverlay) {
            cartOverlay.classList.add("open");
        }

    }


    /* =========================
       CLOSE CART
    ========================= */

    function closeCart() {

        if (cartDrawer) {
            cartDrawer.classList.remove("open");
        }

        if (cartOverlay) {
            cartOverlay.classList.remove("open");
        }

    }


    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCart
        );

    }


    if (cartClose) {

        cartClose.addEventListener(
            "click",
            closeCart
        );

    }


    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            closeCart
        );

    }


    /* =========================
       ADD TO CART
    ========================= */

    function addToCart(product) {

        const existingProduct =
            cart.find(
                item => item.image === product.image
            );


        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({

                name: product.name,

                price: Number(product.price),

                image: product.image,

                quantity: 1

            });

        }


        renderCart();

        openCart();

    }


    /* =========================
       PRODUCTS
    ========================= */

    document
        .querySelectorAll(".product")
        .forEach(product => {

            const addButton =
                product.querySelector(".add-to-cart");

            const productImage =
                product.querySelector(".product-image");


            /* ADD BUTTON */

            if (addButton) {

                addButton.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();
                        event.stopPropagation();


                        addToCart({

                            name:
                                product.dataset.name,

                            price:
                                product.dataset.price,

                            image:
                                product.dataset.image

                        });

                    }
                );

            }


            /* PRODUCT IMAGE */

            if (productImage) {

                productImage.addEventListener(
                    "click",
                    function(event) {

                        if (
                            event.target.closest(
                                ".add-to-cart"
                            )
                        ) {
                            return;
                        }


                        openProductModal(product);

                    }
                );

            }

        });


    /* =========================
       RENDER CART
    ========================= */

    function renderCart() {

        if (!cartItems) {
            return;
        }


        cartItems.innerHTML = "";


        let total = 0;
        let quantityTotal = 0;


        /* EMPTY */

        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">
                    YOUR CART IS EMPTY
                </div>
            `;

        }


        /* PRODUCTS */

        cart.forEach((item, index) => {

            const itemTotal =
                item.price * item.quantity;


            total += itemTotal;

            quantityTotal += item.quantity;


            const cartItem =
                document.createElement("div");


            cartItem.className =
                "cart-item";


            cartItem.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>


                <div class="cart-item-info">

                    <div>

                        <div class="cart-item-name">
                            ${item.name}
                        </div>

                        <div class="cart-item-price">
                            ${formatPrice(item.price)}
                        </div>

                    </div>


                    <div class="cart-item-bottom">

                        <div class="quantity">

                            <button
                                type="button"
                                class="quantity-minus"
                                data-index="${index}"
                            >
                                −
                            </button>


                            <span>
                                ${item.quantity}
                            </span>


                            <button
                                type="button"
                                class="quantity-plus"
                                data-index="${index}"
                            >
                                +
                            </button>

                        </div>


                        <button
                            type="button"
                            class="remove-item"
                            data-index="${index}"
                        >
                            REMOVE
                        </button>

                    </div>

                </div>

            `;


            cartItems.appendChild(cartItem);

        });


        /* TOTAL */

        if (cartTotal) {

            cartTotal.textContent =
                formatPrice(total);

        }


        /* COUNT */

        if (cartCount) {

            cartCount.textContent =
                quantityTotal;


            cartCount.classList.toggle(
                "active",
                quantityTotal > 0
            );

        }


        /* MINUS */

        cartItems
            .querySelectorAll(".quantity-minus")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();
                        event.stopPropagation();


                        const index =
                            Number(
                                this.dataset.index
                            );


                        if (!cart[index]) {
                            return;
                        }


                        if (
                            cart[index].quantity > 1
                        ) {

                            cart[index].quantity -= 1;

                        } else {

                            cart.splice(index, 1);

                        }


                        renderCart();

                    }
                );

            });


        /* PLUS */

        cartItems
            .querySelectorAll(".quantity-plus")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();
                        event.stopPropagation();


                        const index =
                            Number(
                                this.dataset.index
                            );


                        if (!cart[index]) {
                            return;
                        }


                        cart[index].quantity += 1;

                        renderCart();

                    }
                );

            });


        /* REMOVE */

        cartItems
            .querySelectorAll(".remove-item")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();
                        event.stopPropagation();


                        const index =
                            Number(
                                this.dataset.index
                            );


                        if (!cart[index]) {
                            return;
                        }


                        cart.splice(index, 1);

                        renderCart();

                    }
                );

            });

    }


    /* =========================
       PRODUCT MODAL
    ========================= */

    function openProductModal(product) {

        currentProduct = product;


        if (modalProductImage) {

            modalProductImage.src =
                product.dataset.image;

            modalProductImage.alt =
                product.dataset.name;

        }


        if (modalProductName) {

            modalProductName.textContent =
                product.dataset.name;

        }


        if (modalProductPrice) {

            modalProductPrice.textContent =
                formatPrice(
                    product.dataset.price
                );

        }


        if (productModal) {
            productModal.classList.add("open");
        }

        if (productModalOverlay) {
            productModalOverlay.classList.add("open");
        }

    }


    /* =========================
       CLOSE PRODUCT MODAL
    ========================= */

    function closeProductModal() {

        if (productModal) {
            productModal.classList.remove("open");
        }

        if (productModalOverlay) {
            productModalOverlay.classList.remove("open");
        }


        currentProduct = null;

    }


    if (productModalClose) {

        productModalClose.addEventListener(
            "click",
            closeProductModal
        );

    }


    if (productModalOverlay) {

        productModalOverlay.addEventListener(
            "click",
            closeProductModal
        );

    }


    /* =========================
       ADD FROM PRODUCT MODAL
    ========================= */

    if (modalAddButton) {

        modalAddButton.addEventListener(
            "click",
            function() {

                if (!currentProduct) {
                    return;
                }


                addToCart({

                    name:
                        currentProduct.dataset.name,

                    price:
                        currentProduct.dataset.price,

                    image:
                        currentProduct.dataset.image

                });


                closeProductModal();

            }
        );

    }


    /* =========================
       OPEN ORDER MODAL
    ========================= */

    function openOrderModal() {

        if (cart.length === 0) {

            alert(
                "YOUR CART IS EMPTY"
            );

            return;

        }


        renderOrderSummary();


        if (orderModal) {
            orderModal.classList.add("active");
        }

        if (orderModalOverlay) {
            orderModalOverlay.classList.add("active");
        }

    }


    /* =========================
       CLOSE ORDER MODAL
    ========================= */

    function closeOrderModal() {

        if (orderModal) {
            orderModal.classList.remove("active");
        }

        if (orderModalOverlay) {
            orderModalOverlay.classList.remove("active");
        }

    }


    if (buyButton) {

        buyButton.addEventListener(
            "click",
            openOrderModal
        );

    }


    if (orderModalClose) {

        orderModalClose.addEventListener(
            "click",
            closeOrderModal
        );

    }


    if (orderModalOverlay) {

        orderModalOverlay.addEventListener(
            "click",
            closeOrderModal
        );

    }


    /* =========================
       ORDER SUMMARY
    ========================= */

    function renderOrderSummary() {

        if (!orderSummaryItems) {
            return;
        }


        orderSummaryItems.innerHTML = "";


        let total = 0;


        cart.forEach(item => {

            const itemTotal =
                item.price * item.quantity;


            total += itemTotal;


            const row =
                document.createElement("div");


            row.className =
                "order-summary-item";


            row.innerHTML = `

                <span class="order-summary-item-name">
                    ${item.name} ×${item.quantity}
                </span>

                <span class="order-summary-item-price">
                    ${formatPrice(itemTotal)}
                </span>

            `;


            orderSummaryItems.appendChild(row);

        });


        if (orderSummaryTotal) {

            orderSummaryTotal.textContent =
                formatPrice(total);

        }

    }


    /* =========================
       DELIVERY METHOD
    ========================= */

    if (deliveryMethod) {

        deliveryMethod.addEventListener(
            "change",
            function() {

                if (novaPoshtaField) {

                    novaPoshtaField.classList.remove(
                        "active"
                    );

                }


                if (ukrPoshtaField) {

                    ukrPoshtaField.classList.remove(
                        "active"
                    );

                }


                if (novaPoshtaNumber) {

                    novaPoshtaNumber.required =
                        false;

                }


                if (ukrPoshtaIndex) {

                    ukrPoshtaIndex.required =
                        false;

                }


                if (
                    deliveryMethod.value ===
                    "Новая Почта"
                ) {

                    if (novaPoshtaField) {

                        novaPoshtaField.classList.add(
                            "active"
                        );

                    }


                    if (novaPoshtaNumber) {

                        novaPoshtaNumber.required =
                            true;

                    }

                }


                if (
                    deliveryMethod.value ===
                    "Укрпочта"
                ) {

                    if (ukrPoshtaField) {

                        ukrPoshtaField.classList.add(
                            "active"
                        );

                    }


                    if (ukrPoshtaIndex) {

                        ukrPoshtaIndex.required =
                            true;

                    }

                }

            }
        );

    }


    /* =========================
       TELEGRAM ORDER
    ========================= */

    if (orderForm) {

        orderForm.addEventListener(
            "submit",
            async function(event) {

                event.preventDefault();


                /* =========================
                   CUSTOMER DATA
                ========================= */

                const nameElement =
                    document.getElementById(
                        "customerName"
                    );


                const phoneElement =
                    document.getElementById(
                        "customerPhone"
                    );


                const telegramElement =
                    document.getElementById(
                        "customerTelegram"
                    );


                const cityElement =
                    document.getElementById(
                        "customerCity"
                    );


                const commentElement =
                    document.getElementById(
                        "customerComment"
                    );


                const name =
                    nameElement
                        ? nameElement.value.trim()
                        : "";


                const phone =
                    phoneElement
                        ? phoneElement.value.trim()
                        : "";


                const telegram =
                    telegramElement
                        ? telegramElement.value.trim()
                        : "";


                const city =
                    cityElement
                        ? cityElement.value.trim()
                        : "";


                const comment =
                    commentElement
                        ? commentElement.value.trim()
                        : "";


                /* =========================
                   TELEGRAM VALIDATION
                ========================= */

                if (
                    !telegram.startsWith("@")
                ) {

                    alert(
                        "Введите Telegram username начиная с @"
                    );

                    return;

                }


                /* =========================
                   DELIVERY VALIDATION
                ========================= */

                if (
                    deliveryMethod.value ===
                    "Новая Почта" &&
                    !novaPoshtaNumber.value.trim()
                ) {

                    alert(
                        "Введите номер отделения Новой Почты"
                    );

                    return;

                }


                if (
                    deliveryMethod.value ===
                    "Укрпочта" &&
                    !ukrPoshtaIndex.value.trim()
                ) {

                    alert(
                        "Введите почтовый индекс"
                    );

                    return;

                }


                /* =========================
                   PRODUCTS
                ========================= */

                let productsText = "";

                let total = 0;


                cart.forEach(item => {

                    const itemTotal =
                        item.price *
                        item.quantity;


                    total += itemTotal;


                    productsText +=
                        `\n🩸 ${item.name} ×${item.quantity} — ${formatPrice(itemTotal)}`;

                });


                /* =========================
                   DELIVERY TEXT
                ========================= */

                let deliveryText =
                    `🚚 <b>Доставка:</b> ${deliveryMethod.value}`;


                if (
                    deliveryMethod.value ===
                    "Новая Почта"
                ) {

                    deliveryText +=
                        `\n🏢 <b>Отделение:</b> ${novaPoshtaNumber.value.trim()}`;

                }


                if (
                    deliveryMethod.value ===
                    "Укрпочта"
                ) {

                    deliveryText +=
                        `\n📮 <b>Индекс:</b> ${ukrPoshtaIndex.value.trim()}`;

                }


                /* =========================
                   TELEGRAM MESSAGE
                ========================= */

                let message =

                    `🛍 <b>НОВЫЙ ЗАКАЗ ZXCAER</b>\n\n` +

                    `👤 <b>Имя:</b> ${name}\n` +

                    `📱 <b>Телефон:</b> ${phone}\n` +

                    `💬 <b>Telegram:</b> ${telegram}\n\n` +

                    `📍 <b>Город:</b> ${city}\n` +

                    `${deliveryText}\n\n` +

                    `📦 <b>ТОВАРЫ:</b>` +

                    productsText +

                    `\n\n💰 <b>ИТОГО:</b> ${formatPrice(total)}`;


                if (comment) {

                    message +=
                        `\n\n📝 <b>Комментарий:</b>\n${comment}`;

                }


                /* =========================
                   DISABLE BUTTON
                ========================= */

                const submitButton =
                    orderForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "ОТПРАВКА...";

                }


                /* =========================
                   SEND TELEGRAM
                ========================= */

                try {

                    const response =
                        await fetch(
                            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body: JSON.stringify({

                                    chat_id:
                                        TELEGRAM_CHAT_ID,

                                    text:
                                        message,

                                    parse_mode:
                                        "HTML"

                                })

                            }
                        );


                    const data =
                        await response.json();


                    if (!data.ok) {

                        console.error(
                            "Telegram error:",
                            data
                        );


                        alert(
                            "Не удалось отправить заказ. Проверьте токен бота."
                        );


                        return;

                    }


                    /* =========================
                       SUCCESS
                    ========================= */

                    alert(
                        "ЗАКАЗ УСПЕШНО ОФОРМЛЕН! ❤️\n\n" +
                        "Мы получили ваш заказ и скоро свяжемся с вами."
                    );


                    /* CLEAR CART */

                    cart = [];


                    renderCart();


                    /* CLOSE WINDOWS */

                    closeOrderModal();

                    closeCart();


                    /* RESET FORM */

                    orderForm.reset();


                    if (novaPoshtaField) {

                        novaPoshtaField.classList.remove(
                            "active"
                        );

                    }


                    if (ukrPoshtaField) {

                        ukrPoshtaField.classList.remove(
                            "active"
                        );

                    }


                    if (novaPoshtaNumber) {

                        novaPoshtaNumber.required =
                            false;

                    }


                    if (ukrPoshtaIndex) {

                        ukrPoshtaIndex.required =
                            false;

                    }


                } catch (error) {

                    console.error(
                        "Telegram request failed:",
                        error
                    );


                    alert(
                        "Ошибка соединения с Telegram. Попробуйте ещё раз."
                    );


                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "ОФОРМИТЬ ЗАКАЗ";

                    }

                }

            }
        );

    }


    /* =========================
       ESC
    ========================= */

    document.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Escape") {

                closeCart();

                closeProductModal();

                closeOrderModal();

            }

        }
    );


    /* =========================
       SCROLL REVEAL
    ========================= */

    const revealElements =
        document.querySelectorAll(".reveal");


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                function(entries) {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            element => {

                observer.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "visible"
                );

            }
        );

    }


    /* =========================
       INTRO
    ========================= */

    const siteIntro =
        document.getElementById(
            "siteIntro"
        );


    window.addEventListener(
        "load",
        () => {

            document.body.classList.add(
                "site-loaded"
            );


            setTimeout(
                () => {

                    if (siteIntro) {

                        siteIntro.classList.add(
                            "hide"
                        );

                    }


                    setTimeout(
                        () => {

                            if (siteIntro) {

                                siteIntro.remove();

                            }

                        },
                        900
                    );


                },
                1500
            );

        }
    );


    /* =========================
       START
    ========================= */

    renderCart();

});