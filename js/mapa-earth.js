// Mapa Earth SMP na stronie: 2D z kafelków BlueMap (mapa.bettergame.pl), zapętlona w każdą stronę jak w grze
// (wschód <-> zachód i północ <-> południe). Granice państw z markerów BlueMap (zestaw "earthnations").
// Kafelki lowres BlueMap: lod1 = 500 kratek, lod2 = 2500; obraz 501x1002, kolor w górnej połowie.
(function () {
  const BAZA = "https://mapa.bettergame.pl/maps/earth";
  const MINX = -10000, MINZ = -5000, SZER = 20000, WYS = 10000;
  const KAFEL = 250; // px na kafelek Leafletu; zoom 0 = 2500 kratek na kafelek (10 kratek na px)
  // lod3 (12500 kratek) BlueMap renderuje tylko częściowo - przy oddaleniu składamy mapę z kafelków lod2
  const LODY = [
    { lod: 2, rozmiar: 2500 },
    { lod: 1, rozmiar: 500 },
  ];
  const mod = (a, n) => ((a % n) + n) % n;
  const zawinX = (x) => mod(x - MINX, SZER) + MINX;
  const zawinZ = (z) => mod(z - MINZ, WYS) + MINZ;

  const obrazy = new Map();
  function obraz(lod, x, z) {
    const url = `${BAZA}/tiles/${lod}/x${x}/z${z}.png`;
    if (!obrazy.has(url)) {
      obrazy.set(url, new Promise((ok) => {
        const im = new Image();
        im.onload = () => ok(im);
        im.onerror = () => ok(null);
        im.src = url;
      }));
    }
    return obrazy.get(url);
  }

  function warstwaKafelkow() {
    const W = L.GridLayer.extend({
      createTile(c, gotowe) {
        const t = document.createElement("canvas");
        t.width = t.height = KAFEL;
        const ctx = t.getContext("2d");
        ctx.fillStyle = "#1b2f57";
        ctx.fillRect(0, 0, KAFEL, KAFEL);
        const S = 2500 / Math.pow(2, c.z); // kratek na kafelek
        const bx0 = c.x * S, bz0 = c.y * S; // bez zawijania - zawijamy dopiero numery kafelków BlueMap
        const L0 = S >= 1000 ? LODY[0] : LODY[1];
        const T = L0.rozmiar, srcPx = 500 / T, dstPx = KAFEL / S;
        const nx = SZER / T, nz = WYS / T, ox = -MINX / T, oz = -MINZ / T; // liczba kafelków BlueMap i przesunięcie
        ctx.imageSmoothingEnabled = dstPx < srcPx;
        const zadania = [];
        for (let X = Math.floor(bx0 / T); X <= Math.floor((bx0 + S - 1) / T); X++) {
          for (let Z = Math.floor(bz0 / T); Z <= Math.floor((bz0 + S - 1) / T); Z++) {
            const x0 = Math.max(bx0, X * T), x1 = Math.min(bx0 + S, (X + 1) * T);
            const z0 = Math.max(bz0, Z * T), z1 = Math.min(bz0 + S, (Z + 1) * T);
            // kafelek BlueMap po drugiej stronie szwu (mapa zapętlona jak w grze)
            const Xw = mod(X + ox, nx) - ox, Zw = mod(Z + oz, nz) - oz;
            zadania.push(obraz(L0.lod, Xw, Zw).then((im) => {
              if (!im) return;
              ctx.drawImage(im, (x0 - X * T) * srcPx, (z0 - Z * T) * srcPx, (x1 - x0) * srcPx, (z1 - z0) * srcPx,
                (x0 - bx0) * dstPx, (z0 - bz0) * dstPx, (x1 - x0) * dstPx, (z1 - z0) * dstPx);
            }));
          }
        }
        Promise.all(zadania).then(() => gotowe(null, t));
        return t;
      },
    });
    return new W({ tileSize: KAFEL, minZoom: -2, maxZoom: 5, keepBuffer: 3, updateWhenZooming: false });
  }

  function hex(c, domyslny) {
    if (!c) return domyslny;
    if (typeof c === "string") return { kolor: c, alfa: domyslny.alfa };
    const r = Math.round(c.r ?? 0), g = Math.round(c.g ?? 0), b = Math.round(c.b ?? 0);
    return { kolor: `rgb(${r},${g},${b})`, alfa: c.a ?? 1 };
  }

  async function granice(mapa, warstwa) {
    warstwa.clearLayers();
    let dane;
    try {
      dane = await fetch(`${BAZA}/live/markers.json`, { cache: "no-store" }).then((r) => r.json());
    } catch { return; }
    for (const zestaw of Object.values(dane || {})) {
      for (const m of Object.values(zestaw.markers || {})) {
        if (!Array.isArray(m.shape) || m.shape.length < 3) continue;
        const f = hex(m.fillColor, { kolor: "#34d399", alfa: 0.3 }), l = hex(m.lineColor, { kolor: "#34d399", alfa: 1 });
        // 3x3 kopie wokół środka - przy przesuwaniu widok i tak wraca do środkowej kopii (moveend w start)
        for (const dx of [-SZER, 0, SZER]) {
          for (const dz of [-WYS, 0, WYS]) {
            L.polygon(m.shape.map((p) => [p.z + dz, p.x + dx]), {
              color: l.kolor, opacity: l.alfa, weight: m.lineWidth || 2, fillColor: f.kolor, fillOpacity: f.alfa,
            }).bindTooltip(m.label || "", { sticky: true }).addTo(warstwa);
          }
        }
      }
    }
  }

  function start(el) {
    const crs = L.extend({}, L.CRS.Simple, { transformation: new L.Transformation(0.1, 0, 0.1, 0) });
    const mapa = L.map(el, {
      crs, minZoom: -2, maxZoom: 5, zoomSnap: 1, attributionControl: false, worldCopyJump: false,
      center: [-2900, 1170], zoom: -1,
    });
    warstwaKafelkow().addTo(mapa);
    const panstwa = L.layerGroup().addTo(mapa);
    granice(mapa, panstwa);
    setInterval(() => granice(mapa, panstwa), 60000);

    // po przejechaniu przez szew widok wraca do środkowej kopii mapy (płynnie, bez skoku obrazu)
    mapa.on("moveend", () => {
      const c = mapa.getCenter();
      const x = zawinX(c.lng), z = zawinZ(c.lat);
      if (x !== c.lng || z !== c.lat) mapa.setView([z, x], mapa.getZoom(), { animate: false });
    });

    const info = L.control({ position: "bottomleft" });
    info.onAdd = () => {
      const d = L.DomUtil.create("div", "e-mapa-wsp");
      d.textContent = "x: — z: —";
      mapa.on("mousemove", (e) => {
        d.textContent = `x: ${Math.round(zawinX(e.latlng.lng))}  z: ${Math.round(zawinZ(e.latlng.lat))}`;
      });
      return d;
    };
    info.addTo(mapa);
    return mapa;
  }

  function wczytajLeaflet() {
    if (window.L) return Promise.resolve();
    return new Promise((ok, blad) => {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(css);
      const js = document.createElement("script");
      js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      js.onload = ok;
      js.onerror = blad;
      document.head.appendChild(js);
    });
  }

  const el = document.getElementById("mapa-earth");
  if (!el) return;
  const odpal = () => wczytajLeaflet().then(() => {
    el.querySelector(".e-mapa-plakat")?.remove();
    start(el);
  }).catch(() => {});
  if ("IntersectionObserver" in window) {
    const ob = new IntersectionObserver((w) => {
      if (w.some((x) => x.isIntersecting)) { ob.disconnect(); odpal(); }
    }, { rootMargin: "300px" });
    ob.observe(el);
  } else {
    odpal();
  }
})();
