// Tryby i produkty sklepu. Ceny w groszach (brutto), żeby uniknąć błędów zaokrągleń.
// cenaPrzed + najnizsza30 — wymagane przy promocji (dyrektywa Omnibus):
// trzeba pokazać najniższą cenę z 30 dni przed obniżką.
// Produkt działa tylko w swoim trybie. Nowy tryb = nowy wpis w TRYBY + produkty z jego id.

const TRYBY = [
  { id: "genblock", nazwa: "GenBlock", opis: "Generatory, ulepszenia, rankingi", kolor: "#ff2fb0" },
  // przedsprzedaz: zakupy czekają w kolejce wydań (serwer "earthsmp") i wpadają w dniu startu trybu
  {
    id: "earthsmp", nazwa: "Earth SMP", opis: "Mapa Ziemi, państwa, wojny", kolor: "#34d399",
    przedsprzedaz: "Przedsprzedaż - Earth SMP startuje wkrótce. Zakupy wydamy automatycznie w dniu startu, a rangi będą liczone od startu trybu.",
  },
];

const KATEGORIE = { rangi: "Rangi", zestawy: "Zestawy", klucze: "Klucze", kosmetyki: "Kosmetyki", wsparcie: "Wsparcie" };

const PRODUKTY = [
  /* ---------- GenBlock ---------- */
  {
    id: "gen-vip",
    tryb: "genblock",
    kategoria: "rangi",
    nazwa: "VIP",
    okres: "30 dni",
    cena: 1000,
    kolor: "#33e4f2",
    opis: "Ranga na start na GenBlocku.",
    zawiera: ["prefiks [VIP] na czacie i tabie", "kolorowy nick", "dostęp do /kit vip", "rola VIP na Discordzie"],
  },
  {
    id: "gen-svip",
    tryb: "genblock",
    kategoria: "rangi",
    nazwa: "SVIP",
    okres: "30 dni",
    cena: 2000,
    kolor: "#c18bff",
    opis: "Wszystko z VIP-a i trochę więcej.",
    zawiera: ["wszystko z rangi VIP", "prefiks [SVIP]", "dostęp do /kit svip", "rola SVIP na Discordzie"],
  },
  {
    id: "gen-sponsor",
    tryb: "genblock",
    kategoria: "rangi",
    nazwa: "SPONSOR",
    okres: "30 dni",
    cena: 3000,
    kolor: "#f4c04a",
    opis: "Dla tych, którzy chcą mocniej wesprzeć serwer.",
    zawiera: ["wszystko z rangi SVIP", "prefiks [SPONSOR]", "dostęp do /kit sponsor", "rola Sponsor na Discordzie"],
  },
  {
    id: "gen-elita",
    tryb: "genblock",
    kategoria: "rangi",
    nazwa: "ELITA",
    okres: "30 dni",
    cena: 5000,
    kolor: "#ff6fae",
    opis: "Ranga dla stałych bywalców GenBlocka.",
    zawiera: ["wszystko z rangi SPONSOR", "prefiks [ELITA]", "dostęp do /kit elita", "rola Elita na Discordzie"],
  },
  {
    id: "gen-better",
    tryb: "genblock",
    kategoria: "rangi",
    nazwa: "BETTER",
    okres: "30 dni",
    cena: 10000,
    kolor: "#ff2fb0",
    wyroznienie: "najwyższa ranga",
    opis: "Najwyższa ranga na serwerze, nazwana tak jak my.",
    zawiera: ["wszystko z rangi ELITA", "prefiks [BETTER] z gradientem", "własny kolor nicku (HEX)", "dostęp do /kit better", "rola Better na Discordzie"],
  },
  {
    id: "gen-zestaw-better-plus",
    tryb: "genblock",
    kategoria: "zestawy",
    nazwa: "Zestaw BETTER+",
    okres: "30 dni",
    cena: 11999,
    kolor: "#f4c04a",
    wyroznienie: "taniej niż osobno",
    opis: "Ranga BETTER z dostępem do kitu i 10 kluczy w jednym.",
    zawiera: ["ranga BETTER na 30 dni", "dostęp do /kit better przez 30 dni", "4× klucz Zwykły", "3× klucz Epicki", "3× klucz Legendarny"],
  },
  {
    id: "gen-zestaw-better",
    tryb: "genblock",
    kategoria: "zestawy",
    nazwa: "Zestaw BETTER",
    okres: "jednorazowo",
    cena: 6499,
    kolor: "#f4c04a",
    opis: "Kit BETTER i 10 kluczy, bez rangi.",
    zawiera: ["kit BETTER (jednorazowo)", "6× klucz Zwykły", "3× klucz Epicki", "1× klucz Legendarny"],
  },
  {
    id: "gen-klucz-zwykly",
    tryb: "genblock",
    kategoria: "klucze",
    nazwa: "Klucz Zwykły",
    okres: "1 szt.",
    cena: 199,
    kolor: "#33e4f2",
    opis: "Klucz do zwykłej skrzynki na GenBlocku.",
  },
  {
    id: "gen-klucz-epicki",
    tryb: "genblock",
    kategoria: "klucze",
    nazwa: "Klucz Epicki",
    okres: "1 szt.",
    cena: 499,
    kolor: "#c18bff",
    opis: "Klucz do epickiej skrzynki na GenBlocku.",
  },
  {
    id: "gen-klucz-legendarny",
    tryb: "genblock",
    kategoria: "klucze",
    nazwa: "Klucz Legendarny",
    okres: "1 szt.",
    cena: 999,
    kolor: "#ff2fb0",
    opis: "Klucz do legendarnej skrzynki na GenBlocku.",
  },

  /* ---------- Earth SMP (przedsprzedaż) ---------- */
  {
    id: "earth-vip", tryb: "earthsmp", kategoria: "rangi", nazwa: "VIP", okres: "30 dni", cena: 1000, kolor: "#33e4f2",
    opis: "Ranga na start na Earth SMP.",
    zawiera: ["ranga VIP na Earth SMP", "2 domy (/dom)", "8 ofert na rynku (/rynek)", "rola VIP na Discordzie"],
  },
  {
    id: "earth-svip", tryb: "earthsmp", kategoria: "rangi", nazwa: "SVIP", okres: "30 dni", cena: 2000, kolor: "#c18bff",
    opis: "Wszystko z VIP-a i trochę więcej.",
    zawiera: ["ranga SVIP na Earth SMP", "3 domy (/dom)", "10 ofert na rynku (/rynek)", "wszystko z rangi VIP", "rola SVIP na Discordzie"],
  },
  {
    id: "earth-sponsor", tryb: "earthsmp", kategoria: "rangi", nazwa: "SPONSOR", okres: "30 dni", cena: 3000, kolor: "#f4c04a",
    opis: "Dla tych, którzy chcą mocniej wesprzeć serwer.",
    zawiera: ["ranga SPONSOR na Earth SMP", "4 domy (/dom)", "12 ofert na rynku (/rynek)", "wszystko z rangi SVIP", "rola Sponsor na Discordzie"],
  },
  {
    id: "earth-elita", tryb: "earthsmp", kategoria: "rangi", nazwa: "ELITA", okres: "30 dni", cena: 5000, kolor: "#ff6fae",
    opis: "Ranga dla stałych bywalców Earth SMP.",
    zawiera: ["ranga ELITA na Earth SMP", "5 domów (/dom)", "15 ofert na rynku (/rynek)", "wszystko z rangi SPONSOR", "rola Elita na Discordzie"],
  },
  {
    id: "earth-better", tryb: "earthsmp", kategoria: "rangi", nazwa: "BETTER", okres: "30 dni", cena: 10000, kolor: "#ff2fb0",
    wyroznienie: "najwyższa ranga",
    opis: "Najwyższa ranga na Earth SMP.",
    zawiera: ["ranga BETTER na Earth SMP", "6 domów (/dom)", "20 ofert na rynku (/rynek)", "wszystko z rangi ELITA", "rola Better na Discordzie"],
  },
  {
    id: "earth-klucz-rzadki", tryb: "earthsmp", kategoria: "klucze", nazwa: "Klucz Rzadki", okres: "1 szt.", cena: 199, kolor: "#33e4f2",
    opis: "Klucz do rzadkiej skrzynki na Earth SMP.",
  },
  {
    id: "earth-klucz-epicki", tryb: "earthsmp", kategoria: "klucze", nazwa: "Klucz Epicki", okres: "1 szt.", cena: 499, kolor: "#c18bff",
    opis: "Klucz do epickiej skrzynki na Earth SMP.",
  },
  {
    id: "earth-klucz-legendarny", tryb: "earthsmp", kategoria: "klucze", nazwa: "Klucz Legendarny", okres: "1 szt.", cena: 999, kolor: "#ff2fb0",
    opis: "Klucz do legendarnej skrzynki na Earth SMP.",
  },
];

