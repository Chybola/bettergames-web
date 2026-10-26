import { useState, useEffect } from 'react'
import {
  Zap,
  Sparkles,
  Copy,
  Check,
  Crown,
  Layers,
  ShoppingBag,
  FileText,
  MessageSquare,
  Flame,
  CheckCircle2,
  Smartphone,
  Monitor,
  X,
  Pickaxe,
  Cloud,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('home') // 'home' | 'modes' | 'shop' | 'rules'
  const [platform, setPlatform] = useState('java') // 'java' | 'bedrock'
  const [copied, setCopied] = useState(false)
  
  // Wybór trybu przed sklepem (GenBlock vs SkyBlock)
  const [shopMode, setShopMode] = useState('genblock') // 'genblock' | 'skyblock'
  const [shopCategory, setShopCategory] = useState('ranks') // 'ranks' | 'keys' | 'vouchers'
  
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [minecraftNick, setMinecraftNick] = useState('')
  const [payMethod, setPayMethod] = useState('blik')
  const [orderDone, setOrderDone] = useState(false)

  // Zawsze podczas zmiany zakładki przewijaj stronę na samą górę
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  const serverJavaIP = "bettergame.pl"
  const serverBedrockIP = "bettergame.pl"
  const bedrockPort = "19132"

  const handleCopy = () => {
    const textToCopy = platform === 'java' ? serverJavaIP : `${serverBedrockIP}:${bedrockPort}`
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleOpenCheckout = (item) => {
    setSelectedProduct({ ...item, targetMode: shopMode === 'genblock' ? 'GenBlock' : 'SkyBlock' })
    setOrderDone(false)
    setMinecraftNick('')
  }

  const tebexStoreUrl = "https://bettergames.tebex.io"

  const handleCompleteOrder = (e) => {
    e.preventDefault()
    const nick = minecraftNick.trim()
    if (!nick) return
    setOrderDone(true)

    // Otwarcie kasy Tebex z przekazanym nickiem gracza
    const targetUrl = `${tebexStoreUrl}?username=${encodeURIComponent(nick)}`
    setTimeout(() => {
      window.open(targetUrl, '_blank')
      setSelectedProduct(null)
      setOrderDone(false)
    }, 1800)
  }

  // Oferta ItemShopu spersonalizowana dla GenBlock oraz SkyBlock
  const shopData = {
    genblock: {
      ranks: [
        {
          id: 'gen-vip',
          name: 'Ranga VIP (GenBlock)',
          price: '10.00 zł',
          featured: false,
          perks: [
            'Prefiks [VIP] z różowym kolorem',
            '+3 dodatkowe sloty na generatory',
            'Mnożnik sprzedaży dropu x1.25',
            'Komenda /autosell (co 10 min)',
            'Dostęp do strefy VIP i kopalni złota'
          ]
        },
        {
          id: 'gen-svip',
          name: 'Ranga SVIP (GenBlock)',
          price: '20.00 zł',
          featured: false,
          perks: [
            'Prefiks [SVIP] ze złotą ramką',
            '+7 dodatkowych slotów na generatory',
            'Mnożnik sprzedaży dropu x1.5',
            'Automatyczne ulepszanie generatorów (/genup)',
            'Komenda /fly na strefie własnych generatorów'
          ]
        },
        {
          id: 'gen-mvip',
          name: 'Ranga MVIP (GenBlock)',
          price: '30.00 zł',
          featured: true,
          tag: 'Najczęściej kupowana',
          perks: [
            'Błękitny animowany prefiks [MVIP]',
            '+15 dodatkowych slotów na generatory',
            'Mnożnik sprzedaży dropu x2.0',
            'Wirtualny lej zbierający drop z generatorów',
            'Brak podatku prowizji na rynku graczy (/ah)'
          ]
        },
        {
          id: 'gen-gvip',
          name: 'Ranga GVIP (GenBlock)',
          price: '50.00 zł',
          featured: true,
          tag: 'Maksymalny prestiż',
          perks: [
            'Najwyższa ranga [GVIP] z koroną',
            'Nielimitowane sloty na generatory surowców',
            'Potężny mnożnik sprzedaży x3.0',
            'Darmowy codzienny /kit gvip z generatorami',
            'Dostęp do unikalnego Generatora Gwiazdy Netheru'
          ]
        }
      ],
      keys: [
        {
          id: 'gen-key-5',
          name: '5x Klucz Generatorów',
          price: '12.99 zł',
          featured: false,
          perks: [
            'Szansa na upuszczenie generatora diamentów',
            'Gwarantowane szmaragdy i boostery dropu',
            'Losowanie zwojów przyspieszających generowanie'
          ]
        },
        {
          id: 'gen-key-15',
          name: '15x Klucz Epicki GenBlock',
          price: '29.99 zł',
          featured: true,
          tag: 'Super Oferta',
          perks: [
            '15 otwarć epickiej skrzyni w Lobby GenBlock',
            'Duża szansa na Generator Netherytu T4',
            'Karty mnożnika dropu x2 na 12 godzin',
            '+3 darmowe klucze w prezencie'
          ]
        },
        {
          id: 'gen-key-mythic',
          name: '1x Mityczny Klucz Bossa',
          price: '19.99 zł',
          featured: false,
          perks: [
            'Gwarantowany legendarny kilof wybuchowy 3x3',
            'Generator Odłamków Próżni',
            'Tytuł mistrza kopalni nad głową'
          ]
        }
      ],
      vouchers: [
        {
          id: 'gen-booster-24h',
          name: 'Booster Dropu x2 (24h)',
          price: '9.99 zł',
          featured: false,
          perks: [
            'Podwaja cały zysk ze sprzedaży surowców',
            'Działa przez 24 godziny od aktywacji',
            'Łączy się z mnożnikami rang VIP/ELITA'
          ]
        },
        {
          id: 'gen-pack-netherite',
          name: 'Pakiet 5x Generator Netherytu',
          price: '19.99 zł',
          featured: false,
          perks: [
            '5 gotowych do postawienia generatorów T3',
            'Pasywny dochód bez wysiłku',
            'Bezpieczne magazynowanie w ekwipunku'
          ]
        }
      ]
    },
    skyblock: {
      ranks: [
        {
          id: 'sky-vip',
          name: 'Ranga VIP (SkyBlock)',
          price: '10.00 zł',
          featured: false,
          perks: [
            'Prefiks [VIP] na czacie i liście graczy',
            'Powiększenie wyspy do 150x150 kratek',
            'Komenda /fly na terenie własnej wyspy',
            '+2 dodatkowe sloty dla członków drużyny',
            'Dostęp do /kit vip co 24 godziny'
          ]
        },
        {
          id: 'sky-svip',
          name: 'Ranga SVIP (SkyBlock)',
          price: '20.00 zł',
          featured: false,
          perks: [
            'Złoty prefiks [SVIP] nad głową',
            'Powiększenie wyspy do 250x250 kratek',
            'Darmowa komenda /feed oraz /heal',
            'Zwiększony limit spawnerów na wyspie do 50',
            'Dostęp do wirtualnego stołu rzemieślniczego'
          ]
        },
        {
          id: 'sky-mvip',
          name: 'Ranga MVIP (SkyBlock)',
          price: '30.00 zł',
          featured: true,
          tag: 'Polecany wybór',
          perks: [
            'Błękitny prefiks [MVIP] nad głową',
            'Powiększenie wyspy do 400x400 kratek',
            'Wirtualny zbieracz dropu z mobów i farm',
            'Zwiększony limit spawnerów do 100',
            'Dostęp do prywatnej strefy skupu surowców'
          ]
        },
        {
          id: 'sky-gvip',
          name: 'Ranga GVIP (SkyBlock)',
          price: '50.00 zł',
          featured: true,
          tag: 'Władca Chmur',
          perks: [
            'Maksymalna ranga [GVIP] z koroną',
            'Ogromna wyspa 600x600 kratek dla Ciebie i ekipy',
            'Nielimitowane stawianie spawnerów i mobów',
            'Automatyczne sadzenie i ścinanie plonów',
            'Rezerwacja slota przy pełnym serwerze'
          ]
        }
      ],
      keys: [
        {
          id: 'sky-key-5',
          name: '5x Klucz Wyspiarza',
          price: '12.99 zł',
          featured: false,
          perks: [
            'Szansa na rzadkie jajka mobów i spawner krów',
            'Materiały budowlane i bloki dekoracyjne',
            'Waluta wyspowa na ulepszenia'
          ]
        },
        {
          id: 'sky-key-15',
          name: '15x Klucz Epicki SkyBlock',
          price: '29.99 zł',
          featured: true,
          tag: 'Super Oferta',
          perks: [
            '15 otwarć epickiej skrzyni w Lobby SkyBlock',
            'Duża szansa na Spawner Żelaznych Golemów',
            'Przedmioty z zaklęciem Mending i Unbreaking IV',
            '+3 darmowe klucze w prezencie'
          ]
        },
        {
          id: 'sky-key-celestial',
          name: '1x Klucz Niebios (Celestial)',
          price: '19.99 zł',
          featured: false,
          perks: [
            'Gwarantowane skrzydła Elytra z unikalną teksturą',
            'Zestaw 3x Spawner Blaze',
            '100,000 serwerowych monet'
          ]
        }
      ],
      vouchers: [
        {
          id: 'sky-island-size',
          name: 'Powiększenie Wyspy +100 kratek',
          price: '14.99 zł',
          featured: false,
          perks: [
            'Natychmiast powiększa granice Twojej wyspy',
            'Więcej miejsca na farmy, spawner i budowle',
            'Działa niezależnie od posiadanej rangi'
          ]
        },
        {
          id: 'sky-golem-pack',
          name: 'Pakiet 3x Spawner Żelaznych Golemów',
          price: '24.99 zł',
          featured: false,
          perks: [
            'Najszybszy sposób na zrobienie zautomatyzowanej fabryki żelaza',
            'Ogromny skok w poziomie wyspy (/is level)',
            'Pewny zysk w serwerowym skupie'
          ]
        }
      ]
    }
  }

  return (
    <>
      {/* Pasek ogłoszeniowy na samej górze */}
      <div className="top-announcement">
        <Sparkles size={15} color="#f472b6" />
        <span>
          Nowa edycja <strong>BETTER GAME</strong>! Dwa potężne tryby: <strong>GENBLOCK</strong> & <strong>SKYBLOCK</strong>. Kod rabatowy -20%: <strong>BETTER20</strong>
        </span>
      </div>

      {/* Główny Navbar (fioletowo-różowy motyw anarchia.gg) */}
      <header className="navbar">
        <div className="container nav-inner">
          <div className="brand-logo" onClick={() => setActiveTab('home')}>
            <div className="brand-icon-box">
              <Zap size={22} color="#ffffff" />
            </div>
            <div className="brand-name">
              BETTER<span>GAME</span>
            </div>
          </div>

          <nav className="nav-menu">
            <button
              className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <Flame size={16} />
              <span>Główna</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'modes' ? 'active' : ''}`}
              onClick={() => setActiveTab('modes')}
            >
              <Layers size={16} />
              <span>Tryby Gry</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'shop' ? 'active' : ''}`}
              onClick={() => setActiveTab('shop')}
            >
              <ShoppingBag size={16} />
              <span>Sklep (ItemShop)</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'rules' ? 'active' : ''}`}
              onClick={() => setActiveTab('rules')}
            >
              <FileText size={16} />
              <span>Regulamin</span>
            </button>
          </nav>

          <div className="nav-actions">
            <div className="online-chip">
              <span className="pulse-dot"></span>
              <span>1,482 ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Główna zawartość */}
      <main>
        {activeTab === 'home' && (
          <>
            {/* HERO SECTION */}
            <section className="hero-section">
              <div className="container">
                <div className="hero-badge">
                  <Flame size={14} />
                  <span>NOWA EDYCJA • GENBLOCK & SKYBLOCK</span>
                </div>

                <h1 className="hero-main-title">
                  DOŁĄCZ DO <span className="text-gradient">BETTER GAME</span>
                </h1>

                <p className="hero-subtitle">
                  Odkryj dwa najbardziej uzależniające tryby Minecraft w Polsce na serwerze <strong>bettergame.pl</strong>.
                  Stawiaj zautomatyzowane generatory na <strong>GenBlocku</strong> lub wzbij się w chmury
                  i stwórz potężne imperium na <strong>SkyBlocku</strong>!
                </p>

                {/* Box z adresem IP (Java & Bedrock) */}
                <div className="ip-container">
                  <div className="platform-switch">
                    <button
                      className={`platform-btn ${platform === 'java' ? 'active' : ''}`}
                      onClick={() => setPlatform('java')}
                    >
                      <Monitor size={16} />
                      <span>MINECRAFT JAVA (PC)</span>
                    </button>
                    <button
                      className={`platform-btn ${platform === 'bedrock' ? 'active' : ''}`}
                      onClick={() => setPlatform('bedrock')}
                    >
                      <Smartphone size={16} />
                      <span>BEDROCK (TELEFONY / KONSOLE)</span>
                    </button>
                  </div>

                  <div className="ip-bar">
                    <div className="ip-display">
                      <span className="ip-sub">
                        {platform === 'java' ? 'Adres serwera (Java 1.20 - 1.21.x):' : 'Adres serwera & Port (Bedrock):'}
                      </span>
                      <span className="ip-value">
                        {platform === 'java' ? serverJavaIP : `${serverBedrockIP} • Port: ${bedrockPort}`}
                      </span>
                    </div>

                    <button
                      className={`ip-copy-btn ${copied ? 'copied' : ''}`}
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <Check size={18} />
                          <span>SKOPIOWANO!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          <span>KOPIUJ IP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Przyciski Akcji */}
                <div className="hero-cta-group">
                  <button className="btn-primary" onClick={() => setActiveTab('shop')}>
                    <ShoppingBag size={18} />
                    <span>Wybierz Tryb i Otwórz Sklep</span>
                  </button>
                  <a
                    href="https://discord.gg"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                  >
                    <MessageSquare size={18} />
                    <span>Nasz Discord (+5,000)</span>
                  </a>
                </div>

                {/* Pasek ze statystykami */}
                <div className="stats-banner">
                  <div className="stat-item-box">
                    <span className="stat-number">1,482</span>
                    <span className="stat-title">Graczy Online</span>
                  </div>
                  <div className="stat-item-box">
                    <span className="stat-number">2 Tryby</span>
                    <span className="stat-title">GenBlock & SkyBlock</span>
                  </div>
                  <div className="stat-item-box">
                    <span className="stat-number">20.0</span>
                    <span className="stat-title">Stałe TPS (Zero Lagów)</span>
                  </div>
                  <div className="stat-item-box">
                    <span className="stat-number">1.20 - 1.21</span>
                    <span className="stat-title">Wersje Minecraft</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SEKCJA TYLKO DWÓCH TRYBÓW (GenBlock i SkyBlock) */}
            <section className="section">
              <div className="container">
                <div className="section-title-wrap">
                  <span className="section-tag">Nasze Dwa Flagowe Światy</span>
                  <h2 className="section-heading">WYBIERZ SWÓJ ULUBIONY TRYB</h2>
                  <p className="section-description">
                    Skupiliśmy się w 100% na dopracowaniu dwóch najlepszych trybów ekonomiczno-budowlanych w historii Minecrafta.
                  </p>
                </div>

                <div className="two-modes-grid">
                  {/* KARTA 1: GENBLOCK */}
                  <div className="mode-card-large">
                    <div className="mode-header">
                      <div className="mode-icon-holder">
                        <Pickaxe size={32} />
                      </div>
                      <div>
                        <div className="mode-tagline">Automatyzacja & Ekonomia</div>
                        <h3 className="mode-name">GENBLOCK</h3>
                      </div>
                    </div>
                    <p className="mode-text">
                      Zbuduj fabrykę bogactwa! Stawiaj generatory surowców od węgla po netheryt,
                      odblokowuj kolejne poziomy mnożników, ulepszaj kilofy wybuchowe i rywalizuj o miano
                      najbogatszego magnata na serwerze!
                    </p>
                    <div className="mode-pill-list">
                      <span className="mode-pill">Generatory T1-T10</span>
                      <span className="mode-pill">Mnożniki Dropu</span>
                      <span className="mode-pill">Wybuchowe Kilofy</span>
                      <span className="mode-pill">Rynek Graczy /ah</span>
                    </div>
                    <button
                      className="mode-btn-action"
                      onClick={() => {
                        setShopMode('genblock')
                        setActiveTab('shop')
                      }}
                    >
                      <ShoppingBag size={16} />
                      <span>Zobacz przedmioty GenBlock w sklepie</span>
                    </button>
                  </div>

                  {/* KARTA 2: SKYBLOCK */}
                  <div className="mode-card-large">
                    <div className="mode-header">
                      <div className="mode-icon-holder">
                        <Cloud size={32} />
                      </div>
                      <div>
                        <div className="mode-tagline">Wyspy w Chmurach</div>
                        <h3 className="mode-name">SKYBLOCK</h3>
                      </div>
                    </div>
                    <p className="mode-text">
                      Klasyczna, a zarazem ultranowoczesna przygoda w chmurach. Rozwijaj swoją wyspę
                      wraz ze znajomymi, wykonuj setki wyspowych misji, buduj gigantyczne farmy mobów
                      oraz automatyczne spawnowanie golemów!
                    </p>
                    <div className="mode-pill-list">
                      <span className="mode-pill">Ranking Wysp /is top</span>
                      <span className="mode-pill">Wyspowe Zadania</span>
                      <span className="mode-pill">Farmy Spawnerów</span>
                      <span className="mode-pill">Wspólna Gra z Ekipą</span>
                    </div>
                    <button
                      className="mode-btn-action"
                      onClick={() => {
                        setShopMode('skyblock')
                        setActiveTab('shop')
                      }}
                    >
                      <ShoppingBag size={16} />
                      <span>Zobacz przedmioty SkyBlock w sklepie</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ZAKŁADKA TRYBY GRY */}
        {activeTab === 'modes' && (
          <section className="section">
            <div className="container">
              <div className="section-title-wrap">
                <span className="section-tag">Szczegółowy Opis</span>
                <h2 className="section-heading">POZNAJ GENBLOCK ORAZ SKYBLOCK</h2>
                <p className="section-description">
                  Dwa unikalne serwery, ten sam wysoki poziom wykonania i brak lagów.
                </p>
              </div>

              <div className="two-modes-grid">
                <div className="mode-card-large">
                  <div className="mode-header">
                    <div className="mode-icon-holder">
                      <Pickaxe size={32} />
                    </div>
                    <div>
                      <div className="mode-tagline">Jak grać na GenBlocku?</div>
                      <h3 className="mode-name">GenBlock SMP</h3>
                    </div>
                  </div>
                  <p className="mode-text">
                    Na start otrzymujesz swoją strefę generatorów oraz podstawowy generator pszenicy.
                    Każdy wygenerowany surowiec możesz sprzedać za serwerową walutę lub zainwestować w ulepszenie generatora do wyższego tieru.
                    Im wyższy poziom, tym rzadsze surowce! Dostępne są także kilofy ze specjalnymi umiejętnościami obszarowymi.
                  </p>
                  <div className="mode-pill-list">
                    <span className="mode-pill">Komenda /gens</span>
                    <span className="mode-pill">Automatyczne zbieranie</span>
                    <span className="mode-pill">Cotygodniowe eventy mnożnika</span>
                  </div>
                </div>

                <div className="mode-card-large">
                  <div className="mode-header">
                    <div className="mode-icon-holder">
                      <Cloud size={32} />
                    </div>
                    <div>
                      <div className="mode-tagline">Jak grać na SkyBlocku?</div>
                      <h3 className="mode-name">SkyBlock Evolution</h3>
                    </div>
                  </div>
                  <p className="mode-text">
                    Rozpoczynasz z jednym drzewem, skrzynką i blokiem lodu.
                    Zbuduj generator bruku, zaproś przyjaciół za pomocą komendy <code>/is invite</code> i zdobywaj kolejne poziomy wyspy.
                    Na serwerze działa autorski system wirtualnych hopperów oraz spawnerów, dzięki czemu farmy nie generują lagów!
                  </p>
                  <div className="mode-pill-list">
                    <span className="mode-pill">Komenda /is</span>
                    <span className="mode-pill">Nagrody za TOP 1 wyspę</span>
                    <span className="mode-pill">Zabezpieczenia przed griefem</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ZAKŁADKA SKLEP (Z WYBOREM TRYBU PRZED SKLEPEM) */}
        {activeTab === 'shop' && (
          <section className="section">
            <div className="container">
              <div className="section-title-wrap">
                <span className="section-tag">Oficjalny ItemShop</span>
                <h2 className="section-heading">SKLEP SERWERA BETTER GAME</h2>
                <p className="section-description">
                  Wybierz tryb, na który chcesz zakupić rangę, klucze lub pakiety surowców.
                </p>
              </div>

              {/* 🎯 WYBÓR TRYBU PRZED SKLEPEM (GENBLOCK vs SKYBLOCK) */}
              <div className="shop-mode-selector-box">
                <div className="selector-title">KROK 1: WYBIERZ SWÓJ TRYB ROZGRYWKI</div>
                <p className="selector-desc">Kliknij tryb, na który mają zostać przypisane zakupione usługi:</p>

                <div className="mode-pick-row">
                  <div
                    className={`mode-pick-btn ${shopMode === 'genblock' ? 'active' : ''}`}
                    onClick={() => setShopMode('genblock')}
                  >
                    <div className="pick-icon-box">
                      <Pickaxe size={26} />
                    </div>
                    <div className="pick-meta">
                      <h4>GENBLOCK</h4>
                      <p>Generatory, Mnożniki dropu, Kilofy, /autosell</p>
                    </div>
                  </div>

                  <div
                    className={`mode-pick-btn ${shopMode === 'skyblock' ? 'active' : ''}`}
                    onClick={() => setShopMode('skyblock')}
                  >
                    <div className="pick-icon-box">
                      <Cloud size={26} />
                    </div>
                    <div className="pick-meta">
                      <h4>SKYBLOCK</h4>
                      <p>Powiększenie wyspy, /fly, Spawnery, Zbieracze</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WSKAŹNIK WYBRANEGO TRYBU */}
              <div style={{ textAlign: 'center' }}>
                <div className="current-mode-indicator">
                  <ShieldCheck size={18} />
                  <span>Kupujesz przedmioty dla trybu: <strong>{shopMode.toUpperCase()}</strong></span>
                </div>
              </div>

              {/* KROK 2: WYBÓR KATEGORII W SKLEPIE */}
              <div className="shop-filter-bar">
                <button
                  className={`shop-tab-btn ${shopCategory === 'ranks' ? 'active' : ''}`}
                  onClick={() => setShopCategory('ranks')}
                >
                  <Crown size={16} />
                  <span>Rangi na {shopMode === 'genblock' ? 'GenBlock' : 'SkyBlock'}</span>
                </button>
                <button
                  className={`shop-tab-btn ${shopCategory === 'keys' ? 'active' : ''}`}
                  onClick={() => setShopCategory('keys')}
                >
                  <Sparkles size={16} />
                  <span>Klucze do Skrzyń</span>
                </button>
                <button
                  className={`shop-tab-btn ${shopCategory === 'vouchers' ? 'active' : ''}`}
                  onClick={() => setShopCategory('vouchers')}
                >
                  <Zap size={16} />
                  <span>Vouchery & Boostery</span>
                </button>
              </div>

              {/* SIATKA PRODUKTÓW DLA WYBRANEGO TRYBU */}
              <div className="shop-grid">
                {shopData[shopMode][shopCategory].map((item) => (
                  <div
                    key={item.id}
                    className={`shop-card ${item.featured ? 'featured' : ''}`}
                  >
                    {item.tag && <div className="card-top-tag">{item.tag}</div>}

                    <div className="shop-item-icon">
                      {shopCategory === 'ranks' && <Crown size={30} />}
                      {shopCategory === 'keys' && <Sparkles size={30} />}
                      {shopCategory === 'vouchers' && <Zap size={30} />}
                    </div>

                    <h3 className="shop-item-name">{item.name}</h3>
                    <div className="shop-item-price">
                      {item.price} <span>{shopCategory === 'ranks' ? '/ 30 dni' : '/ pakiet'}</span>
                    </div>

                    <ul className="shop-perks-list">
                      {item.perks.map((perk, idx) => (
                        <li key={idx} className="shop-perk-item">
                          <CheckCircle2 size={16} color="#ec4899" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className="btn-buy"
                      onClick={() => handleOpenCheckout(item)}
                    >
                      <ShoppingBag size={18} />
                      <span>KUP NA {shopMode.toUpperCase()}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Pasek metod płatności */}
              <div className="payment-methods-strip">
                <div className="payment-title">Bezpieczne i natychmiastowe płatności:</div>
                <div className="payment-badges">
                  <div className="payment-badge">🔵 BLIK</div>
                  <div className="payment-badge">💳 PaySafeCard</div>
                  <div className="payment-badge">🏦 Przelew Online (P24)</div>
                  <div className="payment-badge">📱 Płatność SMS</div>
                  <div className="payment-badge">💳 Karta VISA / MasterCard</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ZAKŁADKA REGULAMIN */}
        {activeTab === 'rules' && (
          <section className="section">
            <div className="container">
              <div className="section-title-wrap">
                <span className="section-tag">Zasady & Bezpieczeństwo</span>
                <h2 className="section-heading">REGULAMIN SERWERA I SKLEPU</h2>
                <p className="section-description">
                  Zapoznaj się z zasadami obowiązującymi na trybach GenBlock oraz SkyBlock.
                </p>
              </div>

              <div className="rules-container">
                <div className="rule-group">
                  <h3 className="rule-group-title">
                    <Pickaxe size={20} color="#ec4899" />
                    <span>1. Zasady Gry na GenBlock & SkyBlock</span>
                  </h3>
                  <ul className="rule-list">
                    <li className="rule-item">
                      <CheckCircle2 size={18} color="#22c55e" />
                      <span><strong>Zakaz cheatów:</strong> Całkowity zakaz używania auto-clickera, skryptów na automatyczne kopanie/sprzedawanie oraz zmodyfikowanych klientów.</span>
                    </li>
                    <li className="rule-item">
                      <CheckCircle2 size={18} color="#22c55e" />
                      <span><strong>Uczciwy handel:</strong> Próby oszustw podczas wymian między graczami lub na rynku <code>/ah</code> skutkują blokadą konta.</span>
                    </li>
                    <li className="rule-item">
                      <CheckCircle2 size={18} color="#22c55e" />
                      <span><strong>Wspólne wyspy (SkyBlock):</strong> Za zaproszone osoby na wyspę odpowiada jej właściciel. Zabezpieczaj swoje cenne przedmioty.</span>
                    </li>
                  </ul>
                </div>

                <div className="rule-group">
                  <h3 className="rule-group-title">
                    <ShoppingBag size={20} color="#ec4899" />
                    <span>2. Regulamin Płatności i Realizacji Usług</span>
                  </h3>
                  <ul className="rule-list">
                    <li className="rule-item">
                      <CheckCircle2 size={18} color="#22c55e" />
                      <span><strong>Wybór trybu:</strong> Upewnij się, że kupujesz pakiet na właściwy tryb (GenBlock lub SkyBlock).</span>
                    </li>
                    <li className="rule-item">
                      <CheckCircle2 size={18} color="#22c55e" />
                      <span><strong>Czas aktywacji:</strong> Rangi i pakiety są nadawane automatycznie w grze w ciągu kilku minut po zaksięgowaniu wpłaty.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BANNER DISCORD NA DOLE STRONY */}
        <div className="container">
          <div className="discord-banner">
            <h2>DOŁĄCZ DO NASZEGO DISCORDA</h2>
            <p>
              Bądź na bieżąco z aktualizacjami GenBlocka i SkyBlocka, bierz udział w konkursach na darmowe rangi i graj razem z nami!
            </p>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              <MessageSquare size={18} />
              <span>Otwórz Serwer Discord</span>
            </a>
          </div>
        </div>
      </main>

      {/* MODAL ZAKUPU (CHECKOUT) Z WIDOCZNYM TRYBEM */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal-btn"
              onClick={() => setSelectedProduct(null)}
            >
              <X size={18} />
            </button>

            {orderDone ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2 size={54} color="#22c55e" style={{ margin: '0 auto 1rem' }} />
                <h3 className="modal-title">Przekierowywanie do kasy...</h3>
                <p className="modal-subtitle">
                  Otwieranie płatności Tebex dla gracza <strong>{minecraftNick}</strong> (pakiet: <strong>{selectedProduct.name}</strong>).
                </p>
                <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#c084fc' }}>
                  Zaraz otworzy się okno płatności BLIK / PaySafeCard...
                </p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div className="modal-mode-badge">Tryb: {selectedProduct.targetMode}</div>
                  <h3 className="modal-title">Kupujesz: {selectedProduct.name}</h3>
                  <p className="modal-subtitle">Cena do zapłaty: <strong>{selectedProduct.price}</strong></p>
                </div>

                <form onSubmit={handleCompleteOrder}>
                  <div className="form-field">
                    <label className="form-label">Twój dokładny nick z Minecrafta:</label>
                    <input
                      type="text"
                      required
                      placeholder="np. Steve123"
                      className="form-input"
                      value={minecraftNick}
                      onChange={(e) => setMinecraftNick(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Wybierz metodę płatności:</label>
                    <div className="pay-options">
                      <button
                        type="button"
                        className={`pay-opt-btn ${payMethod === 'blik' ? 'active' : ''}`}
                        onClick={() => setPayMethod('blik')}
                      >
                        BLIK
                      </button>
                      <button
                        type="button"
                        className={`pay-opt-btn ${payMethod === 'psc' ? 'active' : ''}`}
                        onClick={() => setPayMethod('psc')}
                      >
                        PaySafeCard
                      </button>
                      <button
                        type="button"
                        className={`pay-opt-btn ${payMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setPayMethod('card')}
                      >
                        Przelew / Karta
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="modal-submit-btn">
                    Przejdź do płatności BLIK / PSC ({selectedProduct.price})
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* STOPKA SERWERA */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-columns">
            <div className="footer-brand">
              <div className="brand-logo" onClick={() => setActiveTab('home')}>
                <div className="brand-icon-box">
                  <Zap size={20} color="#ffffff" />
                </div>
                <div className="brand-name">
                  BETTER<span>GAME</span>
                </div>
              </div>
              <p className="footer-desc">
                Oficjalny serwer Minecraft BetterGame.pl. Dwa dopracowane tryby: GenBlock oraz SkyBlock. Najlepsza społeczność, brak lagów i stałe 20 TPS.
              </p>
            </div>

            <div className="footer-nav">
              <div>
                <h4 className="footer-col-title">Nawigacja</h4>
                <ul className="footer-links">
                  <li><a href="#home" onClick={() => setActiveTab('home')}>Strona Główna</a></li>
                  <li><a href="#modes" onClick={() => setActiveTab('modes')}>Tryby Gry</a></li>
                  <li><a href="#shop" onClick={() => setActiveTab('shop')}>ItemShop</a></li>
                  <li><a href="#rules" onClick={() => setActiveTab('rules')}>Regulamin</a></li>
                </ul>
              </div>

              <div>
                <h4 className="footer-col-title">Społeczność</h4>
                <ul className="footer-links">
                  <li><a href="https://discord.gg" target="_blank" rel="noreferrer">Discord</a></li>
                  <li><a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a></li>
                  <li><a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} BETTER GAME. Wszelkie prawa zastrzeżone.</span>
            <span>Nie jesteśmy powiązani ze spółką Mojang Studios ani Microsoft.</span>
          </div>
        </div>
      </footer>
    </>
  )
}
