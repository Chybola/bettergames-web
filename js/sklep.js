// Sklep: lista produktów, koszyk, formularz zamówienia

// Adres backendu, który utworzy zamówienie i zwróci link do bramki płatności
// (np. Tpay, Przelewy24, HotPay). Dopóki jest pusty, formularz pokaże komunikat.
const ADRES_ZAMOWIEN = "";

const zl = (grosze) =>
  (grosze / 100).toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł";

const produkt = (id) => PRODUKTY.find((p) => p.id === id);
const tryb = (id) => TRYBY.find((t) => t.id === id);
const esc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[z]);

let koszyk = wczytajKoszyk().filter((poz) => produkt(poz.id));
let krok = "lista";
let wybranyTryb = tryb(location.hash.slice(1)) ? location.hash.slice(1) : "survival";
let wybranaKategoria = "wszystko";

/* ---------- produkty ---------- */

function kartaProduktu(p) {
  const promo = p.cenaPrzed
    ? `<span class="old">${zl(p.cenaPrzed)}</span>`
    : "";
  const omnibus = p.najnizsza30
    ? `<p class="omnibus">Najniższa cena z 30 dni przed obniżką: ${zl(p.najnizsza30)}</p>`
    : "";
  const lista = p.zawiera
    ? `<ul class="perks">${p.zawiera.map((z) => `<li>${esc(z)}</li>`).join("")}</ul>`
    : "";

  return `
    <article class="product ${p.kategoria === "rangi" ? "is-rank" : ""}" data-kat="${p.kategoria}" style="--accent:${p.kolor || "var(--violet-2)"}">
      ${p.wyroznienie ? `<span class="ribbon">${esc(p.wyroznienie)}</span>` : ""}
      <div class="product-top">
        <h3>${p.kategoria === "rangi" ? `<span class="mono rank-tag">[${esc(p.nazwa)}]</span>` : esc(p.nazwa)}</h3>
        <span class="period mono">${esc(p.okres)}</span>
      </div>
      <p class="desc">${esc(p.opis)}</p>
      <p class="works-in mono">działa: ${esc(tryb(p.tryb).nazwa)}</p>
      ${lista}
      <div class="product-foot">
        <div class="price">
          ${promo}
          <strong>${zl(p.cena)}</strong>
        </div>
        <button class="btn btn-pink add" data-dodaj="${p.id}">Do koszyka</button>
      </div>
      ${omnibus}
    </article>`;
}

function renderujTryby() {
  document.getElementById("tryby").innerHTML = TRYBY.map((t) => `
    <button role="tab" class="mode-card" data-tryb="${t.id}" aria-selected="${t.id === wybranyTryb}" style="--accent:${t.kolor}">
      <b>${esc(t.nazwa)}</b>
      <span>${esc(t.opis)}</span>
      <small class="mono">${PRODUKTY.filter((p) => p.tryb === t.id).length} produktów</small>
    </button>`).join("");
}

function renderujKategorie() {
  const dostepne = [...new Set(PRODUKTY.filter((p) => p.tryb === wybranyTryb).map((p) => p.kategoria))];
  if (wybranaKategoria !== "wszystko" && !dostepne.includes(wybranaKategoria)) wybranaKategoria = "wszystko";
  const przyciski = dostepne.length > 1 ? ["wszystko", ...dostepne] : [];
  document.getElementById("kategorie").innerHTML = przyciski.map((k) => `
    <button role="tab" class="tab" data-kategoria="${k}" aria-selected="${k === wybranaKategoria}">${k === "wszystko" ? "Wszystko" : KATEGORIE[k]}</button>`).join("");
  document.getElementById("naglowek-trybu").textContent = `Sklep: ${tryb(wybranyTryb).nazwa}`;
}

function renderujProdukty() {
  const lista = PRODUKTY.filter((p) => p.tryb === wybranyTryb && (wybranaKategoria === "wszystko" || p.kategoria === wybranaKategoria));
  document.getElementById("produkty").innerHTML = lista.map(kartaProduktu).join("");
}

function ustawTryb(id) {
  wybranyTryb = id;
  wybranaKategoria = "wszystko";
  history.replaceState(null, "", `#${id}`);
  renderujTryby();
  renderujKategorie();
  renderujProdukty();
}

/* ---------- koszyk ---------- */

function dodaj(id) {
  const poz = koszyk.find((k) => k.id === id);
  if (poz) poz.ilosc = Math.min(poz.ilosc + 1, 10);
  else koszyk.push({ id, ilosc: 1 });
  zapiszKoszyk(koszyk);
  renderujKoszyk();
  pokazToast(`Dodano: ${produkt(id).nazwa} (${tryb(produkt(id).tryb).nazwa})`);
}

function zmienIlosc(id, zmiana) {
  const poz = koszyk.find((k) => k.id === id);
  if (!poz) return;
  poz.ilosc += zmiana;
  if (poz.ilosc <= 0) koszyk = koszyk.filter((k) => k.id !== id);
  poz.ilosc = Math.min(poz.ilosc, 10);
  zapiszKoszyk(koszyk);
  renderujKoszyk();
}

const suma = () => koszyk.reduce((s, poz) => s + produkt(poz.id).cena * poz.ilosc, 0);