// Promocja czasowa (nazwa, procent, termin: PROMOCJA_BAZA w js/wspolne.js): wszystkie ceny -procent.
// Prawdziwą cenę zamówienia liczy sklep-panel/produkty.php - tam ten sam procent i termin.
// najnizsza30 = najniższa cena z 30 dni przed obniżką (dyrektywa Omnibus), w groszach.
const PROMOCJA = {
  ...PROMOCJA_BAZA,
  najnizsza30: {
    "gen-vip": 999, "gen-svip": 1999, "gen-sponsor": 2999, "gen-elita": 3999, "gen-better": 4999,
    "gen-zestaw-better-plus": 7499, "gen-zestaw-better": 6499,
    "gen-klucz-zwykly": 199, "gen-klucz-epicki": 499, "gen-klucz-legendarny": 999,
  },
};
PROMOCJA.aktywna = promocjaAktywna();
if (PROMOCJA.aktywna) {
  for (const p of PRODUKTY) {
    p.cenaPrzed = p.cena;
    p.najnizsza30 = PROMOCJA.najnizsza30[p.id] ?? p.cena;
    p.cena = Math.floor((p.cena * (100 - PROMOCJA.procent)) / 100);
    p.wyroznienie = `${PROMOCJA.nazwa} -${PROMOCJA.procent}%`;
  }
}

