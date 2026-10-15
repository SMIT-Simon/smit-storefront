/**
 * Lösungsseiten nach Branche und Einsatzbereich (/loesungen/<slug>).
 *
 * Jede Seite ist reiner Inhalt: Texte, typische Anforderungen, Szenarien mit
 * passenden Produktgruppen und FAQ. Die Produkte kommen live aus Shopify –
 * über Kategorie + Unterkategorie-Tag (siehe categoryQuery in ~/lib/categories).
 *
 * Bilder austauschen: einfach das Feld `image` ändern und die Datei unter
 * public/images/loesungen/ ablegen (Querformat, ca. 1200 px breit, webp/jpg).
 */
import {categoryQuery} from '~/lib/categories';

export type SolutionKind = 'branche' | 'einsatz';

export type Scenario = {
  title: string;
  text: string;
  /** Kategorie-Handle und optional Unterkategorie-Slug. */
  category: string;
  sub?: string;
  linkLabel?: string;
};

export type Solution = {
  slug: string;
  kind: SolutionKind;
  /** Kurzname für Menü und Kacheln. */
  name: string;
  /** H1 der Seite. */
  title: string;
  /** Ein Satz für Kacheln und Menü. */
  teaser: string;
  metaTitle: string;
  metaDescription: string;
  image: string;
  imageAlt: string;
  intro: string[];
  needs: {title: string; text: string}[];
  scenarios: Scenario[];
  /** Optionaler Hinweis-Kasten (z. B. Grenzen von Standard-Hardware). */
  notice?: string;
  faq: {q: string; a: string}[];
  related: string[];
};

