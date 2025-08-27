(() => {
  const el = document.getElementById("countryName");
  const STORAGE_KEY = "user_country_cache_v1";

  // показываем из кэша
  try {
    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (cached && cached.name) el.textContent = cached.name;
  } catch (_) {}

  // всегда на английском
  const displayNames = (() => {
    try {
      return new Intl.DisplayNames(["en"], { type: "region" });
    } catch {
      return null;
    }
  })();

  function fetchWithTimeout(url, options = {}, timeout = 4000) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeout);
    return fetch(url, { ...options, signal: controller.signal }).finally(() =>
      clearTimeout(t)
    );
  }

  const providers = [
    async () => {
      const r = await fetchWithTimeout("https://api.country.is/");
      const d = await r.json();
      if (d && d.country) {
        const code = d.country.toUpperCase();
        const name = displayNames?.of(code) || code;
        return { code, name };
      }
    },
    async () => {
      const r = await fetchWithTimeout("https://ipwho.is/");
      const d = await r.json();
      if (d && d.success && d.country)
        return { name: d.country, code: d.country_code };
    },
    async () => {
      const r = await fetchWithTimeout("https://ipapi.co/json/");
      const d = await r.json();
      if (d && d.country_name)
        return { name: d.country_name, code: d.country_code };
    },
    async () => {
      const r = await fetchWithTimeout("https://ipinfo.io/json");
      const d = await r.json();
      if (d && d.country) {
        const code = d.country.toUpperCase();
        const name = displayNames?.of(code) || code;
        return { code, name };
      }
    },
    async () => {
      const r = await fetchWithTimeout(
        "https://www.cloudflare.com/cdn-cgi/trace"
      );
      const txt = await r.text();
      const m = txt.match(/loc=([A-Z]{2})/);
      if (m) {
        const code = m[1];
        const name = displayNames?.of(code) || code;
        return { code, name };
      }
    },
  ];

  async function detectCountry() {
    for (const provider of providers) {
      try {
        const res = await provider();
        if (res && res.name) {
          el.textContent = res.name;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
          return;
        }
      } catch {}
    }
    el.textContent = "Unknown";
  }

  detectCountry();
})();
