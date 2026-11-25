// BetterGame.pl — skrypty używane na każdej podstronie

const ADRES_SERWERA = "bettergame.pl";
const KLUCZ_KOSZYKA = "bg_koszyk";

// Promocje czasowe - pasek na górze każdej podstrony i ceny w sklepie (js/produkty.js).
// Te same procenty i terminy MUSZĄ być w sklep-panel/produkty.php. Każda działa w oknie [od, do), potem znika sama.
const PROMOCJE = [
  { nazwa: "BLACK FRIDAY", emoji: "⚡", procent: 50, od: "2026-11-23T00:00:00+01:00", do: "2026-12-01T00:00:00+01:00", koniecTekst: "30.11, 23:59" },
  { nazwa: "MIKOŁAJKI", emoji: "🎅", procent: 30, od: "2026-12-06T00:00:00+01:00", do: "2026-12-07T00:00:00+01:00", koniecTekst: "6.12, 23:59" },
  { nazwa: "ŚWIĘTA", emoji: "🎄", procent: 25, od: "2026-12-20T00:00:00+01:00", do: "2026-12-27T00:00:00+01:00", koniecTekst: "26.12, 23:59" },
];
const promocjaTeraz = () => PROMOCJE.find((p) => Date.now() >= Date.parse(p.od) && Date.now() < Date.parse(p.do)) || null;
const PROMOCJA_BAZA = promocjaTeraz();
const promocjaAktywna = () => Boolean(PROMOCJA_BAZA) && Date.now() < Date.parse(PROMOCJA_BAZA.do);

function pasekPromocji() {
  if (!promocjaAktywna()) return;
  const p = PROMOCJA_BAZA;
  const pasek = document.createElement("a");
  pasek.className = "promo-top";
  pasek.href = "sklep.html";
  pasek.innerHTML = `<span class="wrap">
      <strong>${p.emoji || ""} ${p.nazwa} <em>-${p.procent}%</em></strong>
      <span class="promo-top-tekst">na wszystko w sklepie — tylko do ${p.koniecTekst}</span>
      <b class="promo-top-licznik"></b>
      <span class="promo-top-cta">Do sklepu →</span>
    </span>`;
  document.body.prepend(pasek);
  // zwykły pasek ogłoszeń (strona główna) chowa się na czas promocji
  const zwykle = [...document.querySelectorAll(".topbar")];
  zwykle.forEach((el) => (el.hidden = true));
  const licznik = pasek.querySelector(".promo-top-licznik");
  const tik = () => {
    const ms = Date.parse(p.do) - Date.now();
    if (ms <= 0) { pasek.remove(); zwykle.forEach((el) => (el.hidden = false)); return; }
    const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000) % 24, m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
    licznik.textContent = `${d > 0 ? d + " d " : ""}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  tik();
  setInterval(tik, 1000);
}
pasekPromocji();

// Odliczanie do startu (Earth SMP): [data-odliczanie="ISO"] z polami [data-d] [data-h] [data-m] [data-s]
// albo [data-odliczanie-tekst="ISO"] - krótki tekst "za 16 d 05:12:33". Po czasie pokazuje [hidden] .e-licznik-po.
function odliczania() {
  const pola = [...document.querySelectorAll("[data-odliczanie], [data-odliczanie-tekst]")];
  if (!pola.length) return;
  const dwa = (n) => String(n).padStart(2, "0");
  const tik = () => {
    for (const el of pola) {
      const ms = Date.parse(el.dataset.odliczanie || el.dataset.odliczanieTekst) - Date.now();
      const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000) % 24, m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
      if (el.dataset.odliczanieTekst !== undefined) {
        el.textContent = ms <= 0 ? "już działa!" : `za ${d > 0 ? d + " d " : ""}${dwa(h)}:${dwa(m)}:${dwa(s)}`;
        continue;
      }
      if (ms <= 0) {
        el.querySelector(".e-licznik-pola")?.setAttribute("hidden", "");
        el.querySelector(".e-licznik-tytul")?.setAttribute("hidden", "");
        el.querySelector(".e-licznik-po")?.removeAttribute("hidden");
        continue;
      }
      for (const [k, v] of [["d", d], ["h", h], ["m", m], ["s", s]]) {
        const p = el.querySelector(`[data-${k}]`);
        if (p) p.textContent = k === "d" ? v : dwa(v);
      }
    }
  };
  tik();
  setInterval(tik, 1000);
}
odliczania();

function wczytajKoszyk() {
  try {
    const dane = JSON.parse(localStorage.getItem(KLUCZ_KOSZYKA) || "[]");
    return Array.isArray(dane) ? dane : [];
  } catch {
    return [];
  }
}

function zapiszKoszyk(koszyk) {
  try {
    localStorage.setItem(KLUCZ_KOSZYKA, JSON.stringify(koszyk));
  } catch {
    // tryb prywatny / zablokowane dane strony — koszyk działa do odświeżenia
  }
  odswiezLicznik(koszyk);
}

function odswiezLicznik(koszyk = wczytajKoszyk()) {
  const ile = koszyk.reduce((suma, poz) => suma + poz.ilosc, 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = ile;
    el.dataset.empty = ile === 0 ? "true" : "false";
  });
}

let toastTimer;
function pokazToast(tekst) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = tekst;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

// data-kopiuj-ip="..." kopiuje podany adres (np. Bedrock), puste = adres Java
function kopiujIP(e) {
  const adres = e.currentTarget.dataset.kopiujIp || ADRES_SERWERA;
  const gotowe = () => pokazToast(`Skopiowano: ${adres}`);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(adres).then(gotowe, () => pokazToast(adres));
  } else {
    pokazToast(adres);
  }
}

// liczba graczy z publicznego API mcsrvstat.us
async function pobierzStatus() {
  const pola = document.querySelectorAll("[data-online]");
  if (!pola.length) return;
  try {
    const odp = await fetch(`https://api.mcsrvstat.us/3/${ADRES_SERWERA}`);
    const dane = await odp.json();
    pola.forEach((el) => {
      if (dane.online) {
        el.textContent = `${dane.players?.online ?? 0} graczy online`;
        el.closest(".status")?.classList.add("is-on");
      } else {
        el.textContent = "serwer offline";
      }
    });
  } catch {
    pola.forEach((el) => (el.textContent = "status niedostępny"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  odswiezLicznik();
  pobierzStatus();

  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".nav-links");
  burger?.addEventListener("click", () => {
    const otwarte = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", otwarte);
  });

  document.querySelectorAll("[data-kopiuj-ip]").forEach((el) => el.addEventListener("click", kopiujIP));

  const rok = document.querySelector("[data-rok]");
  if (rok) rok.textContent = new Date().getFullYear();
});

// płatki sakury — liczba z atrybutu data-platki na <body>
document.addEventListener("DOMContentLoaded", () => {
  const ile = Number(document.body.dataset.platki || 0);
  if (!ile || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const kontener = document.createElement("div");
  kontener.className = "petals";
  kontener.setAttribute("aria-hidden", "true");
  for (let i = 0; i < ile; i++) {
    const p = document.createElement("i");
    const skala = 0.6 + Math.random() * 0.8;
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${11 + Math.random() * 12}s`;
    p.style.animationDelay = `${-Math.random() * 20}s`;
    p.style.scale = skala;
    kontener.appendChild(p);
  }
  document.body.appendChild(kontener);
});