export const SOLUTIONS: Solution[] = [
  // ───────────────────────────── Branchen ─────────────────────────────
  {
    slug: 'steuerberater-datev',
    kind: 'branche',
    name: 'Steuerberater & DATEV',
    title: 'PCs für Steuerberater und DATEV-Arbeitsplätze',
    teaser: 'Leistungsstarke Büro-PCs mit Platz für zwei Monitore – passend für DATEV.',
    metaTitle: 'PC für Steuerberater & DATEV kaufen – TERRA Business-PCs',
    metaDescription:
      'TERRA Business-PCs, Dual-Monitor-Arbeitsplätze und Server für Steuerkanzleien und DATEV. Mit Einrichtung durch das Systemhaus aus Verl.',
    image: '/images/home/section-dual-monitor.webp',
    imageAlt: 'TERRA Arbeitsplatz mit zwei Monitoren',
    intro: [
      'In einer Steuerkanzlei laufen DATEV, Office, DMS und Mandantenkommunikation oft gleichzeitig – meist auf zwei Bildschirmen. Ein Arbeitsplatz-PC muss das den ganzen Tag ohne Gedenksekunden schaffen und sich unauffällig in den Kanzleialltag einfügen.',
      'Wir stellen Ihnen TERRA-Systeme zusammen, die für diese Last ausgelegt sind, und richten sie auf Wunsch so ein, dass sie in Ihre bestehende DATEV-Umgebung passen.',
    ],
    needs: [
      {title: 'Genug Arbeitsspeicher', text: 'DATEV-Anwendungen, Browser und Office parallel – 16 GB sind sinnvoll, 32 GB geben Reserve für die nächsten Jahre.'},
      {title: 'Schnelle SSD', text: 'Kurze Start- und Ladezeiten bei großen Mandantenbeständen und Belegen.'},
      {title: 'Zwei Monitore', text: 'Beleg links, Buchung rechts: Grafikausgänge für zwei Displays gehören zur Grundausstattung.'},
      {title: 'Aktuelle Systemvoraussetzungen', text: 'DATEV veröffentlicht regelmäßig Hard- und Softwarevoraussetzungen. Wir gleichen die Ausstattung vor dem Kauf damit ab.'},
    ],
    scenarios: [
      {title: 'Sachbearbeitung & Buchhaltung', text: 'Business-PCs im kompakten Gehäuse mit Anschlüssen für zwei Monitore.', category: 'desktop-pcs', sub: 'business'},
      {title: 'Zwei-Monitor-Arbeitsplatz', text: 'Höhenverstellbare TERRA-Displays für ergonomisches Arbeiten am Doppelmonitor.', category: 'monitore', sub: 'hoehenverstellbar'},
      {title: 'Kanzleiserver', text: 'Tower-Server für Dateiablage und zentrale Anwendungen in kleinen und mittleren Kanzleien.', category: 'server-netzwerk', sub: 'tower-server'},
    ],
    faq: [
      {q: 'Wie viel Arbeitsspeicher braucht ein DATEV-Arbeitsplatz?', a: 'Für einen typischen Kanzlei-Arbeitsplatz mit DATEV, Office und Browser empfehlen wir mindestens 16 GB RAM. Wer viele Programme parallel nutzt oder den PC lange einsetzen möchte, ist mit 32 GB auf der sicheren Seite. Maßgeblich sind die aktuellen Systemvoraussetzungen von DATEV.'},
      {q: 'Brauche ich einen eigenen Server für DATEV?', a: 'Das hängt von der Kanzleigröße und dem Betriebsmodell ab – lokal, DATEVasp oder hybrid. Wir besprechen mit Ihnen, ob ein eigener Server sinnvoll ist oder ob leistungsfähige Arbeitsplätze genügen.'},
      {q: 'Können Sie die PCs vorinstalliert liefern?', a: 'Ja. Mit unserem Einrichtungsservice werden Windows-Updates, Benutzer und Grundsoftware vorbereitet. Die Integration in Ihre DATEV-Umgebung stimmen wir individuell ab.'},
      {q: 'Welcher Monitor eignet sich für die Belegbearbeitung?', a: 'Bewährt haben sich zwei 24- oder 27-Zoll-Displays mit Höhenverstellung und Pivot-Funktion – so lassen sich Belege auch hochkant anzeigen.'},
    ],
    related: ['multimonitor-arbeitsplatz', 'kanzleien', 'server-kleine-unternehmen'],
  },
  {
    slug: 'arztpraxen',
    kind: 'branche',
    name: 'Arztpraxen',
    title: 'Computer und PCs für Arztpraxen',
    teaser: 'Leise, kompakte PCs für Anmeldung, Sprechzimmer und Praxisverwaltung.',
    metaTitle: 'PC für Arztpraxis kaufen – kompakte TERRA-PCs für Praxen',
    metaDescription:
      'Kompakte und leise TERRA-PCs, Monitore und Server für Anmeldung, Behandlungszimmer und Verwaltung in Arzt- und Zahnarztpraxen.',
    image: '/images/loesungen/arbeitsplatz.webp',
    imageAlt: 'Kompakter TERRA-Arbeitsplatz mit Monitor, Tastatur und Maus',
    intro: [
      'An der Anmeldung zählt jeder Zentimeter, im Sprechzimmer soll der Rechner nicht stören und in der Verwaltung muss die Praxissoftware zuverlässig laufen. Für Praxen bewähren sich deshalb kompakte, leise Systeme, die sich hinter dem Monitor oder unter dem Tresen montieren lassen.',
      'Wir helfen bei der Auswahl passender TERRA-Geräte und stimmen die Ausstattung mit den Anforderungen Ihrer Praxissoftware und Ihres IT-Dienstleisters für die Telematikinfrastruktur ab.',
    ],
    needs: [
      {title: 'Platzsparend', text: 'Mini- und Micro-PCs lassen sich per VESA-Halterung hinter dem Monitor befestigen.'},
      {title: 'Leise', text: 'Im Sprechzimmer soll man den Patienten hören – nicht den Lüfter.'},
      {title: 'Genug Anschlüsse', text: 'Kartenlesegerät, Etikettendrucker, Scanner und Signaturpad wollen angeschlossen werden.'},
      {title: 'Zuverlässigkeit', text: 'Fällt ein Arbeitsplatz aus, steht die Anmeldung. Schneller Service ist entscheidend – optional mit Vor-Ort-Service am nächsten Werktag.'},
    ],
    scenarios: [
      {title: 'Anmeldung & Empfang', text: 'Mini- und Micro-PCs für den Tresen – klein, leise und mit vielen USB-Anschlüssen.', category: 'desktop-pcs', sub: 'mini-micro'},
      {title: 'Sprechzimmer', text: 'All-in-One-PCs sparen Kabel und Platz auf dem Schreibtisch im Behandlungsraum.', category: 'all-in-one-pcs', sub: '24-zoll'},
      {title: 'Praxisverwaltung', text: 'Business-PCs für Abrechnung, Korrespondenz und Praxismanagement.', category: 'desktop-pcs', sub: 'business'},
    ],
    notice:
      'Standard-Büro-PCs sind nicht für den Einsatz in der Patientenumgebung im Sinne der Medizinprodukte-Normen (z. B. DIN EN 60601-1) zugelassen. Für solche Bereiche beraten wir Sie individuell zu geeigneten Lösungen.',
    faq: [
      {q: 'Welcher PC eignet sich für die Anmeldung einer Praxis?', a: 'Ein kompakter Mini- oder Micro-PC mit ausreichend USB-Anschlüssen für Kartenterminal, Drucker und Scanner. Er lässt sich hinter dem Monitor montieren und spart Platz am Tresen.'},
      {q: 'Wie viel Arbeitsspeicher braucht ein Praxis-PC?', a: 'Das hängt von Ihrer Praxissoftware und den parallel genutzten Programmen ab. Für übliche Verwaltungsarbeitsplätze sind 16 GB eine solide Basis. Maßgeblich sind die Vorgaben Ihres Softwareherstellers.'},
      {q: 'Darf ich einen normalen PC im Behandlungszimmer nutzen?', a: 'Für Dokumentation am Schreibtisch ist das üblich. Steht der PC jedoch in der Patientenumgebung oder ist er mit medizinischen Geräten verbunden, gelten besondere Anforderungen. Sprechen Sie uns an – wir klären das vor dem Kauf.'},
      {q: 'Kümmern Sie sich um die Einrichtung?', a: 'Wir liefern die Geräte auf Wunsch vorbereitet aus. Die Anbindung an Praxissoftware und Telematikinfrastruktur erfolgt in Abstimmung mit Ihrem Softwarehaus.'},
    ],
    related: ['empfang', 'buero-unternehmen', 'server-kleine-unternehmen'],
  },
  {
    slug: 'kanzleien',
    kind: 'branche',
    name: 'Rechtsanwälte & Notare',
    title: 'IT-Ausstattung für Rechtsanwälte und Notariate',
    teaser: 'Leise Büro-PCs und mobile Notebooks für Kanzlei, Termin und Gericht.',
    metaTitle: 'PC & Notebook für Rechtsanwälte und Notare – TERRA',
    metaDescription:
      'Leise Arbeitsplatz-PCs, Business-Notebooks und Monitore für Rechtsanwaltskanzleien und Notariate – mit Einrichtung und Service aus Verl.',
    image: '/images/loesungen/arbeitsplatz-notebook.webp',
    imageAlt: 'TERRA Notebook neben einem Monitor-Arbeitsplatz',
    intro: [
      'Kanzleien arbeiten mit vertraulichen Daten, langen Schriftsätzen und der elektronischen Akte. Gefragt sind ruhige, zuverlässige Arbeitsplätze im Büro – und Notebooks, die beim Mandanten oder bei Gericht genauso funktionieren wie am Schreibtisch.',
      'Mit Dockingstation wird das Notebook im Büro zum vollwertigen Zwei-Monitor-Arbeitsplatz. So arbeiten Sie unterwegs und in der Kanzlei mit demselben Gerät.',
    ],
    needs: [
      {title: 'Mobil und sicher', text: 'Business-Notebooks mit Windows Pro, Verschlüsselung per BitLocker und gutem Akku.'},
      {title: 'Ein Gerät, zwei Orte', text: 'Mit Dockingstation am Schreibtisch: ein Kabel für Monitore, Netzwerk und Strom.'},
      {title: 'Lesefreundliche Displays', text: 'Für lange Schriftsätze und Akten lohnen sich große, höhenverstellbare Monitore.'},
      {title: 'Diskretion', text: 'Leise Geräte im Besprechungsraum und Webcams mit Abdeckung für Videotermine.'},
    ],
    scenarios: [
      {title: 'Anwalts-Notebook', text: 'Business-Notebooks für Kanzlei, Termin und Homeoffice.', category: 'notebooks', sub: 'business'},
      {title: 'Dockingstation', text: 'Notebook einstecken und am großen Arbeitsplatz weiterarbeiten.', category: 'zubehoer', sub: 'dockingstations'},
      {title: 'Sekretariat', text: 'Kompakte Büro-PCs für Schreibdienst, beA und Aktenverwaltung.', category: 'desktop-pcs', sub: 'mini-micro'},
    ],
    faq: [
      {q: 'Notebook oder Desktop für die Kanzlei?', a: 'Wer häufig unterwegs ist, fährt mit einem Business-Notebook und Dockingstation am besten. Für feste Arbeitsplätze im Sekretariat ist ein kompakter Desktop-PC meist günstiger und leistungsfähiger.'},
      {q: 'Welche Windows-Version brauche ich?', a: 'Für Kanzleien empfehlen wir Windows 11 Pro – unter anderem wegen BitLocker-Verschlüsselung und der Einbindung in ein Firmennetzwerk.'},
      {q: 'Passen die Geräte zu unserer Kanzleisoftware?', a: 'Die gängigen Kanzleiprogramme laufen auf aktuellen Windows-PCs. Wir prüfen die Systemvoraussetzungen Ihres Anbieters gerne vor der Bestellung.'},
      {q: 'Kann ich ein Angebot für mehrere Arbeitsplätze bekommen?', a: 'Ja. Legen Sie die Geräte in den Warenkorb und erstellen Sie dort mit „PDF-Angebot erstellen“ direkt ein Angebot – oder schreiben Sie uns.'},
    ],
    related: ['steuerberater-datev', 'homeoffice', 'buero-unternehmen'],
  },
  {
    slug: 'buero-unternehmen',
    kind: 'branche',
    name: 'Büros & Unternehmen',
    title: 'Business-PCs für Büros und Unternehmen',
    teaser: 'Standardisierte Arbeitsplätze, die sich einfach ausrollen und betreuen lassen.',
    metaTitle: 'Business-PC für Büro kaufen – TERRA PCs für Unternehmen',
    metaDescription:
      'TERRA Business-PCs, Notebooks und Monitore für Büroarbeitsplätze. Einheitliche Geräte und Einrichtung vom Systemhaus.',
    image: '/images/ap/2427w.png',
    imageAlt: 'Büroarbeitsplatz mit zwei TERRA Monitoren LCD/LED 2427W',
    intro: [
      'Im Büro zählt, dass die Technik einfach funktioniert. Einheitliche Arbeitsplätze lassen sich schneller einrichten, leichter betreuen und bei Bedarf unkompliziert ersetzen.',
      'TERRA-PCs werden von WORTMANN in Hüllhorst gefertigt. Wir kombinieren sie mit passenden Monitoren, Software und Einrichtung zu kompletten Arbeitsplätzen – vom Einzelplatz bis zur ganzen Abteilung.',
    ],
    needs: [
      {title: 'Einheitliche Geräte', text: 'Gleiche Modelle vereinfachen Support, Ersatz und Softwareverteilung.'},
      {title: 'Kompakte Bauform', text: 'Mini-PCs schaffen Platz auf dem Schreibtisch und sparen Strom.'},
      {title: 'Ergonomie', text: 'Höhenverstellbare Monitore und gute Eingabegeräte für den ganzen Arbeitstag.'},
      {title: 'Planbarer Service', text: 'Optionaler Vor-Ort-Service und ein Ansprechpartner in Verl.'},
    ],
    scenarios: [
      {title: 'Standard-Büroarbeitsplatz', text: 'Business-PCs für Office, Mail, ERP und Browser.', category: 'desktop-pcs', sub: 'business'},
      {title: 'Platzsparend', text: 'Mini- und Micro-PCs für aufgeräumte Schreibtische.', category: 'desktop-pcs', sub: 'mini-micro'},
      {title: 'Monitore', text: 'TERRA-Displays in 24 und 27 Zoll für jeden Arbeitsplatz.', category: 'monitore'},
    ],
    faq: [
      {q: 'Was ist der Unterschied zwischen PC-Business und PC-Home?', a: 'Business-Modelle sind auf lange Verfügbarkeit, Windows Pro und den Einsatz im Firmennetzwerk ausgelegt. Home-Modelle zielen eher auf Privatkunden.'},
      {q: 'Können Sie mehrere PCs gleich einrichten?', a: 'Ja. Mit dem Einrichtungsservice bereiten wir die Geräte einheitlich vor – Updates, Benutzer, Grundsoftware. Bei größeren Stückzahlen sprechen Sie uns direkt an.'},
      {q: 'Gibt es Netto-Preise für Geschäftskunden?', a: 'Oben im Shop können Sie jederzeit auf Netto-Preise umschalten. Für größere Mengen erstellen wir gerne ein individuelles Angebot.'},
      {q: 'Ist Kauf auf Rechnung möglich?', a: 'Für Geschäftskunden ist Kauf auf Rechnung nach Prüfung möglich.'},
    ],
    related: ['multimonitor-arbeitsplatz', 'homeoffice', 'empfang'],
  },
  {
    slug: 'lager-logistik',
    kind: 'branche',
    name: 'Lager & Logistik',
    title: 'PCs für Lager, Versand und Warenwirtschaft',
    teaser: 'Robuste Arbeitsplätze für Warenwirtschaft, Scanner und Versand.',
    metaTitle: 'Lager-PC für Warenwirtschaft & Versand kaufen – TERRA',
    metaDescription:
      'Kompakte TERRA-PCs für Lager, Versand und Warenwirtschaft (z. B. JTL-Wawi). Mit Einrichtung durch das Systemhaus aus Verl.',
    image: '/images/loesungen/pc-familie.webp',
    imageAlt: 'TERRA PC-Familie vom Micro-PC bis zum Tower',
    intro: [
      'Im Lager laufen Kommissionierung, Etikettendruck und Versand oft an einem Platz zusammen. Der PC muss Scanner, Etiketten- und Lieferscheindrucker sowie Waage zuverlässig ansteuern – und die Warenwirtschaft flüssig bedienen.',
      'Da wir auch JTL-Dienstleistungen anbieten, kennen wir diese Arbeitsplätze aus der Praxis: Wir stellen Hardware zusammen, die zu Ihrer Wawi und Ihren Versandprozessen passt, und richten sie auf Wunsch gleich mit ein.',
    ],
    needs: [
      {title: 'Viele Anschlüsse', text: 'Barcode-Scanner, Etikettendrucker, Lieferscheindrucker, Waage – USB- und Netzwerkports zählen.'},
      {title: 'Kompakt montierbar', text: 'Micro-PCs verschwinden per VESA-Halterung hinter dem Monitor oder unter dem Packtisch.'},
      {title: 'Stabile Warenwirtschaft', text: 'Genug Leistung und eine SSD, damit Pickliste und Versandlabel ohne Wartezeit kommen.'},
      {title: 'Mobil im Lager', text: 'Notebooks und Tablets für Inventur und Wareneingang.'},
    ],
    scenarios: [
      {title: 'Versand- & Packtisch', text: 'Mini- und Micro-PCs für Label-Druck, Scanner und Versandsoftware.', category: 'desktop-pcs', sub: 'mini-micro'},
      {title: 'Inventur & Wareneingang', text: 'Mobile Geräte für Erfassung direkt am Regal.', category: 'tablets'},
      {title: 'Lagerbüro & Wawi', text: 'Business-PCs für Disposition, Einkauf und Warenwirtschaft.', category: 'desktop-pcs', sub: 'business'},
    ],
    notice:
      'In staubigen, feuchten oder stark vibrierenden Umgebungen stoßen normale Büro-PCs an ihre Grenzen. Für solche Bereiche bieten sich die TERRA Industry-Modelle an – wir beraten Sie gern.',
    faq: [
      {q: 'Welcher PC eignet sich für JTL-Wawi im Versand?', a: 'Ein aktueller Business- oder Micro-PC mit SSD und 16 GB RAM bedient JTL-Wawi und den Versand-Workflow in der Regel problemlos. Wichtig sind genügend USB-Anschlüsse für Scanner und Drucker.'},
      {q: 'Unterstützen Sie bei der Einrichtung von JTL?', a: 'Ja. SMIT Digital Services bietet JTL-Dienstleistungen an – von der Einrichtung bis zur Prozessberatung. Mehr dazu auf systemhaus-verl.de.'},
      {q: 'Kann ich den PC unter dem Packtisch montieren?', a: 'Micro- und Mini-PCs lassen sich mit VESA-Halterung an Monitor oder Tischunterseite befestigen. Passende Halterungen finden Sie im Zubehör.'},
      {q: 'Was tun bei Staub und Kälte?', a: 'Für raue Umgebungen gibt es TERRA Industry-PCs und robuste Notebooks. Wir prüfen gemeinsam mit Ihnen, welche Bauform passt.'},
    ],
    related: ['industrie-produktion', 'empfang', 'server-kleine-unternehmen'],
  },
  {
    slug: 'industrie-produktion',
    kind: 'branche',
    name: 'Industrie & Produktion',
    title: 'PCs für Industrie, Produktion und Fertigung',
    teaser: 'Industry-PCs, robuste Notebooks und Workstations für die Fertigung.',
    metaTitle: 'Industrie-PC für Produktion kaufen – TERRA Industry',
    metaDescription:
      'TERRA Industry-PCs, robuste Notebooks und Workstations für Fertigungssteuerung, Betriebsdatenerfassung und Konstruktion.',
    image: '/images/loesungen/tower-familie.webp',
    imageAlt: 'TERRA PC-Gehäuse in verschiedenen Bauformen',
    intro: [
      'In der Produktion arbeiten PCs an Maschinen, in der Betriebsdatenerfassung und in der Arbeitsvorbereitung. Je nach Umgebung braucht es robuste Geräte, die Staub, Temperaturschwankungen und Dauerbetrieb verkraften.',
      'Für die Konstruktion und Arbeitsvorbereitung kommen leistungsstarke Workstations dazu. Wir helfen bei der Auswahl – vom Hallen-PC bis zum CAD-Arbeitsplatz.',
    ],
    needs: [
      {title: 'Dauerbetrieb', text: 'Komponenten, die für lange Laufzeiten im Schichtbetrieb ausgelegt sind.'},
      {title: 'Robustheit', text: 'Staub, Vibration und Temperatur: In der Halle zählen andere Kriterien als im Büro.'},
      {title: 'Schnittstellen', text: 'Serielle Ports, LAN und USB für Maschinen, Scanner und Terminals.'},
      {title: 'Rechenleistung', text: 'Workstations für CAD, CAM und Simulation in der Arbeitsvorbereitung.'},
    ],
    scenarios: [
      {title: 'Industry-PCs', text: 'Geräte für den Einsatz in der Fertigung und an Maschinen.', category: 'desktop-pcs', sub: 'industry'},
      {title: 'Robuste Notebooks', text: 'Rugged-Notebooks für Instandhaltung und Service in der Halle.', category: 'notebooks', sub: 'industry'},
      {title: 'Arbeitsvorbereitung & CAD', text: 'Workstations für Konstruktion, CAM und Planung.', category: 'desktop-pcs', sub: 'workstation'},
    ],
    notice:
      'Ob ein Gerät für Ihre Umgebung geeignet ist, hängt von Schutzart, Temperaturbereich und Schnittstellen ab. Bitte sprechen Sie uns vor dem Kauf an – wir prüfen die Datenblätter mit Ihnen.',
    faq: [
      {q: 'Was unterscheidet einen Industrie-PC von einem Büro-PC?', a: 'Industrie-PCs sind für raue Umgebungen und Dauerbetrieb ausgelegt – etwa mit robusterem Gehäuse, erweitertem Temperaturbereich oder speziellen Schnittstellen. Welche Eigenschaften nötig sind, hängt vom Einsatzort ab.'},
      {q: 'Welcher PC für die Betriebsdatenerfassung?', a: 'Für BDE-Terminals in Büronähe reichen oft kompakte Mini-PCs. Direkt an der Maschine sind Industry-Modelle die bessere Wahl.'},
      {q: 'Bieten Sie Workstations für CAD an?', a: 'Ja, TERRA-Workstations mit professionellen Grafikkarten. Mehr dazu auf unserer Seite zu CAD-Arbeitsplätzen.'},
      {q: 'Können wir größere Stückzahlen projektieren?', a: 'Gerne. Sprechen Sie uns an – wir erstellen ein Angebot inklusive Einrichtung und Rollout.'},
    ],
    related: ['cad-workstation', 'lager-logistik', 'server-kleine-unternehmen'],
  },
  {
    slug: 'handwerk',
    kind: 'branche',
    name: 'Handwerk',
    title: 'Computer für Handwerksbetriebe',
    teaser: 'Büro-PC für Angebote und Rechnungen, Notebook für Baustelle und Kunde.',
    metaTitle: 'PC & Notebook für Handwerksbetriebe – TERRA kaufen',
    metaDescription:
      'Büro-PCs, Notebooks und Convertibles für Handwerksbetriebe: Angebote, Aufmaß, Handwerkersoftware und Baustelle. Mit Einrichtung aus Verl.',
    image: '/images/loesungen/notebooks.webp',
    imageAlt: 'TERRA MOBILE Notebooks',
    intro: [
      'Im Handwerksbetrieb entstehen Angebote, Aufmaße und Rechnungen meist abends im Büro – oder direkt beim Kunden. Gefragt sind ein zuverlässiger Büro-PC für die Handwerkersoftware und ein mobiles Gerät, das auch mal den Weg auf die Baustelle verträgt.',
      'Wir helfen bei der Auswahl und richten die Geräte so ein, dass Sie sofort loslegen können – ohne sich selbst um Updates, Konten und Datensicherung kümmern zu müssen.',
    ],
    needs: [
      {title: 'Büro-Arbeitsplatz', text: 'Für Handwerkersoftware, Kalkulation, Banking und Office.'},
      {title: 'Mobil beim Kunden', text: 'Notebooks oder Convertibles für Aufmaß, Fotos und Unterschrift vor Ort.'},
      {title: 'Einfach zu betreuen', text: 'Kein eigener IT-Mitarbeiter? Dann sind Einrichtung und Wartung vom Profi Gold wert.'},
      {title: 'Datensicherung', text: 'Angebote und Rechnungen müssen aufbewahrt werden – Backup gehört dazu.'},
    ],
    scenarios: [
      {title: 'Büro-PC', text: 'Business-PCs für Handwerkersoftware und Buchhaltung.', category: 'desktop-pcs', sub: 'business'},
      {title: 'Notebook für unterwegs', text: 'Business-Notebooks für Kunde, Baustelle und Büro.', category: 'notebooks', sub: 'business'},
      {title: 'Convertible & Tablet', text: 'Mit Stift für Aufmaß, Skizze und Unterschrift.', category: 'notebooks', sub: 'convertible'},
    ],
    faq: [
      {q: 'Notebook oder Tablet für die Baustelle?', a: 'Ein Convertible verbindet beides: Tastatur für Angebote, Touch und Stift für Skizzen und Unterschriften. Für sehr raue Umgebungen gibt es robuste Industry-Notebooks.'},
      {q: 'Läuft meine Handwerkersoftware auf TERRA-PCs?', a: 'Gängige Handwerkerprogramme laufen auf aktuellen Windows-PCs. Wir gleichen die Systemvoraussetzungen Ihres Anbieters gerne vorab ab.'},
      {q: 'Können Sie die Geräte einrichten?', a: 'Ja. Mit unserem Einrichtungsservice ist der PC bei Lieferung vorbereitet. Auf Wunsch übernehmen wir auch die laufende Betreuung.'},
      {q: 'Brauche ich Office?', a: 'Für Angebote und Korrespondenz meist ja. Office und Microsoft 365 können Sie direkt beim PC dazubestellen.'},
    ],
    related: ['homeoffice', 'buero-unternehmen', 'cad-workstation'],
  },
  {
    slug: 'schulen-bildung',
    kind: 'branche',
    name: 'Schulen & Bildung',
    title: 'IT-Ausstattung für Schulen und Bildungseinrichtungen',
    teaser: 'Lehrer-Notebooks, Klassenraum-PCs und Displays für Schule und Schulung.',
    metaTitle: 'PCs & Notebooks für Schulen und Schulungsräume – TERRA',
    metaDescription:
      'TERRA Notebooks, PCs, All-in-Ones und Tablets für Schulen, Bildungsträger und Schulungsräume. Einheitlich einrichtbar.',
    image: '/images/loesungen/multimonitor.webp',
    imageAlt: 'Mehrere TERRA-Arbeitsplätze nebeneinander',
    intro: [
      'In Schulen und Schulungsräumen müssen viele Geräte gleichzeitig funktionieren – und nach jedem Kurs wieder in einem sauberen Zustand sein. Einheitliche Hardware ist dafür die wichtigste Grundlage.',
      'Wir liefern Lehrer-Notebooks, Schüler-Arbeitsplätze und Präsentationstechnik und unterstützen Bildungsträger bei Einrichtung und Betreuung.',
    ],
    needs: [
      {title: 'Gleiche Geräte', text: 'Identische Modelle lassen sich zentral verwalten und schnell zurücksetzen.'},
      {title: 'Mobil für Lehrkräfte', text: 'Leichte Notebooks oder Convertibles für Unterricht und Vorbereitung.'},
      {title: 'Wenig Kabel', text: 'All-in-One-PCs im Schulungsraum: ein Gerät, ein Stromkabel.'},
      {title: 'Lange Nutzung', text: 'Robuste Geräte, optional mit Service für mehrere Schuljahre.'},
    ],
    scenarios: [
      {title: 'Lehrer-Notebooks', text: 'Business-Notebooks für Unterricht, Vorbereitung und Verwaltung.', category: 'notebooks', sub: 'business'},
      {title: 'Schulungsraum', text: 'All-in-One-PCs für aufgeräumte Lern- und Schulungsplätze.', category: 'all-in-one-pcs'},
      {title: 'Tablets', text: 'Für Lernen und Präsentieren im Klassenraum.', category: 'tablets'},
    ],
    faq: [
      {q: 'Können Schulen auf Rechnung bestellen?', a: 'Öffentliche Einrichtungen und Schulträger können nach Prüfung auf Rechnung bestellen. Für Ausschreibungen oder größere Mengen erstellen wir gern ein individuelles Angebot.'},
      {q: 'Welche Geräte eignen sich für einen Schulungsraum?', a: 'All-in-One-PCs oder Mini-PCs mit Monitor. Wichtig ist, dass alle Plätze gleich ausgestattet sind – das vereinfacht Einrichtung und Wartung.'},
      {q: 'Bieten Sie auch Bildungslizenzen an?', a: 'Sprechen Sie uns an. Je nach Einrichtung gibt es besondere Lizenzmodelle für Microsoft-Produkte.'},
      {q: 'Unterstützen Sie bei der Einrichtung?', a: 'Ja. Wir bereiten die Geräte einheitlich vor und übernehmen auf Wunsch auch die Betreuung.'},
    ],
    related: ['buero-unternehmen', 'homeoffice', 'multimonitor-arbeitsplatz'],
  },

  // ────────────────────────── Einsatzbereiche ──────────────────────────
  {
    slug: 'empfang',
    kind: 'einsatz',
    name: 'Empfangs-PCs',
    title: 'Empfangs-PCs: kompakt, leise, platzsparend',
    teaser: 'Kleine PCs für Empfang, Rezeption und Anmeldung.',
    metaTitle: 'Empfangs-PC kaufen – Mini-PCs für Rezeption',
    metaDescription:
      'Platzsparende und leise TERRA Mini- und Micro-PCs sowie All-in-Ones für Empfang, Rezeption und Anmeldung – mit Beratung und Einrichtung vom Systemhaus.',
    image: '/images/loesungen/arbeitsplatz.webp',
    imageAlt: 'Aufgeräumter TERRA-Arbeitsplatz mit kompaktem PC',
    intro: [
      'Am Empfang ist der erste Eindruck wichtig – auch der des Arbeitsplatzes. Ein kompakter PC hinter dem Monitor sorgt für einen aufgeräumten Tresen, ist kaum hörbar und bietet trotzdem alle Anschlüsse für Telefon-Software, Drucker und Kartenleser.',
      'Ob Praxisanmeldung, Hotelrezeption oder Firmenempfang: Wir stellen das passende Gerät zusammen und liefern es auf Wunsch eingerichtet.',
    ],
    needs: [
      {title: 'Unsichtbar', text: 'Micro-PCs lassen sich hinter dem Monitor montieren.'},
      {title: 'Flüsterleise', text: 'Kein Lüfterrauschen im Gespräch mit Besuchern.'},
      {title: 'Anschlussfreudig', text: 'USB für Kartenleser, Etikettendrucker und Headset.'},
      {title: 'Alles in einem', text: 'Alternativ: All-in-One-PC mit integrierter Webcam.'},
    ],
    scenarios: [
      {title: 'Mini- & Micro-PCs', text: 'Die kleinste Bauform für den Empfangstresen.', category: 'desktop-pcs', sub: 'mini-micro'},
      {title: 'All-in-One', text: 'PC und Monitor in einem Gerät – nur ein Kabel.', category: 'all-in-one-pcs', sub: '24-zoll'},
      {title: 'Monitore', text: 'Höhenverstellbare Displays für den Tresen.', category: 'monitore', sub: 'hoehenverstellbar'},
    ],
    faq: [
      {q: 'Mini-PC oder All-in-One am Empfang?', a: 'Ein Mini-PC ist flexibler – Monitor und PC lassen sich getrennt tauschen. Ein All-in-One spart Kabel und wirkt besonders aufgeräumt.'},
      {q: 'Ist ein Micro-PC leistungsstark genug?', a: 'Für Terminverwaltung, Office, Browser und Telefonie problemlos. Für sehr rechenintensive Aufgaben empfehlen wir einen Business-PC.'},
      {q: 'Brauche ich eine VESA-Halterung?', a: 'Für die Montage hinter dem Monitor brauchen Sie einen VESA-kompatiblen Monitor und – je nach Modell – eine passende Halterung. Wir prüfen gern, was zu Ihrem Gerät gehört.'},
    ],
    related: ['arztpraxen', 'buero-unternehmen', 'lager-logistik'],
  },
  {
    slug: 'multimonitor-arbeitsplatz',
    kind: 'einsatz',
    name: 'Multimonitor & Buchhaltung',
    title: 'Multimonitor-Arbeitsplätze für Buchhaltung und Controlling',
    teaser: 'Zwei oder drei Bildschirme – für mehr Überblick in Buchhaltung und Disposition.',
    metaTitle: 'Multimonitor-Arbeitsplatz & Buchhaltungs-PC – TERRA',
    metaDescription:
      'PCs, Dockingstations und höhenverstellbare Monitore für Dual- und Triple-Monitor-Arbeitsplätze in Buchhaltung, Controlling und Disposition.',
    image: '/images/ap/2448w-pv.png',
    imageAlt: 'Arbeitsplatz mit drei TERRA Monitoren LCD/LED 2448W PV und Notebook',
    intro: [
      'Buchhaltung, Controlling und Disposition profitieren messbar von mehr Bildschirmfläche: Beleg und Buchungsmaske, Tabelle und ERP, Mail und Kalender – alles gleichzeitig im Blick.',
      'Damit das klappt, müssen PC, Grafikausgänge, Kabel und Monitore zusammenpassen. Wir stellen Ihnen das komplette Set zusammen.',
    ],
    needs: [
      {title: 'Passende Ausgänge', text: 'DisplayPort, HDMI oder USB-C – der PC muss alle Monitore ansteuern können.'},
      {title: 'Gleiche Monitore', text: 'Identische Displays sorgen für einheitliche Farben und Höhen.'},
      {title: 'Ergonomie', text: 'Höhenverstellung und Pivot reduzieren Nacken- und Kopfbewegungen.'},
      {title: 'Ein-Kabel-Lösung', text: 'Mit USB-C-Monitor oder Dock wird das Notebook zum Mehrschirm-Arbeitsplatz.'},
    ],
    scenarios: [
      {title: 'Höhenverstellbare Monitore', text: 'Ergonomische 24- und 27-Zoll-Displays für den Doppelarbeitsplatz.', category: 'monitore', sub: 'hoehenverstellbar'},
      {title: 'Business-PCs', text: 'PCs mit mehreren Grafikausgängen.', category: 'desktop-pcs', sub: 'business'},
      {title: 'Dockingstations', text: 'Für Notebook-Nutzer: zwei Monitore an einem Kabel.', category: 'zubehoer', sub: 'dockingstations'},
    ],
    faq: [
      {q: 'Wie viele Monitore kann ein PC ansteuern?', a: 'Die meisten aktuellen Business-PCs unterstützen mindestens zwei, oft drei Displays. Entscheidend sind die vorhandenen Ausgänge – wir prüfen das für Ihr Wunschmodell.'},
      {q: '24 oder 27 Zoll?', a: 'Für zwei Monitore nebeneinander sind 24 Zoll ein guter Standard. 27 Zoll mit höherer Auflösung bietet mehr Fläche, braucht aber einen tieferen Schreibtisch.'},
      {q: 'Was ist ein USB-C-Monitor?', a: 'Ein Monitor, der Bild, Daten und Strom über ein einziges Kabel überträgt. Ideal für Notebook-Arbeitsplätze.'},
    ],
    related: ['steuerberater-datev', 'buero-unternehmen', 'cad-workstation'],
  },
  {
    slug: 'homeoffice',
    kind: 'einsatz',
    name: 'Homeoffice',
    title: 'Homeoffice-Ausstattung für Unternehmen',
    teaser: 'Notebook, Dock, Monitor und Headset – der komplette Heimarbeitsplatz.',
    metaTitle: 'Homeoffice-Ausstattung kaufen – Notebook, Monitor & Dock',
    metaDescription:
      'Komplette Homeoffice-Arbeitsplätze mit TERRA Notebooks, Dockingstations, Monitoren, Webcams und Headsets – eingerichtet vom Systemhaus.',
    image: '/images/ap/2427w-ha.png',
    imageAlt: 'Homeoffice-Arbeitsplatz mit TERRA Notebook und zwei Monitoren LCD/LED 2427W HA',
    intro: [
      'Wer zuhause genauso produktiv arbeiten soll wie im Büro, braucht mehr als ein Notebook: einen großen Monitor, eine Dockingstation, ordentliche Eingabegeräte und eine gute Kamera für Besprechungen.',
      'Wir stellen Ihnen komplette Homeoffice-Pakete zusammen – einheitlich für alle Mitarbeitenden und vorbereitet für den sicheren Zugriff auf Ihr Firmennetz.',
    ],
    needs: [
      {title: 'Ein Gerät für alles', text: 'Das Business-Notebook pendelt zwischen Büro und Zuhause.'},
      {title: 'Großer Bildschirm', text: 'Ein externer Monitor verhindert den Notebook-Nacken.'},
      {title: 'Gute Videocalls', text: 'Webcam und Headset für klare Bild- und Tonqualität.'},
      {title: 'Sicherer Zugriff', text: 'VPN, Verschlüsselung und Updates – zentral vorbereitet.'},
    ],
    scenarios: [
      {title: 'Business-Notebooks', text: 'Leistung für den ganzen Arbeitstag – im Büro und zuhause.', category: 'notebooks', sub: 'business'},
      {title: 'Dockingstations', text: 'Ein Kabel, alles verbunden.', category: 'zubehoer', sub: 'dockingstations'},
      {title: 'Webcams', text: 'Für Teams, Zoom & Co.', category: 'zubehoer', sub: 'webcams'},
    ],
    faq: [
      {q: 'Was gehört zu einem guten Homeoffice-Arbeitsplatz?', a: 'Notebook, externer Monitor, Dockingstation, Tastatur und Maus sowie Webcam und Headset für Besprechungen.'},
      {q: 'Wie greifen Mitarbeitende sicher auf das Firmennetz zu?', a: 'Über eine VPN-Verbindung, idealerweise mit einer Firewall im Unternehmen. Passende Firewalls finden Sie bei Server & Netzwerk – die Einrichtung übernehmen wir.'},
      {q: 'Können Sie mehrere Pakete identisch einrichten?', a: 'Ja, mit dem Einrichtungsservice bereiten wir alle Geräte einheitlich vor.'},
    ],
    related: ['kanzleien', 'buero-unternehmen', 'multimonitor-arbeitsplatz'],
  },
  {
    slug: 'cad-workstation',
    kind: 'einsatz',
    name: 'CAD & Konstruktion',
    title: 'CAD-Workstations für Konstruktion, Architektur und Planung',
    teaser: 'Workstations mit Profi-Grafik für CAD, BIM und Visualisierung.',
    metaTitle: 'CAD-Workstation kaufen – TERRA für Konstruktion',
    metaDescription:
      'TERRA Workstations mit professionellen Grafikkarten für CAD, BIM, CAM und Visualisierung – für Architekten, Ingenieure und Konstruktion.',
    image: '/images/home/section-tower-server.webp',
    imageAlt: 'Leistungsstarke TERRA Tower-Systeme',
    intro: [
      'CAD, BIM und Visualisierung stellen andere Anforderungen als Büroarbeit: große Baugruppen, komplexe 3D-Modelle und Renderings brauchen viel Arbeitsspeicher, schnelle Prozessoren und eine leistungsfähige Grafikkarte.',
      'TERRA-Workstations sind für diese Last gebaut. Wir helfen bei der Konfiguration passend zu Ihrer Software – ob AutoCAD, SolidWorks, Revit, ArchiCAD oder Inventor.',
    ],
    needs: [
      {title: 'Profi-Grafik', text: 'Grafikkarten mit zertifizierten Treibern für CAD-Software.'},
      {title: 'Viel RAM', text: '32 GB aufwärts für große Baugruppen und BIM-Modelle.'},
      {title: 'Schneller Speicher', text: 'NVMe-SSDs für kurze Ladezeiten großer Projekte.'},
      {title: 'Große Displays', text: '27 Zoll und mehr, gern mit höherer Auflösung.'},
    ],
    scenarios: [
      {title: 'Workstations', text: 'TERRA-Workstations für CAD, BIM und Rendering.', category: 'desktop-pcs', sub: 'workstation'},
      {title: '27-Zoll-Monitore', text: 'Mehr Fläche und Auflösung für Zeichnungen und Modelle.', category: 'monitore', sub: '27-zoll'},
      {title: 'Mobile Leistung', text: 'Leistungsstarke Notebooks für Baustelle und Kundentermin.', category: 'notebooks', sub: 'premium'},
    ],
    faq: [
      {q: 'Welche Grafikkarte brauche ich für CAD?', a: 'Für professionelle CAD-Programme empfehlen wir Workstation-Grafikkarten mit zertifizierten Treibern. Welches Modell sinnvoll ist, hängt von Software und Modellgröße ab.'},
      {q: 'Wie viel Arbeitsspeicher für BIM?', a: 'Für Revit, ArchiCAD und große Baugruppen sind 32 GB ein guter Startpunkt, bei sehr großen Projekten auch 64 GB.'},
      {q: 'Workstation oder Gaming-PC?', a: 'Gaming-PCs sind oft günstiger, haben aber keine zertifizierten Treiber für CAD-Software. Für den professionellen Einsatz ist eine Workstation die verlässlichere Wahl.'},
    ],
    related: ['industrie-produktion', 'multimonitor-arbeitsplatz', 'handwerk'],
  },
  {
    slug: 'server-kleine-unternehmen',
    kind: 'einsatz',
    name: 'Server & Netzwerk',
    title: 'Server und Netzwerk für kleine Unternehmen',
    teaser: 'Tower-Server, Firewall und VPN – die Basis für Praxis, Kanzlei und Büro.',
    metaTitle: 'Server für kleine Unternehmen – TERRA Server',
    metaDescription:
      'TERRA Tower- und Rack-Server sowie Firewalls für kleine und mittlere Unternehmen, Praxen und Kanzleien – mit Einrichtung und Wartung.',
    image: '/images/loesungen/server-tower.webp',
    imageAlt: 'TERRA Tower-Server mit geöffneter Front',
    intro: [
      'Zentrale Dateiablage, Warenwirtschaft, Datensicherung und sicherer Fernzugriff: Auch kleine Unternehmen brauchen eine solide IT-Basis. Ein Tower-Server im Büro und eine Firewall am Internetanschluss sind dafür oft die richtige Kombination.',
      'Server sind kein Produkt von der Stange. Wir planen mit Ihnen Größe, Datensicherung und Wartung – und übernehmen Installation und Betreuung durch unser Systemhaus.',
    ],
    needs: [
      {title: 'Richtig dimensioniert', text: 'Speicher, RAM und Prozessor passend zu Anzahl der Nutzer und Anwendungen.'},
      {title: 'Ausfallsicher', text: 'RAID, redundante Netzteile und Herstellerservice vor Ort.'},
      {title: 'Datensicherung', text: 'Backup-Konzept nach der 3-2-1-Regel.'},
      {title: 'Sicherer Zugang', text: 'Firewall mit VPN für Homeoffice und Filialen.'},
    ],
    scenarios: [
      {title: 'Tower-Server', text: 'Leise Server für Büro, Praxis und Kanzlei.', category: 'server-netzwerk', sub: 'tower-server'},
      {title: 'Rack-Server', text: 'Für den Serverschrank und wachsende Anforderungen.', category: 'server-netzwerk', sub: 'rack-server'},
      {title: 'Firewall & VPN', text: 'Schutz am Internetanschluss und sicherer Fernzugriff.', category: 'server-netzwerk', sub: 'firewall'},
    ],
    faq: [
      {q: 'Ab wann lohnt sich ein eigener Server?', a: 'Sobald mehrere Mitarbeitende gemeinsam auf Daten oder Anwendungen zugreifen, ist ein zentraler Server meist sinnvoller als freigegebene Ordner auf einzelnen PCs. Alternativ kommen Cloud- oder Hosting-Lösungen in Frage.'},
      {q: 'Tower oder Rack?', a: 'Ohne Serverschrank ist ein Tower-Server die einfachste Lösung. Rack-Server lohnen sich, wenn ein Schrank vorhanden ist oder weitere Systeme folgen.'},
      {q: 'Richten Sie den Server ein?', a: 'Ja. Planung, Installation, Datensicherung und Wartung übernimmt SMIT Digital Services – Ihr Systemhaus aus Verl.'},
    ],
    related: ['steuerberater-datev', 'arztpraxen', 'homeoffice'],
  },
];

export const BRANCHEN = SOLUTIONS.filter((s) => s.kind === 'branche');
export const EINSATZBEREICHE = SOLUTIONS.filter((s) => s.kind === 'einsatz');

export function findSolution(slug?: string) {
  return SOLUTIONS.find((s) => s.slug === slug) ?? null;
}

export function scenarioQuery(s: Scenario) {
  return categoryQuery(s.category, s.sub);
}
