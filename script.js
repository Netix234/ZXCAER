document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       TELEGRAM
    ========================= */

    // Вставь сюда новый токен Telegram-бота.
    // Для безопасности отправку заказов лучше перенести на сервер.
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

    const novaPoshtaType = document.getElementById("novaPoshtaType");
    const novaPoshtaLockerField = document.getElementById("novaPoshtaLockerField");
    const novaPoshtaBranchField = document.getElementById("novaPoshtaBranchField");

    const novaPoshtaLockerNumber = document.getElementById("novaPoshtaLockerNumber");
    const novaPoshtaLockerAddress = document.getElementById("novaPoshtaLockerAddress");
    const novaPoshtaBranchNumber = document.getElementById("novaPoshtaBranchNumber");
    const novaPoshtaBranchAddress = document.getElementById("novaPoshtaBranchAddress");

    const ukrPoshtaIndex = document.getElementById("ukrPoshtaIndex");

    const orderSummaryItems = document.getElementById("orderSummaryItems");
    const orderSummaryTotal = document.getElementById("orderSummaryTotal");


    /* =========================
       CART DATA
    ========================= */

    const CART_KEY = "zxcaerCart";


    function loadCart() {
        try {
            const saved = localStorage.getItem(CART_KEY);

            if (!saved) {
                return [];
            }

            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed.map(item => ({
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
            })).filter(
                item => item.quantity > 0
            );

        } catch (error) {
            console.error(
                "Не вдалося завантажити кошик:",
                error
            );

            return [];
        }
    }


    function saveCart() {
        try {
            localStorage.setItem(
                CART_KEY,
                JSON.stringify(cart)
            );

        } catch (error) {
            console.error(
                "Не вдалося зберегти кошик:",
                error
            );
        }
    }


    let cart = loadCart();
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
       HTML ESCAPE
    ========================= */

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
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
        cartButton.addEventListener("click", openCart);
    }

    if (cartClose) {
        cartClose.addEventListener("click", closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener("click", closeCart);
    }


    /* =========================
       ADD TO CART
    ========================= */

    function addToCart(product) {
        const productId =
            product.productId ??
            product.id ??
            null;

        const productSize =
            product.size || null;

        const existingProduct =
            cart.find(item => {
                const sameProduct =
                    productId !== null &&
                    item.productId !== null &&
                    String(item.productId) === String(productId);

                const sameSize =
                    (item.size || null) === productSize;

                if (sameProduct) {
                    return sameSize;
                }

                if (
                    productId === null &&
                    item.productId === null
                ) {
                    return (
                        item.image === product.image &&
                        sameSize
                    );
                }

                return false;
            });

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                productId:
                    productId !== null
                        ? String(productId)
                        : null,

                name:
                    product.name || "",

                price:
                    Number(product.price || 0),

                image:
                    product.image || "",

                size:
                    productSize,

                quantity:
                    1
            });
        }

        saveCart();
        renderCart();
        openCart();
    }

    window.zxcaerAddToCart = addToCart;


    /* =========================
       CART SYNC
    ========================= */

    window.addEventListener("pageshow", () => {
        cart = loadCart();
        renderCart();
    });


    window.addEventListener("storage", event => {
        if (event.key !== CART_KEY) {
            return;
        }

        cart = loadCart();
        renderCart();
    });


    /* =========================
       PRODUCTS
    ========================= */

    document.querySelectorAll(".product").forEach(product => {
        const productImage = product.querySelector(".product-image");

        if (productImage) {
            productImage.addEventListener("click", function(event) {
                if (event.target.closest(".product-status-badge")) {
                    event.preventDefault();
                }

                const productId = product.dataset.id;

                if (productId) {
                    window.location.href =
                        `product.html?id=${encodeURIComponent(productId)}`;
                    return;
                }

                openProductModal(product);
            });
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
            const itemTotal = item.price * item.quantity;

            total += itemTotal;
            quantityTotal += item.quantity;

            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";

            cartItem.innerHTML = `
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

                            <span>${item.quantity}</span>

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
            cartTotal.textContent = formatPrice(total);
        }

        /* COUNT */

        if (cartCount) {
            cartCount.textContent = quantityTotal;

            cartCount.classList.toggle(
                "active",
                quantityTotal > 0
            );
        }

        /* MINUS */

        cartItems.querySelectorAll(".quantity-minus").forEach(button => {
            button.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopPropagation();

                const index = Number(this.dataset.index);

                if (!cart[index]) {
                    return;
                }

                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }

                saveCart();
                renderCart();
            });
        });

        /* PLUS */

        cartItems.querySelectorAll(".quantity-plus").forEach(button => {
            button.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopPropagation();

                const index = Number(this.dataset.index);

                if (!cart[index]) {
                    return;
                }

                cart[index].quantity += 1;

                saveCart();
                renderCart();
            });
        });

        /* REMOVE */

        cartItems.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopPropagation();

                const index = Number(this.dataset.index);

                if (!cart[index]) {
                    return;
                }

                cart.splice(index, 1);

                saveCart();
                renderCart();
            });
        });
    }


    /* =========================
       PRODUCT MODAL
    ========================= */

    function openProductModal(product) {
        currentProduct = product;

        if (modalProductImage) {
            modalProductImage.src = product.dataset.image;
            modalProductImage.alt = product.dataset.name;
        }

        if (modalProductName) {
            modalProductName.textContent = product.dataset.name;
        }

        if (modalProductPrice) {
            modalProductPrice.textContent = formatPrice(
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
        productModalClose.addEventListener("click", closeProductModal);
    }

    if (productModalOverlay) {
        productModalOverlay.addEventListener("click", closeProductModal);
    }


    /* =========================
       ADD FROM PRODUCT MODAL
    ========================= */

    if (modalAddButton) {
        modalAddButton.addEventListener("click", function() {
            if (!currentProduct) {
                return;
            }

            addToCart({
                productId: currentProduct.dataset.id,
                name: currentProduct.dataset.name,
                price: currentProduct.dataset.price,
                image: currentProduct.dataset.image,
                size: null
            });

            closeProductModal();
        });
    }


    /* =========================
       OPEN ORDER MODAL
    ========================= */

    function openOrderModal() {
        if (cart.length === 0) {
            alert("YOUR CART IS EMPTY");
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

    window.zxcaerOpenOrderModal = openOrderModal;


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
        buyButton.addEventListener("click", openOrderModal);
    }

    if (orderModalClose) {
        orderModalClose.addEventListener("click", closeOrderModal);
    }

    if (orderModalOverlay) {
        orderModalOverlay.addEventListener("click", closeOrderModal);
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
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const row = document.createElement("div");
            row.className = "order-summary-item";

            row.innerHTML = `
                <span class="order-summary-item-name">
                    ${escapeHTML(item.name)} ×${item.quantity}
                </span>

                <span class="order-summary-item-price">
                    ${formatPrice(itemTotal)}
                </span>
            `;

            orderSummaryItems.appendChild(row);
        });

        if (orderSummaryTotal) {
            orderSummaryTotal.textContent = formatPrice(total);
        }
    }


    /* =========================
       NOVA POSHTA TYPE
    ========================= */

    function updateNovaPoshtaType() {
        const isNovaPoshta = deliveryMethod?.value === "Новая Почта";
        const isLocker = isNovaPoshta && novaPoshtaType?.value === "Поштомат";
        const isBranch = isNovaPoshta && novaPoshtaType?.value === "Відділення";

        if (novaPoshtaLockerField) {
            novaPoshtaLockerField.classList.toggle("active", !!isLocker);
        }

        if (novaPoshtaBranchField) {
            novaPoshtaBranchField.classList.toggle("active", !!isBranch);
        }

        [
            novaPoshtaLockerNumber,
            novaPoshtaLockerAddress,
            novaPoshtaBranchNumber,
            novaPoshtaBranchAddress
        ].forEach(field => {
            if (field) {
                field.required = false;
            }
        });

        if (novaPoshtaType) {
            novaPoshtaType.required = !!isNovaPoshta;
        }

        if (isLocker) {
            if (novaPoshtaLockerNumber) {
                novaPoshtaLockerNumber.required = true;
            }

            if (novaPoshtaLockerAddress) {
                novaPoshtaLockerAddress.required = true;
            }
        }

        if (isBranch) {
            if (novaPoshtaBranchNumber) {
                novaPoshtaBranchNumber.required = true;
            }

            if (novaPoshtaBranchAddress) {
                novaPoshtaBranchAddress.required = true;
            }
        }
    }


    if (novaPoshtaType) {
        novaPoshtaType.addEventListener("change", updateNovaPoshtaType);
    }


    /* =========================
       DELIVERY METHOD
    ========================= */

    function updateDeliveryMethod() {
        const method = deliveryMethod?.value || "";

        if (novaPoshtaField) {
            novaPoshtaField.classList.toggle(
                "active",
                method === "Новая Почта"
            );
        }

        if (ukrPoshtaField) {
            ukrPoshtaField.classList.toggle(
                "active",
                method === "Укрпочта"
            );
        }

        if (ukrPoshtaIndex) {
            ukrPoshtaIndex.required = method === "Укрпочта";
        }

        if (method !== "Новая Почта") {
            if (novaPoshtaType) {
                novaPoshtaType.required = false;
            }

            [
                novaPoshtaLockerNumber,
                novaPoshtaLockerAddress,
                novaPoshtaBranchNumber,
                novaPoshtaBranchAddress
            ].forEach(field => {
                if (field) {
                    field.required = false;
                }
            });

            if (novaPoshtaLockerField) {
                novaPoshtaLockerField.classList.remove("active");
            }

            if (novaPoshtaBranchField) {
                novaPoshtaBranchField.classList.remove("active");
            }
        } else {
            updateNovaPoshtaType();
        }
    }


    if (deliveryMethod) {
        deliveryMethod.addEventListener("change", updateDeliveryMethod);
    }


    /* =========================
       TELEGRAM ORDER
    ========================= */

    if (orderForm) {
        orderForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            /* CUSTOMER DATA */

            const nameElement = document.getElementById("customerName");
            const surnameElement = document.getElementById("customerSurname");
            const phoneElement = document.getElementById("customerPhone");
            const telegramElement = document.getElementById("customerTelegram");
            const cityElement = document.getElementById("customerCity");
            const commentElement = document.getElementById("customerComment");

            const name = nameElement ? nameElement.value.trim() : "";
            const surname = surnameElement ? surnameElement.value.trim() : "";
            const phone = phoneElement ? phoneElement.value.trim() : "";
            const telegram = telegramElement ? telegramElement.value.trim() : "";
            const city = cityElement ? cityElement.value.trim() : "";
            const comment = commentElement ? commentElement.value.trim() : "";

            /* CUSTOMER VALIDATION */

            if (!name) {
                alert("Введіть ім’я");
                nameElement?.focus();
                return;
            }

            if (!surname) {
                alert("Введіть прізвище");
                surnameElement?.focus();
                return;
            }

            if (!telegram.startsWith("@")) {
                alert("Введите Telegram username начиная с @");
                telegramElement?.focus();
                return;
            }

            if (!deliveryMethod?.value) {
                alert("Оберіть спосіб доставки");
                deliveryMethod?.focus();
                return;
            }

            /* DELIVERY VALIDATION */

            let destinationType = "";
            let destinationNumber = "";
            let destinationAddress = "";

            if (deliveryMethod.value === "Новая Почта") {
                if (!novaPoshtaType?.value) {
                    alert("Оберіть поштомат або відділення Нової Пошти");
                    novaPoshtaType?.focus();
                    return;
                }

                if (novaPoshtaType.value === "Поштомат") {
                    destinationType = "Поштомат";
                    destinationNumber = novaPoshtaLockerNumber?.value.trim() || "";
                    destinationAddress = novaPoshtaLockerAddress?.value.trim() || "";
                } else if (novaPoshtaType.value === "Відділення") {
                    destinationType = "Відділення";
                    destinationNumber = novaPoshtaBranchNumber?.value.trim() || "";
                    destinationAddress = novaPoshtaBranchAddress?.value.trim() || "";
                }

                if (!destinationNumber) {
                    alert("Вкажіть номер поштомата або відділення");
                    return;
                }

                if (!destinationAddress) {
                    alert("Вкажіть адресу поштомата або відділення");
                    return;
                }
            }

            if (
                deliveryMethod.value === "Укрпочта" &&
                !ukrPoshtaIndex?.value.trim()
            ) {
                alert("Введите почтовый индекс");
                ukrPoshtaIndex?.focus();
                return;
            }

            /* PRODUCTS */

            let productsText = "";
            let total = 0;

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                productsText +=
                    `\n🩸 ${escapeHTML(item.name)} ×${item.quantity} — ${formatPrice(itemTotal)}`;
            });

            if (cart.length === 0) {
                alert("YOUR CART IS EMPTY");
                return;
            }

            /* DELIVERY TEXT */

            let deliveryText =
                `🚚 <b>Доставка:</b> ${escapeHTML(deliveryMethod.value)}`;

            if (deliveryMethod.value === "Новая Почта") {
                deliveryText += `\n📦 <b>Тип:</b> ${escapeHTML(destinationType)}`;
                deliveryText += `\n🔢 <b>Номер:</b> ${escapeHTML(destinationNumber)}`;
                deliveryText += `\n📍 <b>Адрес:</b> ${escapeHTML(destinationAddress)}`;
            }

            if (deliveryMethod.value === "Укрпочта") {
                deliveryText +=
                    `\n📮 <b>Индекс:</b> ${escapeHTML(ukrPoshtaIndex.value.trim())}`;
            }

            /* TELEGRAM MESSAGE */

            let message =
                `🛍 <b>НОВЫЙ ЗАКАЗ ZXCAER</b>\n\n` +
                `👤 <b>Ім’я:</b> ${escapeHTML(name)}\n` +
                `👤 <b>Прізвище:</b> ${escapeHTML(surname)}\n` +
                `📱 <b>Телефон:</b> ${escapeHTML(phone)}\n` +
                `💬 <b>Telegram:</b> ${escapeHTML(telegram)}\n\n` +
                `📍 <b>Город:</b> ${escapeHTML(city)}\n` +
                `${deliveryText}\n\n` +
                `📦 <b>ТОВАРЫ:</b>` +
                productsText +
                `\n\n💰 <b>ИТОГО:</b> ${formatPrice(total)}`;

            if (comment) {
                message +=
                    `\n\n📝 <b>Комментарий:</b>\n${escapeHTML(comment)}`;
            }

            /* DISABLE BUTTON */

            const submitButton = orderForm.querySelector(
                'button[type="submit"]'
            );

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "ОТПРАВКА...";
            }

            /* SEND TELEGRAM */

            try {
                if (
                    !TELEGRAM_BOT_TOKEN ||
                    TELEGRAM_BOT_TOKEN === "ВСТАВЬ_НОВЫЙ_ТОКЕН_БОТА"
                ) {
                    throw new Error("Не настроен токен Telegram-бота.");
                }

                const response = await fetch(
                    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            chat_id: TELEGRAM_CHAT_ID,
                            text: message,
                            parse_mode: "HTML"
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.ok) {
                    console.error("Telegram error:", data);
                    throw new Error(
                        data.description || "Ошибка отправки заказа в Telegram."
                    );
                }

                /* SUCCESS */

                alert(
                    "ЗАКАЗ УСПЕШНО ОФОРМЛЕН! ❤️\n\n" +
                    "Мы получили ваш заказ и скоро свяжемся с вами."
                );

                /* CLEAR CART */

                cart = [];
                saveCart();
                renderCart();

                /* CLOSE WINDOWS */

                closeOrderModal();
                closeCart();

                /* RESET FORM */

                orderForm.reset();
                updateDeliveryMethod();

            } catch (error) {
                console.error("Telegram request failed:", error);

                alert(
                    "Не удалось отправить заказ. Проверьте подключение и настройки Telegram."
                );

            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "ОФОРМИТЬ ЗАКАЗ";
                }
            }
        });
    }


    /* =========================
       ESC
    ========================= */

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            closeCart();
            closeProductModal();
            closeOrderModal();
        }
    });


    /* =========================
       SCROLL REVEAL
    ========================= */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }


    /* =========================
       INTRO
    ========================= */

    const siteIntro = document.getElementById("siteIntro");

    window.addEventListener("load", () => {
        document.body.classList.add("site-loaded");

        setTimeout(() => {
            if (siteIntro) {
                siteIntro.classList.add("hide");
            }

            setTimeout(() => {
                if (siteIntro) {
                    siteIntro.remove();
                }
            }, 900);

        }, 1500);
    });


    /* =========================
       START
    ========================= */

    renderCart();


    /* =========================
       ACCOUNT / AUTH
       Supabase Auth
    ========================= */

    const accountButton = document.getElementById("accountButton");
    const accountModal = document.getElementById("accountModal");
    const accountOverlay = document.getElementById("accountOverlay");
    const accountModalClose = document.getElementById("accountModalClose");
    const accountForm = document.getElementById("accountForm");
    const accountEmail = document.getElementById("accountEmail");
    const accountPassword = document.getElementById("accountPassword");
    const accountSubmit = document.getElementById("accountSubmit");
    const accountMessage = document.getElementById("accountMessage");
    const accountLogged = document.getElementById("accountLogged");
    const accountUserEmail = document.getElementById("accountUserEmail");
    const accountLogout = document.getElementById("accountLogout");
    const accountTabs = document.querySelectorAll("[data-account-tab]");

    let accountMode = "login";
    let accountClient = null;

    function getAccountClient() {
        if (accountClient) {
            return accountClient;
        }

        if (!window.supabase) {
            return null;
        }

        accountClient = window.supabase.createClient(
            "https://gxkmnkphocqvlhnerkix.supabase.co",
            "sb_publishable_B3hq0yrXvptyr4KT7dCczg_5VVVeup_"
        );

        return accountClient;
    }

    function setAccountMessage(text = "", type = "") {
        if (!accountMessage) {
            return;
        }

        accountMessage.textContent = text;
        accountMessage.className =
            "account-message" + (type ? " " + type : "");
    }

    function setAccountMode(mode) {
        accountMode = mode;

        accountTabs.forEach(tab => {
            tab.classList.toggle(
                "active",
                tab.dataset.accountTab === mode
            );
        });

        if (accountSubmit) {
            accountSubmit.textContent =
                mode === "login" ? "ВОЙТИ" : "СОЗДАТЬ АККАУНТ";
        }

        if (accountPassword) {
            accountPassword.autocomplete =
                mode === "login" ? "current-password" : "new-password";
        }

        setAccountMessage("");
    }

    function openAccount() {
        if (!accountModal) {
            return;
        }

        accountModal.classList.add("open");
        accountOverlay?.classList.add("open");
        accountModal.setAttribute("aria-hidden", "false");
        setAccountMessage("");
    }

    function closeAccount() {
        accountModal?.classList.remove("open");
        accountOverlay?.classList.remove("open");
        accountModal?.setAttribute("aria-hidden", "true");
    }

    function renderAccount(user) {
        if (!accountForm || !accountLogged) {
            return;
        }

        const loggedIn = !!user;

        accountForm.hidden = loggedIn;
        accountLogged.hidden = !loggedIn;

        if (accountUserEmail) {
            accountUserEmail.textContent = user?.email || "";
        }

        if (!loggedIn) {
            setAccountMode("login");
        }
    }

    async function refreshAccount() {
        const client = getAccountClient();

        if (!client) {
            return;
        }

        const { data } = await client.auth.getSession();
        renderAccount(data?.session?.user || null);
    }

    accountButton?.addEventListener("click", openAccount);
    accountModalClose?.addEventListener("click", closeAccount);
    accountOverlay?.addEventListener("click", closeAccount);

    accountTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            setAccountMode(tab.dataset.accountTab);
        });
    });

    accountForm?.addEventListener("submit", async event => {
        event.preventDefault();

        const client = getAccountClient();

        if (!client) {
            setAccountMessage(
                "Не удалось подключить авторизацию.",
                "error"
            );
            return;
        }

        const email = accountEmail?.value.trim() || "";
        const password = accountPassword?.value || "";

        if (!email || password.length < 6) {
            setAccountMessage(
                "Введите email и пароль минимум из 6 символов.",
                "error"
            );
            return;
        }

        if (accountSubmit) {
            accountSubmit.disabled = true;
            accountSubmit.textContent =
                accountMode === "login" ? "ВХОД..." : "СОЗДАНИЕ...";
        }

        setAccountMessage("");

        try {
            let result;

            if (accountMode === "login") {
                result = await client.auth.signInWithPassword({
                    email,
                    password
                });
            } else {
                result = await client.auth.signUp({
                    email,
                    password
                });
            }

            if (result.error) {
                throw result.error;
            }

            if (accountMode === "login") {
                setAccountMessage("Ви успішно увійшли.", "success");
                renderAccount(result.data.user);

            } else if (result.data.session) {
                setAccountMessage(
                    "Акаунт успішно створено. Ви увійшли.",
                    "success"
                );
                renderAccount(result.data.user);

            } else {
                setAccountMessage(
                    "Акаунт успішно створено. Реєстрацію завершено.",
                    "success"
                );
            }

        } catch (error) {
            console.error("ZXCAER auth error:", error);

            setAccountMessage(
                error?.message || "Ошибка авторизации. Попробуйте ещё раз.",
                "error"
            );

        } finally {
            if (accountSubmit) {
                accountSubmit.disabled = false;
                accountSubmit.textContent =
                    accountMode === "login" ? "ВОЙТИ" : "СОЗДАТЬ АККАУНТ";
            }
        }
    });

    accountLogout?.addEventListener("click", async () => {
        const client = getAccountClient();

        if (!client) {
            return;
        }

        const { error } = await client.auth.signOut();

        if (error) {
            setAccountMessage(
                error.message || "Не удалось выйти.",
                "error"
            );
            return;
        }

        renderAccount(null);
        setAccountMessage("Вы вышли из аккаунта.", "success");
    });

    const initialAccountClient = getAccountClient();

    if (initialAccountClient) {
        initialAccountClient.auth.onAuthStateChange((_event, session) => {
            renderAccount(session?.user || null);
        });

        refreshAccount();
    }

});
