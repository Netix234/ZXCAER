(function () {
    if (window.showZXCAERSuccess) return;

    const purchaseAudio = new Audio("sounds/purchase.mp3");
    purchaseAudio.preload = "auto";

    function playPurchaseSound() {
        try {
            purchaseAudio.currentTime = 0;
            const playback = purchaseAudio.play();
            if (playback && typeof playback.catch === "function") {
                playback.catch(error => {
                    console.info("Custom purchase sound could not be played.", error);
                });
            }
        } catch (error) {
            console.info("Custom purchase sound is unavailable in this browser.", error);
        }
    }

    function addStyles() {
        if (document.getElementById("zxcaer-order-success-style")) return;
        const style = document.createElement("style");
        style.id = "zxcaer-order-success-style";
        style.textContent = `
            #zxcaerOrderSuccess{position:fixed;inset:0;z-index:200000;background:rgba(8,10,9,.72);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:22px;opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s ease}
            #zxcaerOrderSuccess.is-visible{opacity:1;visibility:visible}
            #zxcaerOrderSuccess .zx-success-card{width:min(420px,100%);box-sizing:border-box;background:#fff;color:#171917;border-radius:26px;padding:38px 28px 30px;text-align:center;box-shadow:0 28px 90px rgba(0,0,0,.28);transform:translateY(18px) scale(.96);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
            #zxcaerOrderSuccess.is-visible .zx-success-card{transform:translateY(0) scale(1)}
            #zxcaerOrderSuccess .zx-check-wrap{width:88px;height:88px;margin:0 auto 24px;border-radius:50%;background:#e8f8ee;display:grid;place-items:center;animation:zxCheckPop .55s cubic-bezier(.18,.89,.32,1.28) both}
            #zxcaerOrderSuccess svg{width:48px;height:48px;overflow:visible}
            #zxcaerOrderSuccess path{fill:none;stroke:#1ca45b;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:55;stroke-dashoffset:55;animation:zxDrawCheck .55s .22s ease forwards}
            #zxcaerOrderSuccess h2{font:600 23px/1.2 Arial,sans-serif;letter-spacing:-.5px;margin:0 0 12px}
            #zxcaerOrderSuccess p{font:400 14px/1.6 Arial,sans-serif;color:#656b67;margin:0 auto 10px;max-width:310px}
            #zxcaerOrderSuccess .zx-success-note{font-size:12px;color:#8a908c;margin-top:14px}
            #zxcaerOrderSuccess button{margin-top:24px;width:100%;border:0;border-radius:14px;background:#171917;color:white;padding:15px 18px;font:600 12px Arial,sans-serif;letter-spacing:1.1px;cursor:pointer}
            @keyframes zxCheckPop{0%{transform:scale(.45);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
            @keyframes zxDrawCheck{to{stroke-dashoffset:0}}
            @media(prefers-reduced-motion:reduce){#zxcaerOrderSuccess,#zxcaerOrderSuccess .zx-success-card,#zxcaerOrderSuccess .zx-check-wrap,#zxcaerOrderSuccess path{animation:none!important;transition:none!important}#zxcaerOrderSuccess path{stroke-dashoffset:0}}
        `;
        document.head.appendChild(style);
    }

    window.showZXCAERSuccess = function (options = {}) {
        addStyles();
        let modal = document.getElementById("zxcaerOrderSuccess");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "zxcaerOrderSuccess";
            modal.innerHTML = `<section class="zx-success-card" role="dialog" aria-modal="true" aria-labelledby="zxSuccessTitle"><div class="zx-check-wrap"><svg viewBox="0 0 52 52" aria-hidden="true"><path d="M10 27 L21 38 L43 14"></path></svg></div><h2 id="zxSuccessTitle"></h2><p class="zx-success-message"></p><p class="zx-success-note"></p><button type="button">ПРОДОВЖИТИ ПОКУПКИ</button></section>`;
            document.body.appendChild(modal);
            modal.addEventListener("click", event => {
                if (event.target === modal || event.target.closest("button")) {
                    modal.classList.remove("is-visible");
                    document.body.style.overflow = "";
                }
            });
        }
        modal.querySelector("h2").textContent = options.title || "Замовлення оформлено";
        const messageElement = modal.querySelector(".zx-success-message");
        const noteElement = modal.querySelector(".zx-success-note");
        messageElement.textContent = options.message || "";
        noteElement.textContent = options.note || "";
        messageElement.hidden = !messageElement.textContent;
        noteElement.hidden = !noteElement.textContent;
        modal.classList.remove("is-visible");
        void modal.offsetWidth;
        modal.classList.add("is-visible");
        document.body.style.overflow = "hidden";
        playPurchaseSound();
    };
})();
