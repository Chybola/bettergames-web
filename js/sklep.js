// Sklep: lista produktów, koszyk, formularz zamówienia

// Adres backendu, który utworzy zamówienie i zwróci link do bramki płatności
// (np. Tpay, Przelewy24, HotPay). Dopóki jest pusty, formularz pokaże komunikat.
const ADRES_ZAMOWIEN = "https://panel.bettergame.pl/sklep/zamowienie.php";

const zl = (grosze) =>
  (grosze / 100).toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł";

const produkt = (id) => PRODUKTY.find((p) => p.id === id);
const tryb = (id) => TRYBY.find((t) => t.id === id);
const esc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[z]);

let koszyk = wczytajKoszyk().filter((poz) => produkt(poz.id));
let krok = "lista";
let wybranyTryb = tryb(location.hash.slice(1)) ? location.hash.slice(1) : TRYBY[0].id;
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
    </button>`).join("") + `
    <div class="mode-card is-soon" aria-hidden="true">
      <b>Wkrótce</b>
      <span>Kolejne tryby są w drodze</span>
    </div>`;
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

function renderujPorownanie() {
  const wiersze = POROWNANIE[wybranyTryb];
  const rangi = PRODUKTY.filter((p) => p.tryb === wybranyTryb && p.kategoria === "rangi");
  const blok = document.getElementById("porownanie");
  blok.hidden = !wiersze || rangi.length < 2 || !["wszystko", "rangi"].includes(wybranaKategoria);
  if (blok.hidden) return;

  const indeks = (id) => rangi.findIndex((r) => r.id === id);
  const komorka = (w, r, i) => {
    if (w.wartosci) return w.wartosci[r.id] ? `<span class="mono">${esc(w.wartosci[r.id])}</span>` : `<span class="no">—</span>`;
    return i >= indeks(w.od) ? `<span class="yes" aria-label="tak">✓</span>` : `<span class="no" aria-label="nie">—</span>`;
  };

  document.getElementById("tabela-porownania").innerHTML = `
    <thead><tr><th scope="col"><span class="sr-only">Cecha</span></th>${rangi.map((r) => `<th scope="col" style="--accent:${r.kolor}"><span class="mono rank-tag">[${esc(r.nazwa)}]</span></th>`).join("")}</tr></thead>
    <tbody>${wiersze.map((w) => `<tr><th scope="row">${esc(w.cecha)}</th>${rangi.map((r, i) => `<td>${komorka(w, r, i)}</td>`).join("")}</tr>`).join("")}</tbody>
    <tfoot><tr><th scope="row">Cena</th>${rangi.map((r) => `<td><strong>${zl(r.cena)}</strong><small class="mono">${esc(r.okres)}</small><button class="btn btn-pink add" data-dodaj="${r.id}">Do koszyka</button></td>`).join("")}</tr></tfoot>`;
}

function ustawTryb(id) {
  wybranyTryb = id;
  wybranaKategoria = "wszystko";
  history.replaceState(null, "", `#${id}`);
  renderujTryby();
  renderujKategorie();
  renderujProdukty();
  renderujPorownanie();
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

// podgląd skórki z mc-heads.net, żeby kupujący zauważył literówkę w nicku
let czasPodgladu;
formularz.elements.nick.addEventListener("input", (e) => {
  clearTimeout(czasPodgladu);
  const nick = e.target.value.trim();
  const podglad = document.getElementById("podglad-skina");
  if (!/^[A-Za-z0-9_]{3,16}$/.test(nick)) {
    podglad.hidden = true;
    return;
  }
  czasPodgladu = setTimeout(() => {
    podglad.querySelector("img").src = `https://mc-heads.net/avatar/${encodeURIComponent(nick)}/40`;
    podglad.querySelector("b").textContent = nick;
    podglad.hidden = false;
  }, 400);
});

// Pole na kody PSC tylko przy paysafecard, instrukcja ticketu tylko przy BLIK
formularz.addEventListener("change", (e) => {
  if (e.target.name !== "platnosc") return;
  formularz.querySelectorAll("[data-tylko]").forEach((el) => {
    el.hidden = el.dataset.tylko !== e.target.value;
  });
});

// Kody PSC z pola tekstowego: każdy kod w osobnej linii, same cyfry
function kodyPsc() {
  return formularz.elements.kodypsc.value.split(/\n+/).map((k) => k.replace(/\D/g, "")).filter(Boolean);
}

function sprawdzFormularz() {
  const f = formularz.elements;
  const nick = f.nick.value.trim();
  const email = f.email.value.trim();

  if (!/^[A-Za-z0-9_]{3,16}$/.test(nick)) return "Nick musi mieć 3–16 znaków: litery, cyfry lub _.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Podaj poprawny adres e-mail.";
  const kody = kodyPsc();
  if (f.platnosc.value === "paysafecard" && (kody.length < 1 || kody.length > 5)) return "Wpisz od 1 do 5 kodów paysafecard.";
  if (kody.some((k) => k.length !== 16)) return "Kod paysafecard ma 16 cyfr — sprawdź, czy dobrze go przepisałeś.";
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
    // kody sprawdza ręcznie administrator w panelu; przy BLIK gracz otwiera ticket na Discordzie
    kodyPsc: f.platnosc.value === "paysafecard" ? kodyPsc() : [],
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
    const wynik = await odp.json().catch(() => ({}));
    if (!odp.ok) {
      pole.textContent = wynik.blad || "Nie udało się złożyć zamówienia. Spróbuj ponownie za chwilę.";
      return;
    }
    koszyk = [];
    zapiszKoszyk(koszyk);
    renderujKoszyk();
    formularz.reset();
    if (zamowienie.platnosc === "blik") {
      pokazInfo(`Zamówienie #${wynik.id} przyjęte — zapłać BLIK-iem`,
        `Otwórz ticket na Discordzie (discord.gg/bettergame, kanał #ticket) i napisz: „Zamówienie #${wynik.id}, BLIK, ${zamowienie.nick}”. ` +
        "Administrator poda ci numer telefonu do przelewu BLIK, a po wpłacie nada zakup. " +
        "Ranga zadziała od razu po zatwierdzeniu (nawet jeśli nie grasz), klucze dostaniesz przy wejściu na GenBlock.");
    } else {
      pokazInfo(`Zamówienie #${wynik.id} przyjęte`,
        `Administrator sprawdzi kod paysafecard i nada zakup na konto ${zamowienie.nick} — zwykle w ciągu kilku godzin. ` +
        "Nie musisz być wtedy w grze: ranga zadziała od razu po zatwierdzeniu, a klucze dostaniesz przy wejściu na GenBlock. " +
        "Problem? Napisz ticket na Discordzie i podaj numer zamówienia.");
    }
  } catch {
    pole.textContent = "Nie udało się złożyć zamówienia. Spróbuj ponownie za chwilę.";
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
    renderujPorownanie();
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
renderujPorownanie();
renderujKoszyk();
ustawKrok("lista");
if (location.hash === "#koszyk") otworz();
