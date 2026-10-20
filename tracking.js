(() => {
  const SUPABASE_URL = "https://gxkmnkphocqvlhnerkix.supabase.co";
  const SUPABASE_KEY = "sb_publishable_B3hq0yrXvptyr4KT7dCczg_5VVVeup_";
  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const $ = id => document.getElementById(id);
  const labels = {new:"Замовлення створено",confirmed:"Замовлення підтверджено",packing:"Готуємо до відправлення",shipping:"Передаємо перевізнику",shipped:"У дорозі",received:"Отримано",cancelled:"Скасовано"};
  const steps = [
    {key:"new",label:"Створено"}, {key:"confirmed",label:"Підтверджено"},
    {key:"packing",label:"Пакування"}, {key:"shipping",label:"Передача пошті"},
    {key:"shipped",label:"У дорозі"}, {key:"received",label:"Отримано"}
  ];
  const esc = v => String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const money = v => new Intl.NumberFormat("uk-UA",{style:"currency",currency:"UAH",maximumFractionDigits:2}).format(Number(v||0));
  function render(o){
    const status = o.status || "new", cancelled = status === "cancelled", received = status === "received";
    const current = steps.findIndex(s=>s.key===status);
    const timeline = steps.map((s,i)=>{const done=(received||current>=i)&&!cancelled;return `<div class="step ${done?"done":""}"><div class="dot">${done?"✓":i+1}</div>${s.label}</div>`}).join("");
    const items = Array.isArray(o.items) ? o.items.map(x=>`${x.name||"Товар"}${x.size?` (${x.size})`:""} × ${Number(x.quantity||1)}`).join(", ") : "";
    const ttn = o.tracking_number ? `<a class="tracking-link" href="https://novaposhta.ua/tracking/?cargo_number=${encodeURIComponent(o.tracking_number)}" target="_blank" rel="noopener noreferrer">${esc(o.tracking_number)} ↗</a>` : "Ще не вказано";
    const method = String(o.delivery_method || "").toLowerCase();
    const destinationNo = String(o.destination_number || "").trim();
    const destinationAddress = String(o.destination_address || "").trim();
    let destinationLabel = "Відділення / адреса";
    let destinationValue = "Не вказано";
    if (method.includes("укр") || method.includes("ukr") || method.includes("укрпошта")) {
      destinationLabel = "Поштовий індекс";
      destinationValue = destinationNo || destinationAddress || "Не вказано";
      if (destinationValue !== "Не вказано" && !/індекс|index/i.test(destinationValue)) destinationValue = `Індекс: ${destinationValue}`;
    } else if (method.includes("поштомат") || method.includes("postomat") || method.includes("постамат")) {
      destinationLabel = "Поштомат";
      destinationValue = destinationNo ? `Поштомат №${destinationNo.replace(/^№\s*/, "")}` : (destinationAddress || "Не вказано");
    } else {
      destinationLabel = "Адреса / номер відділення";
      const number = destinationNo ? `№${destinationNo.replace(/^№\s*/, "")}` : "";
      destinationValue = [destinationAddress, number].filter(Boolean).join(", ") || "Не вказано";
    }
    const total = Number(o.total||0), delivery = Number(o.delivery_price||0), paid = Number(o.paid_amount||0);
    const due = Math.max(0, Number.isFinite(Number(o.payment_due)) && o.payment_due !== null ? Number(o.payment_due) : total + delivery - paid);
    return `<section class="result order-result" aria-live="polite">
      <div class="result-head"><div><div class="order-no">ЗАМОВЛЕННЯ №${esc(o.id)}</div><div class="product-title">${esc([o.customer_name,o.customer_surname].filter(Boolean).join(" ")||"Ваше замовлення")}</div><div class="order-no">Створено: ${o.created_at ? esc(new Date(o.created_at).toLocaleDateString("uk-UA")) : "—"}</div></div><span class="status-pill ${received?"done":cancelled?"cancel":""}">${esc(labels[status]||"Статус оновлюється")}</span></div>
      ${cancelled ? `<p class="message">Це замовлення скасовано. Зв’яжіться з магазином, якщо вважаєте це помилкою.</p>` : `<div class="progress">${timeline}</div>`}
      <div class="info-grid"><div class="info"><span>Номер ТТН / накладної</span><strong>${ttn}</strong></div><div class="info"><span>Місто доставки</span><strong>${esc(o.city||"Не вказано")}</strong></div><div class="info"><span>Спосіб доставки</span><strong>${esc(o.delivery_method||"Не вказано")}</strong></div><div class="info"><span>${esc(destinationLabel)}</span><strong>${esc(destinationValue)}</strong></div></div>
      ${items?`<div class="info" style="margin-top:12px"><span>Товари</span><strong>${esc(items)}</strong></div>`:""}
      <div class="info-grid" style="margin-top:12px"><div class="info"><span>Вартість товарів</span><strong>${money(total)}</strong></div><div class="info"><span>Вартість доставки</span><strong>${money(delivery)}</strong></div><div class="info"><span>Вже оплачено</span><strong>${money(paid)}</strong></div><div class="info pay-due"><span>Залишилось оплатити</span><strong>${money(due)}</strong></div></div>
      ${o.comment?`<div class="info" style="margin-top:12px"><span>Коментар</span><strong>${esc(o.comment)}</strong></div>`:""}
      <div class="updated"></div></section>`;
  }
  $("refreshBtn")?.addEventListener("click", () => {
    if ($("phone").value.trim()) { $("trackForm").requestSubmit(); }
    else { $("phone").focus(); $("message").textContent="Спочатку введіть номер телефону."; }
  });
  $("trackForm").addEventListener("submit", async e => {
    e.preventDefault(); $("message").textContent=""; $("result").classList.add("hidden"); $("result").innerHTML="";
    const btn=$("submitBtn"); btn.disabled=true; btn.textContent="Шукаємо…";
    try {
      const {data,error}=await db.rpc("public_track_order_by_phone",{p_phone:$("phone").value.trim()});
      if(error) throw error;
      if(!data || data.error || !Array.isArray(data.orders) || !data.orders.length) { $("message").textContent="За цим номером телефону замовлень не знайдено. Перевірте номер і спробуйте ще раз."; return; }
      $("result").innerHTML=data.orders.map(render).join(""); $("result").classList.remove("hidden");
    } catch(err) {
      console.error(err);
      $("message").textContent="Не вдалося виконати пошук. Переконайтеся, що SQL для відстеження встановлено в Supabase, і спробуйте ще раз.";
    } finally {btn.disabled=false;btn.textContent="Знайти замовлення →";}
  });
})();