// BetterGame.pl — skrypty używane na każdej podstronie

const ADRES_SERWERA = "bettergame.pl";
const KLUCZ_KOSZYKA = "bg_koszyk";

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

function kopiujIP() {
  const gotowe = () => pokazToast(`Skopiowano: ${ADRES_SERWERA}`);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(ADRES_SERWERA).then(gotowe, () => pokazToast(ADRES_SERWERA));
  } else {
    pokazToast(ADRES_SERWERA);
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
