/**
 * TERRA CLOUD – Inhalte der Cloud-Rubrik (/cloud).
 * Fakten aus den Leistungsbeschreibungen der TERRA CLOUD GmbH (Stand 07/2026) und der
 * TERRA CLOUD Broschüre 2026/2027. Preise bewusst "auf Anfrage".
 */

export type CloudFact = {label: string; value: string};
export type CloudFeature = {title: string; text: string};
export type CloudFaq = {q: string; a: string};

export type CloudService = {
  slug: string;
  name: string; // kurz, für Navigation/Kacheln
  title: string; // H1
  teaser: string; // Kachel
  image: string; // siteImg-Pfad
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  facts: CloudFact[];
  features: CloudFeature[];
  /** Optionaler Vergleich (z. B. IaaS vs. IaaS Basic) */
  compare?: {head: string[]; rows: string[][]};
  note?: string;
  faq: CloudFaq[];
};

export const CLOUD_USPS: CloudFact[] = [
  {label: 'Rechenzentrum', value: 'Hüllhorst (NRW)'},
  {label: 'Zertifiziert', value: 'ISO/IEC 27001:2022'},
  {label: 'Verfügbarkeit VM', value: 'bis 99,95 %'},
  {label: 'Laufzeit', value: 'monatlich kündbar'},
];

