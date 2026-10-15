/**
 * SEO-Themenseiten (/themen/<slug>) für konkrete Suchanfragen aus der Search Console.
 * Jede Seite hat eigenen Ratgeber-Inhalt und zeigt die passenden Produkte live aus dem Shop.
 */
export type LandingFaq = {q: string; a: string};

export type Landing = {
  slug: string;
  keyword: string; // Haupt-Suchbegriff
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  /** Storefront-Suchquery für die Produkte */
  productQuery: string;
  /** Link zur passenden Kategorie (mit Filtern) */
  category: {label: string; href: string};
  /** Großes Produktbild oben (Produkt-Handle) mit kurzer Bildunterschrift */
  hero?: {handle: string; caption: string};
  /** Vergleichstabelle aus den Produkt-Tags erzeugen */
  compare?: 'monitor';
  /** Nur diese Produkte (Handles, in dieser Reihenfolge) statt aller Treffer zeigen */
  picks?: string[];
  /** Überschrift über der Produktliste */
  productsTitle?: string;
  /** Baureihen/Unterkategorien als verlinkte Kacheln */
  series?: {title: string; text: string; href: string}[];
  seriesTitle?: string;
  /** Geschichte / Hintergrund mit Zeitleiste */
  story?: {title: string; paragraphs: string[]; milestones: {year: string; text: string}[]; source?: string};
  guideTitle?: string;
  /** Zielgruppen mit Bild */
  audiences?: {title: string; items: {title: string; text: string; image: string; alt: string}[]};
  /** Vergleichstabelle (frei) */
  table?: {title: string; head: string[]; rows: string[][]; note?: string};
  /** Bild-Text-Abschnitt (z. B. „IT made in Germany“) */
  feature?: {
    eyebrow?: string;
    title: string;
    paragraphs: string[];
    image: string;
    imageAlt: string;
    facts?: {value: string; label: string}[];
  };
  guide: {title: string; text: string}[];
  faq: LandingFaq[];
  related: {label: string; href: string}[];
};

