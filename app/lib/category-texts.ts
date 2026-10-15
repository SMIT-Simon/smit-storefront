/**
 * Kurze Einleitungstexte je Kategorie und Unterkategorie (über den Produkten).
 * Bewusst knapp: 2–3 Sätze, mit den Begriffen, nach denen Kunden suchen.
 */
export const CATEGORY_TEXTS: Record<string, {intro: string; subs?: Record<string, string>}> = {
  notebooks: {
    intro:
      'TERRA Laptops (TERRA MOBILE) vom deutschen Hersteller WORTMANN für Büro, Homeoffice und unterwegs – in 14, 15,6 und 16 Zoll, vom günstigen Business-Notebook bis zum Copilot+ PC mit KI-Prozessor. Auf Wunsch fertig eingerichtet.',
    subs: {
      business: 'Robuste Business-Notebooks mit Windows 11 Pro – die solide Wahl für Büro, Außendienst und Homeoffice.',
      'copilot-pc': 'Copilot+ PCs mit NPU für KI-Funktionen direkt auf dem Gerät – schnell, effizient und mit langer Akkulaufzeit.',
      premium: 'MOBILE ELITE: leichte Premium-Notebooks mit hochwertigem Gehäuse und starker Ausstattung.',
      convertible: 'Convertibles und 2-in-1-Geräte mit Touch und Stift – Notebook und Tablet in einem.',
      industry: 'Robuste Industry-Notebooks für Werkstatt, Lager und Außeneinsatz.',
    },
  },
  'desktop-pcs': {
    intro:
      'TERRA PCs und Computer, gefertigt in Deutschland: vom platzsparenden TERRA Mini-PC für Empfang und Büro über leistungsstarke Business-PCs bis zur Workstation für CAD. Optional mit Vor-Ort-Service, Windows und Einrichtung.',
    subs: {
      business: 'Business-PCs für den Büroalltag – zuverlässig, leise und auf lange Laufzeit ausgelegt.',
      'mini-micro': 'TERRA Mini-PCs und Micro-PCs: klein, sparsam und per VESA-Halterung hinter dem Monitor montierbar.',
      workstation: 'Workstations mit Profi-Grafik für CAD, BIM, Rendering und anspruchsvolle Anwendungen.',
      industry: 'Industry-PCs für Fertigung und raue Umgebungen.',
      home: 'PCs für Zuhause – für Office, Internet, Fotos und Familie.',
      gamer: 'Gaming-PCs mit starker Grafikkarte für aktuelle Spiele.',
      'copilot-pc': 'Desktop-Copilot+ PCs mit KI-Beschleuniger (NPU).',
    },
  },
  'all-in-one-pcs': {
    intro:
      'TERRA All-in-One-PCs vereinen PC und Monitor in einem Gerät: ein Kabel, aufgeräumter Schreibtisch, integrierte Webcam. Ideal für Empfang, Praxis und Büro.',
    subs: {
      '24-zoll': 'All-in-One-PCs mit 24-Zoll-Display – der kompakte Standard für jeden Arbeitsplatz.',
      '27-zoll': 'All-in-One-PCs mit 27-Zoll-Display – mehr Fläche für Tabellen und mehrere Fenster.',
    },
  },
  monitore: {
    intro:
      'TERRA LCD/LED-Monitore für Büro und Homeoffice: IPS-Panels, flimmerfrei, viele Modelle höhenverstellbar und mit USB-C. Optional mit Vor-Ort-Austausch und Pixelservice.',
    subs: {
      '24-zoll': '24-Zoll-Monitore – der Klassiker für Büro und Dual-Monitor-Arbeitsplätze.',
      '27-zoll': '27-Zoll-Monitore mit Full HD oder WQHD – mehr Platz für produktives Arbeiten.',
      '32-zoll': '32-Zoll-Monitore in WQHD und 4K für maximale Arbeitsfläche.',
      hoehenverstellbar: 'Höhenverstellbare Monitore (PV/HA) für ergonomisches Arbeiten – viele mit Pivot-Funktion.',
    },
  },
  tablets: {
    intro:
      'TERRA PAD Tablets mit Windows oder Android – für mobile Datenerfassung, Schule, Lager und unterwegs. Aktuelle Modelle wie TERRA PAD 1007, 1201 und 1262, dazu passende Tastatur-Cover und Zubehör.',
    subs: {
      windows: 'Windows-Tablets mit voller Desktop-Software – mit Type Cover auch als Notebook nutzbar.',
      android: 'Android-Tablets für Präsentation, Lernen und mobile Anwendungen.',
    },
  },
  'server-netzwerk': {
    intro:
      'TERRA Server, Firewalls und Netzwerkzubehör für kleine und mittlere Unternehmen, Praxen und Kanzleien. Planung, Installation und Wartung übernimmt auf Wunsch unser Systemhaus in Verl.',
    subs: {
      'tower-server': 'Tower- und Miniserver – leise Server für Büro, Praxis und Kanzlei ohne Serverschrank.',
      'rack-server': 'Rack-Server für den 19"-Schrank – skalierbar für wachsende Anforderungen.',
      firewall: 'TERRA Firewalls und VPN-Gateways (Black Dwarf) mit Securepoint UTM – Schutz und sicherer Fernzugriff.',
    },
  },
  zubehoer: {
    intro:
      'Original TERRA-Zubehör: TERRA Tastaturen, Mäuse, Dockingstations, Webcams, Taschen und Netzteile – passend zu Ihren TERRA-Geräten.',
    subs: {
      dockingstations: 'Dockingstations für Notebooks – ein Kabel für Monitore, Netzwerk, USB und Strom.',
      eingabegeraete: 'TERRA Tastaturen, Mäuse und Desktop-Sets – kabelgebunden oder kabellos, mit Copilot-Taste.',
      webcams: 'Webcams für Videokonferenzen mit Teams, Zoom & Co.',
      taschen: 'Notebook-Taschen, Rucksäcke und Schutzhüllen.',
      netzteile: 'Original-Netzteile und Akkus für TERRA-Geräte.',
      halterungen: 'VESA-Halterungen und Standfüße für Monitore und Mini-PCs.',
      ersatzteile: 'Kabel, Adapter und Ersatzteile.',
    },
  },
  'software-services': {
    intro:
      'Windows, Microsoft Office und Virenschutz – auf Wunsch direkt auf Ihrem neuen PC vorinstalliert. Dazu unser Einrichtungsservice: Ihr Gerät kommt startklar an.',
    subs: {
      services: 'Einrichtungsservice: Updates, Treiber, Benutzer und Grundsoftware – fertig eingerichtet geliefert.',
      betriebssysteme: 'Windows 11 Pro und Home für Ihre PCs.',
      office: 'Microsoft Office 2024 und Microsoft 365 für Büro und Unternehmen.',
      sicherheit: 'ESET Virenschutz für Privat und Unternehmen.',
    },
  },
};