export const CLOUD_SERVICES: CloudService[] = [
  {
    slug: 'virtuelle-server',
    name: 'Virtuelle Server (IaaS)',
    title: 'Virtuelle Server aus der TERRA CLOUD',
    teaser: 'Windows- und Linux-Server im deutschen Rechenzentrum – hochverfügbar, monatlich kündbar.',
    image: '/images/cloud/kachel-iaas.jpg',
    imageAlt: 'TERRA CLOUD IaaS',
    metaTitle: 'Cloud-Server mieten – Virtuelle Server (IaaS) aus Deutschland | terra-computershop.de',
    metaDescription:
      'Virtuelle Windows- und Linux-Server (IaaS) in der TERRA CLOUD: Rechenzentrum in Hüllhorst, ISO 27001, eigene Firewall & privates Netz, bis 99,95 % Verfügbarkeit, monatlich kündbar. Jetzt anfragen.',
    intro: [
      'Mit TERRA CLOUD IaaS mieten Sie virtuelle Server statt eigene Hardware zu kaufen. CPU, Arbeitsspeicher und Speicherplatz wachsen mit Ihrem Bedarf – ohne Investition und ohne Serverraum.',
      'Ihre Server laufen auf hochverfügbaren Hyper-V-Clustern im Rechenzentrum der WORTMANN AG in Hüllhorst. Jedes Paket bekommt eine eigene Firewall, ein privates Netzwerk und eine öffentliche IP-Adresse. Einrichtung, Betreuung und Backup übernehmen auf Wunsch wir.',
    ],
    facts: [
      {label: 'vCores', value: '1 – 16'},
      {label: 'Arbeitsspeicher', value: '2 – 256 GB'},
      {label: 'Speicher', value: 'bis 30 TB'},
      {label: 'Betriebssystem', value: 'Windows Server / Linux'},
      {label: 'Verfügbarkeit', value: '99,95 % (VM)'},
      {label: 'Bereitstellung', value: 'ca. 3 Arbeitstage'},
    ],
    features: [
      {title: 'Hochverfügbar', text: 'Virtuelle Server auf redundanten Hyper-V- und Storage-Clustern. Fällt ein Host aus, läuft Ihre VM weiter.'},
      {title: 'Always Private', text: 'Jedes Paket mit eigener Firewall-VM, eigenem VLAN und einer öffentlichen IP – getrennt von anderen Kunden.'},
      {title: 'Schneller Speicher', text: 'Archiv-Storage (HDD) bis 30 TB oder NVMe-Storage (Standard Plus / Performance) bis 15 TB je Volume.'},
      {title: 'Traffic inklusive', text: 'Bandbreite bis 1 Gbit/s, der Internet-Traffic ist im Paket enthalten.'},
      {title: 'Migration möglich', text: 'Bestehende (virtuelle) Server lassen sich als Hyper-V-Image in die TERRA CLOUD umziehen.'},
      {title: 'Lizenzen flexibel', text: 'Windows Server, SQL Server & Co. als monatliche Mietlizenz (SPLA) – keine hohen Anschaffungskosten.'},
    ],
    compare: {
      head: ['', 'IaaS (Cluster)', 'IaaS Basic (Single Host)'],
      rows: [
        ['Technik', 'Hyper-V-Cluster mit Storage-Cluster', 'einzelner physischer Server, lokaler Storage'],
        ['vCores / RAM', '1–16 vCores, 2–256 GB', 'feste Größen: 2, 4 oder 8 vCores, 4–32 GB'],
        ['Speicher', 'bis 30 TB', 'Systempartition 300–1.000 GB + bis 5 TB Daten'],
        ['Verfügbarkeit', '99,95 % pro Monat', '99,9 % pro Monat'],
        ['Ideal für', 'geschäftskritische Server, Terminalserver, ERP', 'günstiger Einstieg, Test- und Nebensysteme'],
      ],
    },
    note:
      'Wichtig: Datensicherung, Updates und Virenschutz innerhalb der VM liegen nicht beim Rechenzentrum. Das übernehmen wir für Sie – oder Sie buchen zusätzlich TERRA CLOUD Backup.',
    faq: [
      {q: 'Was kostet ein Cloud-Server?', a: 'Der Preis hängt von vCores, Arbeitsspeicher, Speicher und Lizenzen ab und wird monatlich abgerechnet. Schicken Sie uns Ihre Anforderungen – Sie erhalten innerhalb eines Werktags ein Angebot.'},
      {q: 'Gibt es eine Mindestlaufzeit?', a: 'Nein. Laut Leistungsbeschreibung gibt es keine Mindestvertragslaufzeit; der Vertrag verlängert sich monatlich und ist mit vier Wochen Frist kündbar.'},
      {q: 'Wo stehen die Server?', a: 'Im TERRA CLOUD Rechenzentrum der WORTMANN AG in Hüllhorst (Nordrhein-Westfalen). Betrieben wird ausschließlich in Deutschland und der Schweiz.'},
      {q: 'Können Sie unseren bestehenden Server umziehen?', a: 'Ja. Bestehende Server können als Hyper-V-Image (VHDX) in die TERRA CLOUD migriert werden. Wir planen den Umzug mit Ihnen und übernehmen die Umsetzung.'},
    ],
  },
  {
    slug: 'backup',
    name: 'Cloud-Backup',
    title: 'TERRA CLOUD Backup – Datensicherung in Deutschland',
    teaser: 'Automatische, verschlüsselte Sicherung von Servern, PCs und Microsoft 365 – gespeichert in Deutschland.',
    image: '/images/cloud/kachel-backup.jpg',
    imageAlt: 'TERRA CLOUD Backup',
    metaTitle: 'Cloud-Backup für Unternehmen – DSGVO-konform in Deutschland | terra-computershop.de',
    metaDescription:
      'TERRA CLOUD Backup: automatische Datensicherung für Server, PCs und Microsoft 365. AES-256-verschlüsselt, Rechenzentrum in Deutschland, monatlich kündbar. Einrichtung durch unser Systemhaus.',
    intro: [
      'Funktioniert Ihre Datensicherung wirklich? Mit TERRA CLOUD Backup werden Server und Arbeitsplätze automatisch gesichert – verschlüsselt und in einem deutschen Rechenzentrum gespeichert.',
      'Optional sichert ein Backup-Satellit vor Ort zuerst ins lokale Netz und repliziert dann in die Cloud. So ist die Wiederherstellung schnell und die Kopie außer Haus trotzdem vorhanden.',
    ],
    facts: [
      {label: 'Speicherort', value: 'Deutschland'},
      {label: 'Verschlüsselung', value: 'AES 256 Bit'},
      {label: 'Abrechnung', value: 'nach Verbrauch'},
      {label: 'Laufzeit', value: 'monatlich kündbar'},
    ],
    features: [
      {title: 'Automatisch', text: 'Zeitgesteuerte oder ereignisgesteuerte Sicherungen, zentrale Überwachung und Berichte im Backup-Portal.'},
      {title: 'Änderungsschutz', text: 'Gesicherte Daten sind gegen nachträgliche Veränderung geschützt – wichtig gegen Ransomware.'},
      {title: 'Hybrid-Backup', text: 'Backup-Satellit als TERRA Appliance oder VM vor Ort: schnelle Sicherung im LAN, zeitversetzte Replikation in die Cloud.'},
      {title: 'Wiederherstellung', text: 'Dateien, Systeme oder komplette Images – auch als Notfall-Server direkt in der TERRA CLOUD.'},
      {title: 'Microsoft 365 Backup', text: 'Mails, OneDrive, SharePoint und Teams auf Basis von Veeam – mit 30 Tagen Unveränderbarkeit und bis zu 10 Jahren Aufbewahrung.'},
      {title: 'Testwiederherstellungen', text: 'Automatisierte Test-Restores zeigen, dass die Sicherung im Ernstfall auch funktioniert.'},
    ],
    faq: [
      {q: 'Was wird gesichert?', a: 'Windows- und Linux-Server, virtuelle Maschinen, Arbeitsplatz-PCs sowie auf Wunsch Microsoft 365 (Exchange Online, OneDrive, SharePoint, Teams).'},
      {q: 'Wie wird abgerechnet?', a: 'Verbrauchsbasiert nach gesicherter Datenmenge und monatlich kündbar. Wir erstellen Ihnen gern ein Angebot nach Ihrem Datenvolumen.'},
      {q: 'Wer richtet das Backup ein?', a: 'Unser Systemhaus aus Verl: Einrichtung, Überwachung und regelmäßige Test-Wiederherstellungen aus einer Hand.'},
    ],
  },
  {
    slug: 's3-storage',
    name: 'S3-Speicher',
    title: 'S3 Storage aus der TERRA CLOUD',
    teaser: 'S3-kompatibler Objektspeicher in Hüllhorst – für Backups, Archive und Anwendungen. Keine Traffickosten.',
    image: '/images/cloud/kachel-s3.jpg',
    imageAlt: 'TERRA CLOUD S3 Storage',
    metaTitle: 'S3 Storage Deutschland – Objektspeicher aus der TERRA CLOUD | terra-computershop.de',
    metaDescription:
      'S3-kompatibler Objektspeicher im deutschen Rechenzentrum (Hüllhorst): Abrechnung pro TB, keine Traffickosten, Object Lock & Versionierung, Schnittstelle für QNAP und Synology.',
    intro: [
      'Der TERRA CLOUD S3 Storage ist ein S3-kompatibler Objektspeicher im Rechenzentrum Hüllhorst. Viele Backup-Programme, NAS-Systeme und Anwendungen können ihn direkt als Ziel nutzen.',
      'Abgerechnet wird pro Terabyte – ohne Traffickosten, ohne Mindestaufbewahrung und ohne Mindestdateigröße.',
    ],
    facts: [
      {label: 'Standort', value: 'Hüllhorst (DE)'},
      {label: 'Abrechnung', value: 'pro TB'},
      {label: 'Traffic', value: 'inklusive'},
      {label: 'Schnittstelle', value: 'S3-kompatibel'},
    ],
    features: [
      {title: 'Object Lock & Versionierung', text: 'Unveränderbare Sicherungen, z. B. als Ziel für Veeam – mit Lifecycle-Management.'},
      {title: 'Archiv-Buckets', text: 'Einfache Ablage für Datenarchive, etwa Röntgenbilder oder Dokumentenarchive.'},
      {title: 'QNAP & Synology', text: 'NAS-Systeme können direkt in die TERRA CLOUD sichern.'},
      {title: 'Revisionssicher', text: 'Aufbewahrung nach revisionssicheren Grundsätzen, Komprimierung und Deduplizierung inklusive.'},
    ],
    faq: [
      {q: 'Für wen eignet sich S3 Storage?', a: 'Für Unternehmen, die Backups außer Haus lagern, ein NAS absichern oder Daten langfristig archivieren möchten – DSGVO-konform in Deutschland.'},
      {q: 'Gibt es versteckte Kosten für Downloads?', a: 'Nein, laut TERRA CLOUD fallen keine Traffickosten an. Abgerechnet wird der belegte Speicher pro TB.'},
    ],
  },
  {
    slug: 'hosting-housing',
    name: 'Hosting & Housing',
    title: 'Server-Hosting und Housing im deutschen Rechenzentrum',
    teaser: 'Dedizierte TERRA Server zur Miete oder Ihre eigene Hardware im Rack – mit Strom, Klima und Anbindung.',
    image: '/images/cloud/rz-server.jpg',
    imageAlt: 'Serverschrank mit TERRA CLOUD Logo im Rechenzentrum',
    metaTitle: 'Server Hosting & Housing Deutschland – TERRA CLOUD Rechenzentrum | terra-computershop.de',
    metaDescription:
      'Dedizierte TERRA Server mieten (Hosting) oder eigene Hardware unterbringen (Housing) im TERRA CLOUD Rechenzentrum Hüllhorst: redundante Stromversorgung, 1 Gbit-Anbindung, Traffic inklusive.',
    intro: [
      'Hosting: Sie mieten dedizierte TERRA Server – als einzelnen Host oder als vorinstallierten Hyper-V-Cluster – exklusiv für Ihr Unternehmen, mit privatem Netzwerk und integrierter Firewall.',
      'Housing: Ihre eigenen Server (TERRA oder andere Hersteller) ziehen in das Rechenzentrum um. Sie behalten die Hardware, das Rechenzentrum sorgt für Strom, Klimatisierung, Brandschutz und Anbindung.',
    ],
    facts: [
      {label: 'Housing', value: 'ab 1 HE bis Rack'},
      {label: 'Anbindung', value: '1 Gbit, Traffic inkl.'},
      {label: 'Hosting', value: 'TERRA SERVER 7220 / 7230'},
      {label: 'Verfügbarkeit', value: '99,9 % (Hosting)'},
    ],
    features: [
      {title: 'Fester Monatspreis', text: 'Höheneinheiten, Racks und dedizierte Server zum monatlichen Fixpreis; Strom beim Housing nach Verbrauch inkl. Kühlung.'},
      {title: 'Racks bis 48 HE', text: 'Ganze Racks (46 HE nutzbar, 4× 16 A) mit bis zu 4 kW, optional 8 kW Last.'},
      {title: 'Firewall-Optionen', text: 'Mit oder ohne Firewall – als virtuelle Instanz oder Securepoint-Hardware.'},
      {title: 'Hardware-Service', text: 'Beim Hosting übernimmt die TERRA CLOUD das Hardware-Management; beim Housing ist autorisierter Zugriff möglich.'},
    ],
    faq: [
      {q: 'Hosting oder virtuelle Server?', a: 'Virtuelle Server (IaaS) sind flexibler und günstiger im Einstieg. Dedizierte Server lohnen sich bei hoher Dauerlast, besonderen Lizenzanforderungen oder wenn Sie die volle Kontrolle über den Hypervisor brauchen.'},
      {q: 'Kann ich vorhandene Server weiter nutzen?', a: 'Ja, mit Housing ziehen Ihre eigenen Geräte in das Rechenzentrum. Wir übernehmen Planung und Umzug.'},
    ],
  },
  {
    slug: 'jtl-wawi-cloud',
    name: 'JTL-Wawi in der Cloud',
    title: 'JTL-Wawi in der Cloud – Server im deutschen Rechenzentrum',
    teaser: 'Ihre JTL-Wawi auf einem eigenen Cloud-Server – eingerichtet und betreut vom JTL-Servicepartner.',
    image: '/images/cloud/rz-netz.jpg',
    imageAlt: 'Netzwerkverkabelung im TERRA CLOUD Rechenzentrum',
    metaTitle: 'JTL-Wawi Cloud Server – Hosting in Deutschland vom JTL-Servicepartner | terra-computershop.de',
    metaDescription:
      'JTL-Wawi in der Cloud: eigener Windows-Server mit SQL-Datenbank in der TERRA CLOUD (Hüllhorst), Zugriff von überall, Backup inklusive – eingerichtet vom JTL-Servicepartner aus Verl.',
    intro: [
      'Ihre JTL-Wawi läuft bisher auf einem Rechner im Büro? In der TERRA CLOUD bekommt sie einen eigenen Windows-Server mit SQL-Datenbank – erreichbar aus Lager, Büro und Homeoffice, gesichert und überwacht.',
      'Als JTL-Servicepartner (wawi-servicepartner.de) richten wir Server, Datenbank, Zugänge und Datensicherung ein und ziehen Ihre bestehende Wawi-Datenbank um.',
    ],
    facts: [
      {label: 'Server', value: 'Windows Server + MS SQL'},
      {label: 'Standort', value: 'Hüllhorst (DE)'},
      {label: 'Zugriff', value: 'VPN / Remote Desktop'},
      {label: 'Betreuung', value: 'JTL-Servicepartner Verl'},
    ],
    features: [
      {title: 'Eigener Server', text: 'Keine geteilte Datenbank: Ihre Wawi läuft auf einem eigenen virtuellen Server mit privater Firewall.'},
      {title: 'Passende SQL-Lizenz', text: 'Für kleine Datenbanken genügt oft SQL Server Express; für größere Datenbanken mieten wir SQL Server Standard monatlich (SPLA).'},
      {title: 'Zugriff von überall', text: 'Mitarbeitende arbeiten per VPN oder Terminalserver – Lager, Büro und Homeoffice greifen auf dieselben Daten zu.'},
      {title: 'Backup inklusive', text: 'Tägliche Sicherung von Datenbank und Server mit TERRA CLOUD Backup, auf Wunsch mit Test-Wiederherstellung.'},
      {title: 'Umzug aus einer Hand', text: 'Wir übernehmen Ihre bestehende JTL-Wawi-Datenbank, Worker, Druckvorlagen und Schnittstellen.'},
      {title: 'Skalierbar', text: 'Mehr Aufträge, mehr Benutzer? CPU, RAM und Speicher werden ohne neue Hardware erweitert.'},
    ],
    note:
      'JTL-Wawi und JTL-Software sind Produkte der JTL-Software-GmbH. Wir betreiben Ihre Installation als Dienstleister auf Servern der TERRA CLOUD.',
    faq: [
      {q: 'Was brauche ich für JTL-Wawi in der Cloud?', a: 'Einen Windows Server mit Microsoft SQL Server, einen sicheren Zugang (VPN oder Remote Desktop) und eine zuverlässige Datensicherung. Das alles stellen wir in der TERRA CLOUD bereit.'},
      {q: 'Reicht SQL Server Express?', a: 'Für kleinere Datenbanken häufig ja – SQL Server Express ist kostenlos, aber auf 10 GB pro Datenbank begrenzt. Wächst Ihre Wawi darüber hinaus, nutzen wir SQL Server Standard als monatliche Mietlizenz.'},
      {q: 'Wie lange dauert der Umzug?', a: 'Die Bereitstellung des Servers dauert etwa drei Arbeitstage. Den Umzug der Datenbank planen wir so, dass Ihr Betrieb möglichst wenig unterbrochen wird – meist an einem Abend oder Wochenende.'},
    ],
  },
  {
    slug: 'rechenzentrum',
    name: 'Rechenzentrum',
    title: 'Das TERRA CLOUD Rechenzentrum in Hüllhorst',
    teaser: 'ISO 27001, redundante Stromversorgung, Diesel für eine Woche, DE-CIX-Anbindung – Cloud aus Ostwestfalen.',
    image: '/images/cloud/rz-tuer.jpg',
    imageAlt: 'TERRA CLOUD Logo an der Glastür des Rechenzentrums',
    metaTitle: 'Rechenzentrum in Deutschland – TERRA CLOUD Hüllhorst (ISO 27001) | terra-computershop.de',
    metaDescription:
      'TERRA CLOUD Rechenzentrum der WORTMANN AG in Hüllhorst: über 8.000 m² RZ-Fläche, ISO/IEC 27001:2022, redundante Stromversorgung, Notstrom für bis zu eine Woche, DE-CIX-Anbindung, ~90 % Ökostrom.',
    intro: [
      'Die TERRA CLOUD wird von der WORTMANN AG betrieben – mit eigenen Rechenzentren, eigener Hardware und eigenem Personal. Der Hauptstandort liegt in Hüllhorst in Ostwestfalen, weitere Standorte gibt es in Düsseldorf und in der Schweiz.',
      'Der Ausbau ist eigenfinanziert und unabhängig von externen Investoren. Betrieben wird ausschließlich in Deutschland und der Schweiz – mit Verträgen nach deutschem Recht.',
    ],
    facts: [
      {label: 'RZ-Fläche', value: 'über 8.000 m²'},
      {label: 'Zertifizierung', value: 'ISO/IEC 27001:2022'},
      {label: 'Notstrom', value: 'bis 1 Woche autark'},
      {label: 'Ökostrom', value: 'rund 90 %'},
    ],
    features: [
      {title: 'Stromversorgung', text: 'Mehrere unabhängige Einspeisungen, acht aktive Transformatoren, direkte Anbindung an ein Umspannwerk, getrennte USV-Pfade.'},
      {title: 'Notstrom', text: 'Sechs Dieselgeneratoren mit über 100.000 Litern Diesel für bis zu eine Woche Betrieb; regelmäßige Black-Building-Tests.'},
      {title: 'Brandschutz', text: 'Getrennte Brandabschnitte, Brandfrüherkennung, Aufschaltung auf die Feuerwehr und rückstandsfreie Gaslöschanlagen.'},
      {title: 'Zutrittskontrolle', text: 'Mehrstufige elektronische Zutrittssysteme, Videoüberwachung rund um die Uhr, Sicherheitsdienst in der Nacht.'},
      {title: 'Klimatisierung', text: 'Redundante Klimatisierung, großer Anteil Freiluftkühlung und Warmgangeinhausung.'},
      {title: 'Anbindung', text: 'Drei unabhängige Carrier, Dark-Fiber-Strecken und direkte DE-CIX-Anbindung – über getrennte Gebäudeseiten zugeführt.'},
    ],
    faq: [
      {q: 'Ist die TERRA CLOUD DSGVO-konform?', a: 'Die Daten werden ausschließlich in Rechenzentren in Deutschland und der Schweiz verarbeitet, die TERRA CLOUD ist nach ISO/IEC 27001:2022 zertifiziert und Verträge gelten nach deutschem Recht. Einen Auftragsverarbeitungsvertrag stellen wir Ihnen bereit.'},
      {q: 'Wer betreibt das Rechenzentrum?', a: 'Die TERRA CLOUD GmbH, ein Unternehmen der WORTMANN AG aus Hüllhorst – Hersteller der TERRA PCs und Server. Wir sind Ihr Ansprechpartner als Fachhändler und Systemhaus.'},
    ],
  },
];