// Tabela porównania rang w trybie. "od" = cecha od tej rangi w górę, "wartosci" = osobny tekst dla każdej rangi.
const POROWNANIE = {
  earthsmp: [
    { cecha: "Ranga na Earth SMP", wartosci: { "earth-vip": "VIP", "earth-svip": "SVIP", "earth-sponsor": "SPONSOR", "earth-elita": "ELITA", "earth-better": "BETTER" } },
    { cecha: "Domy (/dom)", wartosci: { "earth-vip": "2", "earth-svip": "3", "earth-sponsor": "4", "earth-elita": "5", "earth-better": "6" } },
    { cecha: "Oferty na rynku (/rynek)", wartosci: { "earth-vip": "8", "earth-svip": "10", "earth-sponsor": "12", "earth-elita": "15", "earth-better": "20" } },
    { cecha: "Rola na Discordzie", wartosci: { "earth-vip": "VIP", "earth-svip": "SVIP", "earth-sponsor": "Sponsor", "earth-elita": "Elita", "earth-better": "Better" } },
  ],
  genblock: [
    { cecha: "Prefiks na czacie i tabie", wartosci: { "gen-vip": "[VIP]", "gen-svip": "[SVIP]", "gen-sponsor": "[SPONSOR]", "gen-elita": "[ELITA]", "gen-better": "[BETTER]" } },
    { cecha: "Kolorowy nick", od: "gen-vip" },
    { cecha: "Kit VIP", od: "gen-vip" },
    { cecha: "Kit SVIP", od: "gen-svip" },
    { cecha: "Kit SPONSOR", od: "gen-sponsor" },
    { cecha: "Kit ELITA", od: "gen-elita" },
    { cecha: "Kit BETTER", od: "gen-better" },
    { cecha: "Rola na Discordzie", wartosci: { "gen-vip": "VIP", "gen-svip": "SVIP", "gen-sponsor": "Sponsor", "gen-elita": "Elita", "gen-better": "Better" } },
    { cecha: "Prefiks z gradientem", od: "gen-better" },
    { cecha: "Własny kolor nicku (HEX)", od: "gen-better" },
  ],
};
