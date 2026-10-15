/**
 * Zahlungsarten im Shopify-Checkout (Stand: Checkout geprüft am 14.10.2026).
 * Icons: offizielle Shopify-Zahlungssymbole (activemerchant/payment_icons) in /public/images/payment.
 */
export type PaymentIcon = {file: string; label: string};

export const PAYMENT_ICONS: PaymentIcon[] = [
  {file: 'paypal', label: 'PayPal'},
  {file: 'visa', label: 'Visa'},
  {file: 'master', label: 'Mastercard'},
  {file: 'maestro', label: 'Maestro'},
  {file: 'american_express', label: 'American Express'},
  {file: 'klarna', label: 'Klarna'},
  {file: 'ideal', label: 'iDEAL'},
  {file: 'wero', label: 'Wero'},
  {file: 'apple_pay', label: 'Apple Pay'},
  {file: 'google_pay', label: 'Google Pay'},
  {file: 'shopify_pay', label: 'Shop Pay'},
];

export const paymentIconSrc = (file: string) => `/images/payment/${file}.svg`;

export type PaymentMethod = {
  title: string;
  icons: string[];
  text: string;
  points: string[];
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    title: 'PayPal',
    icons: ['paypal'],
    text: 'Bezahlen Sie bequem mit Ihrem PayPal-Konto – direkt im Checkout oder per Express-Button. Im PayPal-Fenster stehen je nach Konto weitere Optionen zur Wahl.',
    points: [
      'Sofort bezahlen per PayPal-Guthaben, Lastschrift oder Karte',
      'Kauf auf Rechnung über PayPal',
      'Später bezahlen: Bezahlung nach 30 Tagen oder Ratenzahlung',
      'PayPal-Käuferschutz für berechtigte Käufe',
    ],
  },
  {
    title: 'Kreditkarte & Debitkarte',
    icons: ['visa', 'master', 'maestro', 'american_express'],
    text: 'Visa, Mastercard, Maestro, American Express und UnionPay – verschlüsselt verarbeitet über Shopify Payments.',
    points: [
      'Sichere Zahlung mit 3-D Secure',
      'Kartendaten werden nicht bei uns gespeichert',
    ],
  },
  {
    title: 'Klarna',
    icons: ['klarna'],
    text: 'Mit Klarna bezahlen Sie sofort, später oder in Raten. Welche Optionen Ihnen angeboten werden, zeigt Klarna direkt im Checkout an.',
    points: [
      'Sofort bezahlen per Überweisung',
      'Später bezahlen oder in Raten',
      'Auswahl im Checkout unter „Klarna“',
    ],
  },
  {
    title: 'iDEAL | Wero',
    icons: ['ideal', 'wero'],
    text: 'Sofort bezahlen über die Banking-App Ihrer Bank. iDEAL ist das beliebteste Bezahlverfahren in den Niederlanden und geht schrittweise in Wero auf, dem europäischen Bezahlverfahren der Banken.',
    points: [
      'Zahlung direkt in der Banking-App bestätigen',
      'Keine Kartendaten nötig',
      'Auswahl im Checkout unter „iDEAL | Wero“',
    ],
  },
  {
    title: 'Apple Pay, Google Pay & Shop Pay',
    icons: ['apple_pay', 'google_pay', 'shopify_pay'],
    text: 'Schnell bezahlen mit einem Klick – mit den in Ihrem Gerät oder Konto hinterlegten Zahlungsdaten.',
    points: [
      'Apple Pay auf iPhone, iPad und Mac (Safari)',
      'Google Pay in Chrome und auf Android',
      'Shop Pay speichert Ihre Daten für künftige Bestellungen',
    ],
  },
  {
    title: 'Vorkasse per Überweisung',
    icons: [],
    text: 'Wählen Sie im Checkout einfach „Banküberweisung“ und überweisen Sie den Betrag vorab auf unser Bankkonto – ohne Zahlungsdienstleister.',
    points: [
      'Bankverbindung erhalten Sie nach der Bestellung',
      'Versand nach Zahlungseingang',
    ],
  },
];