export const RZ_GALLERY = [
  {src: '/images/cloud/rz-strom.jpg', alt: 'Notstrom-Dieselgenerator im Rechenzentrum', label: 'Notstrom'},
  {src: '/images/cloud/rz-brandschutz.jpg', alt: 'Gaslöschanlage mit grünen Flaschen', label: 'Brandschutz'},
  {src: '/images/cloud/rz-zutritt.jpg', alt: 'Gesicherte Serverschränke', label: 'Zutrittskontrolle'},
  {src: '/images/cloud/rz-klima.jpg', alt: 'Bedienung der Klimatisierung am Serverschrank', label: 'Klimatisierung'},
  {src: '/images/cloud/rz-netz.jpg', alt: 'Netzwerkverkabelung im Rechenzentrum', label: 'Anbindung'},
  {src: '/images/cloud/rz-luft.jpg', alt: 'Luftaufnahme des Rechenzentrums in Hüllhorst', label: 'Standort Hüllhorst'},
];

export const CLOUD_INTEREST_OPTIONS = [
  'Virtuelle Server (IaaS)',
  'Cloud-Backup',
  'Microsoft 365 Backup',
  'S3-Speicher',
  'Hosting / Housing',
  'JTL-Wawi in der Cloud',
  'Beratung / weiß noch nicht',
];

export function findCloudService(slug?: string) {
  return CLOUD_SERVICES.find((s) => s.slug === slug);
}
