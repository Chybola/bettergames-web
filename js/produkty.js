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
];

// Promocja czasowa: wszystkie ceny -procent w oknie [od, do). Ten sam procent i termin MUSZĄ być w
// sklep-panel/produkty.php (tam liczy się prawdziwa cena zamówienia). Po "do" ceny wracają same.
// najnizsza30 = najniższa cena z 30 dni przed obniżką (dyrektywa Omnibus), w groszach.
const PROMOCJA = {
  nazwa: "BLACK FRIDAY",
  procent: 50,
  od: "2026-11-23T00:00:00+01:00",
  do: "2026-12-01T00:00:00+01:00",
  koniecTekst: "30.11, 23:59",
  najnizsza30: {
    "gen-vip": 999, "gen-svip": 1999, "gen-sponsor": 2999, "gen-elita": 3999, "gen-better": 4999,
    "gen-zestaw-better-plus": 7499, "gen-zestaw-better": 6499,
    "gen-klucz-zwykly": 199, "gen-klucz-epicki": 499, "gen-klucz-legendarny": 999,
  },
};
PROMOCJA.aktywna = Date.now() >= Date.parse(PROMOCJA.od) && Date.now() < Date.parse(PROMOCJA.do);
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