function renderujKoszyk() {
  const ul = document.getElementById("lista-koszyka");
  ul.innerHTML = koszyk
    .map((poz) => {
      const p = produkt(poz.id);
      return `
        <li>
          <div>
            <b>${esc(p.nazwa)}</b>
            <small><span class="cart-mode" style="--accent:${tryb(p.tryb).kolor}">${esc(tryb(p.tryb).nazwa)}</span> ${esc(p.okres)} · ${zl(p.cena)}</small>
          </div>
          <div class="qty">
            <button data-ilosc="${p.id}" data-zmiana="-1" aria-label="Mniej">−</button>
            <span class="mono">${poz.ilosc}</span>
            <button data-ilosc="${p.id}" data-zmiana="1" aria-label="Więcej">+</button>
          </div>
          <strong class="line-sum">${zl(p.cena * poz.ilosc)}</strong>
        </li>`;
    })
    .join("");

  const pusty = koszyk.length === 0;
  document.getElementById("pusty-koszyk").hidden = !pusty;
  document.getElementById("suma").textContent = zl(suma());
  document.querySelector("[data-dalej]").disabled = pusty;
  if (pusty && krok === "dane") ustawKrok("lista");
}

/* ---------- szuflada i kroki ---------- */

const szuflada = document.getElementById("koszyk");

function otworz() {
  szuflada.classList.add("open");
  szuflada.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}

function zamknij() {
  szuflada.classList.remove("open");
  szuflada.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
  if (krok === "info") ustawKrok("lista");
}

function ustawKrok(nowy) {
  krok = nowy;
  document.querySelectorAll("[data-krok]").forEach((el) => (el.hidden = el.dataset.krok !== nowy));
  document.querySelector("[data-tytul-koszyka]").textContent =
    nowy === "dane" ? "Twoje dane" : nowy === "info" ? "Zamówienie" : "Koszyk";
  document.querySelector("[data-wstecz]").hidden = nowy !== "dane";
  document.querySelector("[data-dalej]").textContent = nowy === "dane" ? "Zamawiam i płacę" : "Przejdź dalej";
  document.getElementById("stopka-koszyka").hidden = nowy === "info";
}

/* ---------- zamówienie ---------- */

const formularz = document.getElementById("formularz");

function sprawdzFormularz() {
  const f = formularz.elements;
  const nick = f.nick.value.trim();
  const email = f.email.value.trim();

  if (!/^[A-Za-z0-9_]{3,16}$/.test(nick)) return "Nick musi mieć 3–16 znaków: litery, cyfry lub _.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Podaj poprawny adres e-mail.";
  if (!f.regulamin.checked) return "Musisz zaakceptować regulamin i politykę prywatności.";
  if (!f.tresci_cyfrowe.checked) return "Zaznacz zgodę na natychmiastowe dostarczenie treści cyfrowych.";
  if (!f.pelnoletnosc.checked) return "Potwierdź pełnoletność lub zgodę opiekuna.";
  return null;
}

function pokazInfo(tytul, tekst) {
  document.getElementById("info-tytul").textContent = tytul;
  document.getElementById("info-tekst").textContent = tekst;
  ustawKrok("info");
}

async function zloz() {
  const blad = sprawdzFormularz();
  const pole = document.getElementById("blad-formularza");
  pole.textContent = blad || "";
  if (blad) return;

  const f = formularz.elements;
  const zamowienie = {
    nick: f.nick.value.trim(),
    email: f.email.value.trim(),
    platnosc: f.platnosc.value,
    pozycje: koszyk.map(({ id, ilosc }) => ({ id, ilosc, tryb: produkt(id).tryb })),
    suma: suma(),
    zgody: {
      regulamin: true,
      tresciCyfrowe: true,
      pelnoletnoscLubZgodaOpiekuna: true,
      data: new Date().toISOString(),
    },
  };

  if (!ADRES_ZAMOWIEN) {
    pokazInfo("Płatności chwilowo niedostępne", "Pracujemy nad uruchomieniem płatności online. Twój koszyk zostaje zapisany — wróć za jakiś czas albo napisz do nas na Discordzie.");
    return;
  }

  const przycisk = document.querySelector("[data-dalej]");
  przycisk.disabled = true;
  try {
    // backend sam liczy cenę na podstawie id produktów — kwota z przeglądarki jest tylko informacyjna
    const odp = await fetch(ADRES_ZAMOWIEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(zamowienie),
    });
    if (!odp.ok) throw new Error(odp.status);
    const { url } = await odp.json();
    koszyk = [];
    zapiszKoszyk(koszyk);
    window.location.href = url;
  } catch {
    pole.textContent = "Nie udało się utworzyć zamówienia. Spróbuj ponownie za chwilę.";
  } finally {
    przycisk.disabled = false;
  }
}

/* ---------- zdarzenia ---------- */

document.addEventListener("click", (e) => {
  const t = e.target.closest("button, [data-zamknij-koszyk]");
  if (!t) return;

  if (t.dataset.dodaj) dodaj(t.dataset.dodaj);
  else if (t.dataset.ilosc) zmienIlosc(t.dataset.ilosc, Number(t.dataset.zmiana));
  else if (t.hasAttribute("data-otworz-koszyk")) otworz();
  else if (t.hasAttribute("data-zamknij-koszyk")) zamknij();
  else if (t.hasAttribute("data-wstecz")) ustawKrok("lista");
  else if (t.hasAttribute("data-dalej")) krok === "lista" ? ustawKrok("dane") : zloz();
  else if (t.dataset.tryb) ustawTryb(t.dataset.tryb);
  else if (t.dataset.kategoria) {
    wybranaKategoria = t.dataset.kategoria;
    document.querySelectorAll(".tab").forEach((b) => b.setAttribute("aria-selected", b === t));
    renderujProdukty();
  }
});

formularz.addEventListener("submit", (e) => {
  e.preventDefault();
  zloz();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && szuflada.classList.contains("open")) zamknij();
});

renderujTryby();
renderujKategorie();
renderujProdukty();
renderujKoszyk();
ustawKrok("lista");
if (location.hash === "#koszyk") otworz();
