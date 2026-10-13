import {useEffect, useState} from 'react';

/**
 * Elfsight KI-Chatbot. Datenschutz: Das Elfsight-Skript wird nur geladen, wenn
 * der Besucher im Cookie-Banner "Personalisierung" erlaubt hat – oder wenn er
 * selbst auf den Chat-Button klickt (bewusste Nutzung des Dienstes).
 */
const APP_CLASS = 'elfsight-app-0f11884d-6c66-4c66-bfcf-6722796d1bdd';
const SCRIPT_SRC = 'https://elfsightcdn.com/platform.js';
const STORAGE_KEY = 'smit-chat-optin';

type CustomerPrivacy = {preferencesProcessingAllowed?: () => boolean};

function consentGiven() {
  try {
    if (window.localStorage.getItem(STORAGE_KEY) === '1') return true;
  } catch {
    /* Speicher gesperrt */
  }
  const cp = (window as unknown as {Shopify?: {customerPrivacy?: CustomerPrivacy}}).Shopify
    ?.customerPrivacy;
  return Boolean(cp?.preferencesProcessingAllowed?.());
}

function loadScript() {
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
  const s = document.createElement('script');
  s.src = SCRIPT_SRC;
  s.async = true;
  document.body.appendChild(s);
}

export function ElfsightChat() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const check = () => {
      if (consentGiven()) setActive(true);
    };
    check();
    // Shopify lädt die Consent-API asynchron; Einwilligung kann später kommen
    const t1 = window.setTimeout(check, 1500);
    const t2 = window.setTimeout(check, 4000);
    document.addEventListener('visitorConsentCollected', check);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.removeEventListener('visitorConsentCollected', check);
    };
  }, []);

  useEffect(() => {
    if (active) loadScript();
  }, [active]);

  if (active) return <div className={APP_CLASS} data-elfsight-app-lazy="" />;

  return (
    <button
      type="button"
      className="chat-optin"
      onClick={() => {
        try {
          window.localStorage.setItem(STORAGE_KEY, '1');
        } catch {
          /* egal */
        }
        setActive(true);
      }}
      title="KI-Chat starten (lädt den Chat-Dienst von Elfsight)"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      </svg>
      <span>KI-Chat</span>
    </button>
  );
}