export const LANDINGS: Landing[] = [
  {
    slug: 'tower-server',
    keyword: 'Tower-Server',
    h1: 'Tower-Server kaufen – Server ohne Serverschrank',
    metaTitle: 'Tower-Server kaufen – TERRA Server für Büro & Praxis',
    metaDescription:
      'Tower-Server von TERRA für Büro, Praxis und Kanzlei: kein Serverschrank nötig, Hardware-RAID, ECC-RAM. Vorteile, Nachteile und Modelle mit Preis.',
    intro: [
      'Ein Tower-Server steht wie ein großer PC auf dem Boden oder im Technikraum – und braucht keinen 19-Zoll-Serverschrank. Für Unternehmen mit einem oder wenigen Servern ist das oft die einfachste und günstigste Lösung.',
      'Die TERRA Tower-Server von WORTMANN werden in Deutschland gefertigt: vom leisen MINISERVER fürs Büro bis zum TERRA SERVER 3030 mit Intel Xeon oder AMD EPYC, Hardware-RAID und auf Wunsch redundantem Netzteil.',
    ],
    productQuery: 'product_type:Server AND tag:"sub:tower-server"',
    category: {label: 'Alle Tower-Server mit Filtern', href: '/collections/server-netzwerk?sub=tower-server'},
    hero: {
      handle: 'terra-server-3030a-g6-32-gb-1920-gb-windows-server-2025-1100421',
      caption: 'TERRA SERVER 3030A G6 – AMD EPYC, 32 GB ECC, 2 × 960 GB SSD (RAID 1), Windows Server 2025',
    },
    productsTitle: 'TERRA Tower-Server – direkt bestellen',
    seriesTitle: 'Die TERRA Tower-Server',
    series: [
      {
        title: 'TERRA MINISERVER G6',
        text: 'Kompakt und geräuscharm – gebaut für den Betrieb direkt im Büro. Intel Xeon E-2400 oder Xeon 6300, bis 64 GB ECC-RAM.',
        href: '/collections/server-netzwerk?sub=tower-server',
      },
      {
        title: 'TERRA SERVER 3030 G6',
        text: 'Der Allrounder mit Intel Xeon 6300: Hardware-RAID (Broadcom MegaRAID), Remote-Management, 4 Laufwerksschächte, optional redundantes Netzteil.',
        href: '/collections/server-netzwerk?sub=tower-server',
      },
      {
        title: 'TERRA SERVER 3030A G6',
        text: 'Mit AMD EPYC 4005 und bis 192 GB ECC-RAM – viel Leistung für Virtualisierung, SQL-Datenbanken und Warenwirtschaft.',
        href: '/collections/server-netzwerk?sub=tower-server',
      },
    ],
    guideTitle: 'Vorteile eines Tower-Servers',
    guide: [
      {
        title: 'Kein Serverschrank nötig',
        text: 'Ein Tower-Server braucht weder 19-Zoll-Rack noch Schienen oder Schrankzubehör. Das spart gerade bei einem einzelnen Server Geld und Platz an der Wand.',
      },
      {
        title: 'Flexibel aufstellen',
        text: 'Technikraum, Abstellraum mit Lüftung oder abschließbarer Büroraum: Der Server steht dort, wo Netzwerk und Strom sind – mit rund 20 × 44 × 57 cm (TERRA SERVER 3030) braucht er wenig Fläche.',
      },
      {
        title: 'Leiser als viele Rack-Server',
        text: 'Große Gehäuse kühlen mit größeren, langsameren Lüftern. Der TERRA MINISERVER ist ausdrücklich für den Betrieb in Büroumgebungen ausgelegt.',
      },
      {
        title: 'Echte Server-Technik',
        text: 'ECC-Arbeitsspeicher, Hardware-RAID mit gespiegelten SSDs, Remote-Management und optional redundante Netzteile – Ausfallsicherheit, die ein normaler PC nicht bietet.',
      },
      {
        title: 'Gut erweiterbar',
        text: 'Freie Laufwerksschächte, RAM-Steckplätze und PCIe-Slots: Speicher, SSDs, Netzwerk- oder Backup-Karten lassen sich später nachrüsten.',
      },
      {
        title: 'Vielseitig einsetzbar',
        text: 'Dateiablage, Active Directory, Druckdienste, SQL-Datenbanken, JTL-Wawi, DATEV oder Praxissoftware – oder mehrere virtuelle Server auf einer Maschine.',
      },
    ],
    audiences: {
      title: 'Für welche Unternehmen eignen sich Tower-Server?',
      items: [
        {
          title: 'Arztpraxen',
          text: 'Praxisverwaltung, Terminkalender und Patientendaten zentral und sicher im eigenen Haus – mit RAID und Backup.',
          image: '/images/tower/zielgruppe-praxis.webp',
          alt: 'Empfang einer Arztpraxis mit zwei Monitoren und Praxissoftware',
        },
        {
          title: 'Steuerkanzleien',
          text: 'DATEV-Umgebung, Mandantenablage und Benutzerverwaltung auf einem Server, der leise im Büro oder Abstellraum läuft.',
          image: '/images/tower/zielgruppe-kanzlei.webp',
          alt: 'Steuerberater am Doppelmonitor-Arbeitsplatz in der Kanzlei',
        },
        {
          title: 'Handel & Warenwirtschaft',
          text: 'JTL-Wawi, SQL-Datenbank, Versand und Lager: schnelle NVMe-SSDs und ECC-RAM halten die Warenwirtschaft flüssig.',
          image: '/images/tower/zielgruppe-handel.webp',
          alt: 'Mitarbeiter im Lager arbeitet mit Warenwirtschaft am PC',
        },
        {
          title: 'Kleine und mittlere Unternehmen',
          text: 'Dateifreigaben, Drucker, Active Directory und virtuelle Server für 5 bis 50 Arbeitsplätze – ohne Serverschrank.',
          image: '/images/tower/zielgruppe-kmu.webp',
          alt: 'Team im Büro arbeitet gemeinsam am PC',
        },
      ],
    },
    table: {
      title: 'Tower-Server oder Rack-Server?',
      head: ['', 'Tower-Server', 'Rack-Server'],
      rows: [
        ['Serverschrank', 'nicht nötig', 'erforderlich (19 Zoll, mind. ca. 90 cm tief)'],
        ['Kosten bei 1–2 Servern', 'meist günstiger', 'zusätzlich Schrank, Schienen, Zubehör'],
        ['Lautstärke', 'häufig leiser', 'häufig lauter (kleine, schnelle Lüfter)'],
        ['Viele Server / Storage', 'weniger geeignet', 'besonders geeignet'],
        ['Verkabelung & Kühlung', 'einfach, Aufstellort beachten', 'strukturiert im Schrank'],
        ['Typischer Einsatz', 'Büro, Praxis, Kanzlei, Filiale', 'Serverraum, Rechenzentrum'],
      ],
      note: 'Sie planen mehrere Server, Storage oder haben bereits einen Netzwerkschrank? Dann sind unsere Rack-Server die bessere Wahl.',
    },
    feature: {
      eyebrow: 'Ohne Serverschrank – aber richtig aufgestellt',
      title: 'Darauf sollten Sie beim Aufstellort achten',
      paragraphs: [
        'Auch ein Tower-Server erzeugt Abwärme und ist unter Last hörbar. Ideal ist ein separater, belüfteter Raum mit Netzwerkanschluss – nicht direkt neben dem Schreibtisch. Die empfohlene Raumtemperatur liegt laut WORTMANN bei 20 bis 22 °C.',
        'Ohne abschließbaren Schrank sollte der Raum selbst verschließbar sein, damit niemand unbefugt an den Server kommt. Eine USV (unterbrechungsfreie Stromversorgung) schützt vor Stromausfällen, ein Backup – lokal und zusätzlich in der TERRA CLOUD – vor Datenverlust.',
      ],
      image: '/images/home/section-tower-server.webp',
      imageAlt: 'TERRA Tower-Server',
      facts: [
        {value: '20–22 °C', label: 'empfohlene Raumtemperatur'},
        {value: 'RAID 1', label: 'gespiegelte SSDs ab Werk'},
        {value: 'abschließbar', label: 'Raum statt Serverschrank'},
        {value: 'USV + Backup', label: 'Schutz vor Ausfall'},
      ],
    },
    faq: [
      {
        q: 'Brauche ich für einen Tower-Server einen Serverschrank?',
        a: 'Nein. Tower-Server stehen frei auf dem Boden oder einem Regal. Wichtig sind ein belüfteter, möglichst abschließbarer Raum, ein Netzwerkanschluss und idealerweise eine USV.',
      },
      {
        q: 'Ist ein Tower-Server laut?',
        a: 'Das hängt von Modell und Auslastung ab. Der TERRA MINISERVER ist für den Betrieb im Büro ausgelegt. Leistungsstärkere Server sollten in einem separaten Raum stehen – mehr Leistung bedeutet mehr Kühlung und damit mehr Geräusch.',
      },
      {
        q: 'Welcher Tower-Server eignet sich für JTL-Wawi oder DATEV?',
        a: 'Für die meisten kleinen und mittleren Betriebe reicht ein TERRA SERVER 3030 oder 3030A mit 32–64 GB ECC-RAM, gespiegelten SSDs und Windows Server 2025. Wir beraten Sie gern anhand Ihrer Benutzerzahl und Datenmenge.',
      },
      {
        q: 'Kann ich einen Tower-Server später in ein Rack einbauen?',
        a: 'Tower-Gehäuse sind für den Standbetrieb gebaut. Wenn ein Serverschrank absehbar ist, empfehlen wir direkt einen Rack-Server wie den TERRA SERVER 3230.',
      },
      {
        q: 'Welcher Service ist bei TERRA Servern dabei?',
        a: 'TERRA Server haben 36 Monate Bring-In-Service inklusive. Vor-Ort-Service bis 10 Jahre, Medieneinbehalt und der kostenlose TERRA Notfallservice sind zubuchbar – Details im Ratgeber Wortmann Server.',
      },
    ],
    related: [
      {label: 'Ratgeber Wortmann Server', href: '/ratgeber/wortmann-server'},
      {label: 'Rack-Server', href: '/collections/server-netzwerk?sub=rack-server'},
      {label: 'Server für kleine Unternehmen', href: '/loesungen/server-kleine-unternehmen'},
      {label: 'Server in der Cloud', href: '/cloud/virtuelle-server'},
      {label: 'JTL-Wawi in der Cloud', href: '/cloud/jtl-wawi-cloud'},
    ],
  },
  {
    slug: 'terra-pc',
    keyword: 'TERRA PC',
    h1: 'TERRA PC – Computer von WORTMANN aus Deutschland',
    metaTitle: 'TERRA PC kaufen – Business-PC & Mini-PC von WORTMANN',
    metaDescription:
      'TERRA PCs von WORTMANN aus Hüllhorst: Business-PCs, Mini- und Micro-PCs, Home- und Gaming-PCs. Modelle, Baureihen, Geschichte der Marke – mit Preisen direkt bestellen.',
    intro: [
      'TERRA PC ist die Computer-Marke der WORTMANN AG aus Hüllhorst in Ostwestfalen. Seit 1986 baut das Unternehmen Computer für Firmen, Behörden, Schulen und Privatkunden – gefertigt in Deutschland und vertrieben über den Fachhandel.',
      'Das Sortiment reicht vom lüfterlosen Mini-PC für den Empfang über den klassischen Büro-PC bis zum leistungsstarken Gaming-PC. Hier finden Sie die wichtigsten Baureihen, beliebte Modelle mit Preis und ein wenig Geschichte zur Marke.',
    ],
    productQuery: "product_type:'Desktop-PC'",
    picks: [
      'terra-pc-business-6000-core-ultra-5-225-16-gb-500-gb-w11-pro-art-nr-1000133-1000133',
      'terra-pc-business-4000-1000126',
      'terra-pc-business-5200-le-eu1000049',
      'terra-pc-micro-6000-core-5-120u-16-gb-500-gb-w11-pro-art-nr-1000151-1000151',
      'terra-pc-mini-3550-fanless-1000047',
      'terra-pc-micro-7000a-copilot-pc-1000184',
      'terra-pc-business-7000-ryzen-7-8700g-16-gb-1-tb-w11-pro-1000160',
      'terra-pc-home-6000-ryzen-5-pro-8500g-16-gb-1000-gb-w11-pro-1000171',
    ],
    productsTitle: 'Beliebte TERRA PCs – direkt bestellen',
    category: {label: 'Alle TERRA PCs mit Filtern', href: '/collections/desktop-pcs'},
    hero: {
      handle: 'terra-pc-business-6000-core-ultra-5-225-16-gb-500-gb-w11-pro-art-nr-1000133-1000133',
      caption: 'PC des Monats: TERRA PC BUSINESS 6000 – Core Ultra 5, 16 GB, 500 GB SSD, Windows 11 Pro',
    },
    feature: {
      eyebrow: 'IT made in Germany',
      title: 'Gebaut in Ostwestfalen – für Ihren Schreibtisch',
      paragraphs: [
        'TERRA PCs entstehen bei WORTMANN in Hüllhorst: Dort werden die Systeme aus Markenkomponenten montiert, mit Windows installiert und geprüft, bevor sie das Werk verlassen. Weil die Fertigung im eigenen Haus liegt, sind auch individuelle Ausstattungen schnell machbar.',
        'Zusammen mit einem passenden TERRA Monitor entsteht so ein kompletter Arbeitsplatz aus einer Hand – auf Wunsch von uns vorinstalliert und bei Ihnen eingerichtet.',
      ],
      image: '/images/ap/2456w-pv.png',
      imageAlt: 'TERRA PC mit TERRA Monitor LCD/LED 2456W PV am Schreibtisch',
      facts: [
        {value: 'seit 1986', label: 'Computer von WORTMANN'},
        {value: 'Hüllhorst', label: 'Montage, Prüfung & Service'},
        {value: '24 Monate', label: 'Bring-In-Service inklusive'},
        {value: 'Verl', label: 'Beratung & Einrichtung vom Systemhaus'},
      ],
    },
    seriesTitle: 'Die TERRA PC-Baureihen',
    series: [
      {
        title: 'TERRA PC-BUSINESS',
        text: 'Der klassische Büro-PC in den Leistungsklassen 4000, 5000, 6000 und 7000 – mit Windows 11 Pro, leise und für den Dauereinsatz im Unternehmen.',
        href: '/collections/desktop-pcs?sub=business',
      },
      {
        title: 'TERRA PC-MICRO & PC-MINI',
        text: 'Kompakte Rechner, die per VESA-Halterung hinter den Monitor passen – ideal für Empfang, Praxis, Kasse und aufgeräumte Schreibtische. Teils lüfterlos.',
        href: '/collections/desktop-pcs?sub=mini-micro',
      },
      {
        title: 'TERRA Copilot+ PC',
        text: 'Neue Generation mit KI-Beschleuniger (NPU) für Windows-KI-Funktionen direkt auf dem Gerät.',
        href: '/collections/desktop-pcs?sub=copilot-pc',
      },
      {
        title: 'TERRA PC-HOME',
        text: 'Für Zuhause und das kleine Büro: Office, Internet, Fotos und Videos – mit viel Speicherplatz.',
        href: '/collections/desktop-pcs?sub=home',
      },
      {
        title: 'TERRA PC-GAMER',
        text: 'Gaming-PCs mit starker Grafikkarte und schnellen Prozessoren für aktuelle Spiele.',
        href: '/collections/desktop-pcs?sub=gamer',
      },
      {
        title: 'TERRA PC-INDUSTRY',
        text: 'Robuste Industrie-PCs für Fertigung, Lager und Umgebungen mit Staub und Wärme.',
        href: '/collections/desktop-pcs?sub=industry',
      },
    ],
    story: {
      title: 'Die Geschichte hinter TERRA',
      paragraphs: [
        'Hinter TERRA steht die WORTMANN AG. Siegbert Wortmann gründete das Unternehmen 1986; Sitz ist bis heute Hüllhorst im Kreis Minden-Lübbecke. Dort werden die TERRA Business-PCs und Server gefertigt.',
        'WORTMANN ist nicht börsennotiert und gilt als einer der größten unabhängigen Computerhersteller Europas. Verkauft wird über Fachhändler und Systemhäuser – so wie über uns, das Systemhaus aus Verl, ebenfalls in Ostwestfalen.',
      ],
      milestones: [
        {year: '1986', text: 'Gründung durch Siegbert Wortmann'},
        {year: '1996', text: 'Erstmals 100 Mio. Euro Umsatz'},
        {year: '1998', text: 'Umwandlung in die WORTMANN AG'},
        {year: '2009', text: 'Neue Produktionsstätten in Hüllhorst'},
        {year: '2012', text: 'Eigenes Rechenzentrum – heute die TERRA CLOUD'},
        {year: '2024', text: 'Über 1 Milliarde Euro Umsatz'},
      ],
      source: 'Quelle: Wikipedia, Artikel „Wortmann AG“',
    },
    guideTitle: 'Darauf sollten Sie beim TERRA PC achten',
    guide: [
      {
        title: 'Prozessor: Core Ultra, Core oder Ryzen',
        text: 'Für Office und Warenwirtschaft genügt ein Core i3/Core 3 bzw. Ryzen 3. Wer viele Programme parallel nutzt, ist mit Core Ultra 5 oder Ryzen 5 gut beraten. Core Ultra 7 und Ryzen 7 lohnen sich für große Datenmengen und Bildbearbeitung.',
      },
      {
        title: '16 GB Arbeitsspeicher',
        text: '8 GB reichen für einfache Aufgaben. Für Windows 11, Browser mit vielen Tabs, Teams und Office empfehlen wir 16 GB – die meisten TERRA PCs haben sie bereits ab Werk.',
      },
      {
        title: 'Windows 11 Pro oder Home',
        text: 'Für Firmennetzwerke, Domäne und BitLocker brauchen Sie Windows 11 Pro – bei den PC-BUSINESS-Modellen ist es vorinstalliert. Home-Modelle sind für den privaten Einsatz gedacht.',
      },
      {
        title: 'Service inklusive',
        text: 'TERRA PCs haben 24 Monate Bring-In-Service der WORTMANN AG inklusive. Auf Wunsch gibt es Vor-Ort-Service mit längerer Laufzeit – fragen Sie uns.',
      },
    ],
    faq: [
      {
        q: 'Wer stellt TERRA PCs her?',
        a: 'TERRA ist die Eigenmarke der WORTMANN AG mit Sitz in Hüllhorst (Ostwestfalen). Das Unternehmen wurde 1986 von Siegbert Wortmann gegründet und fertigt Business-PCs und Server in Deutschland.',
      },
      {
        q: 'Sind TERRA PCs gut?',
        a: 'TERRA PCs sind für den professionellen Einsatz in Unternehmen, Behörden und Schulen gebaut: Markenkomponenten, Windows 11 Pro und Service aus Deutschland. Dazu kommen 24 Monate Bring-In-Service inklusive.',
      },
      {
        q: 'Wo kann ich einen TERRA PC kaufen?',
        a: 'TERRA PCs werden über Fachhändler verkauft. Bei uns – dem Systemhaus aus Verl – bestellen Sie direkt online, auf Wunsch mit Einrichtung, Datenübernahme und Kauf auf Rechnung für Firmen.',
      },
      {
        q: 'Was kostet ein TERRA PC?',
        a: 'Kompakte TERRA Micro-PCs gibt es ab rund 430 €, Business-PCs mit Windows 11 Pro ab etwa 760 €. Die aktuellen Preise aller Modelle finden Sie in der Kategorie TERRA PCs.',
      },
      {
        q: 'Welcher TERRA PC ist der richtige fürs Büro?',
        a: 'Für die meisten Büroarbeitsplätze empfehlen wir einen TERRA PC BUSINESS 6000 mit 16 GB RAM und Windows 11 Pro. Wenig Platz? Dann ist ein TERRA PC-MICRO hinter dem Monitor die elegante Lösung.',
      },
    ],
    related: [
      {label: 'TERRA Mini-PC', href: '/collections/desktop-pcs?sub=mini-micro'},
      {label: 'PC-Konfigurator', href: '/konfigurator/terra-pc-business-6000'},
      {label: 'Laptop aus Deutschland', href: '/ratgeber/laptop-aus-deutschland'},
      {label: 'TERRA Monitor 27 Zoll', href: '/themen/terra-monitor-27-zoll'},
      {label: 'Business-PC fürs Büro', href: '/loesungen/buero-unternehmen'},
    ],
  },
  {
    slug: 'terra-monitor-27-zoll',
    keyword: 'TERRA Monitor 27 Zoll',
    h1: 'TERRA Monitor 27 Zoll',
    metaTitle: 'TERRA Monitor 27 Zoll – alle Modelle im Vergleich',
    metaDescription:
      'TERRA 27-Zoll-Monitore von WORTMANN im Vergleich: Full HD oder WQHD (2K), IPS-Panel, höhenverstellbar mit Pivot, USB-C mit Power Delivery. Alle Modelle mit Preis – direkt bestellen.',
    intro: [
      'Ein 27-Zoll-Monitor bietet spürbar mehr Arbeitsfläche als die klassischen 24 Zoll: zwei Dokumente nebeneinander, große Tabellen, Videokonferenz plus Notizen – ohne zweites Display.',
      'Alle TERRA LCD/LED-Monitore in 27 Zoll (68,6 cm) nutzen IPS-Panels mit blickwinkelstabilen Farben. Unterschiede gibt es bei Auflösung, Standfuß und Anschlüssen – die Übersicht unten hilft bei der Auswahl.',
    ],
    productQuery: 'product_type:Monitor AND tag:"sub:27-zoll"',
    category: {label: 'Alle 27-Zoll-Monitore mit Filtern', href: '/collections/monitore?sub=27-zoll'},
    hero: {
      handle: 'terra-lcd-led-2775w-pv-v3-2k-ips-black-usb-c-dp-hdmi-3030231',
      caption: 'Topmodell: TERRA LCD/LED 2775W PV V3 – WQHD, höhenverstellbar mit Pivot, USB-C-Dock',
    },
    compare: 'monitor',
    feature: {
      eyebrow: 'Mehr Platz am Arbeitsplatz',
      title: 'Zwei 27-Zöller statt Fenster-Jonglieren',
      paragraphs: [
        'Mit zwei TERRA 27-Zoll-Monitoren nebeneinander haben Sie Warenwirtschaft und E-Mail, Tabelle und Angebot oder Videokonferenz und Notizen gleichzeitig im Blick – ohne ständig zwischen Fenstern zu wechseln.',
        'Schmale Rahmen lassen beide Bildschirme fast nahtlos ineinander übergehen. Mit einem USB-C-Modell genügt oft ein einziges Kabel zum Notebook.',
      ],
      image: '/images/ap/2727w.png',
      imageAlt: 'Arbeitsplatz mit TERRA 27-Zoll-Monitoren LCD/LED 2727W',
    },
    guide: [
      {
        title: 'Full HD oder WQHD (2K)?',
        text: 'Bei 27 Zoll ergibt Full HD (1920 × 1080) rund 82 Pixel pro Zoll – gut für Office und größeren Sitzabstand. WQHD (2560 × 1440, bei TERRA „2K“) liefert rund 109 ppi: deutlich schärfere Schrift und mehr Platz für Fenster. Für Tabellen, CAD und Bildbearbeitung empfehlen wir WQHD.',
      },
      {
        title: 'Höhenverstellbar und Pivot (PV / HA)',
        text: 'Modelle mit „HA“ sind höhenverstellbar, „PV“-Modelle zusätzlich drehbar ins Hochformat (Pivot). Für ergonomisches Arbeiten am Büroarbeitsplatz ist ein höhenverstellbarer Fuß die beste Wahl.',
      },
      {
        title: 'USB-C mit Power Delivery',
        text: 'Mit USB-C überträgt ein einziges Kabel Bild, Ton und Daten – und lädt bei Power Delivery gleichzeitig das Notebook. Einige Modelle haben zusätzlich einen integrierten USB-Hub bzw. Dock-Funktionen.',
      },
      {
        title: '100 Hz für flüssiges Arbeiten',
        text: 'Mehrere 27-Zoll-Modelle bieten 100 Hz Bildwiederholrate. Scrollen und Mausbewegungen wirken flüssiger – angenehm auch im normalen Büroalltag.',
      },
    ],
    faq: [
      {
        q: 'Wie groß ist ein 27-Zoll-Monitor?',
        a: '27 Zoll entsprechen 68,6 cm Bilddiagonale. Im 16:9-Format ist die sichtbare Fläche etwa 60 × 34 cm, mit Standfuß ist der Monitor rund 61 cm breit.',
      },
      {
        q: 'Welcher TERRA 27-Zoll-Monitor ist der günstigste?',
        a: 'Der Einstieg ist der TERRA LCD/LED 2727W V3 mit Full HD, IPS-Panel und 100 Hz. Die aktuellen Preise aller Modelle sehen Sie in der Übersicht oben.',
      },
      {
        q: 'Brauche ich WQHD bei 27 Zoll?',
        a: 'Für reine Office-Arbeit genügt Full HD. Wer viel mit Tabellen, mehreren Fenstern oder Grafik arbeitet, profitiert von der schärferen WQHD-Auflösung.',
      },
      {
        q: 'Gibt es TERRA Monitore auch größer als 27 Zoll?',
        a: 'Ja. Für noch mehr Arbeitsfläche gibt es TERRA Monitore mit 32 Zoll (81,3 cm) – zum Beispiel den TERRA LCD/LED 3285W HA mit gebogenem WQHD-Display (Curved), 100 Hz und USB-C sowie den 3295W PV mit 4K-Auflösung. Alle Modelle finden Sie unter „32-Zoll-Monitore“.',
      },
      {
        q: 'Gibt es Vor-Ort-Service für TERRA Monitore?',
        a: 'Ja. TERRA Monitore haben 24 Monate Vor-Ort-Austausch-Service inklusive; optional zubuchbar sind längere Laufzeiten bis 60 Monate und Pixelservice.',
      },
    ],
    related: [
      {label: 'Höhenverstellbare Monitore', href: '/collections/monitore?sub=hoehenverstellbar'},
      {label: '24-Zoll-Monitore', href: '/collections/monitore?sub=24-zoll'},
      {label: '32-Zoll-Monitore', href: '/collections/monitore?sub=32-zoll'},
      {label: 'Multimonitor-Arbeitsplatz', href: '/loesungen/multimonitor-arbeitsplatz'},
    ],
  },
];

export function findLanding(slug?: string) {
  return LANDINGS.find((l) => l.slug === slug);
}

/** Monitor-Eigenschaften aus den Filter-Tags (f:…) lesen */
export function monitorSpecs(tags: string[]) {
  const has = (t: string) => tags.includes(`f:${t}`);
  return {
    resolution: has('res-wqhd') ? 'WQHD 2560 × 1440' : has('res-4k') ? '4K UHD' : 'Full HD 1920 × 1080',
    stand: has('pivot') ? 'höhenverstellbar + Pivot' : has('hv') ? 'höhenverstellbar' : 'neigbar',
    usbc: has('usbc-dock') ? 'USB-C (PD, Dock)' : has('usbc-pd') ? 'USB-C (Power Delivery)' : 'USB-C',
    hz: has('hz-100') ? '100 Hz' : '–',
  };
}
