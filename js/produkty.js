// Tryby i produkty sklepu. Ceny w groszach (brutto), żeby uniknąć błędów zaokrągleń.
// cenaPrzed + najnizsza30 — wymagane przy promocji (dyrektywa Omnibus):
// trzeba pokazać najniższą cenę z 30 dni przed obniżką.
// Produkt działa tylko w swoim trybie. Nowy tryb = nowy wpis w TRYBY + produkty z jego id.

const TRYBY = [
  { id: "genblock", nazwa: "GenBlock", opis: "Generatory, ulepszenia, rankingi", kolor: "#ff2fb0" },
];

const KATEGORIE = { rangi: "Rangi", kosmetyki: "Kosmetyki", wsparcie: "Wsparcie" };

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
    cena: 5000,
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
    cena: 7500,
    kolor: "#ff2fb0",
    wyroznienie: "najwyższa ranga",
    opis: "Najwyższa ranga na serwerze, nazwana tak jak my.",
    zawiera: ["wszystko z rangi ELITA", "prefiks [BETTER] z gradientem", "własny kolor nicku (HEX)", "rola Better na Discordzie"],
  },
];
