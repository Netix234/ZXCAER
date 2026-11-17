(function () {
  const SUPABASE_URL = "https://gxkmnkphocqvlhnerkix.supabase.co";
  const SUPABASE_KEY = "sb_publishable_B3hq0yrXvptyr4KT7dCczg_5VVVeup_";

  function getVisitorId() {
    const key = "zxcaer_visitor_id";
    try {
      let id = localStorage.getItem(key);
      if (!id) {
        id = (window.crypto && crypto.randomUUID)
          ? crypto.randomUUID()
          : "zx-" + Date.now() + "-" + Math.random().toString(36).slice(2);
        localStorage.setItem(key, id);
      }
      return id;
    } catch (_) {
      // If browser storage is blocked, count this page load as a separate visitor.
      return "zx-temp-" + Date.now() + "-" + Math.random().toString(36).slice(2);
    }
  }

  function localDate() {
    const now = new Date();
    return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
  }

  function recordDailyDeviceVisit() {
    if (!window.supabase || !window.supabase.createClient) return;
    const visitorId = getVisitorId();
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Unique constraint (visitor_id, visit_date) ensures one count per browser/device per local day.
    client.from("site_visits").upsert({
      visitor_id: visitorId,
      visit_date: localDate(),
      page_path: location.pathname
    }, { onConflict: "visitor_id,visit_date", ignoreDuplicates: true })
      .then(({ error }) => {
        if (error) console.warn("ZXCAER visit analytics:", error.message);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", recordDailyDeviceVisit, { once: true });
  } else {
    recordDailyDeviceVisit();
  }
})();