export function categoryIntro(handle: string, sub?: string | null) {
  const c = CATEGORY_TEXTS[handle];
  if (!c) return null;
  return (sub && c.subs?.[sub]) || c.intro;
}

/** Seitentitel (Google) je Kategorie bzw. Unterkategorie – mit den Begriffen, nach denen gesucht wird. */
const SEO_TITLES: Record<string, string> = {
  notebooks: 'TERRA Laptop kaufen – TERRA MOBILE Notebooks',
  'notebooks/business': 'TERRA Business-Notebooks kaufen – TERRA MOBILE',
  'notebooks/copilot-pc': 'TERRA Copilot+ PC Notebooks mit KI-Prozessor',
  'notebooks/premium': 'TERRA MOBILE ELITE – Premium-Notebooks kaufen',
  'notebooks/convertible': 'TERRA Convertible & 2-in-1 Notebooks kaufen',
  'notebooks/industry': 'TERRA Rugged Notebooks – Industry-Laptops',
  'desktop-pcs': 'TERRA PC kaufen – Business-PC & Workstation',
  'desktop-pcs/business': 'TERRA PC-Business kaufen – Büro-PCs',
  'desktop-pcs/mini-micro': 'TERRA Mini-PC kaufen – PC-Mini & PC-Micro',
  'desktop-pcs/workstation': 'TERRA Workstation kaufen – CAD & Grafik',
  'desktop-pcs/industry': 'TERRA Industrie-PC kaufen – PC-Industry',
  'desktop-pcs/home': 'TERRA PC-Home kaufen – PCs für Zuhause',
  'desktop-pcs/gamer': 'TERRA Gaming-PC kaufen – PC-Gamer',
  'desktop-pcs/copilot-pc': 'TERRA Copilot+ PC kaufen – Desktop mit NPU',
  'all-in-one-pcs': 'TERRA All-in-One-PC kaufen – 24 & 27 Zoll',
  'all-in-one-pcs/24-zoll': 'TERRA All-in-One-PC 24 Zoll kaufen',
  'all-in-one-pcs/27-zoll': 'TERRA All-in-One-PC 27 Zoll kaufen',
  monitore: 'TERRA Monitor kaufen – 24, 27 & 32 Zoll',
  'monitore/24-zoll': 'TERRA Monitor 24 Zoll kaufen – LCD/LED',
  'monitore/27-zoll': 'TERRA Monitor 27 Zoll kaufen – LCD/LED',
  'monitore/32-zoll': 'TERRA Monitor 32 Zoll kaufen – WQHD & 4K',
  'monitore/hoehenverstellbar': 'Höhenverstellbare TERRA Monitore kaufen',
  tablets: 'TERRA PAD Tablet kaufen – Windows & Android',
  'tablets/windows': 'TERRA PAD Windows-Tablet kaufen',
  'tablets/android': 'TERRA PAD Android-Tablet kaufen',
  'server-netzwerk': 'TERRA Server & Firewall kaufen',
  'server-netzwerk/tower-server': 'TERRA Miniserver & Tower-Server kaufen',
  'server-netzwerk/rack-server': 'TERRA Rack-Server kaufen – 19 Zoll',
  'server-netzwerk/firewall': 'Firewall & VPN für Unternehmen kaufen',
  zubehoer: 'TERRA Zubehör kaufen – Docks, Maus & Tastatur',
  'zubehoer/dockingstations': 'Dockingstation kaufen – USB-C Docks',
  'zubehoer/eingabegeraete': 'TERRA Tastatur & Maus kaufen',
  'zubehoer/webcams': 'Webcam kaufen – für Teams & Videokonferenz',
  'zubehoer/taschen': 'Notebook-Taschen & Schutzhüllen kaufen',
  'zubehoer/netzteile': 'Notebook-Netzteile & Akkus für TERRA',
  'zubehoer/halterungen': 'Monitor-Halterungen & Standfüße kaufen',
  'zubehoer/ersatzteile': 'Kabel, Adapter & Ersatzteile für TERRA',
  'software-services': 'Software & Service – Windows, Office, Virenschutz',
  'software-services/services': 'Einrichtungsservice für PC & Notebook',
  'software-services/betriebssysteme': 'Windows 11 Pro & Home kaufen',
  'software-services/office': 'Microsoft Office 2024 & 365 kaufen',
  'software-services/sicherheit': 'ESET Virenschutz kaufen – für Firmen',
};

export function categorySeoTitle(handle: string, sub?: string | null) {
  return (sub && SEO_TITLES[`${handle}/${sub}`]) || SEO_TITLES[handle] || null;
}
