/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    /** API-Key von resend.com für den Versand der Widerrufs-Eingangsbestätigung. */
    RESEND_API_KEY?: string;
    /** Absender, z. B. "terra-computershop.de <widerruf@terra-computershop.de>" (Domain muss bei Resend verifiziert sein). */
    WIDERRUF_FROM?: string;
    /** Empfänger der Händler-Kopie (Standard: info@wawi-servicepartner.de). */
    WIDERRUF_NOTIFY?: string;
  }
}
