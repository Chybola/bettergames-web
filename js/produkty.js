// Tryby i produkty sklepu. Ceny w groszach (brutto), żeby uniknąć błędów zaokrągleń.
// cenaPrzed + najnizsza30 — wymagane przy promocji (dyrektywa Omnibus):
// trzeba pokazać najniższą cenę z 30 dni przed obniżką.
// Produkt działa tylko w swoim trybie. Nowy tryb = nowy wpis w TRYBY + produkty z jego id.

const TRYBY = [
  { id: "genblock", nazwa: "GenBlock", opis: "Generatory, ulepszenia, rankingi", kolor: "#ff2fb0" },
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
    zawiera: ["prefiks [VIP] na czacie i tabie", "kolorowy nick", "rola VIP na Discordzie"],
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
    zawiera: ["wszystko z rangi VIP", "prefiks [SVIP]", "rola SVIP na Discordzie"],
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
    zawiera: ["wszystko z rangi SVIP", "prefiks [SPONSOR]", "rola Sponsor na Discordzie"],
  },
  {
    id: "gen-elita",
    tryb: "genblock",
    kategoria: "rangi",
    nazwa: "ELITA",
    okres: "30 dni",
    cena: 4000,
    kolor: "#ff6fae",
    opis: "Ranga dla stałych bywalców GenBlocka.",
    zawiera: ["wszystko z rangi SPONSOR", "prefiks [ELITA]", "rola Elita na Discordzie"],
  },
  {
    id: "gen-better",
    tryb: "genblock",
    kategoria: "rangi",
    nazwa: "BETTER",
    okres: "30 dni",
    cena: 5000,
    kolor: "#ff2fb0",
    wyroznienie: "najwyższa ranga",
    opis: "Najwyższa ranga na serwerze, nazwana tak jak my.",
    zawiera: ["wszystko z rangi ELITA", "prefiks [BETTER] z gradientem", "własny kolor nicku (HEX)", "rola Better na Discordzie"],
  },
  {
    id: "gen-zestaw-better-plus",
    tryb: "genblock",
    kategoria: "zestawy",
    nazwa: "Zestaw BETTER+",
    okres: "30 dni",
    cena: 6500,
    kolor: "#f4c04a",
    wyroznienie: "taniej niż osobno",
    opis: "Ranga BETTER, kit i 10 kluczy w jednym.",
    zawiera: ["ranga BETTER na 30 dni", "/kit better co 24h przez 30 dni", "4× klucz Zwykły", "3× klucz Epicki", "3× klucz Legendarny"],
  },
  {
    id: "gen-zestaw-better",
    tryb: "genblock",
    kategoria: "zestawy",
    nazwa: "Zestaw BETTER",
    okres: "jednorazowo",
    cena: 2500,
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
    cena: 200,
    kolor: "#33e4f2",
    opis: "Klucz do zwykłej skrzynki na GenBlocku.",
  },
  {
    id: "gen-klucz-epicki",
    tryb: "genblock",
    kategoria: "klucze",
    nazwa: "Klucz Epicki",
    okres: "1 szt.",
    cena: 500,
    kolor: "#c18bff",
    opis: "Klucz do epickiej skrzynki na GenBlocku.",
  },
  {
    id: "gen-klucz-legendarny",
    tryb: "genblock",
    kategoria: "klucze",
    nazwa: "Klucz Legendarny",
    okres: "1 szt.",
    cena: 1000,
    kolor: "#ff2fb0",
    opis: "Klucz do legendarnej skrzynki na GenBlocku.",
  },
];

// Tabela porównania rang w trybie. "od" = cecha od tej rangi w górę, "wartosci" = osobny tekst dla każdej rangi.
const POROWNANIE = {
  genblock: [
    { cecha: "Prefiks na czacie i tabie", wartosci: { "gen-vip": "[VIP]", "gen-svip": "[SVIP]", "gen-sponsor": "[SPONSOR]", "gen-elita": "[ELITA]", "gen-better": "[BETTER]" } },
    { cecha: "Kolorowy nick", od: "gen-vip" },
    { cecha: "Rola na Discordzie", wartosci: { "gen-vip": "VIP", "gen-svip": "SVIP", "gen-sponsor": "Sponsor", "gen-elita": "Elita", "gen-better": "Better" } },
    { cecha: "Prefiks z gradientem", od: "gen-better" },
    { cecha: "Własny kolor nicku (HEX)", od: "gen-better" },
  ],
};
