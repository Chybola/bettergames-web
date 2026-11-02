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
    zawiera: ["prefiks [VIP] na czacie i tabie", "+3 miejsca na generatory", "sprzedaż ×1,25", "+1 sellchest", "kit VIP co 24 h: $2 500, generator Miedziany, klucz Zwykły", "Strefa VIP: własna farma i kopalnia, plony i surowce ×1,5"],
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
    zawiera: ["wszystko z rangi VIP", "prefiks [SVIP]", "+7 miejsc na generatory", "sprzedaż ×1,5", "generatory szybsze o 5%", "kit SVIP co 24 h: $5 000, generator Kościany, 2× klucz Zwykły"],
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
    zawiera: ["wszystko z rangi SVIP", "prefiks [SPONSOR]", "+12 miejsc na generatory", "sprzedaż ×1,75", "generatory szybsze o 10%", "+2 sellchesty", "kit SPONSOR co 24 h: $10 000, generator Śnieżny, 2× klucz Zwykły, 1× Epicki", "Strefa SPONSOR: plony i surowce ×1,75"],
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
    zawiera: ["wszystko z rangi SPONSOR", "prefiks [ELITA]", "+20 miejsc na generatory", "sprzedaż ×2", "generatory szybsze o 15%", "kit ELITA co 24 h: $20 000, generator Gliniany, 3× klucz Zwykły, 1× Epicki", "Strefa ELITA: plony i surowce ×2"],
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
    zawiera: ["wszystko z rangi ELITA", "prefiks [BETTER]", "+30 miejsc na generatory", "sprzedaż ×2,5", "generatory szybsze o 20%", "+3 sellchesty", "kit BETTER co 24 h: $40 000, generator Wełniany, 3× klucz Zwykły, 2× Epicki, 1× Legendarny", "Strefa ELITA: plony i surowce ×2", "arena: 2× dusze za zabójstwo i brak utraty dusz"],
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

// Tabela porównania rang w trybie. "od" = cecha od tej rangi w górę, "wartosci" = osobny tekst dla każdej rangi.
const POROWNANIE = {
  genblock: [
    { cecha: "Prefiks na czacie i tabie", wartosci: { "gen-vip": "[VIP]", "gen-svip": "[SVIP]", "gen-sponsor": "[SPONSOR]", "gen-elita": "[ELITA]", "gen-better": "[BETTER]" } },
    { cecha: "Dodatkowe miejsca na generatory", wartosci: { "gen-vip": "+3", "gen-svip": "+7", "gen-sponsor": "+12", "gen-elita": "+20", "gen-better": "+30" } },
    { cecha: "Mnożnik sprzedaży", wartosci: { "gen-vip": "×1,25", "gen-svip": "×1,5", "gen-sponsor": "×1,75", "gen-elita": "×2", "gen-better": "×2,5" } },
    { cecha: "Szybsze generatory", wartosci: { "gen-svip": "+5%", "gen-sponsor": "+10%", "gen-elita": "+15%", "gen-better": "+20%" } },
    { cecha: "Dodatkowe sellchesty", wartosci: { "gen-vip": "+1", "gen-svip": "+1", "gen-sponsor": "+2", "gen-elita": "+2", "gen-better": "+3" } },
    { cecha: "Kit VIP (co 24 h)", od: "gen-vip" },
    { cecha: "Kit SVIP (co 24 h)", od: "gen-svip" },
    { cecha: "Kit SPONSOR (co 24 h)", od: "gen-sponsor" },
    { cecha: "Kit ELITA (co 24 h)", od: "gen-elita" },
    { cecha: "Kit BETTER (co 24 h)", od: "gen-better" },
    { cecha: "Strefa VIP (plony i surowce ×1,5)", od: "gen-vip" },
    { cecha: "Strefa SPONSOR (×1,75)", od: "gen-sponsor" },
    { cecha: "Strefa ELITA (×2)", od: "gen-elita" },
    { cecha: "Arena: 2× dusze, brak utraty dusz", od: "gen-better" },
  ],
};
